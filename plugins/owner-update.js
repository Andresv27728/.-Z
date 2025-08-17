const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let handler = async (m, { conn }) => {
    try {
        await m.reply('🌊🦈 *A~ Gura-chan está iniciando la actualización desde la rama pro...* 💙');

        if (!fs.existsSync('.git')) {
            return m.reply('❌ *Auu~ Este directorio no es un repo git válido, desu!* 🐟');
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
        await m.reply('📋 *Guardando cambios locales...* UwU 💫');
        try {
            execSync('git add -A', { stdio: 'ignore' });
            execSync('git stash --include-untracked', { stdio: 'ignore' });
        } catch {}

        // Rama fija: pro
        const branch = 'pro';

        // Descargar actualizaciones
        await m.reply(`⬇️ *Descargando updates desde la rama ${branch}...* 🦈✨`);
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
        await m.reply('📦 *Instalando dependencias mágicas...* 🔮💙');
        execSync('npm install', { stdio: 'ignore' });

        // Recargar plugins
        await m.reply('🔄 *Recargando plugins nya~* 🐟✨');
        global.plugins = {};
        const pluginsFolder = path.join(__dirname, '../plugins');
        const pluginFiles = fs.readdirSync(pluginsFolder).filter(f => f.endsWith('.js'));

        for (const file of pluginFiles) {
            try {
                const pluginPath = path.join(pluginsFolder, file);
                delete require.cache[require.resolve(pluginPath)];
                global.plugins[file] = require(pluginPath);
            } catch (e) {
                conn.logger.error(`⚠️ Error al recargar ${file}:`, e);
            }
        }

        await m.reply(`✅ *Yatta~! Gura-chan actualizó el bot con éxito desde la rama ${branch}!* 🦈💙\n\n🔌 *Plugins recargados:* ${Object.keys(global.plugins).length}\n🛡 *Archivos protegidos:* ${excludePaths.join(', ') || 'Ninguno detectado'}\n\n> 𓆩 🌊 Powered by Gura-chan 🐟𓆪`);
    } catch (error) {
        console.error(error);
        await m.reply(`❌ *Uu~ Hubo un error durante la actualización, desu!* 🦈💦\n\n> ${error.message}`);
    }
};

handler.help = ['update', 'actualizar'];
handler.tags = ['owner'];
handler.command = /^(update|actualizar)$/i;
handler.rowner = true;

module.exports = handler;
