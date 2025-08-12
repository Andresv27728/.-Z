let search = require('yt-search');
let fetch = require('node-fetch');

// Lista de APIs públicas para descargar YouTube (sin API key)
const APIs_PUBLICAS = [
    'https://api.cobalt.tools/api/json',
    'https://api.savefrom.net/v2/',
    'https://www.y2mate.com/mates/analyze/ajax',
    'https://api.vevioz.com/api/button/mp3/',
    'https://api.onlinevideoconverter.pro/api/convert'
];

// Función para intentar con múltiples APIs
async function descargarConMultiplesAPIs(videoUrl, titulo) {
    const errores = [];
    
    // API 1: Cobalt Tools (gratuita)
    try {
        const respuesta = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: videoUrl,
                vQuality: "720",
                vFormat: "mp4",
                aFormat: "mp3",
                isAudioOnly: true
            })
        });
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            if (datos.url) {
                return { exito: true, url: datos.url, api: 'Cobalt Tools' };
            }
        }
    } catch (error) {
        errores.push(`Cobalt Tools: ${error.message}`);
    }

    // API 2: Y2Mate alternativa (simulación - necesitarías la implementación real)
    try {
        const respuesta = await fetch(`https://www.y2mate.com/mates/analyze/ajax`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(videoUrl)}&q_auto=1&ajax=1`
        });
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            // Procesar respuesta de Y2mate aquí
            console.log('Respuesta Y2mate:', datos);
        }
    } catch (error) {
        errores.push(`Y2Mate: ${error.message}`);
    }

    // API 3: Usando yt-dlp como servicio (si tienes un servidor propio)
    try {
        const respuesta = await fetch('https://tu-servidor-ytdlp.com/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: videoUrl,
                format: 'mp3',
                quality: 'best'
            })
        });
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            if (datos.download_url) {
                return { exito: true, url: datos.download_url, api: 'YT-DLP Servidor' };
            }
        }
    } catch (error) {
        errores.push(`YT-DLP: ${error.message}`);
    }

    // Si todas las APIs fallan, devolver error
    return { 
        exito: false, 
        error: 'Todas las APIs fallaron', 
        detalles: errores 
    };
}

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw '¡Ingresa un título o enlace de YouTube!';
    
    try {
        await m.reply('🔍 Buscando y procesando tu solicitud...');
        
        const busqueda = await search(text);
        const video = busqueda.videos[0];
        
        if (!video) throw 'Video/Audio no encontrado';
        
        if (video.seconds >= 3600) {
            return conn.reply(m.chat, '⚠️ ¡El video dura más de 1 hora!', m);
        }
        
        await m.reply('⬇️ Descargando audio, por favor espera...');
        
        // Intentar descargar con múltiples APIs
        const resultadoDescarga = await descargarConMultiplesAPIs(video.url, video.title);
        
        if (!resultadoDescarga.exito) {
            throw `Error al descargar: ${resultadoDescarga.error}`;
        }

        let descripcion = '';
        descripcion += `📺 *Título:* ${video.title}\n`;
        descripcion += `🆔 *ID:* ${video.videoId}\n`;
        descripcion += `⏱️ *Duración:* ${video.timestamp}\n`;
        descripcion += `👁️ *Visualizaciones:* ${video.views.toLocaleString()}\n`;
        descripcion += `📅 *Subido:* ${video.ago}\n`;
        descripcion += `👤 *Autor:* ${video.author.name}\n`;
        descripcion += `🔗 *Canal:* ${video.author.url}\n`;
        descripcion += `🌐 *URL:* ${video.url}\n`;
        descripcion += `📝 *Descripción:* ${video.description}\n`;
        descripcion += `🖼️ *Miniatura:* ${video.image}\n`;
        descripcion += `🔧 *API utilizada:* ${resultadoDescarga.api}`;

        // Enviar información del video
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: descripcion,
                contextInfo: {
                    externalAdReply: {
                        title: video.title,
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
            audio: {
                url: resultadoDescarga.url
            },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: video.title,
                    body: `Descargado con ${resultadoDescarga.api}`,
                    thumbnailUrl: video.image,
                    sourceUrl: video.url,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: m
        });

        await m.reply('✅ ¡Audio descargado y enviado exitosamente!');

    } catch (error) {
        console.error('Error en el descargador:', error);
        conn.reply(m.chat, `❌ *Error:* ${error.message || error}`, m);
    }
};

handler.command = handler.help = ['reproducir', 'cancion', 'descargar', 'play', 'song'];
handler.tags = ['descargador'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;
