let handler = async (m, { conn }) => {
  conn.chatModify(
    { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
    m.chat
  );
  await m.reply("🗑️ ¡Chat eliminado con éxito!");
};

handler.help = ['deletechat'];
handler.tags = ['owner'];
handler.command = /^(deletechat|delchat|dchat|clearchat|cleanchat)$/i;
handler.owner = true;

module.exports = handler;
