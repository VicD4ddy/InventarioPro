-- Actualización de Configuración SaaS para mayor profundidad funcional
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS system_name TEXT DEFAULT 'InventarioPRO';
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS support_email TEXT DEFAULT 'soporte@inventariopro.com';
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS free_plan_category_limit INTEGER DEFAULT 10;
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS notification_type TEXT DEFAULT 'info';
ALTER TABLE system_config ADD COLUMN IF NOT EXISTS is_notification_active BOOLEAN DEFAULT FALSE;

-- Asegurar que el registro por defecto tenga estos valores (opcional si ya existen con DEFAULT)
UPDATE system_config SET 
    system_name = COALESCE(system_name, 'InventarioPRO'),
    support_email = COALESCE(support_email, 'soporte@inventariopro.com'),
    free_plan_category_limit = COALESCE(free_plan_category_limit, 10),
    notification_type = COALESCE(notification_type, 'info'),
    is_notification_active = COALESCE(is_notification_active, FALSE)
WHERE id = 1;
