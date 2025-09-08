import { useEffect, useState } from 'react';
import { FileText, PenTool, Briefcase, Mail, Users, BarChart3 } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { useAuth } from '@/react-app/contexts/AuthContext';

export default function Admin() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    pages: 0,
    blogPosts: 0,
    services: 0,
    contactSubmissions: 0,
    unreadSubmissions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [pagesRes, blogRes, servicesRes, contactRes] = await Promise.all([
          fetch('/api/pages', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/blog', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/services', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/contact-submissions', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [pages, blog, services, contact] = await Promise.all([
          pagesRes.json(),
          blogRes.json(),
          servicesRes.json(),
          contactRes.json()
        ]);

        setStats({
          pages: pages.length,
          blogPosts: blog.length,
          services: services.length,
          contactSubmissions: contact.length,
          unreadSubmissions: contact.filter((c: any) => !c.is_read).length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const cardClasses = theme === 'turquoise'
    ? 'bg-gradient-to-br from-cyan-500 to-teal-600'
    : 'bg-gradient-to-br from-gray-500 to-green-600';

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'}`}>
                <FileText className={`h-6 w-6 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Sayfalar</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.pages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'}`}>
                <PenTool className={`h-6 w-6 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Blog Yazıları</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.blogPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'}`}>
                <Briefcase className={`h-6 w-6 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Hizmetler</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.services}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'}`}>
                <Mail className={`h-6 w-6 ${theme === 'turquoise' ? 'text-cyan-600' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">İletişim Mesajları</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.contactSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Okunmamış Mesajlar</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.unreadSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Aktif Tema</h3>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {theme === 'turquoise' ? 'Turkuaz' : 'Gri-Yeşil'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/sayfalar"
              className={`${cardClasses} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <FileText className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Sayfaları Yönet</h3>
              <p className="text-sm opacity-90">Hakkımızda, hizmetler gibi sayfları düzenle</p>
            </a>

            <a
              href="/admin/blog"
              className={`${cardClasses} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <PenTool className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Blog Yönet</h3>
              <p className="text-sm opacity-90">Blog yazılarını ekle ve düzenle</p>
            </a>

            <a
              href="/admin/hizmetler"
              className={`${cardClasses} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <Briefcase className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Hizmetler</h3>
              <p className="text-sm opacity-90">Sunduğunuz hizmetleri yönetin</p>
            </a>

            <a
              href="/admin/iletisim"
              className={`${cardClasses} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <Mail className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">İletişim</h3>
              <p className="text-sm opacity-90">Gelen mesajları görüntüle</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
