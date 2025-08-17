let fetch = require('node-fetch');

let handler = async (m, { conn }) => {
  try {
    await m.reply('⏳💙 Sumergiéndome para revisar tu API... 🦈🌊');

    let api = await fetch(`https://api.botcahx.eu.org/api/checkkey?apikey=${btc}`);
    let body = await api.json();
    let { 
      email, 
      username, 
      limit, 
      premium, 
      expired, 
      todayHit,
      totalHit
    } = body.result;
    
    let capt = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣾⡿⠛⠉⠀⠀⠀⠀⠉⠙⠻⣷⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣴⣿⠏⠀⠀⠀🦈 GURA 🦈⠀⠀⠙⣿⣦⠀⠀
⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀💙💦 A~~ ⛵ 💦💙⠀⠀⢹⣿⣇⠀
⠀⠀⠀⠀⠀⠘⢿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⡿⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⢿⣿⣶⣶⣶⣶⣿⡿⠿⠛⠉⠀⠀⠀

╔═══════💙🌊═══════╗
     🦈 *Gawr Gura - Revisión de API* 🦈
╚═══════💙🌊═══════╝

🐚 *Correo:* ${email}
🐬 *Usuario:* ${username}
🐠 *Límite:* ${limit}
🪸 *Premium:* ${premium}
⚓ *Expira:* ${expired}

🌊──────────────🌊
📊 *Usos hoy:* ${todayHit}
📈 *Total de usos:* ${totalHit}
🌊──────────────🌊

💙 ¡Cuida tu API como si fuera un tesoro del océano! 🦈✨
`;

    await conn.reply(m.chat, capt, m);
  } catch (e) {
    throw e;
  }
};

handler.command = handler.help = ['checkapi', 'api'];
handler.tags = ['main'];
handler.owner = true;
module.exports = handler;
