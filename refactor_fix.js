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

        // Fix ./client inside src/lib/api
        if (filePath.includes('lib\\api') || filePath.includes('lib/api')) {
            if (content.match(/from\s+['"]\.\/client['"]/)) {
                content = content.replace(/from\s+['"]\.\/client['"]/g, 'from "@/shared/services/client"');
                modified = true;
            }
        }

        // Fix ./ui/button inside src/components/Footer.tsx and VehicleCard.tsx
        if (content.match(/from\s+['"]\.\/ui\/button['"]/)) {
            content = content.replace(/from\s+['"]\.\/ui\/button['"]/g, 'from "@/shared/ui/button"');
            modified = true;
        }

        // Fix ./ui/badge etc if any exist
        if (content.match(/from\s+['"]\.\/ui\/badge['"]/)) {
            content = content.replace(/from\s+['"]\.\/ui\/badge['"]/g, 'from "@/shared/ui/badge"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed imports: ${filePath}`);
        }
    }
});
