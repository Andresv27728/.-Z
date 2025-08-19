let search = require('yt-search');
let fetch = require('node-fetch');

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

        let audioUrl;

        // Intento 1: API SpeedMaster
        try {
            const res = await fetch(`http://br1.speedmasterhost.com.br:2029/youtube/play?query=${encodeURIComponent(text)}&apikey=danieldev`);
            const data = await res.json();
            if (data && data.audio) audioUrl = data.audio;
        } catch (e) { console.log('API SpeedMaster falló'); }

        // Intento 2: API BotCahx (requiere key)
        if (!audioUrl) {
            try {
                const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(video.url)}&apikey=btc`);
                const data = await res.json();
                if (data && data.result?.mp3) audioUrl = data.result.mp3;
            } catch (e) { console.log('API BotCahx falló'); }
        }

        // Intento 3: API MyApiAdonix (sin key)
        if (!audioUrl) {
            try {
                const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(video.url)}`);
                const data = await res.json();
                if (data && data.result) audioUrl = data.result;
            } catch (e) { console.log('API MyApiAdonix falló'); }
        }

        if (!audioUrl) throw '💔🐟 Todas las APIs fallaron, intenta más tarde~';

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

        // Enviar info
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

        // Enviar audio
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
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
