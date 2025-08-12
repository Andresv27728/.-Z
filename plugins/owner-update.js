
const { execSync } = require('child_process')
const fs = require('fs')

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        await m.reply('🔄 Iniciando actualización del bot...')
        
        // Verificar si es un repositorio git
        if (!fs.existsSync('.git')) {
            return m.reply('❌ Este directorio no es un repositorio git válido.')
        }
        
        // Hacer backup de archivos importantes
        await m.reply('📋 Haciendo backup de configuraciones...')
        
        // Hacer stash de cambios locales
        try {
            execSync('git stash', { stdio: 'pipe' })
        } catch (e) {
            // Si no hay cambios para stash, continúa
        }
        
        // Pull de cambios
        await m.reply('⬇️ Descargando actualizaciones...')
        const pullResult = execSync('git pull origin main', { encoding: 'utf8' })
        
        // Instalar dependencias
        await m.reply('📦 Instalando dependencias...')
        execSync('npm install', { stdio: 'pipe' })
        
        // Recargar plugins
        await m.reply('🔄 Recargando plugins...')
        Object.keys(global.plugins).forEach(key => {
            delete global.plugins[key]
        })
        global.plugins = {}
        
        // Recargar todos los plugins
        const pluginFilter = filename => /\.js$/.test(filename)
        let plugins = {}
        const pluginsFolder = './plugins'
        
        for (let filename of fs.readdirSync(pluginsFolder).filter(pluginFilter)) {
            try {
                delete require.cache[require.resolve(`../plugins/${filename}`)]
                plugins[filename] = require(`../plugins/${filename}`)
            } catch (e) {
                conn.logger.error(e)
                delete plugins[filename]
            }
        }
        
        global.plugins = plugins
        
        await m.reply(`✅ Bot actualizado exitosamente!\n\n📝 Cambios:\n${pullResult}\n\n🔌 Plugins recargados: ${Object.keys(plugins).length}`)
        
    } catch (error) {
        console.error(error)
        await m.reply(`❌ Error durante la actualización:\n${error.message}`)
    }
}

handler.help = ['update', 'actualizar']
handler.tags = ['owner']
handler.command = /^(update|actualizar)$/i
handler.rowner = true

module.exports = handler
