"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const zod_1 = require("zod");
const types_1 = require("../../dist/shared/types");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Database connection pool
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Utility function to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[şŞ]/g, 's')
        .replace(/[çÇ]/g, 'c')
        .replace(/[ğĞ]/g, 'g')
        .replace(/[üÜ]/g, 'u')
        .replace(/[öÖ]/g, 'o')
        .replace(/[ıİ]/g, 'i')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors
                });
            }
            next(error);
        }
    };
};
// Theme API
app.get('/api/theme', async (req, res) => {
    try {
        const result = await pool.query('SELECT value FROM settings WHERE key = $1', ['theme']);
        res.json({ theme: result.rows[0]?.value || 'turquoise' });
    }
    catch (error) {
        console.error('Theme fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/theme', validate(zod_1.z.object({ theme: types_1.ThemeSchema })), async (req, res) => {
    try {
        const { theme } = req.body;
        await pool.query(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `, ['theme', theme]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Theme update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Pages API
app.get('/api/pages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pages ORDER BY sort_order ASC, created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Pages fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/pages/hierarchy', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pages ORDER BY sort_order ASC, created_at DESC');
        const pages = result.rows;
        // Build hierarchy
        const pageMap = new Map();
        const rootPages = [];
        pages.forEach((page) => {
            pageMap.set(page.id, { ...page, children: [] });
        });
        pages.forEach((page) => {
            const pageWithChildren = pageMap.get(page.id);
            if (page.parent_id) {
                const parent = pageMap.get(page.parent_id);
                if (parent) {
                    parent.children.push(pageWithChildren);
                }
                else {
                    rootPages.push(pageWithChildren);
                }
            }
            else {
                rootPages.push(pageWithChildren);
            }
        });
        res.json(rootPages);
    }
    catch (error) {
        console.error('Pages hierarchy fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Page fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/pages', validate(types_1.PageInputSchema), async (req, res) => {
    try {
        const data = req.body;
        const slug = generateSlug(data.title);
        const result = await pool.query(`
      INSERT INTO pages (slug, title, content, meta_description, is_published, parent_id, sort_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id
    `, [slug, data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0]);
        res.json({ id: result.rows[0].id, slug });
    }
    catch (error) {
        console.error('Page create error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/pages/:id', validate(types_1.PageInputSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await pool.query(`
      UPDATE pages 
      SET title = $1, content = $2, meta_description = $3, is_published = $4, parent_id = $5, sort_order = $6, updated_at = NOW()
      WHERE id = $7
    `, [data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0, id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Page update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/pages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if page has children
        const childrenResult = await pool.query('SELECT COUNT(*) as count FROM pages WHERE parent_id = $1', [id]);
        if (parseInt(childrenResult.rows[0].count) > 0) {
            return res.status(400).json({ error: 'Bu sayfanın alt sayfaları var. Önce alt sayfaları silin.' });
        }
        await pool.query('DELETE FROM pages WHERE id = $1', [id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Page delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/pages/:id/sort', validate(zod_1.z.object({ sort_order: zod_1.z.number() })), async (req, res) => {
    try {
        const { id } = req.params;
        const { sort_order } = req.body;
        await pool.query('UPDATE pages SET sort_order = $1, updated_at = NOW() WHERE id = $2', [sort_order, id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Page sort update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Blog API
app.get('/api/blog', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Blog posts fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/blog/published', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blog_posts WHERE is_published = true ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Published blog posts fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/blog/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Blog post fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/blog', validate(types_1.BlogPostInputSchema), async (req, res) => {
    try {
        const data = req.body;
        const slug = generateSlug(data.title);
        const result = await pool.query(`
      INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, meta_description, is_published, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id
    `, [data.title, slug, data.content || '', data.excerpt || '', data.featured_image_url || '', data.meta_description || '', data.is_published]);
        res.json({ id: result.rows[0].id, slug });
    }
    catch (error) {
        console.error('Blog post create error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/blog/:id', validate(types_1.BlogPostInputSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const slug = generateSlug(data.title);
        await pool.query(`
      UPDATE blog_posts 
      SET title = $1, slug = $2, content = $3, excerpt = $4, featured_image_url = $5, meta_description = $6, is_published = $7, updated_at = NOW()
      WHERE id = $8
    `, [data.title, slug, data.content || '', data.excerpt || '', data.featured_image_url || '', data.meta_description || '', data.is_published, id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Blog post update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Services API
app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Services fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/services', validate(types_1.ServiceInputSchema), async (req, res) => {
    try {
        const data = req.body;
        const result = await pool.query(`
      INSERT INTO services (title, description, icon, category, sort_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id
    `, [data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active]);
        res.json({ id: result.rows[0].id });
    }
    catch (error) {
        console.error('Service create error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/services/:id', validate(types_1.ServiceInputSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await pool.query(`
      UPDATE services 
      SET title = $1, description = $2, icon = $3, category = $4, sort_order = $5, is_active = $6, updated_at = NOW()
      WHERE id = $7
    `, [data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active, id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Service update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM services WHERE id = $1', [id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Service delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Contact API
app.post('/api/contact', validate(types_1.ContactFormSchema), async (req, res) => {
    try {
        const data = req.body;
        const result = await pool.query(`
      INSERT INTO contact_submissions (name, email, subject, message, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id
    `, [data.name, data.email, data.subject || '', data.message]);
        res.json({ success: true, id: result.rows[0].id });
    }
    catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/contact-submissions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Contact submissions fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/contact-submissions/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE contact_submissions SET is_read = true, updated_at = NOW() WHERE id = $1', [id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Contact submission read update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// User authentication routes
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role || 'user']);
        res.json({ success: true });
    }
    catch (error) {
        console.error('User registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Define a secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Middleware to protect admin routes
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
const authorizeAdmin = (req, res, next) => {
    if (!req.user || typeof req.user === 'string' || !('role' in req.user)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};
// Protect admin routes
app.use('/api/admin', authenticate, authorizeAdmin);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📊 API endpoints available at http://localhost:${port}/api`);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await pool.end();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await pool.end();
    process.exit(0);
});
