let handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    user.afk = + new Date
    user.afkReason = text

    // Variantes de mensajes AFK con temática Gawr Gura
    const mensajesAFK = [
        `🦈💙 @${m.sender.split`@`[0]} se ha sumergido en el océano y está AFK ${text ? '\nRazón: ' + text : 'sin razón'} 💙🦈`,
        `🌊🐟 ¡Cuidado! @${m.sender.split`@`[0]} está explorando otras aguas ${text ? '\nMotivo: ' + text : 'sin motivo'} 🐟🌊`,
        `🐠✨ @${m.sender.split`@`[0]} ha desaparecido en las profundidades ✨🐠 ${text ? '\nRazón: ' + text : ''}`,
        `💦🦈 @${m.sender.split`@`[0]} AFK activo 💦🦈 ${text ? '\nMotivo: ' + text : ''}`,
        `🦈🌟 ¡El tiburoncito @${m.sender.split`@`[0]} se ha ido a explorar! 🌟🦈 ${text ? '\nRazón: ' + text : ''}`,
        `🐟💙 @${m.sender.split`@`[0]} se ha sumergido en el océano de comandos 💙🐟 ${text ? '\nMotivo: ' + text : ''}`,
        `🌊✨ AFK activado por @${m.sender.split`@`[0]} ✨🌊 ${text ? '\nRazón: ' + text : ''}`,
        `🦈🐠 ¡@${m.sender.split`@`[0]} está fuera del radar! 🐠🦈 ${text ? '\nMotivo: ' + text : ''}`,
        `💙🐋 @${m.sender.split`@`[0]} navegando por aguas profundas 💙🐋 ${text ? '\nRazón: ' + text : ''}`,
        `🐠🦈 ¡AFK de @${m.sender.split`@`[0]} en acción! 🦈🐠 ${text ? '\nMotivo: ' + text : ''}`
    ]

    // Seleccionar un mensaje aleatorio
    let mensaje = mensajesAFK[Math.floor(Math.random() * mensajesAFK.length)]

    m.reply(mensaje)
}

handler.help = ['afk [razón]']
handler.tags = ['main']
handler.command = /^afk$/i

module.exports = handler
