let search = require('yt-search');
let fetch = require('node-fetch');
let ytdl = require('ytdl-core');
let { PassThrough } = require('stream');

let handler = async (m, { conn, text }) => {
    if (!text) throw '🐬✨ Ingresa el título de YouTube, senpai~';
    try {
        await m.reply('⏳🌊 *Cargando...* Gura está buscando tu video entre las olas del océano...');

        // Buscar el video en YouTube
        const look = await search(text);
        const video = look.videos[0];
        if (!video) throw '🦈💦 No encontré nada, intenta con otro título.';

        const tryApis = async () => {
            const promises = [
                // SpeedMaster
                (async () => {
                    try {
                        const res = await fetch(`http://br1.speedmasterhost.com.br:2029/youtube/play?query=${encodeURIComponent(text)}&apikey=danieldev`);
                        const data = await res.json();
                        if (data?.audio) return await (await fetch(data.audio)).buffer();
                    } catch {}
                    throw 'SpeedMaster falló';
                })(),
                // BotCahx
                (async () => {
                    try {
                        const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(video.url)}&apikey=btc`);
                        const data = await res.json();
                        if (data?.result?.mp4) return await (await fetch(data.result.mp4)).buffer();
                    } catch {}
                    throw 'BotCahx falló';
                })(),
                // GiftedTech
                (async () => {
                    try {
                        const res = await fetch(`https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(video.url)}`);
                        const data = await res.json();
                        if (data?.result?.url) return await (await fetch(data.result.url)).buffer();
                    } catch {}
                    throw 'GiftedTech falló';
                })(),
                // MyApiAdonix
                (async () => {
                    try {
                        const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(video.url)}`);
                        const data = await res.json();
                        if (data?.result) return await (await fetch(data.result)).buffer();
                    } catch {}
                    throw 'MyApiAdonix falló';
                })(),
                // Respaldo ytdl-core
                (async () => {
                    try {
                        const stream = ytdl(video.url, { filter: 'audioandvideo', quality: 'highest' });
                        const pass = new PassThrough();
                        stream.pipe(pass);
                        const chunks = [];
                        for await (const chunk of pass) chunks.push(chunk);
                        return Buffer.concat(chunks);
                    } catch {}
                    throw 'ytdl-core falló';
                })()
            ];

            return await Promise.any(promises);
        };

        const buffer = await tryApis();

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
                        title: `🎬🐬 ${video.title}`,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: video.image,
                        sourceUrl: video.url
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        // Verificar tamaño para enviar como video o documento
        const MAX_VIDEO_SIZE = 16 * 1024 * 1024; // 16 MB
        if (buffer.length <= MAX_VIDEO_SIZE) {
            await conn.sendMessage(m.chat, {
                video: buffer,
                mimetype: 'video/mp4',
                caption: `🎥✨ Aquí tienes tu video, senpai~`,
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                document: buffer,
                mimetype: 'video/mp4',
                fileName: `${video.title}.mp4`,
                caption: `📦🎥 Tu video excede 16MB, lo envié como documento, senpai~`,
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '💔🐟 ¡Ups! Todas las APIs fallaron o hubo un error bajo el océano~', m);
    }
};

handler.command = handler.help = ['play2', 'video', 'vds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler; 
