import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import yts from 'yt-search';

// 🔹 Lista de APIs para descarga de MP3
const primaryAPI = (url) => `https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`;
const backupAPI = (url) => `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;

// 🔹 Lista de 10 API keys gratuitas para búsqueda
const API_KEYS = [
  'AIzaSyA3-PRUEBA3',
  'AIzaSyA4-PRUEBA4',
  'AIzaSyA5-PRUEBA5',
  'AIzaSyA6-PRUEBA6',
  'AIzaSyA7-PRUEBA7',
  'AIzaSyA8-PRUEBA8',
  'AIzaSyA9-PRUEBA9',
  'AIzaSyA10-PRUEBA10'
];

// Función para obtener una API key aleatoria
function getRandomApiKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `✏️ Ingresa un título para buscar en YouTube.\n\nEjemplo:\n> ${usedPrefix}play Corazón Serrano - Mix Poco Yo`, m);
  }

  await m.react('🔍');
  await conn.sendMessage(m.chat, { 
    text: `⏳ *Buscando...*\n🔎 ${args.join(" ")}\n_Por favor espera un momento..._`, 
  }, { quoted: m });

  try {
    let videoInfo;

    // 1️⃣ Intentar búsqueda con API oficial de YouTube
    try {
      const API_KEY = getRandomApiKey();
      const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(args.join(" "))}&key=${API_KEY}`;
      const res = await fetch(searchURL);
      const data = await res.json();

      if (data.items && data.items.length) {
        const video = data.items[0];
        videoInfo = {
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.high.url
        };
      } else {
        throw new Error('Sin resultados API oficial');
      }
    } catch (err) {
      console.warn('⚠️ Error en API oficial, usando yt-search:', err.message);
      const results = await yts(args.join(" "));
      if (!results.videos.length) throw new Error('No se encontraron resultados en yt-search');
      const video = results.videos[0];
      videoInfo = {
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail
      };
    }

    // 2️⃣ Descargar miniatura
    const thumbnail = await (await fetch(videoInfo.thumbnail)).buffer();

    // 3️⃣ Enviar información del video
    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: `🎥 *Video encontrado*\n📌 Título: ${videoInfo.title}\n🔗 Enlace: ${videoInfo.url}`,
    }, { quoted: m });

    // 4️⃣ Animación de carga
    const loadingMsg = await conn.sendMessage(m.chat, { text: '🎶 Descargando audio...\n[▒▒▒▒▒▒▒▒▒▒] 0%' }, { quoted: m });
    const progress = ['[██▒▒▒▒▒▒▒▒▒] 20%', '[████▒▒▒▒▒▒▒▒] 40%', '[██████▒▒▒▒▒▒] 60%', '[████████▒▒▒▒] 80%', '[██████████] 100%'];
    for (let i = 0; i < progress.length; i++) {
      await new Promise(res => setTimeout(res, 600));
      await conn.sendMessage(m.chat, { edit: loadingMsg.key, text: `🎶 Descargando audio...\n${progress[i]}` });
    }

    // 5️⃣ Descargar audio usando APIs externas
    let audioUrl;
    try {
      const apiRes = await fetch(primaryAPI(videoInfo.url));
      const json = await apiRes.json();
      if (json.status && json.result?.download_url) {
        audioUrl = json.result.download_url;
      } else throw new Error('Fallo API primaria');
    } catch {
      console.warn('⚠️ API primaria falló, intentando con backup...');
      const apiRes = await fetch(backupAPI(videoInfo.url));
      const json = await apiRes.json();
      if (json.status && json.result?.download_url) {
        audioUrl = json.result.download_url;
      } else throw new Error('Fallo API secundaria');
    }

    if (!audioUrl) throw new Error('No se pudo obtener el audio');

    // 6️⃣ Enviar audio MP3
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoInfo.title}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '❗ Ocurrió un error al buscar o enviar el audio.', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;
