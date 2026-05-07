# Ticket-Help - Sistema de Gestión de Requerimientos y Soporte Técnico

Esta es una aplicación web diseñada para apoyar la gestión operativa de servicios técnicos mediante la digitalización del proceso de atención de equipos. El sistema permite registrar solicitudes de soporte en forma de tickets, asignar técnicos responsables del servicio, realizar seguimiento al estado de las reparaciones y mantener un historial detallado de las actividades realizadas para mantener al cliente actualizado con información en tiempo real del proceso de reparación.

## Propósito

Mejorar la organización y trazabilidad de los servicios técnicos, facilitando la administración de las solicitudes, el control de los procesos de reparación y la comunicación del estado del servicio hacia los usuarios finales, contribuyendo a optimizar la gestión del trabajo técnico, reducir pérdidas de información y proporcionar mayor transparencia en el proceso de atención. Actualmente el proyecto se encuentra en fase alfa.

## Características Principales

- Gestión completa del ciclo de vida de tickets de soporte
- Sistema de roles (Administrador, Técnico, Cliente)
- Dashboard con métricas y reportes de desempeño
- Sistema de notificaciones en tiempo real
- Interfaz responsive y moderna
- Autenticación segura con JWT
- Trazabilidad completa de cambios y actividades
- Indicadores de productividad técnica

## Arquitectura del Sistema

El stack tecnológico está conformado por:

**Frontend** en su respectivo repositorio de GitHub: [https://github.com/JulianOrtiz952/tickethelp-frontend.git](https://github.com/JulianOrtiz952/tickethelp-frontend.git)
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Routing:** React Router DOM 7.9.3
- **UI Framework:** TailwindCSS 4.1.9
- **Gestión de Formularios:** React Hook Form 7.65.0
- **Validación:** Yup 1.7.1
- **Gráficos:** Recharts 2.15.4
- **HTTP Client:** Axios 1.12.2

**Backend** en su respectivo repositorio de GitHub: [https://github.com/JulianOrtiz952/tickethelp-backend.git](https://github.com/JulianOrtiz952/tickethelp-backend.git)
- **Framework:** Django REST Framework
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Tokens)

### Arquitectura por Capas
```
┌─────────────────────────────────────┐
│   Frontend (React SPA)              │
│   - Vistas por rol                  │
│   - Componentes reutilizables       │
└──────────────┬──────────────────────┘
               │ HTTP/REST (Axios)
┌──────────────▼──────────────────────┐
│   Backend (Django REST Framework)   │
│   - API REST                        │
│   - Lógica de negocio               │
│   - Autenticación JWT               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Base de Datos (PostgreSQL)        │
│   - Usuarios, Tickets, Historial    │
└─────────────────────────────────────┘
```

## Estructura del Proyecto

```
tickethelp-frontend/
├── src/
│   ├── components/          
│   │   ├── tickets/         
│   │   ├── AvatarPicker.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── MessageDialog.jsx
│   │   ├── Pagination.jsx
│   │   └── ...
│   ├── layouts/             
│   │   ├── administrador/   # Layout y componentes de admin
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── tecnico/         # Layout y componentes de técnico
│   │   │   ├── TecnicoLayout.jsx
│   │   │   ├──  TecnicoSidebarT.jsx
│   │   │   └──  TecnicoTopbarT.jsx
│   │   ├── cliente/         # Layout y componentes de cliente
│   │   │   ├── ClienteLayout.jsx
│   │   │   ├── ClienteSidebarT.jsx
│   │   │   └── ClienteTopbarT.jsx
│   ├── pages/               # Páginas específicas por rol
│   │   ├── administrador/   # Páginas de administrador
│   │   ├── tecnico/         # Páginas de técnico
│   │   ├── cliente/         # Páginas de cliente
│   │   ├── auth/            # Páginas de autenticación
│   │   └── notifications/   # Sistema de notificaciones
│   ├── router/              # Configuración de rutas
│   │   └── routes.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── logo_ticket-help.svg
│   ├── default_avatar.svg 
│   └── fondo.jpg
├── .env                     # Variables de entorno
├── package.json
├── vite.config.js
├── .gitignore
├── index.html
├── package-lock.json
└── README.md
```

## Instalación y Configuración

### Prerrequisitos:
- Node.js: v18.0.0 o superior
- npm: v9.0.0 o superior
- Git: Para clonar el repositorio

### Pasos de Instalación:
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JulianOrtiz952/tickethelp-frontend.git
   cd tickethelp-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_BACKEND_URL=https://tickethelp-backend.onrender.com
   ```
   *Nota: Para desarrollo local, puedes usar `http://localhost:8000` si tienes el backend corriendo localmente.*

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint para verificar el código |

## Roles y Funcionalidades

### Administrador:
- Registrar clientes y equipos
- Crear y gestionar tickets
- Asignar técnicos a tickets
- Validar el cierre de servicios
- Consultar reportes y métricas
- Gestión completa de usuarios

### Técnico:
- Visualizar tickets asignados
- Actualizar estados de tickets
- Registrar actividades técnicas
- Solicitar cierre de tickets
- Consultar métricas de desempeño personal

### Cliente:
- Consultar estado de tickets
- Ver historial de actividades
- Recibir notificaciones
- Visualizar línea de tiempo del servicio

## Autenticación y Seguridad

El sistema utiliza **JSON Web Tokens (JWT)** para la autenticación:

1. El usuario inicia sesión con documento y contraseña.
2. El backend genera un token JWT.
3. Cada petición incluye el token en el header `Authorization`.
4. Las rutas están protegidas según el rol del usuario.

### Rutas Protegidas:
- `/admin/*` - Solo accesible para Administradores
- `/tecnico/*` - Solo accesible para Técnicos
- `/cliente/*` - Solo accesible para Clientes

## Integración con Backend

### URL Base de la API
```javascript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
```

### Ejemplo de Petición
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Estilos y Diseño

El proyecto utiliza TailwindCSS 4 con configuración personalizada:
- **Paleta de colores:** Definida en su configuración de estilos.
- **Componentes UI:** Componentes reutilizables.
- **Responsive:** Diseño mobile-first.
- **Animaciones:** Transiciones suaves para mejor UX.

## Deployment

### Build de Producción:
```bash
npm run build
```
Esto generará una carpeta `dist/` con los archivos optimizados para producción.

### Despliegue Actual:
- **Frontend:** Desplegado en servidor compatible con aplicaciones React SPA.
- **Backend:** [https://tickethelp-backend.onrender.com](https://tickethelp-backend.onrender.com)

## Equipo de Desarrollo

| Nombre | Código | Rol |
| :--- | :--- | :--- |
| Andrés Julián Ortiz Jaimes | 1152249 | Líder de Proyecto |
| Maria Jose López Reyes | 1152268 | Desarrollador |
| Daniela Alejandra Barreto Ibarra | 1152269 | Desarrollador |
| Anyela Jhohana Herrera Lobo | 1152256 | Desarrollador |
| Laura Isabella Correa Nieto | 1152265 | Desarrollador |
| Josué Daniel Perez Guerrero | 1152273 | Desarrollador |
| David Santiago Peñaranda Parada | 1151943 | Desarrollador |

**Universidad Francisco de Paula Santander**  
Programa de Ingeniería de Sistemas  
San José de Cúcuta - 2025

## Versionamiento

Este proyecto utiliza Git para control de versiones.

- **Repositorio Frontend:** [https://github.com/JulianOrtiz952/tickethelp-frontend](https://github.com/JulianOrtiz952/tickethelp-frontend)
- **Repositorio Backend:** [https://github.com/JulianOrtiz952/tickethelp-backend](https://github.com/JulianOrtiz952/tickethelp-backend)

**Versión Actual:** 1.0.0-alpha
