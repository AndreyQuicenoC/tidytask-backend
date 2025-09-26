# TidyTask Backend - Documentación Completa de la Aplicación

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Flujo de Datos y Comunicación](#flujo-de-datos-y-comunicación)
5. [Modelos de Datos](#modelos-de-datos)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [APIs y Endpoints](#apis-y-endpoints)
8. [Capa de Acceso a Datos (DAO)](#capa-de-acceso-a-datos-dao)
9. [Middleware y Utilidades](#middleware-y-utilidades)
10. [Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)
11. [Despliegue y Producción](#despliegue-y-producción)

---

## 🎯 Visión General

**TidyTask Backend** es una API REST desarrollada en **Node.js con Express** que proporciona servicios para una aplicación de gestión de tareas. La aplicación permite a los usuarios registrarse, autenticarse, y gestionar sus tareas personales de forma segura.

### Características Principales
- ✅ **Gestión de Usuarios**: Registro, login, perfil, avatar
- ✅ **Gestión de Tareas**: CRUD completo de tareas con fechas y estados
- ✅ **Autenticación JWT**: Seguridad basada en tokens
- ✅ **Upload de Archivos**: Gestión de avatares de usuario
- ✅ **Validación de Datos**: Esquemas robustos con Yup
- ✅ **Base de Datos**: MongoDB con Mongoose ODM
- ✅ **CORS Configurado**: Soporte para frontend en Vercel
- ✅ **Arquitectura Modular**: Patrón DAO implementado

---

## 🏗️ Arquitectura de la Aplicación

### Patrón Arquitectónico: MVC + DAO

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   MIDDLEWARE    │    │   CONTROLLER    │
│  (React/Vue)    │◄──►│   (Express)     │◄──►│   (Business)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │      DAO        │◄────────────┘
                       │  (Data Access)  │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │     MODEL       │
                       │   (Mongoose)    │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │    DATABASE     │
                       │   (MongoDB)     │
                       └─────────────────┘
```

### Capas de la Aplicación

#### 1. **Capa de Presentación (Routes)**
- Define los endpoints HTTP
- Aplica middlewares de autenticación
- Valida parámetros de entrada

#### 2. **Capa de Lógica de Negocio (Controllers)**
- Procesa las peticiones HTTP
- Ejecuta validaciones de negocio
- Orquesta llamadas a DAOs
- Formatea respuestas

#### 3. **Capa de Acceso a Datos (DAO)**
- Encapsula operaciones de base de datos
- Abstrae el ORM/ODM (Mongoose)
- Proporciona interfaz consistente

#### 4. **Capa de Datos (Models)**
- Define esquemas de MongoDB
- Establece validaciones de datos
- Configura índices y relaciones

---

## 📁 Estructura de Directorios

```
tidytask-backend/
├── 📄 app.js                    # Configuración principal de Express
├── 📄 server.js                 # Punto de entrada del servidor
├── 📄 index.js                  # Archivo de inicio alternativo
├── 📄 package.json              # Dependencias y scripts
├── 📄 Procfile                  # Configuración para Heroku
├── 📄 vercel.json               # Configuración para Vercel
├── 📄 render.yaml               # Configuración para Render
├── 📄 Dockerfile                # Containerización
├── 📄 .env                      # Variables de entorno (no versionado)
│
├── 📁 config/                   # Configuraciones
│   ├── database.js              # Configuración de MongoDB
│   └── passport.js              # Configuración de Passport (OAuth)
│
├── 📁 src/                      # Código fuente principal
│   ├── 📁 config/               # Configuraciones internas
│   │   └── index.js             # Exporta configuraciones
│   ├── 📁 dao/                  # Data Access Objects
│   │   ├── user.dao.js          # DAO para usuarios
│   │   └── task.dao.js          # DAO para tareas
│   └── 📁 routes/               # Definición de rutas
│       └── index.js             # Exporta todas las rutas
│
├── 📁 controllers/              # Controladores de negocio
│   ├── auth.controller.js       # Autenticación (login, registro)
│   ├── user.controller.js       # Gestión de usuarios
│   └── tasks.controller.js      # Gestión de tareas
│
├── 📁 models/                   # Modelos de Mongoose
│   ├── user.model.js            # Esquema de usuarios
│   └── task.model.js            # Esquema de tareas
│
├── 📁 routes/                   # Rutas de Express
│   ├── auth.routes.js           # Rutas de autenticación
│   ├── user.routes.js           # Rutas de usuarios
│   └── tasks.routes.js          # Rutas de tareas
│
├── 📁 utils/                    # Utilidades
│   ├── decorators.js            # Middlewares reutilizables
│   └── test-urls.js             # URLs para testing
│
├── 📁 services/                 # Servicios externos
│   └── email.service.js         # Servicio de emails
│
├── 📁 uploads/                  # Archivos subidos
│   └── 📁 avatars/              # Avatares de usuarios
│
└── 📁 database/                 # Scripts de base de datos
    ├── init.js                  # Inicialización
    ├── sync.js                  # Sincronización
    └── package.json             # Dependencias de DB
```

---

## 🔄 Flujo de Datos y Comunicación

### Flujo de una Petición HTTP

```
1. 📱 CLIENTE (Frontend)
   │
   ▼ HTTP Request (GET/POST/PUT/DELETE)
   │
2. 🌐 EXPRESS SERVER (app.js)
   │
   ▼ Middleware (CORS, JSON Parser, Session)
   │
3. 🛣️ ROUTES (auth.routes.js, user.routes.js, tasks.routes.js)
   │
   ▼ Route Matching + Middleware (requireAuth, validation)
   │
4. 🎮 CONTROLLER (auth.controller.js, user.controller.js, tasks.controller.js)
   │
   ▼ Business Logic + Validation
   │
5. 📊 DAO (user.dao.js, task.dao.js)
   │
   ▼ Database Operations
   │
6. 📋 MODEL (user.model.js, task.model.js)
   │
   ▼ Mongoose ODM
   │
7. 🗄️ MONGODB (Atlas Cloud)
   │
   ▼ Response Data
   │
8. 📱 CLIENTE (JSON Response)
```

### Ejemplo Práctico: Crear una Tarea

```javascript
// 1. Cliente envía petición
POST /api/tasks
Headers: { Authorization: "Bearer jwt_token" }
Body: { title: "Nueva tarea", date: "2025-09-20", time: "14:30" }

// 2. Express recibe y aplica middlewares
app.use(cors()) ✓
app.use(express.json()) ✓

// 3. Router encuentra la ruta
router.post('/', tasksController.createTask)

// 4. Middleware de autenticación
requireAuth(req, res, next) → verifica JWT → req.user = { userId: "..." }

// 5. Controller procesa
tasksController.createTask(req, res) {
  // Validación con Yup
  await createTaskSchema.validate(req.body)
  
  // Preparar datos
  const taskData = { ...req.body, user: req.user.userId }
  
  // Llamar DAO
  const savedTask = await TaskDAO.create(taskData)
  
  // Respuesta
  res.status(201).json({ task: savedTask })
}

// 6. DAO ejecuta operación
TaskDAO.create(data) → new Task(data).save()

// 7. Mongoose guarda en MongoDB
MongoDB.collection('tasks').insertOne(document)

// 8. Respuesta al cliente
Status: 201 Created
Body: { message: "Task created", task: { _id: "...", title: "Nueva tarea" } }
```

---

## 🗃️ Modelos de Datos

### Modelo de Usuario (user.model.js)

```javascript
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  age: { type: Number, required: true },
  googleId: { type: String, sparse: true },
  avatar: { type: String, default: null }
}, { timestamps: true });
```

**Campos Principales:**
- `firstName`, `lastName`: Nombre completo del usuario
- `email`: Identificador único para login
- `password`: Hash bcrypt de la contraseña
- `age`: Edad del usuario (validación: 13-120 años)
- `avatar`: Ruta al archivo de imagen de perfil
- `googleId`: ID para autenticación OAuth con Google
- `resetPasswordToken/Expires`: Tokens para recuperación de contraseña

### Modelo de Tarea (task.model.js)

```javascript
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  detail: { type: String, trim: true },
  date: { type: Date, required: true },
  time: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time must be in HH:MM format (24-hour)'
    }
  },
  status: { 
    type: String, 
    enum: ['Por hacer', 'Haciendo', 'Hecho'], 
    default: 'Por hacer' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });
```

**Campos Principales:**
- `title`: Título de la tarea (obligatorio)
- `detail`: Descripción opcional de la tarea
- `date`: Fecha de vencimiento (obligatorio)
- `time`: Hora en formato HH:MM (opcional, validado)
- `status`: Estado actual ('Por hacer', 'Haciendo', 'Hecho')
- `user`: Referencia al usuario propietario de la tarea

### Relaciones entre Modelos

```
User (1) ──────────── (*) Task
     │                    │
     │                    │
     ▼                    ▼
  _id: ObjectId      user: ObjectId (referencia)
```

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación JWT

```
1. REGISTRO
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   POST /auth/   │───▶│   Validar datos │───▶│   Hash password │
│    register     │    │   (email único) │    │    (bcrypt)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│   Generar JWT   │◄───│  Guardar user   │◄─────────────┘
│   + Respuesta   │    │   en MongoDB    │
└─────────────────┘    └─────────────────┘

2. LOGIN
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  POST /auth/    │───▶│  Buscar usuario │───▶│   Verificar     │
│     login       │    │   por email     │    │   password      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│   Generar JWT   │◄───│   Password OK   │◄─────────────┘
│   + Respuesta   │    │                 │
└─────────────────┘    └─────────────────┘

3. PETICIONES AUTENTICADAS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Cualquier API  │───▶│ Middleware      │───▶│   Verificar     │
│ Authorization:  │    │ requireAuth()   │    │   JWT Token     │
│ Bearer <token>  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│  Ejecutar API   │◄───│ req.user = data │◄─────────────┘
│   Controller    │    │                 │
└─────────────────┘    └─────────────────┘
```

### Implementación del Middleware de Autenticación

```javascript
// utils/decorators.js
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: "...", email: "..." }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
```

---

## 🛣️ APIs y Endpoints

### Autenticación (/api/auth)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| POST | `/register` | Registro de usuario | `{ firstName, lastName, email, password, age }` | `{ token, user }` |
| POST | `/login` | Inicio de sesión | `{ email, password }` | `{ token, user }` |
| POST | `/logout` | Cerrar sesión | - | `{ message }` |

### Usuarios (/api/users)

| Método | Endpoint | Descripción | Auth | Body | Respuesta |
|--------|----------|-------------|------|------|-----------|
| GET | `/me` | Obtener perfil | ✅ | - | `{ data: user }` |
| PUT | `/me` | Actualizar perfil | ✅ | `{ firstName, lastName, email, age }` | `{ data: user }` |
| PUT | `/me/password` | Cambiar contraseña | ✅ | `{ currentPassword, newPassword, confirmPassword }` | `{ message }` |
| DELETE | `/me` | Eliminar cuenta | ✅ | - | `{ message }` |
| POST | `/me/avatar` | Subir avatar | ✅ | FormData: `avatar` | `{ data: { avatar } }` |

### Tareas (/api/tasks)

| Método | Endpoint | Descripción | Auth | Body | Respuesta |
|--------|----------|-------------|------|------|-----------|
| GET | `/` | Listar tareas del usuario | ✅ | - | `{ tasks: [...] }` |
| POST | `/` | Crear nueva tarea | ✅ | `{ title, detail?, date, time?, status? }` | `{ task }` |
| GET | `/:id` | Obtener tarea específica | ✅ | - | `{ task }` |
| PUT | `/:id` | Actualizar tarea | ✅ | `{ title?, detail?, date?, time?, status? }` | `{ task }` |
| DELETE | `/:id` | Eliminar tarea | ✅ | - | `{ message }` |

### Ejemplos de Uso

#### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "age": 25
  }'
```

#### Crear Tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "title": "Completar proyecto",
    "detail": "Finalizar la implementación del backend",
    "date": "2025-09-20",
    "time": "14:30",
    "status": "Por hacer"
  }'
```

---

## 📊 Capa de Acceso a Datos (DAO)

### ¿Qué es el Patrón DAO?

El **Data Access Object (DAO)** es un patrón de diseño que proporciona una interfaz abstracta para acceder a la base de datos. En TidyTask, los DAOs encapsulan todas las operaciones de Mongoose.

### Beneficios Implementados

1. **Separación de Responsabilidades**
   - Controllers → Lógica de negocio
   - DAOs → Acceso a datos
   - Models → Definición de esquemas

2. **Facilidad de Testing**
   - Mock de DAOs simples
   - Tests unitarios aislados
   - Mayor cobertura de código

3. **Mantenibilidad**
   - Cambios de BD centralizados
   - Interfaz consistente
   - Código más limpio

### UserDAO - Operaciones de Usuario

```javascript
const UserDAO = {
  // Búsquedas
  findById: (id) => User.findById(id),
  findOne: (filter) => User.findOne(filter),
  find: (filter) => User.find(filter),
  
  // Actualizaciones
  findOneAndUpdate: (filter, update, options) => 
    User.findOneAndUpdate(filter, update, options),
  findByIdAndUpdate: (id, update, options) => 
    User.findByIdAndUpdate(id, update, options),
  
  // Eliminación
  findByIdAndDelete: (id) => User.findByIdAndDelete(id),
  
  // Creación
  create: (data) => new User(data).save(),
};
```

### TaskDAO - Operaciones de Tareas

```javascript
const TaskDAO = {
  // Búsquedas
  findById: (id) => Task.findById(id),
  findOne: (filter) => Task.findOne(filter),
  find: (filter) => Task.find(filter),
  
  // Actualizaciones
  findOneAndUpdate: (filter, update, options) => 
    Task.findOneAndUpdate(filter, update, options),
  findByIdAndUpdate: (id, update, options) => 
    Task.findByIdAndUpdate(id, update, options),
  
  // Eliminación
  findOneAndDelete: (filter) => Task.findOneAndDelete(filter),
  
  // Creación
  create: (data) => new Task(data).save(),
};
```

### Uso en Controladores

```javascript
// Antes (acceso directo)
const user = await User.findById(userId);

// Después (usando DAO)
const user = await UserDAO.findById(userId);

// Ventaja: Mantiene compatibilidad con Mongoose
const user = await UserDAO.findById(userId)
  .select('-password')
  .populate('tasks');
```

---

## ⚙️ Middleware y Utilidades

### Middlewares Principales

#### 1. requireAuth - Autenticación JWT
```javascript
// Uso en rutas
router.get('/me', requireAuth, userController.getProfile);

// Implementación
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

#### 2. validateRequest - Validación con Yup
```javascript
// Esquema de validación
const createTaskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  date: yup.date().required('Date is required'),
  time: yup.string().nullable().test('valid-time-format', ...)
});

// Uso en controladores
export default {
  createTask: [
    requireAuth,
    validateRequest(createTaskSchema),
    (req, res) => controller.createTask(req, res)
  ]
};
```

#### 3. CORS - Cross-Origin Resource Sharing
```javascript
// Configuración dinámica por ambiente
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.FRONTEND_URL, "https://tidytask-frontend-pi1.vercel.app"]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  credentials: true
}));
```

#### 4. Multer - Upload de Archivos
```javascript
// Configuración para avatares
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads", "avatars");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    cb(null, allowedMimes.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```

### Utilidades

#### Decoradores (utils/decorators.js)
- `requireAuth`: Middleware de autenticación
- `validateRequest`: Wrapper para validación con Yup
- Funciones helper para respuestas HTTP

#### Servicios

##### Email Service (services/email.service.js)
```javascript
// Servicio para envío de emails (simulado en desarrollo)
export const emailService = {
  sendWelcomeEmail: async (userEmail, userName) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [SIMULADO] Welcome email sent to ${userEmail}`);
      return { success: true, simulated: true };
    }
    // Implementación real con SendGrid, Nodemailer, etc.
  },
  
  sendPasswordResetEmail: async (userEmail, resetToken) => {
    // Implementación de reset de contraseña
  }
};
```

---

## 🔧 Configuración y Variables de Entorno

### Variables de Entorno Requeridas (.env)

```bash
# Base de Datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/TaskManager

# Autenticación
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
SESSION_SECRET=tu_session_secret_aqui

# Servidor
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (opcional)
SENDGRID_API_KEY=tu_api_key_de_sendgrid
EMAIL_FROM=noreply@tidytask.com

# OAuth Google (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### Configuración de Base de Datos

```javascript
// config/database.js o src/config/index.js
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};
```

### Configuración por Ambiente

#### Desarrollo
```javascript
if (process.env.NODE_ENV !== "production") {
  allowedOrigins = [
    "http://localhost:5173", // Vite
    "http://localhost:3000", // React
    "http://localhost:8080"  // Vue
  ];
}
```

#### Producción
```javascript
if (process.env.NODE_ENV === "production") {
  allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://tidytask-frontend-pi1.vercel.app"
  ];
}
```

---

## 🚀 Despliegue y Producción

### Plataformas Soportadas

#### 1. Heroku
```bash
# Procfile
web: node server.js

# Configuración automática
# Variables de entorno via Heroku Dashboard
# Buildpack: heroku/nodejs
```

#### 2. Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### 3. Render
```yaml
# render.yaml
services:
  - type: web
    name: tidytask-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
```

#### 4. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Scripts de Package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "echo 'No build step needed for Node.js'",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### Proceso de Despliegue

```bash
# 1. Desarrollo local
npm run dev

# 2. Testing
npm test

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 4. Deploy automático (CI/CD)
# Heroku/Vercel/Render detectan el push y despliegan automáticamente

# 5. Variables de entorno
# Configurar en la plataforma correspondiente:
# - MONGODB_URI
# - JWT_SECRET
# - FRONTEND_URL
# - NODE_ENV=production
```

---

## 📈 Monitoring y Logs

### Logs de Aplicación
```javascript
// Logs implementados
console.log("✅ MongoDB Atlas connected successfully");
console.log("🗄️  Database:", conn.connection.name);
console.error("❌ Create task error:", error);
console.log("📧 [SIMULADO] Welcome email sent");
```

### Health Check
```javascript
// Endpoint de health check
app.get("/", (req, res) => {
  res.send("Task Manager Backend is running...");
});

// GET / → "Task Manager Backend is running..."
```

### Error Handling Global
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
```

---

## 🎯 Resumen de Funcionamiento

### Flujo Completo de la Aplicación

1. **Inicio del Servidor**
   ```
   server.js → app.js → conecta MongoDB → inicia Express en puerto 3000
   ```

2. **Usuario se Registra**
   ```
   POST /api/auth/register → auth.controller.js → UserDAO.create() → MongoDB
   ```

3. **Usuario Inicia Sesión**
   ```
   POST /api/auth/login → verifica password → genera JWT → responde token
   ```

4. **Usuario Crea Tarea**
   ```
   POST /api/tasks + Bearer token → requireAuth → tasks.controller.js → TaskDAO.create() → MongoDB
   ```

5. **Usuario Consulta Tareas**
   ```
   GET /api/tasks + Bearer token → requireAuth → TaskDAO.find({user: userId}) → responde tareas
   ```

### Características Técnicas Principales

- ✅ **API RESTful** con endpoints semánticos
- ✅ **Autenticación JWT** segura y stateless  
- ✅ **Validación robusta** con Yup schemas
- ✅ **Arquitectura modular** con patrón DAO
- ✅ **Base de datos NoSQL** con MongoDB y Mongoose
- ✅ **Upload de archivos** con Multer
- ✅ **CORS configurado** para múltiples orígenes
- ✅ **Variables de entorno** para configuración
- ✅ **Deploy multi-plataforma** (Heroku, Vercel, Render)
- ✅ **Documentación JSDoc** completa

La aplicación **TidyTask Backend** es una solución robusta y escalable para la gestión de tareas, implementada con las mejores prácticas de desarrollo backend y arquitectura de software.