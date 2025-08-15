const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.sender]

  if (user.registered === true) throw `🦈 ¡Ya estás registrado! 🌊\n¿Quieres registrarte de nuevo? Usa: ${usedPrefix}unreg <SN|NÚMERO SERIAL>`

  if (!Reg.test(text)) throw `❌ Formato incorrecto\nUsa: *${usedPrefix}daftar nombre.edad*`

  let [_, name, splitter, age] = text.match(Reg)

  if (!name) throw '❌ El nombre no puede estar vacío (solo caracteres alfanuméricos)'
  if (!age) throw '❌ La edad no puede estar vacía (solo números)'

  age = parseInt(age)
  if (age > 120) throw '😂 ¡Edad demasiado alta!'
  if (age < 5) throw '👶 ¡Eres muy pequeño para registrarte!'

  user.name = name.trim()
  user.age = age
  user.regTime = + new Date()
  user.registered = true

  let sn = createHash('md5').update(m.sender).digest('hex')

  m.reply(`
🦈✨ ¡Registro exitoso! 🌊

╭─「 📝 Información 」─╮
│ Nombre: ${name}
│ Edad: ${age} años
╰───────────────╯

🔑 Serial Number:
${sn}

¡Bienvenido a la familia tiburón! 🦈💙
`.trim())
}

handler.help = ['daftar', 'reg', 'register'].map(v => v + ' <nombre>.<edad>')
handler.tags = ['xp']
handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler

