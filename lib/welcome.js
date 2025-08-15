const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')
const cp = require('child_process')

// Carpeta base de recursos 🌊🦈
const src = path.join(__dirname, '..', 'src')
const _svg = fs.readFileSync(path.join(src, 'welcome.svg'), 'utf-8')

// 🦈 Generar código de barras en SVG a partir de datos
const barcode = data => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, data, {
        xmlDocument: document,
    });

    return xmlSerializer.serializeToString(svgNode);
}

// 🖼️ Función para establecer imagen en el SVG
const imageSetter = (img, value) => img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value)
// ✏️ Función para establecer texto en el SVG
const textSetter = (el, value) => el.textContent = value

let { document: svg } = new JSDOM(_svg).window

/**
 * 🌊 Generar SVG de bienvenida con estilo Gawr Gura
 * @param {object} param0
 * @param {string} param0.wid - ID del usuario
 * @param {string} param0.pp - Imagen de perfil
 * @param {string} param0.name - Nombre del usuario
 * @param {string} param0.text - Texto personalizado
 * @param {string} param0.title - Título del grupo o mensaje
 * @param {string} param0.background - Imagen de fondo
 * @returns {string} SVG final
 */
const genSVG = async ({
    wid = '',
    pp = path.join(src, 'avatar_contact.png'),
    title = '',
    name = '',
    text = '',
    background = ''
} = {}) => {
    let el = {
        code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png')],
        pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
        text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
        title: ['#_1661899539392 > text.fil2.fnt1', textSetter, title],
        name: ['#_1661899539392 > text.fil2.fnt2', textSetter, name],
        bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background],
    }
    for (let [selector, set, value] of Object.values(el)) {
        set(svg.querySelector(selector), value)
    }
    return svg.body.innerHTML
}

// 🔹 Convertir SVG a imagen (PNG/JPG) usando ImageMagick
const toImg = (svg, format = 'png') => new Promise((resolve, reject) => {
    if (!svg) return resolve(Buffer.alloc(0))
    let bufs = []
    let im = cp.spawn('magick', ['convert', 'svg:-', format + ':-'])
    im.on('error', e => reject(e))
    im.stdout.on('data', chunk => bufs.push(chunk))
    im.stdin.write(Buffer.from(svg))
    im.stdin.end()
    im.on('close', code => {
        if (code !== 0) reject(code)
        resolve(Buffer.concat(bufs))
    })
})

// 🔹 Convertir buffer de imagen a Base64 para SVG
const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`

/**
 * 🌊 Renderizar SVG de bienvenida a imagen final
 * @param {object} param0
 * @param {string} param0.wid - ID del usuario
 * @param {string} param0.pp - Imagen de perfil (Base64 o ruta)
 * @param {string} param0.name - Nombre del usuario
 * @param {string} param0.text - Texto personalizado
 * @param {string} param0.title - Título
 * @param {string} param0.background - Imagen de fondo (Base64)
 * @param {string} format - Formato de salida ('png' o 'jpg')
 * @returns {Promise<Buffer>} Imagen final
 */
const render = async ({
    wid = '',
    pp = toBase64(fs.readFileSync(path.join(src, 'avatar_contact.png')), 'image/png'),
    name = '',
    title = '',
    text = '',
    background = toBase64(fs.readFileSync(path.join(src, 'Aesthetic', 'Aesthetic_000.jpeg')), 'image/jpeg'),
} = {}, format = 'png') => {
    let svg = await genSVG({ wid, pp, name, text, background, title })
    return await toImg(svg, format)
}

// 🦈 Test de renderizado si se ejecuta directamente
if (require.main === module) {
    render({
        wid: '1234567890',
        name: 'usuario',
        text: '¡Bienvenido a la familia tiburón! 🦈\nQue disfrutes tu estancia 🌊',
        title: 'Grupo Testing'
    }, 'jpg').then(result => {
        process.stdout.write(result)
    })
} else module.exports = render
