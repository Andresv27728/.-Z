let search = require('yt-search');
let fetch = require('node-fetch');
let ytdl = require('ytdl-core');

let handler = async (m, { conn, text }) => {
    if (!text) throw '🐬✨ Ingresa el título de YouTube, senpai~';
    try {
        await m.reply('⏳🌊 *Cargando...* Gura está buscando tu video entre las olas del océano...');

        // Buscar el video en YouTube
        const look = await search(text);
        const video = look.videos[0];
        if (!video) throw '🦈💦 No encontré nada, intenta con otro título.';

        let videoUrl;
        let buffer;

        // Intento 1: SpeedMaster
        try {
            const apiSpeedMaster = `http://br1.speedmasterhost.com.br:2029/youtube/play?query=${encodeURIComponent(text)}&apikey=danieldev`;
            const res1 = await fetch(apiSpeedMaster);
            const data1 = await res1.json();
            if (data1?.audio) videoUrl = data1.audio;
        } catch (e) { console.log('API SpeedMaster falló'); }

        // Intento 2: BotCahx
        if (!videoUrl) {
            try {
                const apiBotCahx = `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(video.url)}&apikey=btc`;
                const res2 = await fetch(apiBotCahx);
                const data2 = await res2.json();
                if (data2?.result?.mp4) videoUrl = data2.result.mp4;
            } catch (e) { console.log('API BotCahx falló'); }
        }

        // Intento 3: GiftedTech
        if (!videoUrl) {
            try {
                const apiGifted = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(video.url)}`;
                const res3 = await fetch(apiGifted);
                const data3 = await res3.json();
                if (data3?.result?.url) videoUrl = data3.result.url;
            } catch (e) { console.log('API GiftedTech falló'); }
        }

        // Intento 4: MyApiAdonix
        if (!videoUrl) {
            try {
                const apiAdonix = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(video.url)}`;
                const res4 = await fetch(apiAdonix);
                const data4 = await res4.json();
                if (data4?.result) videoUrl = data4.result;
            } catch (e) { console.log('API MyApiAdonix falló'); }
        }

        // Respaldo: ytdl-core
        if (!videoUrl) {
            try {
                buffer = await ytdl(video.url, { filter: 'audioandvideo', quality: 'highest' }).pipe(require('stream').PassThrough());
            } catch (e) {
                console.log('ytdl-core falló');
                throw '💔🐟 Todas las APIs y respaldo fallaron, intenta más tarde~';
            }
        }

        // Si tenemos URL de API, descargar buffer
        if (videoUrl && !buffer) {
            const res = await fetch(videoUrl);
            buffer = await res.buffer();
        }

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

        // Enviar video
        await conn.sendMessage(m.chat, {
            video: buffer,
            mimetype: 'video/mp4',
            caption: `🎥✨ Aquí tienes tu video, senpai~`,
            contextInfo: {
                externalAdReply: {
                    title: `🎬🐬 ${video.title}`,
                    body: "Gura trajo tu video desde el océano~ 🐚💖",
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

handler.command = handler.help = ['play2', 'video', 'vds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;
