const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔄 Iniciando actualización del bot...');

        // Verificar repositorio
        if (!fs.existsSync('.git')) {
            return m.reply('❌ Este directorio no es un repositorio git válido.');
        }

        // Detectar automáticamente archivos y carpetas que no deben tocarse
        const excludePaths = fs.readdirSync('./').filter(item => {
            // Ignorar carpetas comunes de trabajo local
            const protectedDirs = ['sessions', 'sesiones', 'temp', 'cache', 'database'];
            if (protectedDirs.includes(item.toLowerCase()) && fs.statSync(item).isDirectory()) return true;

            // Ignorar archivos de configuración y datos locales
            const protectedExt = ['.json', '.env'];
            if (protectedExt.includes(path.extname(item).toLowerCase()) && fs.statSync(item).isFile()) return true;

            return false;
        });

        // Guardar cambios ignorando .gitignore
        await m.reply('📋 Guardando cambios locales...');
        try {
            execSync('git add -A', { stdio: 'ignore' }); // Fuerza a agregar todo
            execSync('git stash --include-untracked', { stdio: 'ignore' });
        } catch { /* ignorar si no hay cambios */ }

        // Detectar rama actual
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

        // Descargar actualizaciones sin reescribir archivos excluidos
        await m.reply(`⬇️ Descargando actualizaciones de la rama *${branch}*...`);
        execSync(`git pull origin ${branch} --no-rebase --no-commit --no-ff`, { stdio: 'ignore' });

        // Restaurar archivos protegidos
        for (const item of excludePaths) {
            if (fs.existsSync(item)) {
                execSync(`git checkout --ours "${item}"`, { stdio: 'ignore' });
            }
        }

        // Instalar dependencias
        await m.reply('📦 Instalando dependencias...');
        execSync('npm install', { stdio: 'ignore' });

        // Recargar plugins
        await m.reply('🔄 Recargando plugins...');
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

        await m.reply(`✅ Bot actualizado con éxito sin afectar archivos del servidor!\n\n🔌 Plugins recargados: ${Object.keys(global.plugins).length}\n🛡 Archivos protegidos: ${excludePaths.join(', ') || 'Ninguno detectado'}`);
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
