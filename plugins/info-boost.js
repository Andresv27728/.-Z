let { performance } = require('perf_hooks')

let handler = async (m, { conn }) => {

  // 🦈 Mensaje inicial de boost
  let start = `⚡ ¡Activando Boost del Tiburón! 🌊`
  
  // Generación de porcentajes aleatorios para animación de boost
  let boost = `${pickRandom(['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'])}%`
  let boost2 = `${pickRandom(['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}%`
  let boost3 = `${pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60'])}%`
  let boost4 = `${pickRandom(['61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80'])}%`
  let boost5 = `${pickRandom(['81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'])}%`

  // Enviar mensajes de boost intermedios para animación
  await m.reply(start)
  await m.reply(boost + ' 🦈')
  await m.reply(boost2 + ' 🌊')
  await m.reply(boost3 + ' 🦈💙')
  await m.reply(boost4 + ' 🌊✨')
  await m.reply(boost5 + ' 🦈🌟')

  // Medir velocidad del bot
  let old = performance.now()
  let neww = performance.now()
  let speed = `${(neww - old).toFixed(2)}`

  // Mensaje final con estilo Gura
  let finish = `✔️ ¡Boost completado con éxito! 🦈💨\nVelocidad del bot aumentada a: ${speed} ms 🌊✨`

  conn.reply(m.chat, finish, m)
}

handler.help = ['boost', 'refresh']
handler.tags = ['info']
handler.command = /^boost|refresh/i
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null

module.exports = handler

// Función para escoger un elemento aleatorio de una lista
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
