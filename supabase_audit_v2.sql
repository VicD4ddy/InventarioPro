-- Migración para Auditoría Avanzada v2
-- Ejecutar en el SQL Editor de Supabase

-- 1. Añadir columna para registrar el stock antes del movimiento
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS stock_before INTEGER;

-- 2. Asegurar que unit_cost existe (ya debería existir según los tipos, pero por seguridad)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stock_movements' AND column_name='unit_cost') THEN
        ALTER TABLE stock_movements ADD COLUMN unit_cost DECIMAL(12,2);
    END IF;
END $$;

-- 3. Comentario descriptivo para la tabla
COMMENT ON COLUMN stock_movements.stock_before IS 'Cantidad de stock existente justo antes de este movimiento.';
COMMENT ON COLUMN stock_movements.stock_after IS 'Cantidad de stock resultante después de aplicar este movimiento.';
COMMENT ON COLUMN stock_movements.unit_cost IS 'Costo unitario del producto en el momento del movimiento para cálculo de valoración histórica.';
