
const fs = require('fs')
const path = require('path')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`🔍 *BUSCAR COMANDO/FUNCIÓN*

*Uso:* ${usedPrefix + command} <término de búsqueda>

*Ejemplos:*
• ${usedPrefix + command} play
• ${usedPrefix + command} sticker
• ${usedPrefix + command} owner
• ${usedPrefix + command} download

Busca comandos por nombre, categoría o descripción.`)
    }

    await m.reply('🔍 Buscando comandos...')

    try {
        const termino = text.toLowerCase().trim()
        let resultados = []
        let totalComandos = 0

        const pluginsDir = './plugins'
        const pluginFilter = filename => /\.js$/.test(filename)
        const archivosPlugins = fs.readdirSync(pluginsDir).filter(pluginFilter)

        for (let archivo of archivosPlugins) {
            try {
                const rutaCompleta = path.resolve(pluginsDir, archivo)
                delete require.cache[rutaCompleta]
                
                const plugin = require(`../plugins/${archivo}`)
                
                if (plugin && !plugin.disabled && plugin.command) {
                    // Obtener comandos
                    let comandos = []
                    if (plugin.command instanceof RegExp) {
                        // Para RegExp, usar help si existe
                        comandos = plugin.help || [archivo.replace('.js', '')]
                    } else if (Array.isArray(plugin.command)) {
                        comandos = plugin.command
                    } else if (typeof plugin.command === 'string') {
                        comandos = [plugin.command]
                    }

                    // Obtener categoría y ayuda
                    const categoria = plugin.tags && plugin.tags.length > 0 ? plugin.tags[0] : 'sin categoría'
                    const ayuda = plugin.help || []
                    
                    // Buscar coincidencias
                    let coincidencias = []
                    
                    // Buscar en comandos
                    comandos.forEach(cmd => {
                        if (typeof cmd === 'string' && cmd.toLowerCase().includes(termino)) {
                            coincidencias.push(`comando: ${cmd}`)
                        }
                    })
                    
                    // Buscar en ayuda
                    ayuda.forEach(help => {
                        if (help.toLowerCase().includes(termino)) {
                            coincidencias.push(`ayuda: ${help}`)
                        }
                    })
                    
                    // Buscar en categoría
                    if (categoria.toLowerCase().includes(termino)) {
                        coincidencias.push(`categoría: ${categoria}`)
                    }
                    
                    // Buscar en nombre de archivo
                    if (archivo.toLowerCase().includes(termino)) {
                        coincidencias.push(`archivo: ${archivo}`)
                    }

                    if (coincidencias.length > 0) {
                        totalComandos += comandos.length
                        
                        resultados.push({
                            archivo: archivo,
                            comandos: comandos,
                            categoria: categoria,
                            ayuda: ayuda,
                            coincidencias: coincidencias
                        })
                    }
                }
            } catch (e) {
                // Ignorar errores de plugins individuales
                continue
            }
        }

        if (resultados.length === 0) {
            return m.reply(`❌ No se encontraron comandos que coincidan con "${text}"

💡 *Sugerencias:*
• Verifica la escritura
• Intenta con términos más generales
• Usa ${usedPrefix}totalfunciones para ver todas las categorías`)
        }

        // Ordenar por relevancia (más coincidencias primero)
        resultados.sort((a, b) => b.coincidencias.length - a.coincidencias.length)

        // Limitar resultados para evitar mensajes muy largos
        const maxResultados = 15
        const resultadosMostrar = resultados.slice(0, maxResultados)

        let respuesta = `🔍 *RESULTADOS DE BÚSQUEDA*\n`
        respuesta += `📝 Término: "${text}"\n`
        respuesta += `📊 Encontrados: ${resultados.length} plugins (${totalComandos} comandos)\n`
        if (resultados.length > maxResultados) {
            respuesta += `👁️ Mostrando: ${maxResultados} primeros resultados\n`
        }
        respuesta += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`

        resultadosMostrar.forEach((resultado, index) => {
            respuesta += `*${index + 1}.* 📁 \`${resultado.archivo}\`\n`
            respuesta += `📂 *Categoría:* ${resultado.categoria}\n`
            
            if (resultado.ayuda.length > 0) {
                respuesta += `💡 *Comandos:* ${resultado.ayuda.slice(0, 3).join(', ')}\n`
                if (resultado.ayuda.length > 3) {
                    respuesta += `   _(+${resultado.ayuda.length - 3} más)_\n`
                }
            }
            
            respuesta += `🎯 *Coincide en:* ${resultado.coincidencias.slice(0, 2).join(', ')}\n`
            if (resultado.coincidencias.length > 2) {
                respuesta += `   _(+${resultado.coincidencias.length - 2} más)_\n`
            }
            
            respuesta += `\n`
        })

        if (resultados.length > maxResultados) {
            respuesta += `\n⚠️ *Se ocultaron ${resultados.length - maxResultados} resultados adicionales*\n`
            respuesta += `💡 Usa términos más específicos para filtrar mejor\n`
        }

        respuesta += `\n━━━━━━━━━━━━━━━━━━━━━━\n`
        respuesta += `📋 Usa ${usedPrefix}totalfunciones para ver estadísticas completas\n`
        respuesta += `⏰ Búsqueda realizada: ${new Date().toLocaleTimeString('es-ES')}`

        await m.reply(respuesta)

    } catch (error) {
        console.error('Error en buscarcomando:', error)
        await m.reply(`❌ Error al buscar comandos: ${error.message}`)
    }
}

handler.help = ['buscarcomando <texto>', 'buscarfuncion <texto>', 'searchcmd <texto>']
handler.tags = ['main']
handler.command = /^(buscarcomando|buscarfuncion|searchcmd|buscarcmd)$/i

module.exports = handler
