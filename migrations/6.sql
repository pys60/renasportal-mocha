
ALTER TABLE services ADD COLUMN category TEXT;

UPDATE services SET category = 'SÜRDÜRÜLEBİLİRLİK' WHERE title LIKE '%KARBON AYAK İZİ%' OR title LIKE '%SU AYAK İZİ%' OR title LIKE '%ÜRÜN AYAK İZİ%' OR title LIKE '%SÜRDÜRÜLEBİLİRLİK RAPORU%' OR title LIKE '%ECOVADIS%';

UPDATE services SET category = 'SOSYAL SORUMLULUK VE UYGUNLUK' WHERE title LIKE '%SEDEX%' OR title LIKE '%INDITEX%' OR title LIKE '%OEKO-TEX%' OR title LIKE '%AMFORI BSCI%' OR title LIKE '%DISNEY%' OR title LIKE '%GLOBAL ORGANİK%' OR title LIKE '%GLOBAL RECYCLE%';

UPDATE services SET category = 'ISO YÖNETİM SİSTEMLERİ' WHERE title LIKE '%ISO %' OR title LIKE '%BRCGS%';

UPDATE services SET category = 'SÜREÇ İYİLEŞTİRME UYGULAMALARI' WHERE title LIKE '%5S%' OR title LIKE '%YALIN%' OR title LIKE '%KAİZEN%' OR title LIKE '%SMED%' OR title LIKE '%TOPLAM VERİMLİ%' OR title LIKE '%TOPLAM KALİTE%';

UPDATE services SET category = 'KİMYA&KOZMETİK&TÜKETİCİ ÜRÜNLERİ DANIŞMANLIĞI' WHERE title LIKE '%GMP%' OR title LIKE '%BİYOSİDAL%' OR title LIKE '%MSDS%' OR title LIKE '%ETİKET%' OR title LIKE '%KKDİK%' OR title LIKE '%KOZMETİK%' OR title LIKE '%REACH%' OR title LIKE '%SINIFLANDIRMA%' OR title LIKE '%TDS%';

UPDATE services SET category = 'KURUMSAL YÖNETİM VE GELİŞİM DANIŞMANLIĞI' WHERE title LIKE '%DİJİTAL DÖNÜŞÜM%' OR title LIKE '%İNSAN KAYNAKLARI%' OR title LIKE '%PAZARLAMA%' OR title LIKE '%SÜREÇ ANALİZİ%' OR title LIKE '%SATIN ALMA%' OR title LIKE '%STRATEJİK PLANLAMA%' OR title LIKE '%KALİTE SİSTEMLERİ%' OR title LIKE '%TURQUALITY%';

UPDATE services SET category = 'YÖNETİM VE MALİ DANIŞMANLIK' WHERE title LIKE '%İŞ SAĞLIĞI%' OR title LIKE '%ACİL DURUM%' OR title LIKE '%YANGIN%' OR title LIKE '%TAHLİYE%' OR title LIKE '%KAZA%' OR title LIKE '%RİSK ANALİZİ%' OR title LIKE '%ATEX%' OR title LIKE '%MAKİNE RİSK%' OR title LIKE '%DAVRANIŞ ODAKLI%';
