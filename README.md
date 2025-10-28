# Auth Next.js

Sistema de autenticación completo construido con Next.js 15, que incluye autenticación estándar (email/contraseña) y OAuth (GitHub y Google).

## 🚀 Características

- ✅ **Autenticación Estándar**: Registro e inicio de sesión con email y contraseña
- ✅ **OAuth 2.0**: Integración con GitHub y Google
- ✅ **Gestión de Sesiones**: Sistema de sesiones basado en JWT
- ✅ **Base de Datos**: SQLite con Drizzle ORM
- ✅ **Seguridad**: Hash de contraseñas con bcrypt
- ✅ **Validación**: Schemas con Zod
- ✅ **UI Moderna**: Tailwind CSS 4
- ✅ **TypeScript**: Totalmente tipado

## 🛠️ Tecnologías

- **Framework**: [Next.js 15.4.4](https://nextjs.org/)
- **React**: 19.1.0
- **Base de Datos**: SQLite con [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticación**: JWT (jsonwebtoken) + bcrypt
- **Validación**: Zod
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form

## 📋 Requisitos Previos

- Node.js 20 o superior
- npm, yarn, pnpm o bun

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/epmyas2022/auth-nextjs.git
cd auth-nextjs
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DB_FILE_NAME=file:local.db

# Autenticación
SECRET_KEY=tu-clave-secreta-muy-segura-aqui
EXPIRED_SESSION=7d

# Entorno
NODE_ENV=development

# OAuth - URL base de redirección
OAUTH_REDIRECT_URL_BASE=http://localhost:3000/api/oauth/

# GitHub OAuth
OAUTH_GITHUB_CLIENT_ID=tu-github-client-id
OAUTH_GITHUB_CLIENT_SECRET=tu-github-client-secret

# Google OAuth
OAUTH_GOOGLE_CLIENT_ID=tu-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 4. Configurar OAuth (opcional)

#### GitHub OAuth:
1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crea una nueva OAuth App
3. Authorization callback URL: `http://localhost:3000/api/oauth/github`
4. Copia el Client ID y Client Secret a tu archivo `.env`

#### Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Crea credenciales OAuth 2.0
5. Authorized redirect URI: `http://localhost:3000/api/oauth/google`
6. Copia el Client ID y Client Secret a tu archivo `.env`

### 5. Configurar la base de datos

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push
```

## 🚀 Iniciar el Proyecto

### Modo desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
# Construir la aplicación
npm run build

# Iniciar el servidor de producción
npm run start
```

## 📁 Estructura del Proyecto

```
auth-nextjs/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── sign-in/       # Página de inicio de sesión
│   │   │   └── sign-up/       # Página de registro
│   │   ├── api/               # API Routes
│   │   │   └── oauth/         # Endpoints de OAuth
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── auth/                  # Sistema de autenticación
│   │   ├── core/              # Lógica core de autenticación
│   │   │   ├── hasher.ts      # Hash de contraseñas (bcrypt)
│   │   │   ├── jwt.ts         # Manejo de JWT
│   │   │   ├── session.ts     # Gestión de sesiones
│   │   │   └── oauth/         # Implementación OAuth
│   │   │       ├── oauth.client.ts
│   │   │       ├── oauth.ts
│   │   │       └── providers/ # Proveedores OAuth (GitHub, Google)
│   │   └── next/              # Integración con Next.js
│   │       ├── components/    # Componentes de UI
│   │       ├── schemas/       # Schemas de validación
│   │       └── server/        # Server actions
│   ├── db/                    # Configuración de base de datos
│   │   ├── index.ts           # Cliente de Drizzle
│   │   └── schema.ts          # Schema de la BD
│   └── shared/                # Utilidades compartidas
│       ├── enviroment.ts      # Gestión de variables de entorno
│       └── schemas/           # Schemas compartidos
├── drizzle.config.ts          # Configuración de Drizzle
└── package.json
```

## 🗄️ Schema de Base de Datos

### Tabla: users
- `id` - ID autoincremental
- `name` - Nombre del usuario
- `email` - Email único
- `username` - Nombre de usuario único
- `password` - Contraseña hasheada (opcional para OAuth)
- `created_at`, `updated_at`, `deleted_at` - Timestamps

### Tabla: oauth
- `id` - ID autoincremental
- `userId` - Referencia al usuario
- `provider` - Proveedor OAuth (github/google)
- `providerAccountId` - ID de la cuenta en el proveedor
- `created_at`, `updated_at`, `deleted_at` - Timestamps

### Tabla: revoked_tokens
- `id` - ID autoincremental
- `token` - Token revocado
- `createdAt` - Fecha de revocación

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo con Turbopack

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Linting
npm run lint         # Ejecuta ESLint

# Base de datos
npm run db:generate  # Genera migraciones de Drizzle
npm run db:migrate   # Aplica migraciones
npm run db:push      # Push del schema a la BD
npm run db:studio    # Abre Drizzle Studio (GUI para la BD)
npm run db:reset     # Resetea la base de datos
```

## 🔐 Flujo de Autenticación

### Autenticación Estándar
1. El usuario se registra con email, nombre de usuario y contraseña
2. La contraseña se hashea con bcrypt
3. Se crea un registro en la tabla `users`
4. Al iniciar sesión, se verifica la contraseña
5. Se genera un JWT y se almacena en cookies

### Autenticación OAuth
1. El usuario hace clic en "Iniciar sesión con GitHub/Google"
2. Se redirige al proveedor OAuth
3. El usuario autoriza la aplicación
4. El proveedor redirige con un código de autorización
5. Se intercambia el código por un access token
6. Se obtiene información del usuario
7. Se crea o actualiza el usuario en la BD
8. Se genera un JWT y se almacena en cookies

## 📝 Notas de Desarrollo

- El proyecto usa el App Router de Next.js 15
- Tailwind CSS 4 con PostCSS para los estilos
- React Hook Form para el manejo de formularios
- Zod para validación de datos y variables de entorno
- Drizzle ORM con SQLite para persistencia de datos
- JWT almacenado en cookies HTTP-only para seguridad
