let search = require('yt-search');
let ytdl = require('ytdl-core');

let handler = async (m, { conn, text }) => {
    if (!text) throw '🐬✨ Ingresa el título de YouTube, senpai~';
    try {
        await m.reply('⏳🌊 *Cargando...* Gura está buscando tu canción entre las olas del océano...');

        // Buscar el video en YouTube
        const look = await search(text);
        const video = look.videos[0];
        if (!video) throw '🦈💦 No encontré nada, nya~ intenta con otro título.';

        if (video.seconds >= 3600) {
            return conn.reply(m.chat, '⚠️⏰ ¡El video dura más de 1 hora, senpai! Busca algo más cortito~', m);
        }

        // Obtener enlace directo de audio con ytdl
        const audioStream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });

        // Preparar mensaje de información
        let caption = '';
        caption += `🦈✨ *Título:* ${video.title}\n`;
        caption += `⏳ *Duración:* ${video.timestamp}\n`;
        caption += `👀 *Vistas:* ${video.views}\n`;
        caption += `📅 *Publicado:* ${video.ago}\n`;
        caption += `🎤 *Autor:* ${video.author.name}\n`;
        caption += `📺 *Canal:* ${video.author.url}\n`;
        caption += `🌊 *Enlace:* ${video.url}\n`;
        caption += `🖼️ *Miniatura:* ${video.image}`;

        // Enviar info del video
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `🎶🐬 ${video.title}`,
                        mediaType: 1,
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
            audio: audioStream,
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

handler.command = handler.help = ['play', 'song', 'ds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;
