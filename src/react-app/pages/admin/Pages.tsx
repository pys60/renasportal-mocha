import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, ChevronRight, ChevronDown, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Page, PageInput } from '@/shared/types';

export default function AdminPages() {
  const { theme } = useTheme();
  const [pages, setPages] = useState<Page[]>([]);
  const [hierarchicalPages, setHierarchicalPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<PageInput>({
    title: '',
    content: '',
    meta_description: '',
    is_published: 1,
    parent_id: undefined,
    sort_order: 0
  });

  const fetchPages = async () => {
    try {
      const [pagesRes, hierarchyRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/pages/hierarchy')
      ]);
      const pagesData = await pagesRes.json();
      const hierarchyData = await hierarchyRes.json();
      setPages(pagesData);
      setHierarchicalPages(hierarchyData);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleAddPage = () => {
    setEditingPage(null);
    setFormData({ 
      title: '', 
      content: '', 
      meta_description: '', 
      is_published: 1, 
      parent_id: undefined,
      sort_order: pages.length 
    });
    setShowForm(true);
  };

  const handleAddSubPage = (parentId: number) => {
    setEditingPage(null);
    setFormData({ 
      title: '', 
      content: '', 
      meta_description: '', 
      is_published: 1, 
      parent_id: parentId,
      sort_order: 0 
    });
    setShowForm(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      content: page.content || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published,
      parent_id: page.parent_id || undefined,
      sort_order: page.sort_order
    });
    setShowForm(true);
  };

  const handleDelete = async (page: Page) => {
    if (confirm(`"${page.title}" sayfasını silmek istediğinizden emin misiniz?`)) {
      try {
        const response = await fetch(`/api/pages/${page.id}`, { method: 'DELETE' });
        
        if (response.ok) {
          fetchPages();
        } else {
          const error = await response.json();
          alert(error.error || 'Sayfa silinirken hata oluştu');
        }
      } catch (error) {
        console.error('Failed to delete page:', error);
        alert('Sayfa silinirken hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPage ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingPage(null);
        setFormData({ title: '', content: '', meta_description: '', is_published: 1, parent_id: undefined, sort_order: 0 });
        fetchPages();
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    }
  };

  const handleSortChange = async (pageId: number, direction: 'up' | 'down') => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const newSortOrder = direction === 'up' ? page.sort_order - 1 : page.sort_order + 1;
    
    try {
      await fetch(`/api/pages/${pageId}/sort`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: newSortOrder })
      });
      
      fetchPages();
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  const toggleExpanded = (pageId: number) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const renderPageTree = (pages: any[], level: number = 0) => {
    return pages.map((page) => (
      <div key={page.id} className={`${level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}`}>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              {page.children && page.children.length > 0 && (
                <button
                  onClick={() => toggleExpanded(page.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {expandedPages.has(page.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{page.title}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  page.is_published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {page.is_published ? (
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
              </div>
              <div className="text-xs text-gray-500">/{page.slug}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleSortChange(page.id, 'up')}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                disabled={page.sort_order === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSortChange(page.id, 'down')}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => handleAddSubPage(page.id)}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${
                theme === 'turquoise'
                  ? 'text-cyan-600 border-cyan-200 hover:bg-cyan-50'
                  : 'text-green-600 border-green-200 hover:bg-green-50'
              }`}
              title="Alt sayfa ekle"
            >
              <Plus className="h-3 w-3 mr-1" />
              Alt Sayfa
            </button>

            <button
              onClick={() => handleEdit(page)}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                theme === 'turquoise'
                  ? 'text-cyan-600 hover:text-cyan-900'
                  : 'text-green-600 hover:text-green-900'
              }`}
            >
              <Edit className="h-3 w-3 mr-1" />
              Düzenle
            </button>

            <button
              onClick={() => handleDelete(page)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Sil
            </button>
          </div>
        </div>

        {/* Children */}
        {page.children && page.children.length > 0 && expandedPages.has(page.id) && (
          <div className="ml-4">
            {renderPageTree(page.children, level + 1)}
          </div>
        )}
      </div>
    ));
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
            <h1 className="text-3xl font-bold text-gray-900">Sayfa Yönetimi</h1>
            <p className="text-gray-600 mt-2">Web sitenizin sayfalarını düzenleyin, sıralayın ve alt sayfalar oluşturun</p>
          </div>
          <button
            onClick={handleAddPage}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${buttonClasses}`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Sayfa Ekle
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa Başlığı
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                    required
                    placeholder="Sayfa başlığı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Üst Sayfa (İsteğe Bağlı)
                  </label>
                  <select
                    value={formData.parent_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  >
                    <option value="">Ana sayfa olarak ekle</option>
                    {pages.filter(p => p.id !== editingPage?.id && !p.parent_id).map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sayfa İçeriği
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} resize-none`}
                  placeholder="Sayfa içeriğini HTML olarak yazabilirsiniz..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Meta Açıklama
                </label>
                <input
                  type="text"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  placeholder="Arama motorları için kısa açıklama (160 karakter önerilir)"
                  maxLength={160}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Küçük sayılar önce görünür</p>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published === 1}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                    className={`h-4 w-4 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'} rounded`}
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
                    Sayfayı yayınla
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold ${buttonClasses}`}
                >
                  {editingPage ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPage(null);
                    setFormData({ title: '', content: '', meta_description: '', is_published: 1, parent_id: undefined, sort_order: 0 });
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
            <h2 className="text-lg font-semibold text-gray-900">
              Sayfalar ({pages.length} toplam)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sayfaları sürükleyerek sıralayabilir, alt sayfalar oluşturabilirsiniz
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {hierarchicalPages.length > 0 ? (
              renderPageTree(hierarchicalPages)
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Henüz sayfa eklenmemiş</p>
                <button
                  onClick={handleAddPage}
                  className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg font-semibold ${buttonClasses}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Sayfayı Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
