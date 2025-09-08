import { useEffect, useState } from 'react';
import { Edit, Eye, EyeOff, Plus } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { BlogPost, BlogPostInput } from '@/shared/types';

export default function AdminBlog() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    meta_description: '',
    is_published: 0
  });

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      featured_image_url: post.featured_image_url || '',
      meta_description: post.meta_description || '',
      is_published: post.is_published
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingPost(null);
        setFormData({ title: '', content: '', excerpt: '', featured_image_url: '', meta_description: '', is_published: 0 });
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to save blog post:', error);
    }
  };

  const buttonClasses = theme === 'turquoise'
    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

  const inputClasses = theme === 'turquoise'
    ? 'focus:ring-cyan-500 focus:border-cyan-500'
    : 'focus:ring-green-500 focus:border-green-500';

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
            <p className="text-gray-600 mt-2">Blog yazılarınızı ekleyin ve düzenleyin</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${buttonClasses}`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Yazı Ekle
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingPost ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} resize-none`}
                  placeholder="Kısa özet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} resize-none`}
                  placeholder="Blog yazısı içeriğini HTML olarak yazabilirsiniz..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öne Çıkan Görsel URL
                </label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama (SEO)
                </label>
                <input
                  type="text"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  placeholder="Arama motorları için kısa açıklama..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published === 1}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  className={`h-4 w-4 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'} rounded`}
                />
                <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
                  Yayınla
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold ${buttonClasses}`}
                >
                  {editingPost ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({ title: '', content: '', excerpt: '', featured_image_url: '', meta_description: '', is_published: 0 });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Blog Yazıları</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturma Tarihi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.is_published ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Yayınlandı
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Taslak
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                            theme === 'turquoise'
                              ? 'text-cyan-600 hover:text-cyan-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
