let search = require('yt-search');
let fetch = require('node-fetch');

async function descargarConDelirius(videoUrl) {
    try {
        const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const respuesta = await fetch(apiUrl);
        const datos = await respuesta.json();

        if (datos.status && datos.data && datos.data.download && datos.data.download.url) {
            return { 
                exito: true, 
                url: datos.data.download.url, 
                api: 'Delirius API', 
                info: datos.data 
            };
        } else {
            throw new Error('No se pudo obtener el enlace de descarga.');
        }
    } catch (error) {
        return { exito: false, error: error.message };
    }
}

let handler = async (m, { conn, text }) => {
    if (!text) throw '❗ Ingresa un título o enlace de YouTube';

    try {
        await m.reply('🔍 Buscando tu canción...');

        const busqueda = await search(text);
        const video = busqueda.videos[0];

        if (!video) throw '❌ Video no encontrado';
        if (video.seconds >= 3600) throw '⚠️ El video dura más de 1 hora';

        await m.reply('⏳ Descargando audio, por favor espera...');

        const resultado = await descargarConDelirius(video.url);
        if (!resultado.exito) throw `Error: ${resultado.error}`;

        let descripcion = `
📺 *Título:* ${resultado.info.title}
🆔 *ID:* ${resultado.info.id}
⏱️ *Duración:* ${video.timestamp}
👁️ *Vistas:* ${resultado.info.views}
👍 *Likes:* ${resultado.info.likes}
👤 *Autor:* ${resultado.info.author}
📅 *Subido:* ${video.ago}
🔗 *URL:* ${video.url}
🎵 *Calidad:* ${resultado.info.download.quality}
💾 *Tamaño:* ${resultado.info.download.size}
        `.trim();

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: descripcion,
                contextInfo: {
                    externalAdReply: {
                        title: video.title,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: resultado.info.image,
                        sourceUrl: video.url
                    }
                }
            }
        }, {});

        await conn.sendMessage(m.chat, {
            audio: { url: resultado.url },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: video.title,
                    body: 'Descargado con Delirius API',
                    thumbnailUrl: resultado.info.image,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        await m.reply('✅ ¡Audio descargado y enviado exitosamente!');
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ *Error:* ${error.message || error}`, m);
    }
};

handler.command = handler.help = ['play', 'cancion', 'descargar', 'song'];
handler.tags = ['descargador'];
handler.exp = 0;
handler.limit = true;

module.exports = handler;
