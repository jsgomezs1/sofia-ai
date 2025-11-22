# Tabla de Usuarios - Configuración Supabase

## SQL para crear la tabla `user`

Ejecuta este SQL en el editor SQL de tu proyecto Supabase:

```sql
create table public.user (
  id bigserial not null,
  name text not null,
  phone_number character varying(20) not null,
  constraint user_pkey primary key (id)
) TABLESPACE pg_default;
```

## Descripción de la tabla

Esta tabla almacena la información básica de los usuarios que inician entrevistas técnicas.

### Campos:

- **id** (bigserial): Identificador único del usuario, generado automáticamente
- **name** (text): Nombre completo del usuario (requerido)
- **phone_number** (varchar(20)): Número de teléfono del usuario (requerido)

## Políticas de Seguridad (RLS) - Opcional

Si deseas habilitar Row Level Security para mayor seguridad, ejecuta:

```sql
-- Habilitar RLS
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Permitir inserción pública (para que los usuarios puedan registrarse)
CREATE POLICY "Enable insert for all users" ON public.user
  FOR INSERT
  WITH CHECK (true);

-- Permitir lectura pública (ajusta según tus necesidades)
CREATE POLICY "Enable read access for all users" ON public.user
  FOR SELECT
  USING (true);
```

## Índices Recomendados (Opcional)

Para mejorar el rendimiento en búsquedas:

```sql
-- Índice en phone_number si necesitas buscar por teléfono
CREATE INDEX idx_user_phone_number ON public.user(phone_number);

-- Índice en name si necesitas buscar por nombre
CREATE INDEX idx_user_name ON public.user(name);
```

## Datos de Prueba (Opcional)

Para probar la funcionalidad:

```sql
INSERT INTO public.user (name, phone_number) VALUES
  ('Juan Pérez', '+1 (555) 123-4567'),
  ('María García', '+52 55 1234 5678'),
  ('Carlos López', '+34 91 123 45 67');
```

## Validación de Datos (Opcional)

Si deseas agregar validaciones adicionales:

```sql
-- Asegurar que el nombre no esté vacío
ALTER TABLE public.user 
  ADD CONSTRAINT check_name_not_empty 
  CHECK (length(trim(name)) > 0);

-- Asegurar que el teléfono no esté vacío
ALTER TABLE public.user 
  ADD CONSTRAINT check_phone_not_empty 
  CHECK (length(trim(phone_number)) > 0);
```

## Integración con la Aplicación

La aplicación ahora:
1. ✅ Solicita nombre y teléfono antes de iniciar la entrevista
2. ✅ Valida que ambos campos estén completos
3. ✅ Guarda los datos en Supabase antes de iniciar la llamada
4. ✅ Muestra errores si la inserción falla
5. ✅ Incluye validación en el System Check

## Verificación

Después de crear la tabla, puedes verificar que funciona:

1. Inicia tu aplicación: `npm run dev`
2. Completa el formulario con nombre y teléfono
3. Selecciona un tech stack
4. Haz clic en "Start Interview"
5. Verifica en Supabase (Table Editor) que el registro se haya creado

## Próximos Pasos Sugeridos

- **Agregar campo de email** para notificaciones
- **Crear relación** entre `user` y las entrevistas realizadas
- **Implementar validación** de formato de teléfono
- **Agregar timestamps** para tracking (created_at, updated_at)
- **Prevenir duplicados** con constraint UNIQUE en phone_number si es necesario

