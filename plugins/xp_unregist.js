const { createHash } = require('crypto');

let handler = async function (m, { conn, args, command, usedPrefix }) {
  if (!args[0]) throw `✳️ *Ingresa tu número serial*\nEjemplo: ${usedPrefix + command} numeroserial\n\nPuedes ver tu número serial con:\n*${usedPrefix}numeroserial* 🦈`

  let user = global.db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')

  if (args[0] !== sn) throw '⚠️ Número serial incorrecto 😅'

  user.registered = false
  m.reply(`✅ ¡Registro eliminado con éxito! 🌊🦈\nAhora puedes registrarte de nuevo si quieres.`)
}

handler.help = ['unreg <Número Serial>']
handler.tags = ['xp']
handler.command = ['unreg']
handler.register = true

module.exports = handler
