import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Service, ServiceInput } from '@/shared/types';

export default function AdminServices() {
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceInput>({
    title: '',
    description: '',
    icon: '',
    category: '',
    sort_order: 0,
    is_active: 1
  });

  const categories = [
    'surdurulebilirlik',
    'sosyal-sorumluluk', 
    'iso-yonetim',
    'surec-iyilestirme',
    'kimya-kozmetik',
    'kurumsal-yonetim',
    'yonetim-mali'
  ];

  const categoryNames = {
    'surdurulebilirlik': 'Sürdürülebilirlik',
    'sosyal-sorumluluk': 'Sosyal Sorumluluk',
    'iso-yonetim': 'ISO Yönetim Sistemleri',
    'surec-iyilestirme': 'Süreç İyileştirme',
    'kimya-kozmetik': 'Kimya & Kozmetik',
    'kurumsal-yonetim': 'Kurumsal Yönetim',
    'yonetim-mali': 'Yönetim & Mali'
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      icon: service.icon || '',
      category: service.category || '',
      sort_order: service.sort_order,
      is_active: service.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      try {
        await fetch(`/api/services/${id}`, { method: 'DELETE' });
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingService(null);
        setFormData({ title: '', description: '', icon: '', category: '', sort_order: 0, is_active: 1 });
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to save service:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Hizmet Yönetimi</h1>
            <p className="text-gray-600 mt-2">Sunduğunuz hizmetleri ekleyin ve düzenleyin</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${buttonClasses}`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Hizmet Ekle
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hizmet Adı
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
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryNames[cat as keyof typeof categoryNames]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} resize-none`}
                  placeholder="Hizmet açıklaması..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkon (Lucide Icon Adı)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses}`}
                    placeholder="CheckCircle, Star, Shield vb."
                  />
                </div>

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
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className={`h-4 w-4 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'} rounded`}
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Aktif
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold ${buttonClasses}`}
                >
                  {editingService ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                    setFormData({ title: '', description: '', icon: '', category: '', sort_order: 0, is_active: 1 });
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
            <h2 className="text-lg font-semibold text-gray-900">Hizmetler ({services.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sıralama
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {service.title}
                      </div>
                      {service.description && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {service.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.category ? categoryNames[service.category as keyof typeof categoryNames] : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.is_active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Pasif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.sort_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                            theme === 'turquoise'
                              ? 'text-cyan-600 hover:text-cyan-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Sil
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
