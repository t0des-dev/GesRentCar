const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const frontendSrc = path.join(__dirname, 'frontend', 'src');

walk(frontendSrc, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        const replacements = [
            // Agent components
            { from: /from ['"]@\/components\/agent\//g, to: "from '@/modules/agent/components/" },
            { from: /from ['"]\.\.\/components\/agent\//g, to: "from '../modules/agent/components/" },
            { from: /from ['"]\.\.\/\.\.\/components\/agent\//g, to: "from '../../modules/agent/components/" },

            // Dashboard components
            { from: /from ['"]@\/components\/dashboard\//g, to: "from '@/modules/dashboard/components/" },
            { from: /from ['"]\.\.\/components\/dashboard\//g, to: "from '../modules/dashboard/components/" },
            { from: /from ['"]\.\.\/\.\.\/components\/dashboard\//g, to: "from '../../modules/dashboard/components/" },
        ];
        
        for (const {from, to} of replacements) {
            if (content.match(from)) {
                content = content.replace(from, to);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated imports: ${filePath}`);
        }
    }
});
