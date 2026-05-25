# Credenciales y Configuración de Entornos

Este documento contiene las credenciales de desarrollo por defecto y la configuración recomendada para los diferentes roles del sistema.

> [!WARNING]
> Estas credenciales son de uso exclusivo para desarrollo local y entornos de staging. Nunca uses contraseñas por defecto en producción.

## Roles del Sistema y Cuentas de Prueba

El sistema de gestión de gimnasio viene pre-configurado para soportar los siguientes roles principales. Al ejecutar los Seeders de la base de datos se crearán estas cuentas de prueba:

| Rol | Correo Electrónico | Contraseña | Permisos Clave |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@fitflow.com` | `admin123` | Control total del sistema, configuración, reportes financieros. |
| **Recepcionista** | `recepcion@fitflow.com` | `recep123` | Gestión de clientes, check-in, cobro de membresías, asistencia. |
| **Entrenador** | `coach@fitflow.com` | `coach123` | Creación de rutinas, seguimiento de clientes asignados. |
| **Cliente (Ejemplo)** | `cliente@fitflow.com` | `client123` | Ver su perfil, código QR para asistencia, ver rutinas asignadas. |

## Variables de Entorno y Conexiones

### Base de Datos (PostgreSQL en Docker)

- **Host:** `localhost` (o `db` desde dentro de la red de Docker)
- **Puerto:** `5432`
- **Base de Datos:** `fitflow_gym`
- **Usuario:** `fitflow_admin`
- **Contraseña:** `fitflow_secure_password`

### Frontend (React + Vite)

Para conectar el Frontend con la API en desarrollo, crea un archivo `.env` en la raíz de la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_HOST=localhost
VITE_WS_PORT=8080
VITE_WS_SCHEME=ws
```

### Backend (Laravel API)

El archivo `.env` en la raíz de `backend/` debe incluir las siguientes configuraciones clave:

```env
APP_NAME="FitFlow API"
APP_ENV=local
APP_KEY=base64:PLACEHOLDER_KEY_GENERATED_BY_ARTISAN
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1 # Cambiar a 'db' si se ejecuta dentro de docker-compose
DB_PORT=5432
DB_DATABASE=fitflow_gym
DB_USERNAME=fitflow_admin
DB_PASSWORD=fitflow_secure_password

BROADCAST_DRIVER=reverb # Preparado para WebSockets de Laravel Reverb
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Reverb (Laravel 11+ WebSockets)
REVERB_APP_ID=fitflow-app
REVERB_APP_KEY=fitflow-key-12345
REVERB_APP_SECRET=fitflow-secret-54321
REVERB_HOST="0.0.0.0"
REVERB_PORT=8080
REVERB_SCHEME=http
```
