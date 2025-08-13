const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn }) => {
    try {
        await m.reply('🦈💙 *Gawr Gura* está preparando su tridente... ¡Iniciando actualización desde la rama *pro*! 🌊');

        // Verificar si es un repositorio Git
        if (!fs.existsSync('.git')) {
            return m.reply('❌ Este directorio no es un repositorio git válido.');
        }

        // Detectar automáticamente archivos/carpetas que no deben tocarse
        const excludePaths = fs.readdirSync('./').filter(item => {
            const protectedDirs = ['sessions', 'sesiones', 'temp', 'cache', 'database'];
            const protectedExt = ['.json', '.env'];
            if (protectedDirs.includes(item.toLowerCase()) && fs.statSync(item).isDirectory()) return true;
            if (protectedExt.includes(path.extname(item).toLowerCase()) && fs.statSync(item).isFile()) return true;
            return false;
        });

        // Guardar cambios ignorando .gitignore
        await m.reply('📋 Guardando cambios locales...');
        try {
            execSync('git add -A', { stdio: 'ignore' });
            execSync('git stash --include-untracked', { stdio: 'ignore' });
        } catch { /* ignorar si no hay cambios */ }

        // Usar siempre la rama 'pro'
        const branch = 'pro';

        // Descargar actualizaciones
        await m.reply(`⬇️ Descargando olas de código desde la rama *${branch}*... 🌊`);
        execSync(`git pull origin ${branch} --no-rebase --no-commit --no-ff`, { stdio: 'ignore' });

        // Restaurar archivos protegidos solo si están en conflicto
        for (const item of excludePaths) {
            if (fs.existsSync(item)) {
                try {
                    const status = execSync(`git status --porcelain "${item}"`, { encoding: 'utf8' });
                    if (status.includes('UU') || status.includes('AA') || status.includes('DD')) {
                        execSync(`git checkout --ours "${item}"`, { stdio: 'ignore' });
                    }
                } catch { /* ignorar si no hay conflicto */ }
            }
        }

        // Instalar dependencias
        await m.reply('📦 Instalando tesoros perdidos (dependencias)... 🐚');
        execSync('npm install', { stdio: 'ignore' });

        // Recargar plugins
        await m.reply('🔄 Gura está recargando sus habilidades (plugins)... 🦈');
        global.plugins = {};

        const pluginsFolder = path.join(__dirname, '../plugins');
        const pluginFiles = fs.readdirSync(pluginsFolder).filter(f => f.endsWith('.js'));

        for (const file of pluginFiles) {
            try {
                const pluginPath = path.join(pluginsFolder, file);
                delete require.cache[require.resolve(pluginPath)];
                global.plugins[file] = require(pluginPath);
            } catch (e) {
                conn.logger.error(`Error al recargar ${file}:`, e);
            }
        }

        // Mensaje final con decoración Gawr Gura
        await m.reply(
`╭━━━━━━━━━━━━━━━╮
🌊🦈  *A C T U A L I Z A C I Ó N  C O M P L E T A*  🦈🌊
╰━━━━━━━━━━━━━━━╯
💙  Capitán, el bot ha sido actualizado con éxito.  
🔌 *Plugins recargados:* ${Object.keys(global.plugins).length}  
🛡 *Archivos protegidos:* ${excludePaths.join(', ') || 'Ninguno detectado'}  

🐟  *Rama usada:* ${branch}  
🌊  ¡Listo para navegar por mares de comandos!
╭━━━━━━━━━━━━━━━╯
  *~ Gawr Gura ~*
╰━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {
        console.error(error);
        await m.reply(`❌ Error durante la actualización:\n${error.message}`);
    }
};

handler.help = ['update', 'actualizar'];
handler.tags = ['owner'];
handler.command = /^(update|actualizar)$/i;
handler.rowner = true;

module.exports = handler;
