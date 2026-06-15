const fs = require('fs');
const path = require('path');

const filesToFix = [
    'frontend/src/app/agent/page.tsx',
    'frontend/src/app/agent/sections/AgentHome.tsx',
    'frontend/src/app/dashboard/page.tsx',
    'frontend/src/app/dashboard/profile/page.tsx'
];

for (const relPath of filesToFix) {
    const filePath = path.join(__dirname, relPath);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace 'from '@/modules/.../...'"; with from "@/modules/.../...";
    content = content.replace(/from '(@\/modules\/[^"';]+)["']/g, 'from "$1"');
    content = content.replace(/from '(\.\.\/modules\/[^"';]+)["']/g, 'from "$1"');
    content = content.replace(/from '(\.\.\/\.\.\/modules\/[^"';]+)["']/g, 'from "$1"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
}
