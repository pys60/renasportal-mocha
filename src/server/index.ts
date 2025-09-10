import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { authenticateToken } from './middleware/auth';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { role?: string };
    }
  }
}

import { 
  PageInputSchema, 
  BlogPostInputSchema, 
  ServiceInputSchema, 
  ContactFormSchema,
  ThemeSchema 
} from '../shared/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));

// Pages API
app.post('/api/pages', authenticateToken, async (req: Request, res: Response) => {
  try {
    const pageData = PageInputSchema.parse(req.body);
    const result = await pool.query(
      'INSERT INTO pages (slug, title, content, meta_description, is_published, parent_id, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [pageData.slug, pageData.title, pageData.content, pageData.meta_description, pageData.is_published, pageData.parent_id, pageData.sort_order]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(400).json({ message: 'Invalid page data' });
  }
});

app.get('/api/pages', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Blog API
app.post('/api/blog', authenticateToken, async (req: Request, res: Response) => {
  try {
    const postData = BlogPostInputSchema.parse(req.body);
    const result = await pool.query(
      'INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, meta_description, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [postData.title, postData.slug, postData.content, postData.excerpt, postData.featured_image_url, postData.meta_description, postData.is_published]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(400).json({ message: 'Invalid blog post data' });
  }
});

app.get('/api/blog', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Services API
app.post('/api/services', authenticateToken, async (req: Request, res: Response) => {
  try {
    const serviceData = ServiceInputSchema.parse(req.body);
    const result = await pool.query(
      'INSERT INTO services (title, description, icon, sort_order, is_active, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [serviceData.title, serviceData.description, serviceData.icon, serviceData.sort_order, serviceData.is_active, serviceData.category]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: 'Invalid service data' });
  }
});

app.get('/api/services', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Contact API
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const contactData = ContactFormSchema.parse(req.body);
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [contactData.name, contactData.email, contactData.subject, contactData.message]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(400).json({ message: 'Invalid contact form data' });
  }
});

app.get('/api/contact-submissions', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Utility function to generate slug from title
function generateSlug(title: string) {
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
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  } catch (error) {
    console.error('Theme fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/theme', validate(z.object({ theme: ThemeSchema })), async (req, res) => {
  try {
    const { theme } = req.body;
    
    await pool.query(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `, ['theme', theme]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Theme update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pages API
app.get('/api/pages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (error) {
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
    const rootPages: Array<{ id: number; title: string; children: any[] }> = [];
    
    pages.forEach((page) => {
      pageMap.set(page.id, { ...page, children: [] });
    });
    
    pages.forEach((page) => {
      const pageWithChildren = pageMap.get(page.id);
      if (page.parent_id) {
        const parent = pageMap.get(page.parent_id);
        if (parent) {
          parent.children.push(pageWithChildren);
        } else {
          rootPages.push(pageWithChildren);
        }
      } else {
        rootPages.push(pageWithChildren);
      }
    });
    
    res.json(rootPages);
  } catch (error) {
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
  } catch (error) {
    console.error('Page fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/pages', validate(PageInputSchema), async (req, res) => {
  try {
    const data = req.body;
    const slug = generateSlug(data.title);
    
    const result = await pool.query(`
      INSERT INTO pages (slug, title, content, meta_description, is_published, parent_id, sort_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id
    `, [slug, data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0]);
    
    res.json({ id: result.rows[0].id, slug });
  } catch (error) {
    console.error('Page create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/pages/:id', validate(PageInputSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    await pool.query(`
      UPDATE pages 
      SET title = $1, content = $2, meta_description = $3, is_published = $4, parent_id = $5, sort_order = $6, updated_at = NOW()
      WHERE id = $7
    `, [data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0, id]);
    
    res.json({ success: true });
  } catch (error) {
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
  } catch (error) {
    console.error('Page delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/pages/:id/sort', validate(z.object({ sort_order: z.number() })), async (req, res) => {
  try {
    const { id } = req.params;
    const { sort_order } = req.body;
    
    await pool.query('UPDATE pages SET sort_order = $1, updated_at = NOW() WHERE id = $2', [sort_order, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Page sort update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog API
app.get('/api/blog', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Blog posts fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blog/published', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE is_published = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
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
  } catch (error) {
    console.error('Blog post fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blog', validate(BlogPostInputSchema), async (req, res) => {
  try {
    const data = req.body;
    const slug = generateSlug(data.title);
    
    const result = await pool.query(`
      INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, meta_description, is_published, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id
    `, [data.title, slug, data.content || '', data.excerpt || '', data.featured_image_url || '', data.meta_description || '', data.is_published]);
    
    res.json({ id: result.rows[0].id, slug });
  } catch (error) {
    console.error('Blog post create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/blog/:id', validate(BlogPostInputSchema), async (req, res) => {
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
  } catch (error) {
    console.error('Blog post update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Services API
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/services', validate(ServiceInputSchema), async (req, res) => {
  try {
    const data = req.body;
    
    const result = await pool.query(`
      INSERT INTO services (title, description, icon, category, sort_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id
    `, [data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active]);
    
    res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Service create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/services/:id', validate(ServiceInputSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    await pool.query(`
      UPDATE services 
      SET title = $1, description = $2, icon = $3, category = $4, sort_order = $5, is_active = $6, updated_at = NOW()
      WHERE id = $7
    `, [data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Service delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact API
app.post('/api/contact', validate(ContactFormSchema), async (req, res) => {
  try {
    const data = req.body;
    
    const result = await pool.query(`
      INSERT INTO contact_submissions (name, email, subject, message, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id
    `, [data.name, data.email, data.subject || '', data.message]);
    
    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/contact-submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Contact submissions fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/contact-submissions/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('UPDATE contact_submissions SET is_read = true, updated_at = NOW() WHERE id = $1', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Contact submission read update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User authentication routes
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role || 'user']
    );
    res.json({ success: true });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to protect admin routes
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded as JwtPayload & { role?: string };
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
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

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role || 'user']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
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
