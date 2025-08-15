// play.js — Usa SOLO las APIs de .artista (theadonix + vreden)
const fetch = require('node-fetch');
const yts = require('yt-search');

const MAX_API_ATTEMPTS = 2;
const MAX_AUDIO_ATTEMPTS = 2;

// --- Utilidades ---
const isYouTubeUrl = (s='') => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(s);
const sanitize = (t='audio') => t.replace(/[^\w\s\-\.\(\)\[\]]/g, '').trim().slice(0, 60) || 'audio';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Descarga vía las 2 APIs (igual que .artista)
async function getDownloadInfo(youtubeUrl) {
  const encoded = encodeURIComponent(youtubeUrl);
  const primaryAPI = `https://theadonix-api.vercel.app/api/ytmp3?url=${encoded}`;
  const backupAPI  = `https://api.vreden.my.id/api/ytmp3?url=${encoded}`;

  let lastErr = null;
  let used = 'primary';
  let data = null;

  // 1) API principal (theadonix)
  for (let i = 1; i <= MAX_API_ATTEMPTS; i++) {
    try {
      const r = await fetch(primaryAPI);
      const j = await r.json();
      if (!j.status || !j.data) throw new Error('Theadonix: respuesta inválida');
      data = { api: 'theadonix', raw: j };
      break;
    } catch (e) {
      lastErr = e;
      if (i < MAX_API_ATTEMPTS) await sleep(400);
    }
  }

  // 2) API respaldo (vreden) si falla principal
  if (!data) {
    used = 'backup';
    for (let i = 1; i <= MAX_API_ATTEMPTS; i++) {
      try {
        const r = await fetch(backupAPI);
        const j = await r.json();
        if (j.status !== 200 || !j.result || !j.result.download)
          throw new Error('Vreden: respuesta inválida');
        data = { api: 'vreden', raw: j };
        break;
      } catch (e) {
        lastErr = e;
        if (i < MAX_API_ATTEMPTS) await sleep(400);
      }
    }
  }

  if (!data) throw lastErr || new Error('No se obtuvo información de descarga');

  // Normalizar salida
  if (data.api === 'theadonix') {
    const j = data.raw;
    const url = j.data?.author?.download || j.data?.download;
    const title = sanitize(j.data?.title);
    if (!url) throw new Error('Theadonix: sin URL de descarga');
    return { downloadUrl: url, title, apiUsed: 'Theadonix' };
  } else {
    const j = data.raw;
    const url = j.result?.download?.url;
    const title = sanitize(j.result?.metadata?.title);
    if (!url) throw new Error('Vreden: sin URL de descarga');
    return { downloadUrl: url, title, apiUsed: 'Vreden' };
  }
}

// Descarga el binario (con reintentos)
async function fetchAudioBuffer(url) {
  let err = null;
  for (let i = 1; i <= MAX_AUDIO_ATTEMPTS; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = await r.buffer();
      if (!buf || buf.length < 1000) throw new Error('Archivo muy pequeño');
      return buf;
    } catch (e) {
      err = e;
      if (i < MAX_AUDIO_ATTEMPTS) await sleep(500);
    }
  }
  throw err || new Error('No se pudo descargar el audio');
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎵 Ingresa el título o enlace de YouTube\n\nEjemplo:\n${usedPrefix + command} Mi Persona Favorita`;

  // Spinner fluido auto-editado
  const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  let idx = 0;
  const baseText = '🎧 Procesando tu petición';
  const loadingMsg = await conn.reply(m.chat, `${baseText} ${frames[idx]}`, m);
  const edit = (t) => conn.relayMessage(m.chat, {
    protocolMessage: {
      key: loadingMsg.key,
      type: 14,
      editedMessage: { conversation: t }
    }
  }, {});
  const ticker = setInterval(() => {
    idx = (idx + 1) % frames.length;
    edit(`${baseText} ${frames[idx]}`);
  }, 120);

  try {
    // 1) Obtener URL (si escribieron texto, buscar)
    let videoUrl = text;
    if (!isYouTubeUrl(text)) {
      edit('🔎 Buscando en YouTube…');
      const res = await yts(text);
      const vid = res && res.videos && res.videos[0];
      if (!vid) throw new Error('No se encontraron resultados');
      if (vid.seconds >= 3600) throw new Error('El video supera 1 hora');
      videoUrl = vid.url;
    }

    // 2) Resolver enlace de descarga con las MISMAS APIs de .artista
    edit('🛰️ Obteniendo enlace de descarga…');
    let { downloadUrl, title, apiUsed } = await getDownloadInfo(videoUrl);

    // 3) Descargar el binario (buffer)
    edit(`⬇️ Descargando audio (${apiUsed})…`);
    let audio = await fetchAudioBuffer(downloadUrl);

    // 4) Enviar
    clearInterval(ticker);
    await edit('✅ Descarga completa. Enviando audio…');
    await conn.sendMessage(
      m.chat,
      { audio, mimetype: 'audio/mpeg', fileName: `${title || 'audio'}.mp3` },
      { quoted: m }
    );
    await edit('✅');

    // Info rápida
    await conn.reply(m.chat, `🎶 *${title}*\n🔧 API usada: *${apiUsed}*`, m);

  } catch (e) {
    clearInterval(ticker);
    await edit('❌');
    await conn.reply(m.chat, `❌ *Error:* ${e.message || e}`, m);
  }
};

handler.help = ['play <texto|link>'];
handler.tags = ['downloader'];
handler.command = /^play|cancion|song|descargar$/i;

module.exports = handler;
