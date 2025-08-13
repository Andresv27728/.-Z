const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔄 Iniciando actualización del bot desde la rama *pro*...');

        if (!fs.existsSync('.git')) {
            return m.reply('❌ Este directorio no es un repositorio git válido.');
        }

        // Archivos/carpetas protegidas
        const excludePaths = fs.readdirSync('./').filter(item => {
            const protectedDirs = ['sessions', 'sesiones', 'temp', 'cache', 'database'];
            const protectedExt = ['.json', '.env'];
            if (protectedDirs.includes(item.toLowerCase()) && fs.statSync(item).isDirectory()) return true;
            if (protectedExt.includes(path.extname(item).toLowerCase()) && fs.statSync(item).isFile()) return true;
            return false;
        });

        // Guardar cambios antes de actualizar
        await m.reply('📋 Guardando cambios locales...');
        try {
            execSync('git add -A', { stdio: 'ignore' });
            execSync('git stash --include-untracked', { stdio: 'ignore' });
        } catch {}

        // Rama fija: pro
        const branch = 'pro';

        // Descargar actualizaciones
        await m.reply(`⬇️ Descargando actualizaciones de la rama *${branch}*...`);
        execSync(`git fetch origin ${branch}`, { stdio: 'ignore' });
        execSync(`git reset --hard origin/${branch}`, { stdio: 'ignore' });

        // Restaurar archivos protegidos si hay conflicto
        for (const item of excludePaths) {
            if (fs.existsSync(item)) {
                try {
                    const status = execSync(`git status --porcelain "${item}"`, { encoding: 'utf8' });
                    if (status.includes('UU') || status.includes('AA') || status.includes('DD')) {
                        execSync(`git checkout --ours "${item}"`, { stdio: 'ignore' });
                    }
                } catch {}
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

        await m.reply(`✅ Bot actualizado con éxito desde la rama *${branch}*!\n\n🔌 Plugins recargados: ${Object.keys(global.plugins).length}\n🛡 Archivos protegidos: ${excludePaths.join(', ') || 'Ninguno detectado'}`);
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
