let handler  = async (m, { conn }) => {
    // Mensajes de introducción aleatorios
    const mensajesInicio = [
        '🦈💙 ¡Vamos a medir tu intelecto submarino, capitán! 💙🦈',
        '🌊🐟 ¡El tiburoncito Gura está calculando tu IQ! 🐟🌊',
        '🐠✨ ¡Sumergiéndonos en tu cerebro, tiburoncito! ✨🐠',
        '💦🦈 ¡Tiempo de ver cuán inteligente eres! 💦🦈',
        '🦈🌟 ¡Preparando los cálculos acuáticos! 🌟🦈',
        '🐟💙 ¡El océano del conocimiento te espera! 💙🐟',
        '🌊✨ ¡Gura está a punto de revelarte tu IQ! ✨🌊',
        '🦈🐠 ¡Atento! Comenzando la evaluación 🐠🦈',
        '💙🐋 ¡Calculando con estilo submarino! 💙🐋',
        '🐠🦈 ¡Que los números fluyan como el océano! 🦈🐠'
    ];
    let inicio = mensajesInicio[Math.floor(Math.random() * mensajesInicio.length)];
    await conn.reply(m.chat, inicio, m);

    // Elegir IQ aleatorio
    let resultado = pickRandom(global.iq);

    // Bordes decorativos estilo océano con peces y burbujas
    const bordes = [
        '🌊🐠 ~~~~~~~~~~~~~~~~~~~~~~ 🌊🐠\n💙 %resultado 💙\n🌊🐟 ~~~~~~~~~~~~~~~~~~~~~~ 🌊🐟',
        '🐠💦 ~~~~~~~~🌊~~~~~~~~ 🐟💦\n💙 %resultado 💙\n🐟🌊 ~~~~~~~~💦~~~~~~~~ 🐠🌊',
        '🦈🌊 -------------------- 🦈🌊\n💙 %resultado 💙\n🌊🦈 -------------------- 🌊🦈',
        '🐟🌊 ~~~~~~~~~~~~~~~~~~~ 🌊🐠\n💙 %resultado 💙\n🌊🐠 ~~~~~~~~~~~~~~~~~~~ 🐟🌊',
        '💦🦈 -------------------- 🦈💦\n💙 %resultado 💙\n💦🦈 -------------------- 🦈💦',
        '🌊🐠 ~~~~💦~~~💙~~~💦~~~~ 🌊🐠\n💙 %resultado 💙\n🌊🐟 ~~~~💦~~~💙~~~💦~~~~ 🌊🐟',
        '🐠🌊 ~~~~🐟~~~💦~~~🐟~~~~ 🌊🐠\n💙 %resultado 💙\n🌊🐟 ~~~~🐠~~~💦~~~🐠~~~~ 🌊🐟',
        '🦈💦 ~~~~~~~~~~~~~~~~~~~~ 💦🦈\n💙 %resultado 💙\n🦈💦 ~~~~~~~~~~~~~~~~~~~~ 💦🦈',
        '🐟🌊 ~~~💙~~~🐠~~~💦~~~ 🌊🐟\n💙 %resultado 💙\n🌊🐠 ~~~💦~~~🐟~~~💙~~~ 🌊🐠',
        '🌊🦈 -------------------- 🦈🌊\n💙 %resultado 💙\n🌊🦈 -------------------- 🦈🌊'
    ];
    let borde = bordes[Math.floor(Math.random() * bordes.length)];

    // Reemplazar %resultado en el borde
    let mensajeDecorado = borde.replace('%resultado', resultado);

    // Enviar mensaje decorado
    await conn.reply(m.chat, mensajeDecorado, m);
};

handler.help = ['iqtest'];
handler.tags = ['game'];
handler.command = /^(iqtest)$/i;

handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

global.iq = [
    'Tu IQ es: 1',
    'Tu IQ es: 14',
    'Tu IQ es: 23',
    'Tu IQ es: 35',
    'Tu IQ es: 41',
    'Tu IQ es: 50',
    'Tu IQ es: 67',
    'Tu IQ es: 72',
    'Tu IQ es: 86',
    'Tu IQ es: 99',
    'Tu IQ es: 150',
    'Tu IQ es: 340',
    'Tu IQ es: 423',
    'Tu IQ es: 500',
    'Tu IQ es: 676',
    'Tu IQ es: 780',
    'Tu IQ es: 812',
    'Tu IQ es: 945',
    'Tu IQ es: 1000',
    'Tu IQ es: ¡Infinito!',
    'Tu IQ es: 5000',
    'Tu IQ es: 7500',
    'Tu IQ es: 10000'
];
