let syntaxerror = require('syntax-error');
let util = require('util');

let handler = async (m, _2) => {
  let { conn, usedPrefix, noPrefix, args, groupMetadata } = _2;
  let _return;
  let _syntax = '';
  let _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix;
  let old = m.exp * 1;

  // Frames de la animación de rueda
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  try {
    // Enviar primer mensaje de carga
    let sent = await conn.sendMessage(m.chat, { text: '⠋ Cargando...' }, { quoted: m });

    // Animar la rueda actualizando el mismo mensaje
    let frameIndex = 0;
    let animInterval = setInterval(async () => {
      frameIndex = (frameIndex + 1) % frames.length;
      await conn.relayMessage(
        m.chat,
        {
          protocolMessage: {
            key: sent.key,
            type: 14, // Reemplaza el texto
            editedMessage: { conversation: `${frames[frameIndex]} Ejecutando código...` }
          }
        },
        {}
      );
    }, 200); // Velocidad de la rueda (200ms)

    // Ejecución del código
    let i = 15;
    let f = { exports: {} };

    let exec = new (async () => {}).constructor(
      'print', 'm', 'handler', 'require', 'conn', 'Array', 'process',
      'args', 'groupMetadata', 'module', 'exports', 'argument', _text
    );

    _return = await exec.call(
      conn,
      (...args) => {
        if (--i < 1) return;
        console.log(...args);
        return conn.reply(m.chat, util.format(...args), m);
      },
      m, handler, require, conn, CustomArray, process, args, groupMetadata, f, f.exports, [conn, _2]
    );

    clearInterval(animInterval);

    // Cambiar rueda por un ✅ grande
    await conn.relayMessage(
      m.chat,
      {
        protocolMessage: {
          key: sent.key,
          type: 14,
          editedMessage: { conversation: '✅ Proceso completado\n\nEnviando resultados...' }
        }
      },
      {}
    );

  } catch (e) {
    clearInterval(animInterval);
    let err = await syntaxerror(_text, 'Función de Ejecución', {
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true
    });
    if (err) _syntax = '```' + err + '```\n\n';
    _return = e;
  } finally {
    conn.reply(m.chat, _syntax + util.format(_return), m);
    m.exp = old;
  }
};

handler.help = ['> ', '=> '];
handler.tags = ['avanzado'];
handler.customPrefix = /^=?> /;
handler.command = /(?:)/i;

handler.owner = true;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] == 'number') return super(Math.min(args[0], 10000));
    else return super(...args);
  }
}
