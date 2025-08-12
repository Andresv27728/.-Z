
const fs = require('fs')
const path = require('path')

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Iniciando diagnóstico del bot...')
        
        let diagnostico = {
            archivosCore: [],
            plugins: [],
            errores: [],
            advertencias: [],
            estadisticas: {
                totalArchivos: 0,
                pluginsValidos: 0,
                pluginsConErrores: 0,
                archivosCoreValidos: 0
            }
        }
        
        // Verificar archivos core
        const archivosCore = ['main.js', 'index.js', 'handler.js', 'config.js', 'package.json']
        
        for (let archivo of archivosCore) {
            if (fs.existsSync(archivo)) {
                try {
                    const contenido = fs.readFileSync(archivo, 'utf8')
                    if (contenido.length > 0) {
                        diagnostico.archivosCore.push(`✅ ${archivo} - OK`)
                        diagnostico.estadisticas.archivosCoreValidos++
                    } else {
                        diagnostico.errores.push(`⚠️ ${archivo} está vacío`)
                    }
                } catch (e) {
                    diagnostico.errores.push(`❌ Error leyendo ${archivo}: ${e.message}`)
                }
            } else {
                diagnostico.errores.push(`❌ ${archivo} no encontrado`)
            }
        }
        
        // Verificar plugins
        const pluginsDir = './plugins'
        if (fs.existsSync(pluginsDir)) {
            const archivosPlugins = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))
            
            for (let plugin of archivosPlugins) {
                const rutaPlugin = path.join(pluginsDir, plugin)
                try {
                    // Verificar sintaxis
                    const contenido = fs.readFileSync(rutaPlugin, 'utf8')
                    
                    // Verificaciones básicas
                    if (!contenido.includes('module.exports')) {
                        diagnostico.advertencias.push(`⚠️ ${plugin}: No exporta módulo`)
                    }
                    
                    if (!contenido.includes('handler')) {
                        diagnostico.advertencias.push(`⚠️ ${plugin}: No define handler`)
                    }
                    
                    // Intentar cargar el plugin
                    delete require.cache[require.resolve(`../plugins/${plugin}`)]
                    const pluginObj = require(`../plugins/${plugin}`)
                    
                    if (typeof pluginObj === 'function' || (typeof pluginObj === 'object' && pluginObj.command)) {
                        diagnostico.plugins.push(`✅ ${plugin} - OK`)
                        diagnostico.estadisticas.pluginsValidos++
                    } else {
                        diagnostico.advertencias.push(`⚠️ ${plugin}: Estructura inválida`)
                    }
                    
                } catch (e) {
                    diagnostico.errores.push(`❌ ${plugin}: ${e.message}`)
                    diagnostico.estadisticas.pluginsConErrores++
                }
                
                diagnostico.estadisticas.totalArchivos++
            }
        }
        
        // Verificar directorios importantes
        const directorios = ['lib', 'tmp', 'src']
        for (let dir of directorios) {
            if (!fs.existsSync(dir)) {
                diagnostico.advertencias.push(`⚠️ Directorio ${dir} no encontrado`)
            }
        }
        
        // Verificar package.json
        if (fs.existsSync('package.json')) {
            try {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
                if (!pkg.dependencies) {
                    diagnostico.advertencias.push('⚠️ No se encontraron dependencias en package.json')
                }
            } catch (e) {
                diagnostico.errores.push('❌ package.json tiene formato inválido')
            }
        }
        
        // Generar reporte
        let reporte = `📊 *DIAGNÓSTICO DEL BOT*\n\n`
        reporte += `📈 *Estadísticas:*\n`
        reporte += `• Total archivos analizados: ${diagnostico.estadisticas.totalArchivos}\n`
        reporte += `• Plugins válidos: ${diagnostico.estadisticas.pluginsValidos}\n`
        reporte += `• Plugins con errores: ${diagnostico.estadisticas.pluginsConErrores}\n`
        reporte += `• Archivos core válidos: ${diagnostico.estadisticas.archivosCoreValidos}\n\n`
        
        if (diagnostico.errores.length > 0) {
            reporte += `❌ *Errores críticos (${diagnostico.errores.length}):*\n`
            reporte += diagnostico.errores.slice(0, 10).join('\n') + '\n\n'
        }
        
        if (diagnostico.advertencias.length > 0) {
            reporte += `⚠️ *Advertencias (${diagnostico.advertencias.length}):*\n`
            reporte += diagnostico.advertencias.slice(0, 10).join('\n') + '\n\n'
        }
        
        reporte += `✅ *Estado general:* ${diagnostico.errores.length === 0 ? 'SALUDABLE' : 'REQUIERE ATENCIÓN'}`
        
        await m.reply(reporte)
        
        // Si hay muchos errores, enviar archivo detallado
        if (diagnostico.errores.length > 10 || diagnostico.advertencias.length > 10) {
            const reporteCompleto = JSON.stringify(diagnostico, null, 2)
            fs.writeFileSync('./tmp/diagnostico.json', reporteCompleto)
            await conn.sendMessage(m.chat, {
                document: fs.readFileSync('./tmp/diagnostico.json'),
                fileName: 'diagnostico_completo.json',
                mimetype: 'application/json'
            }, { quoted: m })
        }
        
    } catch (error) {
        console.error(error)
        await m.reply(`❌ Error durante el diagnóstico: ${error.message}`)
    }
}

handler.help = ['diagnostico', 'checkbot']
handler.tags = ['owner']
handler.command = /^(diagnostico|checkbot|check)$/i
handler.rowner = true

module.exports = handler
