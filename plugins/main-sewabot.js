let handler = async (m, { conn, command }) => {
    let txt = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣾⡿⠛⠉⠀⠀⠀⠀⠉⠙⠻⣷⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣴⣿⠏⠀⠀⠀🦈 GURA 🦈⠀⠀⠙⣿⣦⠀⠀
⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀💙💦 A~~ ⛵ 💦💙⠀⠀⢹⣿⣇⠀
⠀⠀⠀⠀⠀⠘⢿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⡿⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⢿⣿⣶⣶⣶⣶⣿⡿⠿⠛⠉⠀⠀⠀

╔═══════✦✧✦═══════╗
      🦈💙 *GAWR GURA BOT* 💙🦈
╚═══════✦✧✦═══════╝

👤 *Habla con el Creador*  
📞 wa.me/${numberowner}

🌊──────────────🌊
🪸 *USUARIO PREMIUM* 🪸
╔╣ 🐚 10.000 Límite  
║ 🐠 Acceso completo al chat  
╚══╣ 💵 *Precio:* Rp.10.000 / mes
🌊──────────────🌊

🪸 *ALQUILER DEL BOT* 🪸
╔╣ 🐟 Incluye Premium  
║ 🐳 Invitación libre a 1 grupo  
╚══╣ 💵 *Precio:* cop.15.000 / mes
🌊──────────────🌊

⚓ *Métodos de pago*  
• 🐚 Nequi / PayPal   
📌 *(No hay otras opciones)*  
👉 Número: ${numberowner}

📡 WhatsApp Multi Dispositivo  
🦈 Siempre activo con Panel (Always ON)
`;

    try {
        await conn.relayMessage(m.chat, {
            requestPaymentMessage: {
                currencyCodeIso4217: 'IDR',
                amount1000: 25000 * 1000,
                requestFrom: '0@s.whatsapp.net',
                noteMessage: {
                    extendedTextMessage: {
                        text: txt,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                showAdAttribution: false
                            }
                        }
                    }
                }
            }
        }, {});
    } catch (error) {
        console.error(error);
    }
};

handler.help = ['sewabot'];
handler.tags = ['main'];
handler.command = /^(sewa|sewabot)$/i;

module.exports = handler;
