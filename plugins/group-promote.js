// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🐟  Handler Promote - Gawr Gura Bot 🐟🌊
// "glub glub~ ascendiendo al admin hacia la superficie" 🦈
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

let handler = async (m, { teks, conn, isOwner, isAdmin, args, command }) => {
    if (m.isBaileys) return;
    
    // 🐋 Solo los guardianes del arrecife (admins/owner) pueden usar esto
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
    let users = [];

    // 🐠 Si se responde a un mensaje, toma a ese usuario
    if (m.quoted) {
        if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid) return;
        users = [m.quoted.sender];
    } 
    // 🐬 O si se etiqueta a un usuario directamente
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        users = m.mentionedJid;
    } 
    // 🦑 Si no hay a quién ascender
    else {
        throw '🌊 Taggea a alguien que quieras convertir en admin, desu~';
    }

    // 🦀 Evita tocar al dueño del arrecife o al bot
    users = users.filter(u => !(u == ownerGroup || u.includes(conn.user.jid)));

    if (users.length === 0) return m.reply('⚠️ Ningún usuario válido para subir a admin, glub~');

    for (let user of users) {
        if (user.endsWith("@s.whatsapp.net")) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [user], "promote");
                await m.reply(`🦈✨ Éxito: *${command}* aplicado a @${user.split('@')[0]}.\n> ¡Ha recibido su aleta de admin brillante! 🐋`, m.chat, {
                    mentions: [user]
                });
            } catch (e) {
                console.error(e);
                await m.reply(`💢 Falló el *${command}* en @${user.split('@')[0]}...\nQuizás el océano estaba en tormenta 🌊`, m.chat, {
                    mentions: [user]
                });
            }
        }
    }
};

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 📌 Info del comando
// ─────────────── ⋆⋅☆⋅⋆
handler.help = ['promote @usuario']; // Sube a un usuario al rango de admin
handler.tags = ['group', 'owner'];
handler.command = /^(promo?te|admin|\^)$/i;

handler.group = true;     // Solo en grupo
handler.botAdmin = true;  // El bot debe ser admin
handler.admin = true;     // Solo para admins
handler.fail = null;

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "¡Sube a la superficie, nuevo admin! glub glub 🐠"
// ─────────────── ⋆⋅☆⋅⋆
