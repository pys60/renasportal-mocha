import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { BlogPost } from '@/shared/types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.is_published) {
            setPost(data);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const linkClasses = theme === 'turquoise'
    ? 'text-cyan-600 hover:text-cyan-700'
    : 'text-green-600 hover:text-green-700';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Blog yazısı bulunamadı
            </h1>
            <Link
              to="/blog"
              className={`inline-flex items-center font-medium ${linkClasses} hover:underline`}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Blog'a Dön
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/blog"
          className={`inline-flex items-center font-medium ${linkClasses} hover:underline mb-8`}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Blog'a Dön
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover"
            />
          )}
          
          <div className="p-8 lg:p-12">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(post.created_at)}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              {post.title}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-gray-600">İçerik henüz eklenmemiş.</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}
