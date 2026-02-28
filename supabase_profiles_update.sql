-- 1. Añadir columna is_active a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Actualizar políticas de RLS para profiles
-- Ya tenemos políticas SELECT de admin. Necesitamos asegurar que el usuario normal SOLO vea si está activo? 
-- En realidad, si el usuario está desactivado, el middleware o el auth deberían manejarlo, 
-- pero por ahora permitiremos que el admin cambie este estado.

-- 3. Crear política para UPDATE en profiles por el admin
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" 
ON profiles 
FOR UPDATE
USING (
  (auth.jwt() ->> 'email' = 'admin@gmail.com')
);
