let search = require('yt-search');
let fetch = require('node-fetch');
const { exec } = require('child_process');

// Método 1: Delirius API
async function descargarDelirius(videoUrl) {
  const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
  try {
    const res = await fetch(apiUrl);
    const j = await res.json();
    if (j.status && j.data?.download?.url) return { success: true, url: j.data.download.url, api: 'Delirius API', info: j.data };
    throw new Error('Sin enlace válido');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 2: SaveTube API (simulada)
async function descargarSaveTube(videoUrl) {
  try {
    const res = await fetch(`https://yt.savetube.me/api/ajax/search?query=${encodeURIComponent(videoUrl)}`);
    const html = await res.text();
    if (html.includes('mp3')) {
      return { success: true, url: videoUrl, api: 'SaveTube (web)', info: {} };
    }
    throw new Error('SaveTube falló');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 3: yt-download.org API
async function descargarYTDownload(videoUrl) {
  try {
    const res = await fetch(`https://api.yt-download.org/download/${encodeURIComponent(videoUrl)}`);
    const json = await res.json();
    if (json?.link) return { success: true, url: json.link, api: 'yt-download.org', info: json };
    throw new Error('yt-download.org falló');
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Método 4: yt-dlp local
async function descargarYtDlp(videoUrl) {
  return new Promise((resolve) => {
    exec(`yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o - "${videoUrl}"`, { encoding: 'buffer', maxBuffer: 1024 * 500 }, (err, stdout) => {
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

    let res = await descargarDelirius(vid.url);
    if (!res.success) res = await descargarSaveTube(vid.url);
    if (!res.success) res = await descargarYTDownload(vid.url);
    if (!res.success) res = await descargarYtDlp(vid.url);
    if (!res.success) throw `Falló todo: ${res.error}`;

    clearInterval(anim);
    await conn.sendMessage(m.chat, {
      text: '✅ Descarga completada, enviando audio...',
      edit: spinnerMsg.key
    });

    // Enviar info del video
    let desc = `
*Titulo:* ${vid.title}
*Duración:* ${vid.timestamp}
*Visualizaciones:* ${vid.views.toLocaleString()}
*Subido:* ${vid.ago}
*Autor:* ${vid.author.name}
*API usada:* ${res.api}
    `.trim();
    await conn.reply(m.chat, desc, m);

    // Enviar audio
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
