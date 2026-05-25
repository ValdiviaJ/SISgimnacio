# Guía de Despliegue (Deployment Guide)

Esta guía detalla los pasos para desplegar la arquitectura desacoplada de **FitFlow SaaS** en entornos de producción.

## Arquitectura de Producción

En producción, la arquitectura recomendada consiste en:
1. **Frontend (React)**: Compilado estáticamente (`dist/`) y servido mediante un servidor web de alta velocidad (Nginx, Vercel, Netlify o Cloudflare Pages).
2. **Backend (Laravel API)**: Ejecutado en un contenedor Docker con PHP-FPM o mediante un servicio administrado (Render, Railway, Heroku, AWS ECS).
3. **Base de Datos (PostgreSQL)**: Un servicio PostgreSQL administrado como Supabase, AWS RDS, o en el mismo proveedor de hosting.

---

## Opción 1: Despliegue Completo con Docker Compose (Servidor Propio / VPS)

Si cuentas con un servidor virtual privado (VPS) como DigitalOcean, Linode o AWS EC2, puedes usar la configuración de Docker incluida:

1. **Clonar el proyecto** en el servidor.
2. **Preparar las variables de entorno** para producción:
   - Crear `/backend/.env` configurando `APP_ENV=production`, `APP_DEBUG=false`, y las credenciales de base de datos seguras.
   - Crear `/frontend/.env` apuntando a la URL del dominio de producción.
3. **Construir y levantar la imagen de producción**:
   ```bash
   docker-compose --profile prod up --build -d
   ```
   *Nota: El perfil `prod` activa el servicio `webserver` (Nginx) que sirve el frontend y redirige las peticiones `/api` al backend automáticamente.*

---

## Opción 2: Despliegue Desacoplado en Plataformas Cloud (Recomendado)

### 1. Despliegue del Frontend (React + Vite)
Recomendado en **Vercel**, **Netlify**, o **Render**.

- **Directorio Raíz**: `frontend/`
- **Comando de Build**: `npm run build`
- **Directorio de salida**: `dist`
- **Variables de Entorno**:
  - `VITE_API_URL`: URL pública de tu API de Laravel (ej. `https://api.tu-gimnasio.com/api`).
  - `VITE_WS_HOST`: URL pública de tu servicio WebSockets.

### 2. Despliegue del Backend (Laravel API)
Recomendado en **Railway** o **Render** usando Docker.

- **Directorio Raíz**: `backend/`
- **Archivo Docker**: Puedes configurar el Dockerfile del backend en `/backend/Dockerfile`.
- **Configuración de Render / Railway**:
  - Detectará automáticamente el `composer.json` y levantará un servicio PHP.
  - Asegúrate de habilitar las extensiones `pdo_pgsql` y `pgsql`.
- **Variables de Entorno en el Panel**:
  - Asegúrate de configurar `APP_KEY` con un valor seguro (`php artisan key:generate`).
  - `DB_CONNECTION=pgsql`
  - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` apuntando a tu PostgreSQL de producción.
  - `APP_ENV=production`
  - `APP_DEBUG=false`

### 3. Base de Datos (PostgreSQL)
- Crea una instancia de base de datos PostgreSQL en tu proveedor (ej. Supabase, Railway o Render).
- Introduce las credenciales en la configuración de la variable de entorno del backend de Laravel.
- Ejecuta las migraciones en tu pipeline de CI/CD:
  ```bash
  php artisan migrate --force
  ```

---

## Configuración de CORS en Laravel para Producción

En producción, asegúrate de editar el archivo `backend/config/cors.php` para restringir los orígenes permitidos únicamente al dominio de tu Frontend:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'https://tu-gimnasio.com'),
],
```
