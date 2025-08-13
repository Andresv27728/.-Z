var name = global.nameowner || "Yo Soy Yo";
var numberowner = global.numberowner || "573133374132";
var gmail = global.mail || "andrescamilovallejogomez701@gmail.com";
var instagram = global.instagram || "no hay por el momento";

const { 
    default: makeWASocket,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    downloadContentFromMessage, 
    downloadHistory, 
    proto,
    getMessage, 
    generateWAMessageContent, 
    prepareWAMessageMedia 
} = require("@adiwajshing/baileys");

var handler = async (m, { conn }) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name}
item.ORG:Creador del Bot
item1.TEL;waid=${numberowner}:${numberowner}@s.whatsapp.net
item1.X-ABLabel:Número del Creador
item2.EMAIL;type=INTERNET:${gmail}
item2.X-ABLabel:Email Owner
item3.ADR:;;🇨🇴 Colombia;;;;
item3.X-ABADR:ac
item4.EMAIL;type=INTERNET:support@tioprm.eu.org
item4.X-ABLabel:Email Developer
item5.URL:${instagram}
item5.X-ABLabel:Instagram
END:VCARD`;

    const sentMsg  = await conn.sendMessage(
        m.chat,
        { 
            contacts: { 
                displayName: name, 
                contacts: [{ vcard }] 
            }
        }
    );

    // Mensaje final con estilo Gawr Gura
    await conn.reply(m.chat, 
`🦈💙 𝑯𝒆𝒚~ 💙🦈  
Aquí tienes el contacto del capitán del bot~ 🫧  
🌊 *Nombre:* ${name}  
📱 *Número:* +${numberowner}  
📧 *Correo:* ${gmail}  
📸 *Instagram:* ${instagram}  
¡Trátalo bien o te muerdo con mis dientecitos kawaii~! 🐟`, sentMsg);
};

handler.command = handler.help = ['owner', 'creator'];
handler.tags = ['info'];
handler.limit = false;

module.exports = handler;
