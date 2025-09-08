import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { 
  PageInputSchema, 
  BlogPostInputSchema, 
  ServiceInputSchema, 
  ContactFormSchema,
  ThemeSchema 
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Utility function to generate slug from title
function generateSlug(title: string): string {
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

// Get theme
app.get('/api/theme', async (c) => {
  const db = c.env.DB;
  const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('theme').first<{ value: string }>();
  return c.json({ theme: result?.value || 'turquoise' });
});

// Update theme
app.post('/api/theme', zValidator('json', z.object({ theme: ThemeSchema })), async (c) => {
  const { theme } = c.req.valid('json');
  const db = c.env.DB;
  
  await db.prepare(`
    INSERT OR REPLACE INTO settings (key, value, updated_at) 
    VALUES (?, ?, datetime('now'))
  `).bind('theme', theme).run();
  
  return c.json({ success: true });
});

// Pages API
app.get('/api/pages', async (c) => {
  const db = c.env.DB;
  const pages = await db.prepare('SELECT * FROM pages ORDER BY sort_order ASC, created_at DESC').all();
  return c.json(pages.results);
});

app.get('/api/pages/hierarchy', async (c) => {
  const db = c.env.DB;
  const pages = await db.prepare('SELECT * FROM pages ORDER BY sort_order ASC, created_at DESC').all();
  
  // Build hierarchy
  const pageMap = new Map();
  const rootPages: any[] = [];
  
  pages.results.forEach((page: any) => {
    pageMap.set(page.id, { ...page, children: [] });
  });
  
  pages.results.forEach((page: any) => {
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
  
  return c.json(rootPages);
});

app.get('/api/pages/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = c.env.DB;
  const page = await db.prepare('SELECT * FROM pages WHERE slug = ?').bind(slug).first();
  
  if (!page) {
    return c.json({ error: 'Page not found' }, 404);
  }
  
  return c.json(page);
});

app.post('/api/pages', zValidator('json', PageInputSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  const slug = generateSlug(data.title);
  
  const result = await db.prepare(`
    INSERT INTO pages (slug, title, content, meta_description, is_published, parent_id, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(slug, data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0).run();
  
  return c.json({ id: result.meta.last_row_id, slug });
});

app.put('/api/pages/:id', zValidator('json', PageInputSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  await db.prepare(`
    UPDATE pages 
    SET title = ?, content = ?, meta_description = ?, is_published = ?, parent_id = ?, sort_order = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(data.title, data.content || '', data.meta_description || '', data.is_published, data.parent_id || null, data.sort_order || 0, id).run();
  
  return c.json({ success: true });
});

app.delete('/api/pages/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  
  // Check if page has children
  const children = await db.prepare('SELECT COUNT(*) as count FROM pages WHERE parent_id = ?').bind(id).first<{ count: number }>();
  
  if (children && children.count > 0) {
    return c.json({ error: 'Bu sayfanın alt sayfaları var. Önce alt sayfaları silin.' }, 400);
  }
  
  await db.prepare('DELETE FROM pages WHERE id = ?').bind(id).run();
  
  return c.json({ success: true });
});

app.put('/api/pages/:id/sort', zValidator('json', z.object({ sort_order: z.number() })), async (c) => {
  const id = c.req.param('id');
  const { sort_order } = c.req.valid('json');
  const db = c.env.DB;
  
  await db.prepare('UPDATE pages SET sort_order = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(sort_order, id).run();
  
  return c.json({ success: true });
});

// Blog API
app.get('/api/blog', async (c) => {
  const db = c.env.DB;
  const posts = await db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  return c.json(posts.results);
});

app.get('/api/blog/published', async (c) => {
  const db = c.env.DB;
  const posts = await db.prepare('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC').all();
  return c.json(posts.results);
});

app.get('/api/blog/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = c.env.DB;
  const post = await db.prepare('SELECT * FROM blog_posts WHERE slug = ?').bind(slug).first();
  
  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }
  
  return c.json(post);
});

app.post('/api/blog', zValidator('json', BlogPostInputSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  const slug = generateSlug(data.title);
  
  const result = await db.prepare(`
    INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, meta_description, is_published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(data.title, slug, data.content || '', data.excerpt || '', data.featured_image_url || '', data.meta_description || '', data.is_published).run();
  
  return c.json({ id: result.meta.last_row_id, slug });
});

app.put('/api/blog/:id', zValidator('json', BlogPostInputSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  const slug = generateSlug(data.title);
  
  await db.prepare(`
    UPDATE blog_posts 
    SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image_url = ?, meta_description = ?, is_published = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(data.title, slug, data.content || '', data.excerpt || '', data.featured_image_url || '', data.meta_description || '', data.is_published, id).run();
  
  return c.json({ success: true });
});

// Services API
app.get('/api/services', async (c) => {
  const db = c.env.DB;
  const services = await db.prepare('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC').all();
  return c.json(services.results);
});

app.post('/api/services', zValidator('json', ServiceInputSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  const result = await db.prepare(`
    INSERT INTO services (title, description, icon, category, sort_order, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active).run();
  
  return c.json({ id: result.meta.last_row_id });
});

app.put('/api/services/:id', zValidator('json', ServiceInputSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  await db.prepare(`
    UPDATE services 
    SET title = ?, description = ?, icon = ?, category = ?, sort_order = ?, is_active = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(data.title, data.description || '', data.icon || '', data.category || '', data.sort_order, data.is_active, id).run();
  
  return c.json({ success: true });
});

app.delete('/api/services/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  
  await db.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
  
  return c.json({ success: true });
});

// Contact API
app.post('/api/contact', zValidator('json', ContactFormSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.env.DB;
  
  const result = await db.prepare(`
    INSERT INTO contact_submissions (name, email, subject, message, created_at, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(data.name, data.email, data.subject || '', data.message).run();
  
  return c.json({ success: true, id: result.meta.last_row_id });
});

app.get('/api/contact-submissions', async (c) => {
  const db = c.env.DB;
  const submissions = await db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all();
  return c.json(submissions.results);
});

app.put('/api/contact-submissions/:id/read', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  
  await db.prepare('UPDATE contact_submissions SET is_read = 1, updated_at = datetime(\'now\') WHERE id = ?').bind(id).run();
  
  return c.json({ success: true });
});

export default app;
