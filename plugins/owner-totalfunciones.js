
const fs = require('fs')
const path = require('path')

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔄 Analizando comandos disponibles...')
        
        let estadisticas = {
            totalPlugins: 0,
            totalComandos: 0,
            comandosPorCategoria: {},
            pluginsActivos: 0,
            pluginsInactivos: 0,
            detalles: []
        }
        
        const pluginsDir = './plugins'
        
        if (!fs.existsSync(pluginsDir)) {
            return m.reply('❌ Directorio de plugins no encontrado')
        }
        
        // Recargar plugins para obtener datos actualizados
        const pluginFilter = filename => /\.js$/.test(filename)
        const archivosPlugins = fs.readdirSync(pluginsDir).filter(pluginFilter)
        
        for (let archivo of archivosPlugins) {
            try {
                estadisticas.totalPlugins++
                
                // Limpiar cache y cargar plugin
                const rutaCompleta = path.resolve(pluginsDir, archivo)
                delete require.cache[rutaCompleta]
                
                const plugin = require(`../plugins/${archivo}`)
                
                if (plugin && !plugin.disabled) {
                    estadisticas.pluginsActivos++
                    
                    // Contar comandos
                    let comandosPlugin = 0
                    
                    if (plugin.command) {
                        if (plugin.command instanceof RegExp) {
                            // Para RegExp, estimamos basándonos en el patrón
                            comandosPlugin = 1
                        } else if (Array.isArray(plugin.command)) {
                            comandosPlugin = plugin.command.length
                        } else if (typeof plugin.command === 'string') {
                            comandosPlugin = 1
                        }
                    }
                    
                    // Obtener categoría
                    const categoria = plugin.tags && plugin.tags.length > 0 ? plugin.tags[0] : 'sin categoría'
                    
                    if (!estadisticas.comandosPorCategoria[categoria]) {
                        estadisticas.comandosPorCategoria[categoria] = 0
                    }
                    estadisticas.comandosPorCategoria[categoria] += comandosPlugin
                    estadisticas.totalComandos += comandosPlugin
                    
                    if (comandosPlugin > 0) {
                        estadisticas.detalles.push({
                            archivo: archivo,
                            comandos: comandosPlugin,
                            categoria: categoria,
                            help: plugin.help || []
                        })
                    }
                } else {
                    estadisticas.pluginsInactivos++
                }
                
            } catch (e) {
                estadisticas.pluginsInactivos++
                console.log(`Error cargando ${archivo}: ${e.message}`)
            }
        }
        
        // Generar reporte
        let reporte = `📊 *TOTAL DE FUNCIONES DEL BOT*\n\n`
        reporte += `🔢 *Resumen:*\n`
        reporte += `• Total de plugins: ${estadisticas.totalPlugins}\n`
        reporte += `• Plugins activos: ${estadisticas.pluginsActivos}\n`
        reporte += `• Plugins inactivos: ${estadisticas.pluginsInactivos}\n`
        reporte += `• *TOTAL COMANDOS: ${estadisticas.totalComandos}*\n\n`
        
        reporte += `📁 *Comandos por categoría:*\n`
        Object.entries(estadisticas.comandosPorCategoria)
            .sort(([,a], [,b]) => b - a)
            .forEach(([categoria, cantidad]) => {
                reporte += `• ${categoria}: ${cantidad}\n`
            })
        
        reporte += `\n⏰ *Última actualización:* ${new Date().toLocaleString('es-ES')}`
        
        await m.reply(reporte)
        
        // Enviar detalles como archivo si hay muchos plugins
        if (estadisticas.detalles.length > 20) {
            const detallesJson = JSON.stringify(estadisticas, null, 2)
            fs.writeFileSync('./tmp/funciones_detalle.json', detallesJson)
            
            await conn.sendMessage(m.chat, {
                document: fs.readFileSync('./tmp/funciones_detalle.json'),
                fileName: 'detalle_funciones.json',
                mimetype: 'application/json'
            }, { quoted: m })
        }
        
    } catch (error) {
        console.error(error)
        await m.reply(`❌ Error al contar funciones: ${error.message}`)
    }
}

handler.help = ['totalfunciones', 'countcmd', 'funciones']
handler.tags = ['owner']
handler.command = /^(totalfunciones|countcmd|funciones|totalcmd)$/i
handler.rowner = true

module.exports = handler
