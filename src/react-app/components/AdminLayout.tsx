import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  Briefcase, 
  Mail, 
  Settings,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '@/react-app/contexts/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Panel', href: '/admin', icon: LayoutDashboard },
    { name: 'Sayfalar', href: '/admin/sayfalar', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: PenTool },
    { name: 'Hizmetler', href: '/admin/hizmetler', icon: Briefcase },
    { name: 'İletişim', href: '/admin/iletisim', icon: Mail },
    { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
  ];

  const sidebarClasses = theme === 'turquoise'
    ? 'bg-cyan-900 text-white'
    : 'bg-gray-800 text-white';

  const linkClasses = theme === 'turquoise'
    ? 'text-cyan-100 hover:bg-cyan-800 hover:text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const activeLinkClasses = theme === 'turquoise'
    ? 'bg-cyan-800 text-white border-r-2 border-cyan-400'
    : 'bg-gray-700 text-white border-r-2 border-green-400';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 ${sidebarClasses} transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://mocha-cdn.com/019923d5-c6c0-7306-868b-90928393b55f/logo.png" 
              alt="Renas Akademi" 
              className="h-8 w-auto"
            />
            <span className="font-semibold">Admin Panel</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href ? activeLinkClasses : linkClasses
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 px-4">
            <Link
              to="/"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${linkClasses}`}
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Siteye Dön
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 h-16 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
