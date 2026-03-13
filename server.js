import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb } from './db.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'super-secret-aura-key-2026';

app.use(cors());
app.use(express.json());

let db;

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/* Auth Routes */
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await db.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
        res.status(201).json({ id: result.lastID, name, email });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

/* Products Route */
app.get('/api/products', async (req, res) => {
    const { search, category, sort, minPrice, maxPrice } = req.query;
    let conditions = [];
    const params = [];

    if (category && category !== 'All') { conditions.push('category = ?'); params.push(category); }
    if (search) { conditions.push('name LIKE ?'); params.push(`%${search}%`); }
    if (minPrice) { conditions.push('price >= ?'); params.push(parseFloat(minPrice)); }
    if (maxPrice) { conditions.push('price <= ?'); params.push(parseFloat(maxPrice)); }

    let query = 'SELECT * FROM products';
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

    const sortMap = { price_asc: 'price ASC', price_desc: 'price DESC', name: 'name ASC' };
    if (sort && sortMap[sort]) query += ` ORDER BY ${sortMap[sort]}`;

    try {
        const products = await db.all(query, params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

/* Reviews Routes */
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const reviews = await db.all(
            'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
            [req.params.id]
        );
        const avg = await db.get(
            'SELECT AVG(rating) as avg FROM reviews WHERE product_id = ?',
            [req.params.id]
        );
        res.json({ reviews, averageRating: avg.avg ? avg.avg.toFixed(1) : null });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/products/:id/reviews', authenticateToken, async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    try {
        const existing = await db.get(
            'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (existing) return res.status(400).json({ error: 'You have already reviewed this product' });

        await db.run(
            'INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [req.params.id, req.user.id, req.user.name, rating, comment || '']
        );
        res.status(201).json({ message: 'Review submitted' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

/* Newsletter Route */
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    try {
        await db.run('INSERT INTO subscribers (email) VALUES (?)', [email]);
        res.status(201).json({ message: 'Subscribed successfully!' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Already subscribed' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

/* Checkout Route */
app.post('/api/checkout', authenticateToken, async (req, res) => {
    const { items, total, address, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    if (!address) return res.status(400).json({ error: 'Address is required' });
    if (!paymentMethod) return res.status(400).json({ error: 'Payment method is required' });

    try {
        await db.run('BEGIN TRANSACTION');
        const orderResult = await db.run(
            'INSERT INTO orders (user_id, total, address, payment_method) VALUES (?, ?, ?, ?)', 
            [req.user.id, total, address, paymentMethod]
        );
        const orderId = orderResult.lastID;

        const stmt = await db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        for (const item of items) {
            await stmt.run(orderId, item.id, item.quantity, item.price);
        }
        await stmt.finalize();

        await db.run('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: 'Checkout failed' });
    }
});

/* Order History Route */
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Start DB then Server
initDb().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}).catch(console.error);
