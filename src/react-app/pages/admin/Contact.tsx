import { useEffect, useState } from 'react';
import { Mail, MailOpen, Calendar, User } from 'lucide-react';
import AdminLayout from '@/react-app/components/AdminLayout';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import { ContactSubmission } from '@/shared/types';

export default function AdminContact() {
  const { theme } = useTheme();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact-submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/contact-submissions/${id}/read`, { method: 'PUT' });
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    if (!submission.is_read) {
      markAsRead(submission.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const buttonClasses = theme === 'turquoise'
    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
          <p className="text-gray-600 mt-2">
            Gelen mesajları görüntüleyin ve yönetin - 
            <span className="font-semibold"> {submissions.filter(s => !s.is_read).length} okunmamış mesaj</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Mesajlar</h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Henüz mesaj bulunmuyor
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        onClick={() => handleViewSubmission(submission)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedSubmission?.id === submission.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        } ${!submission.is_read ? 'bg-yellow-50' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              {submission.is_read ? (
                                <MailOpen className="h-4 w-4 text-gray-400 mr-2" />
                              ) : (
                                <Mail className="h-4 w-4 text-blue-500 mr-2" />
                              )}
                              <p className={`text-sm font-medium truncate ${
                                !submission.is_read ? 'text-gray-900 font-semibold' : 'text-gray-700'
                              }`}>
                                {submission.name}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {submission.subject || 'Konu yok'}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 mt-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(submission.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Mesaj Detayı</h2>
                    {!selectedSubmission.is_read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Yeni
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Gönderen
                      </label>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedSubmission.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        E-posta
                      </label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <a 
                          href={`mailto:${selectedSubmission.email}`}
                          className={`${theme === 'turquoise' ? 'text-cyan-600 hover:text-cyan-800' : 'text-green-600 hover:text-green-800'} hover:underline`}
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Konu
                    </label>
                    <p className="text-gray-900">
                      {selectedSubmission.subject || 'Konu belirtilmemiş'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tarih
                    </label>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(selectedSubmission.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Mesaj
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedSubmission.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'İletişim Mesajınız'}`}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${buttonClasses}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Yanıtla
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Mesaj Seçin
                </h3>
                <p className="text-gray-500">
                  Görüntülemek için sol taraftan bir mesaj seçin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
