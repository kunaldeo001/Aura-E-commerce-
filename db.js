import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial product seed
const initialProducts = [
    {
        name: 'Aura Sync Wireless Headphones',
        price: 24999,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Minimalist Chronograph Watch',
        price: 14999,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Polarized Aviator Sunglasses',
        price: 11500,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Smart Fitness Tracker',
        price: 9999,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Premium Leather Backpack',
        price: 19900,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Mechanical Keyboard Pro',
        price: 14500,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Wireless Charging Pad',
        price: 3599,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Noise-Canceling Earbuds',
        price: 15999,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1606220588913-b3aec5c9eab8?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Luxe Velvet Throw Pillow',
        price: 2499,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Designer Scented Candle',
        price: 1899,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Canvas Tote Bag',
        price: 3499,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1544816153-12ad4d71cc0d?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Ultra-thin Laptop Sleeve',
        price: 4999,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1544333346-64e4fe182547?q=80&w=800&auto=format&fit=crop',
    }
];

export async function initDb() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT DEFAULT 'Experience premium quality and exquisite design. Carefully crafted to elevate your everyday style and performance.'
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'Completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_name TEXT,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Seed products if empty
    const productCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
        console.log('Seeding initial products...');
        const stmt = await db.prepare('INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)');
        for (const p of initialProducts) {
            await stmt.run(p.name, p.price, p.category, p.image);
        }
        await stmt.finalize();
    }

    return db;
}
