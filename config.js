global.owner = ['573133374132', '573133374132'] // debe estar lleno, no puede estar vacío
global.mods  = ['573133374132', '573133374132'] // debe estar lleno, no puede estar vacío
global.prems = ['573133374132', '573133374132'] // debe estar lleno, no puede estar vacío
global.nameowner = 'yo soy yo' // debe estar lleno, no puede estar vacío
global.numberowner = '573133374132' // debe estar lleno, no puede estar vacío
global.mail = 'andrescamilovallejogomez701@gmail.com' // debe estar lleno, no puede estar vacío
global.gc = '' // debe estar lleno, no puede estar vacío
global.instagram = '' // debe estar lleno, no puede estar vacío
global.wm = 'un bot en prueba' // completa el nombre del bot o tu nombre
global.wait = '_*Espera, se está procesando....*_' //Este es un mensaje de simulación de carga.
global.eror = '_*Error del servidor*_' // este es el mensaje cuando ocurre un error
global.stiker_wait = '*⫹⫺ se está haciendo un Stiker...*' // Este es un mensaje de simulación al cargar la creación de stickers.
global.packname = 'Hecho por yo soy yo' // nombre del paquete de adhesivo de marca de agua
global.author = 'Bot WhatsApp' //autor del adhesivo de marca de agua
global.maxwarn = '5' //Advertencia máxima Advertir

global.autobio = false // Establezca verdadero/falso para habilitar o deshabilitar la autobio (predeterminado: falso)
global.antiporn = false // Establezca verdadero/falso para la eliminación automática de mensajes pornográficos (el robot debe ser administrador) (predeterminado: falso)
global.spam = false // Establezca verdadero/falso para antispam (predeterminado: falso)
global.gcspam = false // Establezca verdadero/falso para cerrar el grupo cuando sea spam (predeterminado: falso)
    

// APIKEY INI WAJIB DI ISI! //
global.btc = 'J8ygeswI'
global.aksesKey = 'YOUR_AKSESKEY_HERE'
// Daftar terlebih dahulu https://api.botcahx.eu.org


// OPSIONAL 
// Jika ingin menggunakan api BETABOTZ sekaligus buat fitur dan juga daftar dan isi apikey di bawah ini. 
// global.lann = 'YOUR_APIKEY_HERE'
// Daftar https://api.betabotz.eu.org 

// Tidak boleh diganti atau di ubah
global.APIs = {   
  btc: 'https://api.botcahx.eu.org'
}

//Tidak boleh diganti atau di ubah
global.APIKeys = { 
  'https://api.botcahx.eu.org': global.btc
}


let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
