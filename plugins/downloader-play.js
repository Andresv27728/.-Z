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

// Método 2: SnapSave (Snappea API no oficial)
async function descargarSnapSave(videoUrl) {
  try {
    const res = await fetch(`https://api.snappea.com/v1/video/details?url=${encodeURIComponent(videoUrl)}`);
    const j = await res.json();
    if (j?.status === 'success') {
      let audio = j.videoInfo?.audios?.[0]?.url;
      if (audio) return { success: true, url: audio, api: 'SnapSave API', info: j };
    }
    throw new Error('SnapSave falló');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 3: Yt5s.io API no oficial
async function descargarYt5s(videoUrl) {
  try {
    const res = await fetch(`https://api.yt5s.io/api/ajaxSearch/index?url=${encodeURIComponent(videoUrl)}&lang=en`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const j = await res.json();
    if (j?.links?.mp3?.mp3128?.url) {
      return { success: true, url: j.links.mp3.mp3128.url, api: 'Yt5s API', info: j };
    }
    throw new Error('Yt5s falló');
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

    // Probar métodos en orden
    let res = await descargarSaveTube(vid.url);
    if (!res.success) res = await descargarSnapSave(vid.url);
    if (!res.success) res = await descargarYt5s(vid.url);
    if (!res.success) res = await descargarYtDlp(vid.url);
    if (!res.success) throw `Falló todo: ${res.error}`;

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
