import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    console.log('Starting migration...');
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    try {
        console.log('Adding address and payment_method columns to orders table...');
        await db.exec('ALTER TABLE orders ADD COLUMN address TEXT');
        await db.exec('ALTER TABLE orders ADD COLUMN payment_method TEXT');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('Columns already exist.');
        } else {
            console.error('Error altering table:', e.message);
        }
    }

    console.log('Updating product images...');
    await db.run("UPDATE products SET image = REPLACE(image, '?q=80&', '?')");
    
    console.log('Migration complete.');
    await db.close();
}

migrate();
