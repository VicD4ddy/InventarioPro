-- 1. Eliminar políticas que pueden causar recursión (referenciando a la propia tabla 'profiles' en la política de 'profiles')
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all products" ON products;

-- 2. Crear una política para 'profiles' que use auth.jwt() para evitar recursión
-- Nota de Antigravity: auth.jwt() es más eficiente y seguro para roles
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  (auth.jwt() ->> 'email' = 'admin@gmail.com')
  OR (auth.uid() = id)
);

-- 3. Crear política para 'products'
CREATE POLICY "Admins can view all products" 
ON products 
FOR SELECT 
USING (
  (auth.jwt() ->> 'email' = 'admin@gmail.com')
  OR (auth.uid() = user_id)
);

-- 4. Asegurar que RLS esté habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
