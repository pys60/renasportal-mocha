import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Phone, Mail } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Service } from '@/shared/types';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        const foundService = data.find((s: Service) => s.id === parseInt(id) && s.is_active);
        
        if (foundService) {
          setService(foundService);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const gradientClasses = theme === 'turquoise'
    ? 'from-cyan-600 to-teal-600'
    : 'from-gray-600 to-green-600';

  const buttonClasses = theme === 'turquoise'
    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

  const linkClasses = theme === 'turquoise'
    ? 'text-cyan-600 hover:text-cyan-700'
    : 'text-green-600 hover:text-green-700';

  const iconClasses = theme === 'turquoise'
    ? 'text-cyan-600'
    : 'text-green-600';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Hizmet bulunamadı
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

  // Kategori slug'ını oluştur
  const getCategorySlug = (category: string) => {
    const categoryMappings: { [key: string]: string } = {
      'SÜRDÜRÜLEBİLİRLİK': 'surdurulebilirlik',
      'SOSYAL SORUMLULUK VE UYGUNLUK': 'sosyal-sorumluluk',
      'ISO YÖNETİM SİSTEMLERİ': 'iso-yonetim',
      'SÜREÇ İYİLEŞTİRME UYGULAMALARI': 'surec-iyilestirme',
      'KİMYA&KOZMETİK&TÜKETİCİ ÜRÜNLERİ DANIŞMANLIĞI': 'kimya-kozmetik',
      'KURUMSAL YÖNETİM VE GELİŞİM DANIŞMANLIĞI': 'kurumsal-yonetim',
      'YÖNETİM VE MALİ DANIŞMANLIK': 'yonetim-mali'
    };
    return categoryMappings[category] || 'hizmetler';
  };

  const categorySlug = service.category ? getCategorySlug(service.category) : 'hizmetler';
  const backUrl = service.category ? `/hizmetler/${categorySlug}` : '/hizmetler';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to={backUrl}
          className={`inline-flex items-center font-medium ${linkClasses} hover:underline mb-8`}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {service.category ? service.category : 'Hizmetlere'} Dön
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${gradientClasses} text-white p-8 lg:p-12`}>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {service.title}
                </h1>
                {service.category && (
                  <p className="text-white/80 mt-2">
                    {service.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Hizmet Detayları
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description || 'Bu hizmet hakkında detaylı bilgi için lütfen bizimle iletişime geçin.'}
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Neden Renas Akademi?
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${iconClasses} mt-0.5 mr-3 flex-shrink-0`} />
                      15+ yıllık saha tecrübesi
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${iconClasses} mt-0.5 mr-3 flex-shrink-0`} />
                      Uluslararası deneyim ve güçlü referanslar
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${iconClasses} mt-0.5 mr-3 flex-shrink-0`} />
                      Uzman mühendis kadromuz
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${iconClasses} mt-0.5 mr-3 flex-shrink-0`} />
                      Müşteri odaklı çözüm yaklaşımı
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${iconClasses} mt-0.5 mr-3 flex-shrink-0`} />
                      Sürekli takip ve destek
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Card */}
              <div className="lg:col-span-1">
                <div className={`${theme === 'turquoise' ? 'bg-cyan-50' : 'bg-green-50'} rounded-lg p-6`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Bu Hizmet İçin İletişime Geçin
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <Phone className={`h-5 w-5 ${iconClasses} mr-3`} />
                      <span className="text-gray-700">+90 XXX XXX XX XX</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className={`h-5 w-5 ${iconClasses} mr-3`} />
                      <span className="text-gray-700">info@renasakademi.com</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/iletisim"
                      className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${buttonClasses}`}
                    >
                      Teklif Al
                    </Link>
                    <a
                      href="mailto:info@renasakademi.com?subject=Hizmet Talebi: {service.title}"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                    >
                      E-posta Gönder
                    </a>
                  </div>
                </div>

                {service.category && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Diğer {service.category} Hizmetleri
                    </h4>
                    <Link
                      to={`/hizmetler/${categorySlug}`}
                      className={`text-sm ${linkClasses} hover:underline`}
                    >
                      Tüm hizmetleri görüntüle →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
