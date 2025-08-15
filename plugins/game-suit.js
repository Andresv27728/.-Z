// 🦈🌊✨ Comando Piedra, Papel o Tijera - Versión Gawr Gura ✨🌊🦈
let handler = async (m, { text, usedPrefix }) => {
    let errorMsg = `🌊💙 Opciones disponibles, kouhai~ 💙🌊\n\n🪨 piedra, ✂️ tijera, 📄 papel\n\nEjemplo: ${usedPrefix}suit piedra\n\n¡No olvides dejar un espacio después del comando! 🦈✨`
    if (!text) throw errorMsg
    
    var guraChoice = Math.random()

    if (guraChoice < 0.34) {
        guraChoice = 'piedra'
    } else if (guraChoice > 0.34 && guraChoice < 0.67) {
        guraChoice = 'tijera'
    } else {
        guraChoice = 'papel'
    }

    // 🌊💙 Reglas del juego estilo Gawr Gura 💙🌊
    if (text == guraChoice) {
        m.reply(`🤝 ¡Empate, desu~! 🦈✨\nTú: ${text}\nGuraBot: ${guraChoice}`)
    } else if (text == 'piedra') {
        if (guraChoice == 'tijera') {
            global.db.data.users[m.sender].money += 1000
            m.reply(`🏆💙 ¡Ganaste, nya~! +💰1000 monedas Gura\nTú: ${text}\nGuraBot: ${guraChoice}`)
        } else {
            m.reply(`😢 Oh no... perdiste, bubby~\nTú: ${text}\nGuraBot: ${guraChoice}`)
        }
    } else if (text == 'tijera') {
        if (guraChoice == 'papel') {
            global.db.data.users[m.sender].money += 1000
            m.reply(`🏆💙 ¡Ganaste, nya~! +💰1000 monedas Gura\nTú: ${text}\nGuraBot: ${guraChoice}`)
        } else {
            m.reply(`😢 Oh no... perdiste, bubby~\nTú: ${text}\nGuraBot: ${guraChoice}`)
        }
    } else if (text == 'papel') {
        if (guraChoice == 'piedra') {
            global.db.data.users[m.sender].money += 1000
            m.reply(`🏆💙 ¡Ganaste, nya~! +💰1000 monedas Gura\nTú: ${text}\nGuraBot: ${guraChoice}`)
        } else {
            m.reply(`😢 Oh no... perdiste, bubby~\nTú: ${text}\nGuraBot: ${guraChoice}`)
        }
    } else {
        throw errorMsg
    }
}

handler.help = ['suit']
handler.tags = ['juegos']
handler.command = /^(suit)$/i

module.exports = handler
