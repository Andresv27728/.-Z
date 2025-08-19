let search = require('yt-search');
let fetch = require('node-fetch');

let handler = async (m, { conn, text }) => {
    if (!text) throw '🐬✨ Ingresa el título de la canción, senpai~';
    try {
        await m.reply('⏳🌊 *Cargando...* Gura está buscando tu canción entre las olas del océano...');

        // Buscar el video en YouTube
        const look = await search(text);
        const video = look.videos[0];
        if (!video) throw '🦈💦 No encontré nada, nya~ intenta con otro título.';

        // Revisar duración
        if (video.seconds >= 3600) {
            return conn.reply(m.chat, '⚠️⏰ ¡El video dura más de 1 hora, senpai! Busca algo más cortito~', m);
        }

        // Enviar enlace a la API para obtener el audio
        const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(video.url)}`);
        const data = await res.json();

        if (!data || !data.result) throw '💔🐟 Error al obtener el audio~';

        let caption = '';
        caption += `🦈✨ *Título:* ${video.title}\n`;
        caption += `⏳ *Duración:* ${video.timestamp}\n`;
        caption += `🖼️ *Miniatura:* ${video.image}`;

        // Enviar información de la canción
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `🎶🐬 ${video.title}`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: video.image,
                        sourceUrl: video.url
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        // Enviar el audio
        await conn.sendMessage(m.chat, {
            audio: { url: data.download },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: `🎵💙 ${video.title}`,
                    body: "Gura trajo tu canción desde el fondo del mar~ 🐚💖",
                    thumbnailUrl: video.image,
                    sourceUrl: video.url,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '💔🐟 ¡Ups! Algo salió mal bajo el océano~', m);
    }
};

handler.command = handler.help = ['play3', 'song3'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;
