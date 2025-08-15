let search = require('yt-search');
let fetch = require('node-fetch');
const { exec } = require('child_process');

// Método 1: SaveTube (WEB scraping simulado)
async function descargarSaveTube(videoUrl) {
  try {
    const res = await fetch(`https://yt.savetube.me/youtube-to-mp3-download-fast?url=${encodeURIComponent(videoUrl)}`);
    if (res.ok) return { success: true, url: videoUrl, api: 'SaveTube (web)', info: {} };
    throw new Error('SaveTube falló');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 2: Yt5s.io (API web simulada)
async function descargarYt5s(videoUrl) {
  try {
    const res = await fetch(`https://yt5s.io/api/ajaxSearch/index?url=${encodeURIComponent(videoUrl)}`);
    if (!res.ok) throw new Error('Yt5s falló');
    let json = await res.json();
    if (json.links?.mp3?.mp3128?.k) {
      return { success: true, url: json.links.mp3.mp3128.k, api: 'Yt5s.io', info: json };
    }
    throw new Error('No se encontró enlace en Yt5s');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 3: Y2Mate (API web simulada)
async function descargarY2Mate(videoUrl) {
  try {
    const res = await fetch(`https://www.y2mate.com/mates/analyzeV2/ajax?url=${encodeURIComponent(videoUrl)}`);
    if (!res.ok) throw new Error('Y2Mate falló');
    let json = await res.json();
    let mp3 = json.links?.mp3?.['128']?.dlink;
    if (mp3) return { success: true, url: mp3, api: 'Y2Mate', info: json };
    throw new Error('No se encontró enlace en Y2Mate');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 4: yt-dlp local
async function descargarYtDlp(videoUrl) {
  return new Promise((resolve) => {
    exec(`yt-dlp -f bestaudio -o - "${videoUrl}"`, { encoding: 'buffer', maxBuffer: 1024 * 500 }, (err, stdout) => {
      if (err) return resolve({ success: false, error: err.message });
      resolve({ success: true, url: stdout, api: 'yt-dlp local', info: {} });
    });
  });
}

let handler = async (m, { conn, text }) => {
  if (!text) throw '❗ Ingresa un título o enlace de YouTube';

  let spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  let spinnerMsg = await conn.reply(m.chat, '⏳ Iniciando descarga...', m);
  let idx = 0;
  let anim = setInterval(async () => {
    await conn.sendMessage(m.chat, { text: `${spinnerFrames[idx]} Procesando...`, edit: spinnerMsg.key });
    idx = (idx + 1) % spinnerFrames.length;
  }, 200);

  try {
    await m.reply('🔍 Buscando tu canción...');
    const vid = (await search(text)).videos[0];
    if (!vid) throw '🚫 No se encontró el video';
    if (vid.seconds >= 3600) throw '⚠️ El video dura más de 1 hora';

    await m.reply('⬇️ Descargando audio...');

    let res = await descargarSaveTube(vid.url);
    if (!res.success) res = await descargarYt5s(vid.url);
    if (!res.success) res = await descargarY2Mate(vid.url);
    if (!res.success) res = await descargarYtDlp(vid.url);
    if (!res.success) throw `Fallaron todas las opciones: ${res.error}`;

    clearInterval(anim);
    await conn.sendMessage(m.chat, {
      text: '✅ Descarga completada, enviando audio...',
      edit: spinnerMsg.key
    });

    let desc = `
*Titulo:* ${vid.title}
*Duración:* ${vid.timestamp}
*Visualizaciones:* ${vid.views.toLocaleString()}
*Subido:* ${vid.ago}
*Autor:* ${vid.author.name}
*API usada:* ${res.api}
    `.trim();
    await conn.reply(m.chat, desc, m);

    await conn.sendMessage(m.chat, {
      audio: { url: res.url },
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    await m.reply('✅ ¡Audio enviado con éxito!');

  } catch (e) {
    clearInterval(anim);
    await conn.reply(m.chat, `❌ Error: ${e.message || e}`, m);
  }

  m.exp = 0;
};

handler.command = handler.help = ['play','cancion','song','descargar'];
handler.tags = ['descarga'];
handler.exp = 0;
handler.limit = true;
module.exports = handler;
