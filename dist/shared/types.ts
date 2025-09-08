import z from "zod";

// Theme types
export const ThemeSchema = z.enum(['turquoise', 'gray-green']);
export type Theme = z.infer<typeof ThemeSchema>;

// Settings
export const SettingSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Setting = z.infer<typeof SettingSchema>;

// Pages
export const PageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  meta_description: z.string().nullable(),
  is_published: z.number(),
  parent_id: z.number().nullable(),
  sort_order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Page = z.infer<typeof PageSchema>;

export const PageInputSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  content: z.string().optional(),
  meta_description: z.string().optional(),
  is_published: z.number().default(1),
  parent_id: z.number().optional(),
  sort_order: z.number().default(0),
});
export type PageInput = z.infer<typeof PageInputSchema>;

// Blog Posts
export const BlogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string().nullable(),
  excerpt: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  meta_description: z.string().nullable(),
  is_published: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type BlogPost = z.infer<typeof BlogPostSchema>;

export const BlogPostInputSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image_url: z.string().optional(),
  meta_description: z.string().optional(),
  is_published: z.number().default(0),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

// Services
export const ServiceSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  category: z.string().nullable(),
  sort_order: z.number(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Service = z.infer<typeof ServiceSchema>;

export const ServiceInputSchema = z.object({
  title: z.string().min(1, "Hizmet adı gereklidir"),
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  sort_order: z.number().default(0),
  is_active: z.number().default(1),
});
export type ServiceInput = z.infer<typeof ServiceInputSchema>;

// Contact Submissions
export const ContactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  subject: z.string().nullable(),
  message: z.string(),
  is_read: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export const ContactFormSchema = z.object({
  name: z.string().min(1, "Ad gereklidir"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  subject: z.string().optional(),
  message: z.string().min(1, "Mesaj gereklidir"),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;
