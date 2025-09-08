import { Palette, Check } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { Theme } from '@/shared/types';

export default function AdminSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'turquoise' as Theme,
      name: 'Turkuaz Tema',
      description: 'Logonun renklerine uygun modern turkuaz tema',
      colors: ['bg-cyan-500', 'bg-teal-600', 'bg-cyan-100'],
      preview: 'from-cyan-50 to-teal-50'
    },
    {
      value: 'gray-green' as Theme,
      name: 'Gri-Yeşil Tema',
      description: 'Profesyonel gri ve yeşil tonlarının hakim olduğu tema',
      colors: ['bg-gray-500', 'bg-green-600', 'bg-gray-100'],
      preview: 'from-gray-50 to-green-50'
    }
  ];

  const handleThemeChange = async (newTheme: Theme) => {
    await setTheme(newTheme);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tema Ayarları</h1>
          <p className="text-gray-600 mt-2">Web sitenizin görünümünü özelleştirin</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Palette className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Renk Teması</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((themeOption) => (
              <div
                key={themeOption.value}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                  theme === themeOption.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeChange(themeOption.value)}
              >
                {theme === themeOption.value && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className={`h-20 rounded-lg mb-4 bg-gradient-to-br ${themeOption.preview}`}></div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {themeOption.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {themeOption.description}
                </p>

                <div className="flex space-x-2">
                  {themeOption.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full ${color} border border-gray-300`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Tema Özellikleri</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tema değişikliği anında tüm siteye yansır</li>
              <li>• Renkler header, butonlar, linkler ve vurgularda kullanılır</li>
              <li>• Mobil uyumlu ve erişilebilir tasarım</li>
              <li>• Profesyonel görünüm ve kullanıcı deneyimi</li>
            </ul>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tema Önizleme</h2>
          <div className={`p-6 rounded-lg bg-gradient-to-br ${themes.find(t => t.value === theme)?.preview}`}>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'turquoise' ? 'text-cyan-800' : 'text-green-800'}`}>
                Örnek Başlık
              </h3>
              <p className="text-gray-600 mb-4">
                Bu, seçili tema ile nasıl görüneceğinizin bir örneğidir.
              </p>
              <button className={`px-4 py-2 rounded-lg text-white font-semibold ${theme === 'turquoise' ? 'bg-cyan-600' : 'bg-green-600'}`}>
                Örnek Buton
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
