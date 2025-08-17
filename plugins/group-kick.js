// ─────────────── ⋆⋅☆⋅⋆ ───────────────
//   🌊🐟  Handler Kick - Gawr Gura Bot 🐟🌊
//   "a~ es hora de lanzar gente al océano" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let handler = async (m, { teks, conn, isOwner, isAdmin, args }) => {
  if (m.isBaileys) return // ⚡ ignoramos mensajes del sistema uwu
  if (!(isAdmin || isOwner)) {
    // 🚫 Solo admins o el dueño pueden usar este comando, a~
    global.dfail('admin', m, conn)
    throw false
  }

  // 👑 Definimos al "shark-king" del grupo (el dueño)
  let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net"

  // 🐋 Si responde a un mensaje → expulsamos al autor
  if (m.quoted) {
    if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid) return // 🛑 no se expulsa al dueño ni al bot
    let usr = m.quoted.sender
    await conn.groupParticipantsUpdate(m.chat, [usr], "remove") // 🌊 adiós al océano
    return
  }

  // 🐚 Si no mencionan a nadie → avisamos
  if (!m.mentionedJid[0]) throw `⚠️ Etiqueta a alguien que quieras lanzar al océano 🦈`

  // 🐠 Filtramos que no sea el dueño o el bot
  let users = m.mentionedJid.filter(
    (u) => !(u == ownerGroup || u.includes(conn.user.jid))
  )

  // 🌊 Expulsamos a los mencionados (glub glub)
  for (let user of users)
    if (user.endsWith("@s.whatsapp.net"))
      await conn.groupParticipantsUpdate(m.chat, [user], "remove")
}

// 📖 Ayuda del comando
handler.help = ['kick @user'] // 🦈 Expulsar a un usuario
handler.tags = ['group']      // 📂 Categoría: grupos
handler.command = /^(kic?k|remove|tendang|\-)$/i // ✨ Variantes de comandos

// ⚙️ Configuración
handler.group = true     // 🐋 Solo en grupos
handler.botAdmin = true  // 👑 El bot debe ser admin

module.exports = handler

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
//   Gawr Gura dice: "a~ fuera del grupo" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────
