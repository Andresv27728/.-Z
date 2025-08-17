// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// 🌊🦈 GuraBot - Generador de Letras 🎶
// "Glub glub~ ¡Déjame cantarte una canción del océano~!" 🎤🐠
// ─────────────── ⋆⋅☆⋅⋆ ───────────────

const fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw(`❌ Debes ingresar un *prompt* para la letra!\n✨ Ejemplo: ${usedPrefix + command} ¿por qué me siento así?`);    

  try {
    m.reply(`⏳🐟 Gura está componiendo tu canción bajo el mar... glub~`);

    const url = `https://api.botcahx.eu.org/api/maker/generateLirik?prompt=${encodeURIComponent(text)}&aksesKey=${aksesKey}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.result || !Array.isArray(json.result)) {
      throw new Error('No se pudieron generar las letras.');
    }

    const cantidadVersos = json.result.length;

    for (let i = 0; i < cantidadVersos; i++) {
      const verso = json.result[i].text;
      await m.reply(`🎶🦈 Verso ${i + 1}:\n\n${verso}`);
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️🐋 *Glub... algo salió mal al crear la letra, inténtalo otra vez desu~*');
  }
};

// 📌 Info del comando
handler.command = handler.help = ['aimusiclyrics', 'ailirik', 'lyricsgen'];
handler.tags = ['ai'];
handler.owner = false;
handler.limit = true;
handler.group = false;
handler.private = false;

module.exports = handler;

// ─────────────── ⋆⋅☆⋅⋆ ───────────────
// Gawr Gura: "Ehehe~ espero que te guste mi canción, glub 🦈"
// ─────────────── ⋆⋅☆⋅⋆
