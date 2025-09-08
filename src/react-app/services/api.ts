import { Page, BlogPost, Service, ContactForm } from '@/shared/types';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Pages API
export const createPage = async (pageData: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await fetch(`${API_URL}/pages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pageData)
  });
  if (!response.ok) throw new Error('Failed to create page');
  return response.json();
};

export const getPages = async () => {
  const response = await fetch(`${API_URL}/pages`);
  if (!response.ok) throw new Error('Failed to fetch pages');
  return response.json();
};

// Blog API
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await fetch(`${API_URL}/blog`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData)
  });
  if (!response.ok) throw new Error('Failed to create blog post');
  return response.json();
};

export const getBlogPosts = async () => {
  const response = await fetch(`${API_URL}/blog`);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

// Services API
export const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(serviceData)
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
};

export const getServices = async () => {
  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

// Contact API
export const submitContactForm = async (contactData: ContactForm) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  if (!response.ok) throw new Error('Failed to submit contact form');
  return response.json();
};

export const getContactSubmissions = async () => {
  const response = await fetch(`${API_URL}/contact-submissions`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch contact submissions');
  return response.json();
};
