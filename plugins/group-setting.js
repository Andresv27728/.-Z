// ─────────────── ⋆⋅☆⋅⋆ ───────────────
//   🌊🐟  Handler Grupo - Gawr Gura Bot 🐟🌊
//   "a~ hora de abrir o cerrar el océano del grupo" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let { groupsSettingUpdate } = require('@adiwajshing/baileys')

let handler = async (m, { isAdmin, isOwner, isBotAdmin, conn, args, usedPrefix, command }) => {
  // 🚫 Validaciones: solo Admins/Dueño
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // 🚫 El bot debe ser admin para controlar las olas 🌊
  if (!isBotAdmin) {
    global.dfail('botAdmin', m, conn)
    throw false
  }

  // 🐋 Mensaje predeterminado al abrir el grupo
  let bu = `🌊 El grupo ha sido *abierto* por @${m.sender.split`@`[0]} 🦈 
Ahora todos los miembros pueden enviar mensajes ✨
Escribe *${usedPrefix}group tutup* para cerrarlo!`.trim()

  // ⚙️ Diccionario de opciones de apertura/cierre
  let isClose = {
    'open': 'not_announcement',
    'buka': 'not_announcement',
    'on': 'not_announcement',
    '1': 'not_announcement',
    'close': 'announcement',
    'tutup': 'announcement',
    'off': 'announcement',
    '0': 'announcement',
  }[(args[0] || '')]

  // 🐠 Si no pusieron argumento válido → ejemplo
  if (isClose === undefined) {
    var text5 = `⚠️ Ejemplo de uso:
${usedPrefix + command} tutup
${usedPrefix + command} buka`
    m.reply(text5)
    throw false
  } 
  // 🚪 Caso: cerrar el grupo
  else if (isClose === 'announcement') {
    await conn.groupSettingUpdate(m.chat, isClose)
    let teks = `🚪 El grupo ha sido *cerrado* por @${m.sender.split`@`[0]} 🌊
Ahora solo los administradores pueden enviar mensajes 🦈
Escribe *${usedPrefix}group buka* para abrirlo!`.trim()
    await m.reply(teks)
  } 
  // 🚪 Caso: abrir el grupo
  else if (isClose === 'not_announcement') {
    await conn.groupSettingUpdate(m.chat, isClose)
    await m.reply(bu)
  } 
  // 🐚 Extra fallback (aunque ya se controla arriba)
  else if (isClose === undefined) {
    var te = `⚠️ Ejemplo:
${usedPrefix + command} tutup
${usedPrefix + command} buka`
    m.reply(te)
  }
}

// 📖 Ayuda del comando
handler.help = ['grup <open/close>'] // 🦈 Abrir/cerrar el grupo
handler.tags = ['group']
handler.command = /^(g(ro?up|c?)?)$/i

// ⚙️ Configuración extra
handler.group = true
handler.botAdmin = false // ✨ importante que el bot tenga admin

module.exports = handler

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
//   Gawr Gura: "a~ abre o cierra las olas del grupo 🌊🦈"
// ─────────────── ⋆⋅☆⋅⋆ ───────────────
