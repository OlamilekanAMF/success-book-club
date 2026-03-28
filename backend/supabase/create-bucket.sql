-- Only create the bucket (policies already exist)
INSERT INTO storage.buckets (id, name, public)
SELECT 'images', 'images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images');
