
-- SÜRDÜREBİLİRLİK DANIŞMANLIĞI
INSERT INTO services (title, description, icon, sort_order, is_active, created_at, updated_at) VALUES 
('Karbon Ayak İzi Hesaplaması ve Yönetimi', 'Organizasyonunuzun sera gazı emisyonlarını ölçerek karbon ayak izinizi hesaplar, azaltma stratejileri geliştiririz. ISO 14064 standardına uygun raporlama ve doğrulama süreçlerini yönetiriz.', 'Leaf', 1, 1, datetime('now'), datetime('now')),
('Su Ayak İzi Hesaplaması ve Yönetimi', 'İşletmenizin su tüketimini analiz ederek su ayak izini hesaplar, su verimliliği stratejileri geliştiririz. Sürdürülebilir su yönetimi için kapsamlı çözümler sunarız.', 'Droplets', 2, 1, datetime('now'), datetime('now')),
('Ürün Ayak İzi Hesaplaması ve Yönetimi', 'Ürünlerinizin yaşam döngüsü boyunca çevresel etkilerini değerlendirerek ürün ayak izini hesaplar, eko-tasarım önerileri sunarız.', 'Package', 3, 1, datetime('now'), datetime('now')),
('Sürdürülebilirlik Raporu Hazırlanması', 'GRI Standards, SASB ve TCFD çerçevelerine uygun sürdürülebilirlik raporları hazırlayarak şeffaflığınızı artırır, paydaş iletişiminizi güçlendiririz.', 'FileText', 4, 1, datetime('now'), datetime('now')),
('EcoVadis Küresel Kurumsal Sosyal Sorumluluk Derecelendirmesine Hazırlık', 'EcoVadis platform üzerinden tedarik zinciri sürdürülebilirlik değerlendirmelerine hazırlık sürecinde kapsamlı destek sağlarız.', 'Award', 5, 1, datetime('now'), datetime('now')),

-- SOSYAL UYGUNLUK DANIŞMANLIĞI
('SEDEX Danışmanlığı', 'Tedarik zinciri etik ticaret platformu SEDEX üyeliği ve SMETA denetimleri için hazırlık süreçlerinde profesyonel danışmanlık hizmeti veriyoruz.', 'Users', 6, 1, datetime('now'), datetime('now')),
('INDITEX Sosyal Uygunluk Danışmanlığı', 'INDITEX grubunun tedarikçi davranış kurallarına uyum sağlamak için sosyal ve çevresel standartları karşılama konusunda destek veriyoruz.', 'ShoppingBag', 7, 1, datetime('now'), datetime('now')),
('OEKO-TEX Standart Danışmanlığı', 'Tekstil ürünlerinde zararlı madde kontrolü ve sürdürülebilirlik sertifikasyonları için OEKO-TEX standartlarına uyum sürecini yönetiyoruz.', 'Shirt', 8, 1, datetime('now'), datetime('now')),
('AMFORI BSCI Danışmanlığı', 'İş dünyası sosyal uygunluk girişimi AMFORI BSCI davranış kuralları ve denetim süreçlerine hazırlık konusunda uzman desteği sağlıyoruz.', 'Handshake', 9, 1, datetime('now'), datetime('now')),
('Disney & FAMA Danışmanlığı', 'Disney ve FAMA markaları için tedarikçi yeterliliği ve sosyal sorumluluk standartlarına uyum sürecinde kapsamlı danışmanlık hizmeti veriyoruz.', 'Star', 10, 1, datetime('now'), datetime('now')),
('Global Organik Standart Danışmanlığı', 'Organik ürün sertifikasyonu için GOTS (Global Organic Textile Standard) ve diğer uluslararası organik standartlara uyum sürecini destekliyoruz.', 'Sprout', 11, 1, datetime('now'), datetime('now')),
('Global Recycle Standard (GRS) Danışmanlığı', 'Geri dönüştürülmüş malzeme içerikli ürünler için GRS sertifikasyonu sürecinde teknik destek ve uygulamalı eğitim hizmeti sunuyoruz.', 'Recycle', 12, 1, datetime('now'), datetime('now')),

-- YÖNETİM SİSTEMLERİ STANDARTLARI DANIŞMANLIĞI  
('ISO 26000 Sosyal Sorumluluk Yönetim Sistemi', 'Organizasyonların sosyal sorumluluk konularını entegre etmesi için ISO 26000 rehber standardına uygun sistemlerin kurulmasını destekliyoruz.', 'Heart', 13, 1, datetime('now'), datetime('now')),
('ISO 9001 Kalite Yönetim Sistemi', 'Müşteri memnuniyeti odaklı kalite yönetim sistemlerinin kurulması, belgelendirilmesi ve sürekli iyileştirilmesi konusunda uzman danışmanlık hizmeti veriyoruz.', 'CheckCircle', 14, 1, datetime('now'), datetime('now')),
('ISO 13485 Medikal Cihazlar İçin Kalite Yönetim Sistemi', 'Medikal cihaz üreticileri için özel kalite yönetim sistemi gerekliliklerini karşılama ve CE işaretleme süreçlerinde teknik destek sağlıyoruz.', 'Activity', 15, 1, datetime('now'), datetime('now')),
('ISO 14001 Çevre Yönetim Sistemi', 'Çevresel performansın iyileştirilmesi ve çevresel risklerin yönetimi için sistematik yaklaşımların geliştirilmesinde kapsamlı danışmanlık hizmeti sunuyoruz.', 'TreePine', 16, 1, datetime('now'), datetime('now')),
('ISO 22000 Gıda Güvenliği Yönetim Sistemi', 'Gıda zinciri boyunca güvenli gıda üretimi için HACCP tabanlı gıda güvenliği yönetim sistemlerinin kurulması ve yönetimini destekliyoruz.', 'Utensils', 17, 1, datetime('now'), datetime('now')),
('ISO 22716 İyi Üretim Uygulamaları (GMP)', 'Kozmetik ürün üretiminde GMP gerekliliklerinin karşılanması ve kalite güvence sistemlerinin oluşturulması konusunda özelleşmiş danışmanlık veriyoruz.', 'Sparkles', 18, 1, datetime('now'), datetime('now')),
('ISO 27001 Bilgi Güvenliği Yönetim Sistemi', 'Bilgi varlıklarının korunması ve siber güvenlik risklerinin yönetimi için kapsamlı bilgi güvenliği yönetim sistemleri kurmaya odaklanıyoruz.', 'Shield', 19, 1, datetime('now'), datetime('now')),
('ISO 45001 İş Sağlığı ve Güvenliği Yönetim Sistemi', 'İşyeri kazalarının önlenmesi ve güvenli çalışma ortamlarının oluşturulması için sistematik İSG yönetim sistemleri geliştiriyoruz.', 'HardHat', 20, 1, datetime('now'), datetime('now')),
('ISO 50001 Enerji Yönetim Sistemi', 'Enerji performansının iyileştirilmesi ve enerji maliyetlerinin azaltılması için sistematik enerji yönetimi yaklaşımları geliştiriyoruz.', 'Zap', 21, 1, datetime('now'), datetime('now')),
('BRCGS British Retail Consortium Global Standards', 'Gıda güvenliği, ambalaj ve depolama standartları için BRCGS sertifikasyonu süreçlerinde teknik destek ve hazırlık danışmanlığı sunuyoruz.', 'Crown', 22, 1, datetime('now'), datetime('now'));
