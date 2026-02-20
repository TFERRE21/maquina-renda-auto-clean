import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateThumbnail() {
    try {
        const outputFolder = path.join(__dirname, '../output');
        const imagesFolder = path.join(__dirname, '../output/images');
        const thumbnailPath = path.join(outputFolder, 'thumbnail.png');

        if (!fs.existsSync(imagesFolder)) {
            console.log('❌ Pasta images não encontrada');
            return;
        }

        const images = fs.readdirSync(imagesFolder)
            .filter(file => file.endsWith('.png'));

        if (images.length === 0) {
            console.log('❌ Nenhuma imagem encontrada');
            return;
        }

        const firstImage = path.join(imagesFolder, images[0]);

        await sharp(firstImage)
            .resize(1280, 720)
            .toFile(thumbnailPath);

        console.log('✅ Thumbnail criada com sucesso');

    } catch (error) {
        console.log('❌ Erro ao gerar thumbnail:', error.message);
    }
}

generateThumbnail();