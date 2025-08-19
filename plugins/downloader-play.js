let search = require('yt-search');
let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw '🐬✨ Ingresa el título o enlace de YouTube, senpai~';
    try {
        await m.reply('⏳🌊 *Cargando...* Gura está buscando tu canción entre las olas del océano...');
        
        const look = await search(text);
        const convert = look.videos[0];
        if (!convert) throw '🦈💦 No encontré nada, nya~ intenta con otro título.';
        
        if (convert.seconds >= 3600) {
            return conn.reply(m.chat, '⚠️⏰ ¡El video dura más de 1 hora, senpai! Busca algo más cortito~', m);
        } else {
            let audioUrl;
            try {
                const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${convert.url}&apikey=${btc}`);
                try {
                    audioUrl = await res.json();
                } catch (e) {
                    conn.reply(m.chat, '💔🐟 Error al procesar el audio~', m)
                }
                
            } catch (e) {
                conn.reply(m.chat, '💔🐟 Error al conectar con el servidor~', m)
                return;
            }

            let caption = '';
            caption += `🦈✨ *Título:* ${convert.title}\n`;
            caption += `📀 *Formato:* Búsqueda\n`;
            caption += `🆔 *ID:* ${convert.videoId}\n`;
            caption += `⏳ *Duración:* ${convert.timestamp}\n`;
            caption += `👀 *Vistas:* ${convert.views}\n`;
            caption += `📅 *Publicado:* ${convert.ago}\n`;
            caption += `🎤 *Autor:* ${convert.author.name}\n`;
            caption += `📺 *Canal:* ${convert.author.url}\n`;
            caption += `🌊 *Enlace:* ${convert.url}\n`;
            caption += `💬 *Descripción:* ${convert.description}\n`;
            caption += `🖼️ *Miniatura:* ${convert.image}`;

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: caption,
                    contextInfo: {
                        externalAdReply: {
                            title: `🎶🐬 ${convert.title}`,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: convert.image,
                            sourceUrl: convert.url
                        }
                    },
                    mentions: [m.sender]
                }
            }, {});

            await conn.sendMessage(m.chat, {
                audio: {
                    url: audioUrl.result.mp3
                },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: `🎵💙 ${convert.title}`,
                        body: "Gura trajo tu canción desde el fondo del mar~ 🐚💖",
                        thumbnailUrl: convert.image,
                        sourceUrl: convert.url,
                        mediaType: 1,
                        showAdAttribution: false,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: m
            });
        }
    } catch (e) {
        conn.reply(m.chat, '💔🐟 ¡Ups! Algo salió mal bajo el océano~', m)
    }
};

handler.command = handler.help = ['play', 'song', 'ds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;
