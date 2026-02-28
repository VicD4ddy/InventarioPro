-- SQL de Seguridad Total: Llaves Foráneas, RLS y Aislamiento de Negocios
-- Ejecutar en el SQL Editor de Supabase para blindar la privacidad de los datos.

-- 1. Establecer llaves foráneas para JOINS estables (Admin Activity)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_stock_movements_profiles') THEN
        ALTER TABLE stock_movements ADD CONSTRAINT fk_stock_movements_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_products_profiles') THEN
        ALTER TABLE products ADD CONSTRAINT fk_products_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Función Central de Seguridad (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Limpiar y Recrear Políticas por Tabla (BLINDAJE TOTAL)

-- TABLA: PROFILES (AISLAMIENTO DE USUARIO)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- TABLA: PRODUCTS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all products" ON products FOR SELECT USING (is_admin());

-- TABLA: STOCK_MOVEMENTS
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own stock movements" ON stock_movements;
DROP POLICY IF EXISTS "Admins can view all stock movements" ON stock_movements;
CREATE POLICY "Users can view own stock movements" ON stock_movements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all stock movements" ON stock_movements FOR SELECT USING (is_admin());

-- TABLA: CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
DROP POLICY IF EXISTS "Admins can view all categories" ON categories;
CREATE POLICY "Users can view own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all categories" ON categories FOR ALL USING (is_admin());

-- TABLA: SUPPLIERS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
CREATE POLICY "Users can view own suppliers" ON suppliers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all suppliers" ON suppliers FOR ALL USING (is_admin());

-- TABLA: NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all notifications" ON notifications FOR ALL USING (is_admin());

-- TABLA: KPI_SNAPSHOTS (Estadísticas del Dashboard)
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own snapshots" ON kpi_snapshots;
DROP POLICY IF EXISTS "Admins can view all snapshots" ON kpi_snapshots;
CREATE POLICY "Users can view own snapshots" ON kpi_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all snapshots" ON kpi_snapshots FOR SELECT USING (is_admin());
