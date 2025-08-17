const { 
    BufferJSON, 
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    proto, 
    generateWAMessageContent, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    areJidsSameUser, 
    getContentType 
} = require('@adiwajshing/baileys')

process.env.TZ = 'Asia/Jakarta'
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let arrayMenu = [
  'all', 'ai', 'main', 'downloader', 'database', 'rpg','rpgG', 'sticker', 
  'advanced', 'xp', 'fun', 'game', 'github', 'group', 'image', 'nsfw', 
  'info', 'internet', 'islam', 'kerang', 'maker', 'news', 'owner', 'voice', 
  'quotes', 'store', 'stalk', 'shortlink', 'tools', 'anonymous',''
];

const allTags = {
    'all': 'TODOS LOS MENÚS',
    'ai': 'MENÚ AI',
    'main': 'MENÚ PRINCIPAL',
    'downloader': 'MENÚ DESCARGAS',
    'database': 'MENÚ BASE DE DATOS',
    'rpg': 'MENÚ RPG',
    'rpgG': 'MENÚ RPG GUILD',
    'sticker': 'MENÚ STICKER',
    'advanced': 'MENÚ AVANZADO',
    'xp': 'MENÚ EXP',
    'fun': 'MENÚ DIVERSION',
    'game': 'MENÚ JUEGOS',
    'github': 'MENÚ GITHUB',
    'group': 'MENÚ GRUPOS',
    'image': 'MENÚ IMÁGENES',
    'nsfw': 'MENÚ NSFW',
    'info': 'MENÚ INFORMACIÓN',
    'internet': 'MENÚ INTERNET',
    'islam': 'MENÚ ISLÁMICO',
    'kerang': 'MENÚ CONCHAS',
    'maker': 'MENÚ CREADOR',
    'news': 'MENÚ NOTICIAS',
    'owner': 'MENÚ OWNER',
    'voice': 'MENÚ CAMBIO DE VOZ',
    'quotes': 'MENÚ FRASES',
    'store': 'MENÚ TIENDA',
    'stalk': 'MENÚ STALK',
    'shortlink': 'MENÚ SHORT LINK',
    'tools': 'MENÚ HERRAMIENTAS',
    'anonymous': 'CHAT ANÓNIMO',
    '': 'SIN CATEGORÍA'
}

// Decoraciones ASCII por categoría (cada categoría tiene un set de 3 variantes)
const asciiDecor = {
  all: [
    `🌊🦈 Gawr Gura Bot 🦈🌊`,
    `🐟 Bienvenido a todos los menús 🐟`,
    `🦈💙 ¡Sumérgete en mi océano de comandos! 💙🦈`
  ],
  ai: [
    `🤖🦈 Menú AI 🦈🤖`,
    `💡 Inteligencia Artificial con Gura 💡`,
    `🌊🐋 Explora mis comandos inteligentes 🐋🌊`
  ],
  main: [
    `🏝️ Menú Principal 🏝️`,
    `🦈💙 Comandos básicos con Gura 💙🦈`,
    `🐠 Sumérgete en lo esencial 🐠`
  ],
  downloader: [
    `📥 Descargas con estilo Gura 📥`,
    `🦈💦 Baja tus archivos rápidamente 💦🦈`,
    `🌊🐟 Menú de descargas 🐟🌊`
  ],
  database: [
    `🗄️ Base de datos de usuarios 🗄️`,
    `🦈 Control total de info 💙`,
    `🐚 Tu información segura 🐚`
  ],
  rpg: [
    `⚔️ Menú RPG 🦈⚔️`,
    `🌊 Aventuras submarinas te esperan 🌊`,
    `🐠 ¡Gura te acompaña en tus quests! 🐠`
  ],
  rpgG: [
    `🏰 Menú RPG Guild 🏰`,
    `🦈 Tu guild bajo el mar 💙`,
    `🐟 Comanda tu equipo submarino 🐟`
  ],
  sticker: [
    `🎨 Menú Sticker 🦈🎨`,
    `🐠 Crea stickers con Gura 🐠`,
    `🌊 ¡Diversión asegurada! 🌊`
  ],
  advanced: [
    `⚡ Menú Avanzado ⚡`,
    `🦈 Funciones pro de Gura 💙`,
    `🌊 Comandos para expertos 🌊`
  ],
  xp: [
    `📈 Menú EXP 🦈📈`,
    `🐟 Mejora tu nivel submarino 🐟`,
    `💙 Sube de rango con estilo 💙`
  ],
  fun: [
    `😂 Menú Diversión 🦈😂`,
    `🌊 Juegos y risas garantizadas 🌊`,
    `🐠 ¡Ríe con Gura! 🐠`
  ],
  game: [
    `🎮 Menú Juegos 🦈🎮`,
    `🐟 Competencias submarinas 🐟`,
    `🌊 ¡Desafía tus habilidades! 🌊`
  ]
  // Puedes agregar más categorías aquí
}

const defaultMenu = {
    before: `
%ascii
Hola %name
Soy tu tiburoncita favorita lista para ayudarte~  
Sumérgete en este océano de comandos y diviértete conmigo~!  

◦ *Library:* Baileys
◦ *Function:* Assistant

┌  ◦ Uptime : %uptime
│  ◦ Fecha : %date
│  ◦ Hora : %time
└  ◦ Prefijo Usado : *[ %p ]*
`.trimStart(),
    header: '┌  ◦ *%category*',
    body: '│  ◦ %cmd %islimit %isPremium',
    footer: '└  ',
    after: `*🦈💙 Nota~ 💙🦈  
Escribe *.menu <categoría>* para ver un menú específico 🫧  
🌊 Ejemplo: *.menu tools*  
¡Así podrás navegar mi océano de comandos más rápido, capitán~! 🐟`
}

let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
        let { exp, limit, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = levelling.xpRange(level, global.multiplier)
        let name = `@${m.sender.split`@`[0]}`
        let teks = args[0] || ''
        
        let d = new Date(new Date + 3600000)
        let locale = 'es'
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
        let uptime = clockString(process.uptime() * 1000)
        
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })

        if (!teks) teks = 'all'

        // Elegir ASCII aleatorio según categoría
        let asciiRandom = asciiDecor[teks] ? asciiDecor[teks][Math.floor(Math.random() * asciiDecor[teks].length)] 
                                           : asciiDecor['all'][Math.floor(Math.random() * asciiDecor['all'].length)]

        let menuCategory = defaultMenu.before.replace('%ascii', asciiRandom) + '\n\n'

        if (teks === 'all') {
            for (let tag of arrayMenu) {
                if (tag !== 'all' && allTags[tag]) {
                    menuCategory += defaultMenu.header.replace(/%category/g, allTags[tag]) + '\n'
                    
                    let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
                    for (let menu of categoryCommands) {
                        for (let help of menu.help) {
                            menuCategory += defaultMenu.body
                                .replace(/%cmd/g, menu.prefix ? help : _p + help)
                                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                        }
                    }
                    menuCategory += defaultMenu.footer + '\n'
                }
            }
        } else {
            menuCategory += defaultMenu.header.replace(/%category/g, allTags[teks]) + '\n'
            let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(teks) && menu.help)
            for (let menu of categoryCommands) {
                for (let help of menu.help) {
                    menuCategory += defaultMenu.body
                        .replace(/%cmd/g, menu.prefix ? help : _p + help)
                        .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                        .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                }
            }
            menuCategory += defaultMenu.footer + '\n'
        }

        menuCategory += '\n' + defaultMenu.after

        let replace = { '%': '%', p: _p, uptime, name, date, time }

        let text = menuCategory.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
            (_, name) => '' + replace[name])

        await conn.relayMessage(m.chat, {
            extendedTextMessage:{
                text: text, 
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: date,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: 'https://files.catbox.moe/tr0lls.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029VbAmMiM96H4KgBHZUn1z'
                    }
                }, 
                mentions: [m.sender]
            }
        }, {})

    } catch (e) {
        conn.reply(m.chat, '🦈💙 Ooops~ 💙 Gomen gomen~ el menú tuvo un error... 🌊 Intenta de nuevo, capitán~ 🐟', m)
        console.error(e)
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help)$/i
handler.exp = 3
module.exports = handler

function clockString(ms) {
    if (isNaN(ms)) return '--'
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
