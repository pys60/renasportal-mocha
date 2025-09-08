import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@/react-app/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { 
      name: 'Hizmetlerimiz', 
      href: '/hizmetler',
      subItems: [
        { name: 'Sürdürülebilirlik', href: '/hizmetler/surdurulebilirlik' },
        { name: 'Sosyal Sorumluluk', href: '/hizmetler/sosyal-sorumluluk' },
        { name: 'ISO Yönetim Sistemleri', href: '/hizmetler/iso-yonetim' },
        { name: 'Süreç İyileştirme', href: '/hizmetler/surec-iyilestirme' },
        { name: 'Kimya & Kozmetik', href: '/hizmetler/kimya-kozmetik' },
        { name: 'Kurumsal Yönetim', href: '/hizmetler/kurumsal-yonetim' },
        { name: 'Yönetim & Mali', href: '/hizmetler/yonetim-mali' }
      ]
    },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  const themeClasses = theme === 'turquoise' 
    ? 'from-cyan-50 to-teal-50 text-gray-900'
    : 'from-gray-50 to-green-50 text-gray-900';

  const headerClasses = theme === 'turquoise'
    ? 'bg-white/95 border-cyan-200'
    : 'bg-white/95 border-gray-300';

  const logoClasses = theme === 'turquoise'
    ? 'text-cyan-600 hover:text-cyan-700'
    : 'text-green-600 hover:text-green-700';

  const linkClasses = theme === 'turquoise'
    ? 'text-gray-700 hover:text-cyan-600 hover:bg-cyan-50'
    : 'text-gray-700 hover:text-green-600 hover:bg-green-50';

  const activeLinkClasses = theme === 'turquoise'
    ? 'text-cyan-600 bg-cyan-50 border-cyan-600'
    : 'text-green-600 bg-green-50 border-green-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${headerClasses}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className={`text-2xl font-bold transition-colors ${logoClasses}`}>
              <img 
                src="https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/logo.png" 
                alt="Renas Akademi" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.subItems ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${
                          location.pathname.startsWith(item.href) ? activeLinkClasses : linkClasses
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      
                      {openDropdown === item.name && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <Link
                            to={item.href}
                            className={`block px-4 py-2 text-sm transition-colors ${linkClasses}`}
                          >
                            Tüm Hizmetler
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                location.pathname === subItem.href ? activeLinkClasses : linkClasses
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${
                        location.pathname === item.href ? activeLinkClasses : linkClasses
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${linkClasses}`}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === item.href ? activeLinkClasses : linkClasses
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            location.pathname === subItem.href ? activeLinkClasses : linkClasses
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className={`bg-white/80 backdrop-blur-md border-t ${theme === 'turquoise' ? 'border-cyan-200' : 'border-gray-300'} mt-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img 
                src="https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/logo.png" 
                alt="Renas Akademi" 
                className="h-8 w-auto mb-4"
              />
              <p className="text-gray-600 leading-relaxed">
                Profesyonel danışmanlık ve eğitim hizmetleri ile kişisel ve kurumsal gelişiminize katkı sağlıyoruz.
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'turquoise' ? 'text-cyan-800' : 'text-green-800'}`}>
                Hızlı Linkler
              </h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`text-gray-600 transition-colors ${theme === 'turquoise' ? 'hover:text-cyan-600' : 'hover:text-green-600'}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'turquoise' ? 'text-cyan-800' : 'text-green-800'}`}>
                İletişim
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: info@renasakademi.com</p>
                <p>Telefon: +90 XXX XXX XX XX</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Renas Akademi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
