import { mattresses } from './src/data/products.js';

for (const product of mattresses) {
    try {
        const img = product.images.find(img => !img.endsWith('.mp4')) || product.images[0];
        console.log(`Product ${product.id}: image is ${img}`);
    } catch (e) {
        console.log(`Error on product ${product.id}: ${e.message}`);
    }
}
