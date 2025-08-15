var { totalmem, freemem } = require('os')
var os = require("os");
var util = require("util");
var osu = require("node-os-utils");
var { performance } = require("perf_hooks");
var { sizeFormatter } = require("human-readable");

// Formateador de tamaño de memoria con estilo Gawr Gura 🦈
var format = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

var handler = async (m, { conn }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) // Grupos

  const used = process.memoryUsage()
  const cpus = os.cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce(
    (last, cpu, _, { length }) => {
      last.total += cpu.total;
      last.speed += cpu.speed / length;
      last.times.user += cpu.times.user;
      last.times.nice += cpu.times.nice;
      last.times.sys += cpu.times.sys;
      last.times.idle += cpu.times.idle;
      last.times.irq += cpu.times.irq;
      return last;
    },
    {
      speed: 0,
      total: 0,
      times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
    }
  );

  var _muptime
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }
  var muptime = clockString(_muptime)

  var old = performance.now();
  var neww = performance.now();
  var speed = neww - old;

  var cpux = osu.cpu
  var cpuCore = cpux.count()
  var drive = osu.drive
  var mem = osu.mem
  var netstat = osu.netstat
  var HostN = osu.os.hostname()
  var OS = osu.os.platform()
  var cpuModel = cpux.model()
        
  var d = new Date(new Date + 3600000)
  var locale = 'es' // Traducido a español
  var weeks = d.toLocaleDateString(locale, { weekday: 'long' })
  var dates = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  var times = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })

  await m.reply('🦈 Probando velocidad del tiburón... 🌊')

  var txt = `
🌊 *PING DEL TIBURÓN*
⏱️ ${Math.round(neww - old)} ms
⚡ ${speed} ms

🕒 *TIEMPO DE EJECUCIÓN DEL BOT*
${muptime}

💌 *CHATS*
• *${groupsIn.length}* Grupos Activos
• *${groupsIn.length}* Grupos Únete
• *${groupsIn.length - groupsIn.length}* Grupos Salidos
• *${chats.length - groupsIn.length}* Chats Personales
• *${chats.length}* Chats Totales

🖥️ *SERVIDOR*
*🛑 RAM Usada:* ${format(totalmem() - freemem())} / ${format(totalmem())}
*🔵 RAM Libre:* ${format(freemem())}
*🔴 CPU:* ${require('os').cpus()[0].model}
*🔭 Plataforma:* ${os.platform()}
*🧿 Servidor:* ${os.hostname()}
*💻 Sistema Operativo:* ${OS}
*⏰ Hora del Servidor:* ${times}

📦 _Uso de memoria NodeJS_
${
  "```" +
  Object.keys(used)
    .map(
      (key, _, arr) =>
        `${key.padEnd(Math.max(...arr.map((v) => v.length)), " ")}: ${format(used[key])}`
    )
    .join("\n") +
  "```"
}

${
  cpus[0]
    ? `_Uso total de CPU_
${cpus[0].model.trim()} (${cpu.speed} MHZ)
${Object.keys(cpu.times)
        .map(
          (type) =>
            `- *${(type + "*").padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`
        )
        .join("\n")}

_Core(s) de CPU (${cpus.length} Núcleo(s))_
${cpus
  .map(
    (cpu, i) =>
      `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)
${Object.keys(cpu.times)
        .map(
          (type) =>
            `- *${(type + "*").padEnd(6)}: ${((100 * cpu.times[type]) / cpu.total).toFixed(2)}%`
        )
        .join("\n")}`
  )
  .join("\n\n")}`
    : ""
}
`

  conn.relayMessage(m.chat, {
    extendedTextMessage:{
      text: txt, 
      contextInfo: {
        externalAdReply: {
          title: `🦈 ${require('os').cpus()[0].model}`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://telegra.ph/file/ec8cf04e3a2890d3dce9c.jpg',
          sourceUrl: ''
        }
      }, mentions: [m.sender]
    }
  }, {})
}

handler.help = ['ping', 'speed'];
handler.tags = ['info'];
handler.command = /^(ping|speed|pong|ingfo)$/i
module.exports = handler;

// Función para convertir milisegundos a Días, Horas, Minutos y Segundos
function clockString(ms) {
  var d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  var h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  var m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  var s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'D ', h, 'H ', m, 'M ', s, 'S '].map(v => v.toString().padStart(2, 0)).join('')
}

