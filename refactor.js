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
            // Booking components
            { from: /@\/components\/booking\//g, to: '@/modules/booking/components/' },
            { from: /((?:\.\.\/)+)components\/booking\//g, to: '$1modules/booking/components/' },
            
            // Booking hooks
            { from: /@\/hooks\/useBooking/g, to: '@/modules/booking/hooks/useBooking' },
            { from: /((?:\.\.\/)+)hooks\/useBooking/g, to: '$1modules/booking/hooks/useBooking' },

            // Payments components
            { from: /@\/components\/StripeCheckout/g, to: '@/modules/payments/components/StripeCheckout' },
            { from: /((?:\.\.\/)+)components\/StripeCheckout/g, to: '$1modules/payments/components/StripeCheckout' },

            { from: /@\/components\/CmiCheckout/g, to: '@/modules/payments/components/CmiCheckout' },
            { from: /((?:\.\.\/)+)components\/CmiCheckout/g, to: '$1modules/payments/components/CmiCheckout' }
        ];
        
        for (const {from, to} of replacements) {
            if (content.match(from)) {
                content = content.replace(from, to);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated Booking/Payments: ${filePath}`);
        }
    }
});
