let handler = async (m, { conn }) => {
    let loadingFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let msg = await conn.reply(m.chat, `⏳ *Cargando lista de comandos...*`, m);

    // Pequeña animación de carga
    let frameIndex = 0;
    let interval = setInterval(async () => {
        if (!msg.key) return;
        await conn.sendMessage(m.chat, { text: `${loadingFrames[frameIndex]} *Cargando lista de comandos...*`, edit: msg.key });
        frameIndex = (frameIndex + 1) % loadingFrames.length;
    }, 150);

    try {
        let lista = Object.entries(global.db.data.sticker).map(([key, value], index) =>
            `*${index + 1}.* ${value.locked ? '🔒' : '🔓'} \`${key}\` → ${value.text}`
        ).join('\n');

        if (!lista) lista = '_No hay comandos o stickers registrados._';

        clearInterval(interval);
        await conn.sendMessage(m.chat, {
            text: `✅ *LISTA DE HASH / COMANDOS*\n\n${lista}\n\n📦 Total: *${Object.keys(global.db.data.sticker).length}*`,
            edit: msg.key
        });
    } catch (err) {
        clearInterval(interval);
        await conn.sendMessage(m.chat, { text: '❌ Error al generar la lista.', edit: msg.key });
        console.error(err);
    }
};

handler.help = ['listcmd'];
handler.tags = ['database', 'premium'];
handler.command = ['listcmd', 'infocmd'];

module.exports = handler;
