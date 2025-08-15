module.exports = Object.assign(async function handler(m, { conn, text }) {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
    if (!hash) throw '⚠️ *No se encontró el hash del sticker.*\n\n💡 Responde a un sticker o escribe el hash manualmente.'

    let sticker = global.db.data.sticker[hash]

    if (sticker) {
        return m.reply(`
🎯 *Información del Sticker*
────────────────────
🆔 *Hash (fileSha256):* ${hash}

💬 *Texto:* ${sticker.text || 'Sin texto'}

📅 *Fecha de creación:* ${sticker.at || 'Desconocida'}

🔒 *Bloqueado:* ${sticker.locked ? 'Sí 🔐' : 'No 🔓'}

👤 *Creador:* ${conn.getName(sticker.creator)}
📞 *Número:* ${splitM(sticker.creator)}
🆔 *JID:* ${sticker.creator}

${sticker.mentionedJid.length > 0 
? `👥 *Menciones en comando:*\n${sticker.mentionedJid.map((v, i) => 
    `No. *${i + 1}*\n👤 *Nombre:* ${conn.getName(v)}\n📞 *Número:* ${splitM(v)}\n🆔 *JID:* ${v}`
    ).join('\n\n')}` 
: ''}
────────────────────
📌 *Fin de la información*
        `.trim())
    } else {
        m.reply('❌ *Este sticker no está en la base de datos.*')
    }
}, {
    help: ['cmd'].map(v => 'info' + v + ' <texto>'),
    tags: ['database'],
    command: ['infocmd']
})

/**
 * 🛠️ Función para obtener el número desde un JID
 * @param {String} jid 
 * @returns {String}
 */
function splitM(jid) {
    return jid.split('@')[0]
}
