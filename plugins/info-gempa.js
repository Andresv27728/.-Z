var axios = require('axios');

var handler = async (m, { conn }) => {
    try {
        // Llamada a la API
        var response = await axios.get(`https://api.botcahx.eu.org/api/search/gempa?apikey=${btc}`);
        var dataGempa = response.data.result.result;

        // Texto decorado estilo Gawr Gura
        var caption = `
🦈💙 *¡Alerta de Terremoto Submarino! 💙🦈*

🌊 *Hora:* ${dataGempa.waktu}
🐟 *Latitud:* ${dataGempa.Lintang}
🐠 *Longitud:* ${dataGempa.Bujur}
💎 *Magnitud:* ${dataGempa.Magnitudo}
🌊 *Profundidad:* ${dataGempa.Kedalaman}
🦈 *Región:* ${dataGempa.Wilayah}

¡Mantente a salvo, capitán! 🐟✨
        `.trim();

        // Enviar la imagen del mapa con el texto decorado
        conn.sendFile(m.chat, dataGempa.image, 'mapa.png', caption, m);

    } catch(e) {
        console.log(e);
        conn.reply(m.chat, '🦈💦 Oops~ Hubo un error al obtener los datos del terremoto. Intenta de nuevo, capitán~ 🐟', m);
    }
};

handler.command = handler.help = ['infogempa', 'gempa'];
handler.tags = ['info'];
handler.premium = false;
handler.limit = true;

module.exports = handler;
