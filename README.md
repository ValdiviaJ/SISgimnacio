# FitFlow - Sistema de Gestión para Gimnasios (SaaS)

FitFlow es un sistema moderno, responsivo y escalable diseñado para la administración integral de gimnasios, centros de fitness y boxes de entrenamiento. Utiliza una arquitectura completamente desacoplada con el fin de proporcionar alto rendimiento, facilidad de despliegue y desarrollo ágil.

## Stack Tecnológico

- **Frontend**: React (Vite) + TailwindCSS + React Router v6 + Axios + Context API/Zustand.
- **Backend**: Laravel API (PHP 8.2+) estructurado con el patrón de diseño Controller-Service-Repository.
- **Base de Datos**: PostgreSQL 15.
- **Tiempo Real**: Preparado para WebSockets con Laravel Reverb / Soketi.
- **Orquestación**: Docker y Docker Compose para desarrollo y producción.

---

## Estructura del Proyecto

El repositorio está organizado en dos componentes principales:

```text
Sistema_Gimnacio/
├── backend/                  # Laravel API (Servidor de base de datos y negocio)
├── frontend/                 # Aplicación React + Vite + TailwindCSS (Interfaz SaaS)
├── docker-compose.yml        # Configuración de servicios locales (Postgres, Laravel, React)
├── nginx.conf                # Configuración de Nginx para producción
├── Dockerfile                # Dockerfile multi-stage para servir el frontend
├── credenciales.md           # Cuentas de prueba preconfiguradas y variables de entorno
└── deployment_guide.md       # Guía paso a paso para despliegue en producción
```

---

## Requisitos Previos

Asegúrate de tener instalado en tu sistema local:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [Node.js v20+](https://nodejs.org/) (opcional, para desarrollo sin Docker)
3. [Composer](https://getcomposer.org/) & [PHP 8.2](https://www.php.net/) (opcional, para desarrollo sin Docker)

---

## Inicio Rápido (Con Docker)

La forma más rápida de levantar todo el entorno de desarrollo (Base de datos PostgreSQL, Laravel API y React Frontend) es utilizando Docker Compose:

1. **Levantar los servicios**:
   ```bash
   docker-compose up -d
   ```
   *Este comando construirá y levantará los contenedores. Instalará automáticamente las dependencias de Composer, Node.js y ejecutará las migraciones de la base de datos.*

2. **Acceder a los servicios**:
   - **Frontend (Desarrollo)**: `http://localhost:3000` (con recarga rápida en vivo).
   - **Backend API**: `http://localhost:8000/api`
   - **WebSockets / Reverb**: `http://localhost:8080`

3. **Detener los servicios**:
   ```bash
   docker-compose down
   ```

---

## Módulos Preparados

El sistema cuenta con la estructura lista para implementar los siguientes módulos:
1. **Autenticación**: Roles integrados (Administrador, Recepcionista, Entrenador, Cliente) con Sanctum.
2. **Dashboard Principal**: Panel SaaS premium interactivo con barra lateral colapsable.
3. **Gestión de Clientes**: CRUD con estado (Activo, Suspendido, Vencido).
4. **Membresías**: Tipos de planes (Mensual, Trimestral, Anual).
5. **Control de Asistencia**: Check-in/out rápido y soporte para QR.
6. **Entrenadores**: Asignación de clientes y horarios.
7. **Rutinas y Entrenamiento**: Categorías musculares y ejercicios.
8. **Pagos**: Control e historial de transacciones.
9. **Reportes**: Gráficos interactivos vacíos para ingresos, asistencia y estado.
10. **Configuración**: Moneda, impuestos e información del establecimiento.
