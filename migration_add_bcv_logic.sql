-- Migración: Soporte para Tasa de Cambio BCV Dinámica e Histórica
-- Este script permite a cada negocio manejar su propia tasa de referencia y guardarla en el historial.

-- 1. Añadir columna a perfiles para la tasa actual configurada
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bcv_rate NUMERIC DEFAULT 0;

COMMENT ON COLUMN profiles.bcv_rate IS 'Tasa de cambio BCV oficial (Bs/USD) configurada por el usuario.';

-- 2. Añadir columna a movimientos de stock para la tasa histórica
ALTER TABLE stock_movements 
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC DEFAULT 0;

COMMENT ON COLUMN stock_movements.exchange_rate IS 'Tasa de cambio de referencia utilizada en el momento preciso de este movimiento.';

-- 3. Actualizar la función is_admin si fuera necesario (opcional, por si quieres que solo admins actualicen la tasa global en el futuro)
