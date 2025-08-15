let search = require('yt-search');
let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `🎵 Ingresa el título o enlace de YouTube.\n\nEjemplo:\n${usedPrefix}play Shape of You`;
    
    try {
        // Animación de carga
        let frames = ['🔍 Buscando.', '🔍 Buscando..', '🔍 Buscando...'];
        let msg = await conn.reply(m.chat, frames[0], m);
        let frameIndex = 0;
        let interval = setInterval(async () => {
            frameIndex = (frameIndex + 1) % frames.length;
            await conn.sendMessage(m.chat, { edit: frames[frameIndex], editMessageId: msg.key.id });
        }, 500);

        // Búsqueda en YouTube
        const look = await search(text);
        const convert = look.videos[0];
        if (!convert) throw '⚠️ No se encontró ningún resultado.';
        if (convert.seconds >= 3600) {
            clearInterval(interval);
            return conn.reply(m.chat, '⚠️ El video dura más de 1 hora, no se puede descargar.', m);
        }

        let audioUrl;
        try {
            const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${convert.url}&apikey=${btc}`);
            audioUrl = await res.json();
        } catch {
            clearInterval(interval);
            return conn.reply(m.chat, '❌ Error al descargar el audio.', m);
        }

        // Detener animación
        clearInterval(interval);

        // Información del video
        let caption = `
🎵 *Título:* ${convert.title}
📂 *Formato:* MP3
🆔 *ID:* ${convert.videoId}
⏳ *Duración:* ${convert.timestamp}
👁️ *Vistas:* ${convert.views}
📅 *Subido:* ${convert.ago}
👤 *Autor:* ${convert.author.name}
🔗 *Canal:* ${convert.author.url}
🌐 *Enlace:* ${convert.url}
📝 *Descripción:* ${convert.description}
`.trim();

        // Enviar info
        await conn.sendMessage(m.chat, { text: caption, contextInfo: {
            externalAdReply: {
                title: convert.title,
                mediaType: 1,
                previewType: 0,
                renderLargerThumbnail: true,
                thumbnailUrl: convert.image,
                sourceUrl: convert.url
            }
        }}, { quoted: m });

        // Enviar audio
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl.result.mp3 },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: convert.title,
                    thumbnailUrl: convert.image,
                    sourceUrl: convert.url,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        conn.reply(m.chat, '❌ Ocurrió un error al procesar la solicitud.', m);
    }
};

handler.command = handler.help = ['play', 'song', 'ds'];
handler.tags = ['downloader'];
handler.limit = true;
module.exports = handler;
