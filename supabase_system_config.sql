-- 1. Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    global_notification_message TEXT DEFAULT NULL,
    free_plan_product_limit INTEGER DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insertar configuración por defecto si no existe
INSERT INTO system_config (id, maintenance_mode, free_plan_product_limit)
VALUES (1, FALSE, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- 4. Política: Solo los Admins pueden EDITAR la configuración
CREATE POLICY "Admins can update system_config" 
ON system_config 
FOR UPDATE
USING (
  (auth.jwt() ->> 'email' = 'admin@gmail.com')
);

-- 5. Política: Todos los usuarios (y públicos) pueden VER la configuración si es necesario (ej. para el modo mantenimiento)
CREATE POLICY "Everyone can view system_config" 
ON system_config 
FOR SELECT 
USING (true);
