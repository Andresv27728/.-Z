let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `
Hai ${ye} Este bot nada por los mares usando un script especial~ 🫧  
¡Listo para ayudarte, capitán~!:\n• https://github.com/Andresv27728/GawrGura.git
`
m.reply(esce)
}
handler.help = ['sc', 'sourcecode']
handler.tags = ['info']
handler.command = /^(sc|sourcecode)$/i

module.exports = handler
