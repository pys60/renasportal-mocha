import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Service } from '@/shared/types';

const categoryTitles: { [key: string]: string } = {
  'surdurulebilirlik': 'Sürdürülebilirlik Danışmanlığı',
  'sosyal-sorumluluk': 'Sosyal Sorumluluk ve Uygunluk',
  'iso-yonetim': 'ISO Yönetim Sistemleri',
  'surec-iyilestirme': 'Süreç İyileştirme Uygulamaları',
  'kimya-kozmetik': 'Kimya & Kozmetik & Tüketici Ürünleri Danışmanlığı',
  'kurumsal-yonetim': 'Kurumsal Yönetim ve Gelişim Danışmanlığı',
  'yonetim-mali': 'Yönetim ve Mali Danışmanlık'
};

const categoryMappings: { [key: string]: string } = {
  'surdurulebilirlik': 'SÜRDÜRÜLEBİLİRLİK',
  'sosyal-sorumluluk': 'SOSYAL SORUMLULUK VE UYGUNLUK',
  'iso-yonetim': 'ISO YÖNETİM SİSTEMLERİ',
  'surec-iyilestirme': 'SÜREÇ İYİLEŞTİRME UYGULAMALARI',
  'kimya-kozmetik': 'KİMYA&KOZMETİK&TÜKETİCİ ÜRÜNLERİ DANIŞMANLIĞI',
  'kurumsal-yonetim': 'KURUMSAL YÖNETİM VE GELİŞİM DANIŞMANLIĞI',
  'yonetim-mali': 'YÖNETİM VE MALİ DANIŞMANLIK'
};

export default function ServiceCategory() {
  const { category } = useParams<{ category: string }>();
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!category) return;
      
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        const dbCategory = categoryMappings[category];
        const filteredServices = data.filter((service: Service) => 
          service.is_active && service.category === dbCategory
        );
        setServices(filteredServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  const gradientClasses = theme === 'turquoise'
    ? 'from-cyan-600 to-teal-600'
    : 'from-gray-600 to-green-600';

  const cardClasses = theme === 'turquoise'
    ? 'hover:shadow-cyan-100'
    : 'hover:shadow-green-100';

  const iconClasses = theme === 'turquoise'
    ? 'text-cyan-600'
    : 'text-green-600';

  const linkClasses = theme === 'turquoise'
    ? 'text-cyan-600 hover:text-cyan-700'
    : 'text-green-600 hover:text-green-700';

  if (!category || !categoryTitles[category]) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Kategori bulunamadı
            </h1>
            <Link
              to="/hizmetler"
              className={`inline-flex items-center font-medium ${linkClasses} hover:underline`}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Hizmetlere Dön
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  const categoryTitle = categoryTitles[category];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${gradientClasses} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/hizmetler"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Hizmetlere Dön
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {categoryTitle}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Bu kategori altında sunduğumuz profesyonel danışmanlık hizmetleri
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Bu kategoride henüz hizmet bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${cardClasses}`}
                >
                  <div className={`w-16 h-16 ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'} rounded-lg flex items-center justify-center mb-6`}>
                    <CheckCircle className={`h-8 w-8 ${iconClasses}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    to={`/hizmet/${service.id}`}
                    className={`inline-flex items-center text-sm font-medium ${iconClasses} hover:underline`}
                  >
                    Detaylı Bilgi
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
