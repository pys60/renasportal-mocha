import { useEffect, useState } from 'react';
import Layout from '@/react-app/components/Layout';
import { Page } from '@/shared/types';
import { Loader2 } from 'lucide-react';

export default function About() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/pages/about');
        if (response.ok) {
          const data = await response.json();
          setPage(data);
        }
      } catch (error) {
        console.error('Failed to fetch about page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {page?.title || 'Hakkımızda'}
          </h1>
          <div className="prose prose-lg max-w-none">
            {page?.content ? (
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            ) : (
              <div className="text-gray-600 space-y-6">
                <p>
                  Renas Akademi olarak, bireylerin ve kurumların potansiyellerini keşfetmelerine ve hedeflerine ulaşmalarına yardımcı oluyoruz. Uzman kadromuz ve kanıtlanmış metodlarımızla, kişiselleştirilmiş danışmanlık ve eğitim hizmetleri sunuyoruz.
                </p>
                <p>
                  Misyonumuz, her bireyin ve kurumun kendine özgü ihtiyaçlarını anlayarak, en uygun çözümleri sunmaktır. Vizyonumuz ise, danışmanlık ve eğitim alanında öncü olmak ve toplumsal gelişime katkı sağlamaktır.
                </p>
                <p>
                  Değerlerimiz arasında dürüstlük, profesyonellik, sürekli gelişim ve müşteri memnuniyeti yer alır. Bu değerlerle hareket ederek, size en kaliteli hizmeti sunmayı taahhüt ediyoruz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
