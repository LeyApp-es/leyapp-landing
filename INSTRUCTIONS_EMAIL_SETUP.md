# Configuración de E-mails con Supabase y Resend

Sigue estos pasos para enviar e-mails de bienvenida automáticamente cuando alguien se une a la lista de espera.

## 1. Crear cuenta en Resend

1.  Ve a [Resend.com](https://resend.com) y crea una cuenta gratuita.
2.  Obtén una **API Key**.
    - Copia la clave (empieza por `re_...`).

## 2. Configurar el Secreto en Supabase

Necesitas guardar la API Key de Resend en Supabase para que tu función pueda usarla.

**Opción A: Usando el Dashboard (Más fácil)**
1.  Ve a tu proyecto en [Supabase](https://supabase.com/dashboard).
2.  Ve a **Project Settings** (icono de engranaje) -> **Edge Functions**.
3.  Añade un nuevo secreto:
    - Name: `RESEND_API_KEY`
    - Value: `re_123456...` (tu clave de Resend).

**Opción B: Usando la Terminal (Si tienes Supabase CLI instalado)**
```bash
npx supabase secrets set RESEND_API_KEY=re_123456...
```

## 3. Desplegar la Función

Para subir tu código a la nube de Supabase, ejecuta este comando en tu terminal (en la carpeta del proyecto):

```bash
npx supabase functions deploy send-welcome-email --no-verify-jwt
```
*(Nota: `--no-verify-jwt` es necesario si la función será llamada por un Webhook de Base de Datos, ya que estos no envían un token de usuario autenticado).*

## 4. Crear el Webhook de Base de Datos

Ahora le diremos a Supabase que ejecute esta función cada vez que se añada alguien a la tabla `waitlist`.

1.  Ve al **Database** -> **Webhooks** en el Dashboard de Supabase.
2.  Haz clic en **Create Webhook**.
3.  Configura lo siguiente:
    - **Name**: `send-welcome-email`
    - **Table**: `waitlist`
    - **Events**: Marca `INSERT` (solo queremos enviar el e-mail al crearse).
    - **Type**: `HTTP Request`.
    - **HTTP Method**: `POST`.
    - **URL**: Pega la URL de tu función desplegada. Puedes encontrarla en la sección **Edge Functions** del dashboard `https://<proyecto>.supabase.co/functions/v1/send-welcome-email`.
    - **HTTP Headers**: Añade un header `Authorization` con valor `Bearer <TU_ANON_KEY>` o `Bearer <TU_SERVICE_ROLE_KEY>`.
      *(Recomendado: Usa la Service Role Key si la función necesita permisos elevados, pero para enviar e-mails la Anon Key suele bastar si la función es pública, o mejor aún, configura el header para que coincida con lo que espera tu función).*

### Verificación de Dominio (Importante)
Por defecto, Resend solo te deja enviar e-mails a tu propia dirección de correo para pruebas (`onboarding@resend.dev` -> `tu_email@ejemplo.com`).

Para enviar correos a cualquier usuario (`usuario@gmail.com`), debes verificar tu dominio (`leyapp.es`) en el panel de Resend y actualizar el campo `from` en el archivo `index.ts`.

```typescript
// En supabase/functions/send-welcome-email/index.ts
from: "LeyApp <hola@leyapp.es>", 
```
