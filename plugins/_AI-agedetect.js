// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🦈 GuraBot - Detector de Edad 🎭
// "glub glub~ ¡Déjame adivinar tu edad bajo el océano~!" 🐠
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.mimetype || q.mediaType || '');
  
  if (/image/g.test(mime) && !/webp/g.test(mime)) {
    await conn.reply(m.chat, '⏳🐟 Gura está analizando tu cara... glub glub~', m);
    
    try {
      const img = await q.download?.();
      let out = await uploadImage(img);
      let res = await fetch(`https://api.botcahx.eu.org/api/search/agedetect?url=${out}&apikey=${btc}`);
      let convert = await res.json();   

      // 🦈 Formato del resultado
      let txt = `
*───「 🦈 Detector de Edad by Gura 」───*

✨ Precisión: ${convert.result.score}
👶 Edad: ${convert.result.age}
🚻 Género: ${convert.result.gender}
😊 Expresión: ${convert.result.expression}
🔷 Forma del rostro: ${convert.result.faceShape}

🌊 *Comentario de Gura*: "¡Wow, así luces en mi arrecife, desu~!" 🐠
`.trim();

      await conn.sendFile(m.chat, out, 'age.png', txt, m);

    } catch (e) {
      console.log(e);
      m.reply('⚠️🐋 *Glub... la identificación falló, inténtalo de nuevo desu~*');
    }

  } else {
    m.reply(`📸 Envía una imagen con el comando *${usedPrefix + command}* o responde a una imagen ya enviada`);
  }
};

// 📌 Info del comando
handler.help = handler.command = ['edad', 'agedetect', 'agedetector'];
handler.tags = ['ai'];
handler.premium = false;
handler.limit = true;

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "Ehehe~ espero no equivocarme, glub 🦈"
// ─────────────── ⋆⋅☆⋅⋆
