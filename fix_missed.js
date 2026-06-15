const fs = require('fs');
const path = require('path');

const filesToFix = [
    'frontend/src/modules/admin/components/AnalyticsDashboard.tsx',
    'frontend/src/modules/admin/components/AdminSettings.tsx',
    'frontend/src/modules/storefront/components/StorefrontManager.tsx'
];

for (const relPath of filesToFix) {
    const filePath = path.join(__dirname, relPath);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix imports
    content = content.replace(/from ['"]\.\/admin\/analytics\//g, "from './analytics/");
    content = content.replace(/from ['"]\.\/admin\/users\//g, "from './users/");
    content = content.replace(/from ['"]\.\/admin\/settings\//g, "from './settings/");
    content = content.replace(/from ['"]\.\/cms\//g, "from './cms/");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
}
