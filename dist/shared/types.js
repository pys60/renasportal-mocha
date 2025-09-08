"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactFormSchema = exports.ContactSubmissionSchema = exports.ServiceInputSchema = exports.ServiceSchema = exports.BlogPostInputSchema = exports.BlogPostSchema = exports.PageInputSchema = exports.PageSchema = exports.SettingSchema = exports.ThemeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Theme types
exports.ThemeSchema = zod_1.default.enum(['turquoise', 'gray-green']);
// Settings
exports.SettingSchema = zod_1.default.object({
    id: zod_1.default.number(),
    key: zod_1.default.string(),
    value: zod_1.default.string().nullable(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
// Pages
exports.PageSchema = zod_1.default.object({
    id: zod_1.default.number(),
    slug: zod_1.default.string(),
    title: zod_1.default.string(),
    content: zod_1.default.string().nullable(),
    meta_description: zod_1.default.string().nullable(),
    is_published: zod_1.default.number(),
    parent_id: zod_1.default.number().nullable(),
    sort_order: zod_1.default.number(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
exports.PageInputSchema = zod_1.default.object({
    title: zod_1.default.string().min(1, "Başlık gereklidir"),
    content: zod_1.default.string().optional(),
    meta_description: zod_1.default.string().optional(),
    is_published: zod_1.default.number().default(1),
    parent_id: zod_1.default.number().optional(),
    sort_order: zod_1.default.number().default(0),
});
// Blog Posts
exports.BlogPostSchema = zod_1.default.object({
    id: zod_1.default.number(),
    title: zod_1.default.string(),
    slug: zod_1.default.string(),
    content: zod_1.default.string().nullable(),
    excerpt: zod_1.default.string().nullable(),
    featured_image_url: zod_1.default.string().nullable(),
    meta_description: zod_1.default.string().nullable(),
    is_published: zod_1.default.number(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
exports.BlogPostInputSchema = zod_1.default.object({
    title: zod_1.default.string().min(1, "Başlık gereklidir"),
    content: zod_1.default.string().optional(),
    excerpt: zod_1.default.string().optional(),
    featured_image_url: zod_1.default.string().optional(),
    meta_description: zod_1.default.string().optional(),
    is_published: zod_1.default.number().default(0),
});
// Services
exports.ServiceSchema = zod_1.default.object({
    id: zod_1.default.number(),
    title: zod_1.default.string(),
    description: zod_1.default.string().nullable(),
    icon: zod_1.default.string().nullable(),
    category: zod_1.default.string().nullable(),
    sort_order: zod_1.default.number(),
    is_active: zod_1.default.number(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
exports.ServiceInputSchema = zod_1.default.object({
    title: zod_1.default.string().min(1, "Hizmet adı gereklidir"),
    description: zod_1.default.string().optional(),
    icon: zod_1.default.string().optional(),
    category: zod_1.default.string().optional(),
    sort_order: zod_1.default.number().default(0),
    is_active: zod_1.default.number().default(1),
});
// Contact Submissions
exports.ContactSubmissionSchema = zod_1.default.object({
    id: zod_1.default.number(),
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    subject: zod_1.default.string().nullable(),
    message: zod_1.default.string(),
    is_read: zod_1.default.number(),
    created_at: zod_1.default.string(),
    updated_at: zod_1.default.string(),
});
exports.ContactFormSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Ad gereklidir"),
    email: zod_1.default.string().email("Geçerli bir email adresi giriniz"),
    subject: zod_1.default.string().optional(),
    message: zod_1.default.string().min(1, "Mesaj gereklidir"),
});
