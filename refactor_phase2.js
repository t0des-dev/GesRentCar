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
            // Admin components (directory)
            { from: /@\/components\/admin\//g, to: '@/modules/admin/components/' },
            { from: /((?:\.\.\/)+)components\/admin\//g, to: '$1modules/admin/components/' },
            
            // AdminSettings
            { from: /@\/components\/AdminSettings/g, to: '@/modules/admin/components/AdminSettings' },
            { from: /((?:\.\.\/)+)components\/AdminSettings/g, to: '$1modules/admin/components/AdminSettings' },

            // StorefrontManager
            { from: /@\/components\/StorefrontManager/g, to: '@/modules/storefront/components/StorefrontManager' },
            { from: /((?:\.\.\/)+)components\/StorefrontManager/g, to: '$1modules/storefront/components/StorefrontManager' },

            // StorefrontPreview
            { from: /@\/components\/StorefrontPreview/g, to: '@/modules/storefront/components/StorefrontPreview' },
            { from: /((?:\.\.\/)+)components\/StorefrontPreview/g, to: '$1modules/storefront/components/StorefrontPreview' },

            // ConciergeAI
            { from: /@\/components\/ConciergeAI/g, to: '@/modules/ai/components/ConciergeAI' },
            { from: /((?:\.\.\/)+)components\/ConciergeAI/g, to: '$1modules/ai/components/ConciergeAI' },

            // ConciergeAILoader
            { from: /@\/components\/ConciergeAILoader/g, to: '@/modules/ai/components/ConciergeAILoader' },
            { from: /((?:\.\.\/)+)components\/ConciergeAILoader/g, to: '$1modules/ai/components/ConciergeAILoader' },

            // ConciergeBanner
            { from: /@\/components\/ConciergeBanner/g, to: '@/modules/ai/components/ConciergeBanner' },
            { from: /((?:\.\.\/)+)components\/ConciergeBanner/g, to: '$1modules/ai/components/ConciergeBanner' },
            
            // Fix CSS imports as well inside the tsx files if they exist
            { from: /\.\/StorefrontManager\.module\.css/g, to: './StorefrontManager.module.css' }
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
