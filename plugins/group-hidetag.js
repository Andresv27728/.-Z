// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🐟  Handler HideTag - Gawr Gura Bot 🐟🌊
// "a~ anuncio secreto bajo el océano" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

const { generateWAMessageFromContent } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    text = text || (q.text || q.caption || q.description || '')

    // 🐚 Si no hay texto ni archivo → ejemplo de uso
    if (!text && !mime) {
        throw `✨ Ejemplo: ${usedPrefix + command} <texto>\n\nResponde a un mensaje (imagen, video, audio, sticker) para incluirlo en el anuncio secreto 🌊`
    }

    // 🎐 Contacto falso usado como quote (estilo escondido bajo el mar)
    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    }

    // 🐋 Si el mensaje es imagen/video/audio → enviamos con @everyone oculto
    if (/image|video|audio/.test(mime)) {
        let media = await q.download?.()
        if (!media) throw '❌ No se pudo descargar el archivo, glub glub~'

        let msgOptions = {
            [mime.includes('image') ? 'image' : mime.includes('video') ? 'video' : 'audio']: media,
            caption: mime.includes('audio') ? undefined : text,
            mentions: participants.map(a => a.id)
        }

        if (mime.includes('audio')) {
            msgOptions.mimetype = 'audio/mpeg'
        }

        await conn.sendMessage(m.chat, msgOptions, { quoted: fkontak })

    // 🐠 Si es sticker → lo mandamos con oculto también
    } else if (/sticker/.test(mime)) {
        let media = await q.download?.()
        if (!media) throw '❌ No se pudo descargar el sticker, a~'
        await conn.sendMessage(m.chat, { sticker: media, mentions: participants.map(a => a.id) }, { quoted: fkontak })

    // 🦈 Si es solo texto → lo mandamos a todos sin que se note
    } else {
        await conn.sendMessage(m.chat, { text: text, mentions: participants.map(a => a.id) }, { quoted: fkontak })
    }
}

// 📖 Ayuda y configuración
handler.help = ['hidetag <texto>'] // 🦈 Anuncio oculto
handler.tags = ['group']
handler.command = /^(hidetag|ht|h)$/i

// ⚙️ Requiere grupo y admin
handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "Glub glub~ anuncio secreto enviado 🐟✨"
// ─────────────── ⋆⋅☆⋅⋆ ───────────────
