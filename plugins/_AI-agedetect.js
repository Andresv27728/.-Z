// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🦈 GuraBot - Age Detector 🎭
// "glub glub~ ¡Déjame adivinar tu edad bajo el océano~!" 🐠
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.mimetype || q.mediaType || '');
  
  if (/image/g.test(mime) && !/webp/g.test(mime)) {
    await conn.reply(m.chat, '⏳🐟 Gura is analyzing your face... glub~', m);
    
    try {
      const img = await q.download?.();
      let out = await uploadImage(img);
      let res = await fetch(`https://api.botcahx.eu.org/api/search/agedetect?url=${out}&apikey=${btc}`);
      let convert = await res.json();   

      // 🦈 Formato del resultado
      let txt = `
*───「 🦈 Age Detection by Gura 」───*

✨ Score: ${convert.result.score}
👶 Age: ${convert.result.age}
🚻 Gender: ${convert.result.gender}
😊 Expression: ${convert.result.expression}
🔷 Face Shape: ${convert.result.faceShape}

🌊 *Comentario de Gura*: "¡Wow, así es como luces en mi arrecife, desu~!" 🐠
`.trim();

      await conn.sendFile(m.chat, out, 'age.png', txt, m);

    } catch (e) {
      console.log(e);
      m.reply('⚠️🐋 *Glub... la identificación falló, intenta de nuevo desu~*');
    }

  } else {
    m.reply(`📸 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`);
  }
};

// 📌 Info del comando
handler.help = handler.command = ['age', 'agedetect', 'agedetector'];
handler.tags = ['ai'];
handler.premium = false;
handler.limit = true;

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "Ehehe~ espero no equivocarme, glub 🦈"
// ─────────────── ⋆⋅☆⋅⋆
