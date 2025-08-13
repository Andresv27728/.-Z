let handler = async (m, { conn }) => {
  try {
    const groupName = await conn.getName(m.chat);
    const inviteCode = await conn.groupInviteCode(m.chat);
    
    conn.reply(
      m.chat,
      `🦈💙 *Enlace del grupo* 💙🦈\n\n` +
      `🌊 *Nombre:* ${groupName}\n` +
      `🔗 *Invitación:* https://chat.whatsapp.com/${inviteCode}\n\n` +
      `Bot: ${conn.user.name}`,
      m
    );
  } catch {
    conn.reply(
      m.chat,
      `⚠️ Debo ser *administrador* para poder generar el enlace, @${conn.user.jid.split('@')[0]}.\n\n` +
      `🦈💙 ¡Hazme admin y nadaré hasta el link del grupo! 🌊`,
      m,
      { mentions: [conn.user.jid] }
    );
  }
};

handler.help = ['linkgroup'];
handler.tags = ['group'];
handler.command = /^link(g(c)?ro?up)?$/i;

handler.group = true;
handler.admin = true;

module.exports = handler;
