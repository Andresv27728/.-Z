let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `*🌊 Contoh:* ${usedPrefix + command} Infinix Hot 40 Pro`;  
  let teks = '';
    try {
        const api = await fetch(`https://api.botcahx.eu.org/api/webzone/gsmarena?query=${text}&apikey=${btc}`);
        let json = await api.json();
        let spec = json.result.specifications;
        
        teks += `*乂 DEVICE INFORMATION 🦈*\n\n`;
        teks += `📱 *Modelo:* ${json.result.name}\n\n`;
        
        teks += '🌐 *Redes*\n';
        teks += `- 📡 Tecnología: ${spec.network.technology}\n`;
        teks += `- 📶 2G: ${spec.network.bands2g}\n`;
        teks += `- 📶 3G: ${spec.network.bands3g}\n`;
        teks += `- 📶 4G: ${spec.network.bands4g}\n\n`;
        
        teks += '⚙️ *Plataforma*\n';
        teks += `- 🔹 Chipset: ${spec.platform.chipset}\n`;
        teks += `- 🔹 CPU: ${spec.platform.cpu}\n`;
        teks += `- 🔹 GPU: ${spec.platform.gpu}\n`;
        teks += `- 🔹 OS: ${spec.platform.os}\n\n`;
        
        teks += '📐 *Cuerpo*\n';
        teks += `- 📏 Dimensiones: ${spec.body.dimensions}\n`;
        teks += `- ⚖️ Peso: ${spec.body.weight}\n`;
        teks += `- 🛡️ Build: ${spec.body.build}\n`;
        teks += `- 💳 SIM: ${spec.body.sim}\n\n`;
        
        teks += '🖥️ *Pantalla*\n';
        teks += `- 🌈 Tipo: ${spec.display.type}\n`;
        teks += `- 📏 Tamaño: ${spec.display.size}\n`;
        teks += `- 🖼️ Resolución: ${spec.display.resolution}\n\n`;
        
        teks += '💾 *Memoria*\n';
        teks += `- 📂 Slot: ${spec.memory.cardSlot}\n`;
        teks += `- 💽 Interna: ${spec.memory.internal}\n\n`;
        
        teks += '📸 *Cámara Principal*\n';
        teks += `- 📷 Dual: ${spec.mainCamera.dual}\n`;
        teks += `- ✨ Features: ${spec.mainCamera.features}\n`;
        teks += `- 🎥 Video: ${spec.mainCamera.video}\n\n`;
        
        teks += '🔋 *Batería*\n';
        teks += `- 🔌 Tipo: ${spec.battery.type}\n`;
        teks += `- ⚡ Carga: ${spec.battery.charging}\n\n`;
        
        teks += '🧩 *Features*\n';
        teks += `- 🧭 Sensores: ${spec.features.sensors}\n\n`;
        
        teks += '🎨 *Colores*\n';
        teks += spec.colors.join(', ') + '\n\n';
        
        teks += '🚀 *Performance*\n';
        teks += spec.performance.join('\n') + '\n\n';
        
        teks += `🌊 *Preview:* ${json.result.image}\n\n`;
        teks += `> 𓆩 Gawr Gura Device Finder 🦈💙 𓆪`;
        
        await conn.relayMessage(m.chat, {
          extendedTextMessage: {
            text: teks,
            contextInfo: {
              externalAdReply: {
                title: 'Gura Device Info 🦈',
                mediaType: 1,
                previewType: 0,
                renderLargerThumbnail: true,
                thumbnailUrl: json.result.image,
                sourceUrl: json.result.url
              }
            },
            mentions: [m.sender]
          }
        }, {});
  } catch (e) {
    throw `❌ *Ups! Gura-chan no pudo encontrar ese dispositivo.*`;
  }
};

handler.command = handler.help = ['spek','gsmarena','spesifikasi'];
handler.tags = ['internet'];
handler.premium = false;
handler.group = false;
handler.limit = true;

module.exports = handler;
