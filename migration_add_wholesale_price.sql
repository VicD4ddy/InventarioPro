-- Migración: Añadir Precio de Venta al Mayor
-- Ejecutar en el SQL Editor de Supabase

-- 1. Añadir la columna a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS wholesale_price DECIMAL(12,2) DEFAULT 0;

-- 2. Añadir comentario descriptivo
COMMENT ON COLUMN products.wholesale_price IS 'Precio de venta para clientes mayoristas o compras por volumen.';
