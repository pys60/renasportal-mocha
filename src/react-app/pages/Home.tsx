import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Building,
  Briefcase,
  Shield,
  Lightbulb,
  BarChart3,
  Globe
} from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Service } from '@/shared/types';

export default function Home() {
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data.filter((service: Service) => service.is_active).slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  const gradientClasses = theme === 'turquoise'
    ? 'from-slate-900 via-cyan-900 to-teal-800'
    : 'from-slate-900 via-gray-800 to-green-800';

  const buttonClasses = theme === 'turquoise'
    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-cyan-500/25'
    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25';

  const accentColor = theme === 'turquoise' ? 'cyan' : 'green';

  const serviceIcons = [
    Shield, Building, TrendingUp, Users, Briefcase, Globe
  ];

  const expertiseAreas = [
    {
      icon: Target,
      title: 'Stratejik Danışmanlık',
      description: 'Kurumsal hedeflerinizi belirlemek ve başarmak için profesyonel rehberlik'
    },
    {
      icon: BarChart3,
      title: 'Süreç Optimizasyonu',
      description: 'İş süreçlerinizi iyileştirerek verimliliği maksimuma çıkarma'
    },
    {
      icon: Lightbulb,
      title: 'İnovasyon Yönetimi',
      description: 'Değişen pazar koşullarına uyum ve yenilikçi çözümler geliştirme'
    },
    {
      icon: Users,
      title: 'İnsan Kaynakları',
      description: 'Ekip gelişimi ve kurumsal kültür oluşturma konularında uzmanlaşma'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`relative min-h-screen bg-gradient-to-br ${gradientClasses} text-white overflow-hidden`}>
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/hero-corporate.jpg')`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className={`inline-flex items-center px-4 py-2 bg-${accentColor}-500/20 backdrop-blur-sm rounded-full border border-${accentColor}-400/30`}>
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Profesyonel Danışmanlık Hizmetleri</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block">Kurumsal</span>
                  <span className={`block bg-gradient-to-r from-${accentColor}-400 to-${accentColor}-300 bg-clip-text text-transparent`}>
                    Mükemmelliği
                  </span>
                  <span className="block">Hedefleyin</span>
                </h1>
              </div>
              
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Endüstri lideri danışmanlık deneyimimiz ile kurumunuzun potansiyelini ortaya çıkarıyor, 
                sürdürülebilir büyüme ve başarı için stratejik çözümler sunuyoruz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/hizmetler"
                  className={`group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1`}
                >
                  Hizmetlerimizi Keşfedin
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/iletisim"
                  className={`inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm`}
                >
                  Ücretsiz Konsültasyon
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-gray-300">Başarılı Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-gray-300">Yıl Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">%98</div>
                  <div className="text-sm text-gray-300">Müşteri Memnuniyeti</div>
                </div>
              </div>
            </div>

            {/* Right side - Corporate imagery */}
            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-600/20 rounded-3xl blur-xl transform rotate-6"></div>
                <img 
                  src="https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/consultation-meeting.jpg"
                  alt="Professional Consultation"
                  className="relative z-10 rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center px-4 py-2 bg-${accentColor}-100 text-${accentColor}-800 rounded-full mb-6`}>
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Uzmanlık Alanlarımız</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Profesyonel Çözümler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Yılların deneyimi ve sektörel uzmanlığımız ile kurumunuzun her alanında 
              profesyonel destek sağlıyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertiseAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br from-${accentColor}-100 to-${accentColor}-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 text-${accentColor}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center px-4 py-2 bg-${accentColor}-100 text-${accentColor}-800 rounded-full mb-6`}>
              <Building className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Hizmet Portföyümüz</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kapsamlı Danışmanlık
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ISO standartlarından sürdürülebilirlik yönetimine, kurumsal gelişimden 
              süreç optimizasyonuna kadar geniş yelpazede hizmet sunuyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br from-${accentColor}-100 to-${accentColor}-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 text-${accentColor}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className={`text-${accentColor}-600 font-semibold group-hover:text-${accentColor}-700 transition-colors`}>
                      Detayları İncele →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/hizmetler"
              className={`group inline-flex items-center px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${buttonClasses}`}
            >
              Tüm Hizmetleri Görüntüle
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Excellence */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div 
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/corporate-building.jpg')`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className={`inline-flex items-center px-4 py-2 bg-${accentColor}-100 text-${accentColor}-800 rounded-full mb-6`}>
                <Star className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Neden Renas Akademi?</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Kurumsal Mükemmellikte
                <span className={`block text-${accentColor}-600`}>Güvenilir Partner</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Sektörde edindiğimiz derin deneyim ve kanıtlanmış başarı hikayelerimiz ile 
                kurumunuzun hedeflerine ulaşması için gerekli tüm desteği sağlıyoruz.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Award,
                    title: 'Sektör Liderliği',
                    description: '15+ yıllık deneyim ve 500+ başarılı proje ile sektörde lider konumdayız'
                  },
                  {
                    icon: Users,
                    title: 'Uzman Kadro',
                    description: 'Alanında uzman, sertifikalı danışmanlardan oluşan güçlü ekibimiz'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Kanıtlanmış Başarı',
                    description: 'Müşterilerimizin %98\'i ile uzun vadeli partnerlik ilişkisi kuruyoruz'
                  },
                  {
                    icon: Shield,
                    title: 'Güvenilir Çözümler',
                    description: 'ISO standartlarına uygun, sürdürülebilir ve ölçeklenebilir çözümler'
                  }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className={`w-12 h-12 bg-${accentColor}-100 rounded-lg flex items-center justify-center group-hover:bg-${accentColor}-200 transition-colors duration-300`}>
                        <IconComponent className={`h-6 w-6 text-${accentColor}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/professional-team.jpg"
                alt="Professional Team"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${accentColor}-100 rounded-full flex items-center justify-center`}>
                    <CheckCircle className={`h-6 w-6 text-${accentColor}-600`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Başarılı Proje</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/corporate-abstract.jpg')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className={`inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30`}>
              <Target className="h-4 w-4 mr-2 text-white" />
              <span className="text-sm font-medium text-white">Başarınız Için Hazırız</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Kurumsal Hedeflerinizi
              <span className={`block text-${accentColor}-400`}>Gerçekleştirin</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
              Uzman danışmanlarımız ile ücretsiz strateji görüşmesi yapmak ve 
              kurumunuz için özel çözümleri keşfetmek için hemen iletişime geçin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/iletisim"
                className="group inline-flex items-center px-10 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
              >
                Ücretsiz Konsültasyon Başlat
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/hakkimizda"
                className="inline-flex items-center px-10 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
              >
                Hakkımızda Daha Fazla Bilgi
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24h</div>
                <div className="text-gray-300">Hızlı Geri Dönüş</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-300">Sınırsız Destek</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">%100</div>
                <div className="text-gray-300">Özelleştirilmiş Çözüm</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
