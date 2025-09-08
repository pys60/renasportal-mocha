import { CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Link } from "react-router-dom";

export default function Services() {
  const { theme } = useTheme();

  

  const cardClasses = theme === 'turquoise'
    ? 'hover:shadow-cyan-100'
    : 'hover:shadow-green-100';

  const iconClasses = theme === 'turquoise'
    ? 'text-cyan-600'
    : 'text-green-600';

  const gradientClasses = theme === 'turquoise'
    ? 'from-cyan-600 to-teal-600'
    : 'from-gray-600 to-green-600';

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${gradientClasses} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Hizmetlerimiz
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Kişisel ve kurumsal gelişiminiz için özel tasarlanmış profesyonel danışmanlık ve eğitim hizmetleri
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Hizmet Kategorilerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı alanlarda sunduğumuz uzman danışmanlık hizmetlerimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Sürdürülebilirlik',
                href: '/hizmetler/surdurulebilirlik',
                description: 'Karbon ayak izi, su ayak izi hesaplaması ve sürdürülebilirlik raporları'
              },
              {
                title: 'Sosyal Sorumluluk',
                href: '/hizmetler/sosyal-sorumluluk',
                description: 'SEDEX, AMFORI BSCI, OEKO-TEX ve diğer sosyal uygunluk standartları'
              },
              {
                title: 'ISO Yönetim Sistemleri',
                href: '/hizmetler/iso-yonetim',
                description: 'ISO 9001, 14001, 45001, 27001 ve diğer yönetim sistemleri'
              },
              {
                title: 'Süreç İyileştirme',
                href: '/hizmetler/surec-iyilestirme',
                description: '5S, Yalın, Kaizen, SMED ve verimlilik artırma uygulamaları'
              },
              {
                title: 'Kimya & Kozmetik',
                href: '/hizmetler/kimya-kozmetik',
                description: 'Kimyasal kayıt, kozmetik bildirim, GMP ve güvenlik değerlendirmeleri'
              },
              {
                title: 'Kurumsal Yönetim',
                href: '/hizmetler/kurumsal-yonetim',
                description: 'Dijital dönüşüm, İK yönetimi, pazarlama ve stratejik planlama'
              },
              {
                title: 'Yönetim & Mali',
                href: '/hizmetler/yonetim-mali',
                description: 'İş sağlığı güvenliği, risk analizi ve acil durum yönetimi'
              }
            ].map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${cardClasses} group`}
              >
                <div className={`w-16 h-16 ${theme === 'turquoise' ? 'bg-cyan-100' : 'bg-green-100'} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <CheckCircle className={`h-8 w-8 ${iconClasses}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {category.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>
                <div className={`inline-flex items-center text-sm font-medium ${iconClasses} group-hover:underline`}>
                  Hizmetleri Görüntüle
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className={`bg-gradient-to-r ${gradientClasses} rounded-2xl p-12 text-center text-white`}>
            <h2 className="text-3xl font-bold mb-4">
              Size Özel Çözüm Arıyor musunuz?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              İhtiyaçlarınızı değerlendirip, size en uygun hizmet paketini birlikte belirleyelim.
            </p>
            <Link
              to="/iletisim"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Ücretsiz Görüşme Talep Et
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
