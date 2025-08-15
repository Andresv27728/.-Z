const axios = require('axios')
const ytdl = require('ytdl-core')
const yts = require('yt-search')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🎵 Ingresa el título o enlace de YouTube\n\n📌 Ejemplo:\n${usedPrefix + command} Shape of You`

    // Animación de carga fluida
    let frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    let msg = await conn.reply(m.chat, `🎧 Buscando y procesando... ${frames[0]}`, m)
    let i = 0
    let spinner = setInterval(() => {
        i = (i + 1) % frames.length
        conn.relayMessage(m.chat, {
            protocolMessage: { key: msg.key, type: 14, editedMessage: { conversation: `🎧 Buscando y procesando... ${frames[i]}` } }
        }, {})
    }, 100)

    try {
        let videoUrl = text

        // Si no es un enlace, buscar en YouTube
        if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
            let search = await yts(text)
            if (!search.videos.length) throw '❌ No se encontraron resultados'
            videoUrl = search.videos[0].url
        }

        let audioBuffer
        let success = false

        // Lista de APIs gratuitas sin API key
        let apis = [
            videoUrl => `https://api.savetube.me/download?url=${encodeURIComponent(videoUrl)}&format=mp3`,
            videoUrl => `https://yt5s.io/api/ajaxSearch/index?query=${encodeURIComponent(videoUrl)}&vt=mp3`,
            videoUrl => `https://youtubeapi.ml/api/v1/ytmp3?url=${encodeURIComponent(videoUrl)}`,
            videoUrl => `https://ytpp3.com/api/json?url=${encodeURIComponent(videoUrl)}`,
            videoUrl => `https://snappea.com/api/v1/audio?url=${encodeURIComponent(videoUrl)}`
        ]

        for (let api of apis) {
            try {
                let { data } = await axios.get(api(videoUrl), { responseType: 'arraybuffer' })
                if (data && data.length > 1000) {
                    audioBuffer = data
                    success = true
                    break
                }
            } catch (e) {
                console.log(`API falló: ${api(videoUrl)}`)
            }
        }

        // Último recurso: Scraping propio con ytdl-core
        if (!success) {
            try {
                audioBuffer = await new Promise((resolve, reject) => {
                    let chunks = []
                    ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' })
                        .on('data', chunk => chunks.push(chunk))
                        .on('end', () => resolve(Buffer.concat(chunks)))
                        .on('error', reject)
                })
                success = true
            } catch (err) {
                console.error('Scraping propio falló:', err)
            }
        }

        clearInterval(spinner)

        if (!success) throw '❌ No fue posible obtener el audio con ninguno de los métodos.'

        await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m })
        conn.reply(m.chat, '✅ Audio enviado correctamente', m)

    } catch (err) {
        clearInterval(spinner)
        conn.reply(m.chat, `❌ Error: ${err}`, m)
    }
}

handler.help = ['play <texto|enlace>']
handler.tags = ['downloader']
handler.command = /^play$/i

module.exports = handler
