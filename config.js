
// - Ubah nomor owner dan wm di sini.
// + Daftar apikey terlebih dahulu sebelum menggunakan svript ini link
  // https://api.botcahx.live
//https://api.lannn.me
// - Jika sudah mendaftar salin key yang ada di profie dan paste di global.btc
// - Contoh global.btc = 'xzRhejka'
// global.lann = 'trial'
// - Jika sudah maka lanjutkan untuk mengubah nomor owner dan wm.

global.owner = ['628992559803']  
global.mods = ['628992559803'] 
global.prems = ['628992559803']
global.nameowner = 'Deva Wahyu'
global.numberowner = '628992559803' 
global.mail = 'support@tioprm.my.id' 
global.dana = '628992559803'
global.pulsa = '628992559803'
global.gopay = '628992559803'
global.namebot = 'DepoBotz'
global.gc = 'https://chat.whatsapp.com/Ln2vHjRrRayAbzalRMB56r'
global.web = 'https://github.com/BOTCAHX'
global.instagram = 'https://instagram.com/prm2.0'
global.wm = '© Deva Wahyu'
global.watermark = wm
global.wm2 = '⫹⫺ Deva Wahyu'
global.wm3 = '© Deva Wahyu'
global.wm4 = '© BotWa'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.benar = 'Benar ✅\n'
global.salah = 'Salah ❌\n'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Made with'
global.author = 'Bot WhatsApp'
global.alpiskey = '8ecfc216' //daftar sendiri jika key habis https://alpis.eu.org

global.btc = 'YOURKEY' //Daftar terlebih dahulu https://api.botcahx.live
global.lann = 'trial' //Note Key Ini Hanya Bertahan Selama 4 Day Sejak Config.js update! lebih baik register di https://api.lannn.me
global.APIs = { 
  tio: 'https://api.botcahx.live',
  alpis: 'https://alpis.eu.org'
}
global.APIKeys = { 
  'https://api.botcahx.live': 'YOURKEY' //isi apikey mu https://api.botcahx.live
}

global.multiplier = 45
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      sampah: '🗑',
      armor: '🥼',
      sword: '⚔️',
      kayu: '🪵',
      batu: '🪨',
      string: '🕸️',
      kuda: '🐎',
      kucing: '🐈' ,
      anjing: '🐕',
      petFood: '🍖',
      gold: '👑',
      emerald: '💚'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
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
