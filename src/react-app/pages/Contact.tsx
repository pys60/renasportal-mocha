import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { ContactForm } from '@/shared/types';

export default function Contact() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const gradientClasses = theme === 'turquoise'
    ? 'from-cyan-600 to-teal-600'
    : 'from-gray-600 to-green-600';

  const buttonClasses = theme === 'turquoise'
    ? 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 disabled:bg-cyan-400'
    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400';

  const inputClasses = theme === 'turquoise'
    ? 'focus:ring-cyan-500 focus:border-cyan-500'
    : 'focus:ring-green-500 focus:border-green-500';

  const iconClasses = theme === 'turquoise'
    ? 'text-cyan-600'
    : 'text-green-600';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${gradientClasses} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            İletişim
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçin
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Bizimle İletişime Geçin
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className={`h-6 w-6 ${iconClasses} mt-1`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">E-posta</h3>
                    <p className="text-gray-600">info@renasakademi.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className={`h-6 w-6 ${iconClasses} mt-1`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Telefon</h3>
                    <p className="text-gray-600">+90 XXX XXX XX XX</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className={`h-6 w-6 ${iconClasses} mt-1`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Adres</h3>
                    <p className="text-gray-600">
                      Merkez Mahallesi, Akademi Sokak No: 1<br />
                      34000 İstanbul, Türkiye
                    </p>
                  </div>
                </div>
              </div>

              <div className={`mt-8 p-6 ${theme === 'turquoise' ? 'bg-cyan-50' : 'bg-green-50'} rounded-lg`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Çalışma Saatleri
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi: 09:00 - 15:00</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mesaj Gönderin
              </h2>

              {submitted ? (
                <div className={`p-4 ${theme === 'turquoise' ? 'bg-cyan-50 text-cyan-800' : 'bg-green-50 text-green-800'} rounded-lg`}>
                  <p className="text-center">
                    Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                      <p>{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} transition-colors`}
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} transition-colors`}
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Konu
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} transition-colors`}
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${inputClasses} transition-colors resize-none`}
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-8 py-3 text-white font-semibold rounded-lg transition-colors ${buttonClasses} disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Mesajı Gönder
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
