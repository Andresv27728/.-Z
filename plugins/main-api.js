let fetch = require('node-fetch');

let handler = async (m, { conn }) => {
  try {
    await m.reply(wait)
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

乂 *C H E C K   A P I K E Y*\n\n`;
    capt += `◦ *Email*: ${email}\n`;
    capt += `◦ *Username*: ${username}\n`;
    capt += `◦ *Limit*: ${limit}\n`;
    capt += `◦ *Premium*: ${premium}\n`;
    capt += `◦ *Expired*: ${expired}\n`;
    capt += `◦ *Today Hit*: ${todayHit}\n`;
    capt += `◦ *Total Hit*: ${totalHit}\n\n`;
    await conn.reply(m.chat, capt, m);
  } catch (e) {
    throw eror
  }
};

handler.command = handler.help = ['checkapi', 'api'];
handler.tags = ['main'];
handler.owner = true;
module.exports = handler;
