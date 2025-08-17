let handler = m => m

handler.before = m => {
  let user = global.db.data.users[m.sender]

  // Variantes de mensajes de regreso de AFK
  const regresoAFK = [
    `🦈💙 ¡Has vuelto del AFK, capitán! 💙🦈\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `🌊🐟 ¡Bienvenido de nuevo al océano de Gura! 🐟🌊\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nDuración: ${clockString(new Date - user.afk)}`,
    `🐠✨ ¡Tiburoncito regresó! ✨🐠\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🦈🌟 ¡El océano te extrañó! 🌟🦈\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `💦🐋 ¡Regresaste de tu expedición submarina! 🐋💦\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🦈💫 ¡Capitán, de vuelta al mando! 💫🦈\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `🌊🐠 ¡Hola de nuevo! ¡El mar te recibe! 🐠🌊\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🐟🦈 ¡AFK terminado! 💙🐟\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo fuera: ${clockString(new Date - user.afk)}`,
    `💙🌊 ¡Bienvenido de regreso al océano de comandos! 🌊💙\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🐠✨ ¡Regresaste, capitán del océano! ✨🐠\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nDuración: ${clockString(new Date - user.afk)}`
  ]

  // Mostrar mensaje aleatorio al regresar
  if (user.afk > -1) {
    m.reply(regresoAFK[Math.floor(Math.random() * regresoAFK.length)])
    user.afk = -1
    user.afkReason = ''
  }

  // Variantes de mensajes al etiquetar a alguien AFK
  const etiquetadoAFK = [
    `🐟🦈 ¡Cuidado! Esta persona está AFK 🦈🐟\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `🌊💙 No molestes, está explorando el océano 💙🌊\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🦈✨ AFK activo 🐠✨\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo fuera: ${clockString(new Date - user.afk)}`,
    `🐋💦 ¡Está sumergido! No lo etiquetes 💦🐋\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `💙🌊 ¡En el mar profundo! Evita etiquetar 💙🌊\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `🐠🦈 ¡Tiburoncito AFK! 🦈🐠\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo fuera: ${clockString(new Date - user.afk)}`,
    `🌊✨ ¡Está navegando otras aguas! ✨🌊\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo AFK: ${clockString(new Date - user.afk)}`,
    `🦈💦 AFK activado 💦🦈\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo ausente: ${clockString(new Date - user.afk)}`,
    `🐟🌊 ¡No lo molestes, está AFK! 🌊🐟\n${user.afkReason ? 'Razón: ' + user.afkReason : 'Sin razón'}\nTiempo fuera: ${clockString(new Date - user.afk)}`,
    `💙🦈 AFK en acción 🦈💙\n${user.afkReason ? 'Motivo: ' + user.afkReason : 'Sin motivo'}\nTiempo AFK: ${clockString(new Date - user.afk)}`
  ]

  // Revisar si alguien etiquetó a un usuario AFK
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    m.reply(etiquetadoAFK[Math.floor(Math.random() * etiquetadoAFK.length)])
  }

  return true
}

module.exports = handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
