# TidyTask Backend - Diagramas de Arquitectura y Flujos

## 🏗️ Diagrama de Arquitectura General

```
                             TIDYTASK BACKEND ARCHITECTURE
                                        
                    ┌─────────────────────────────────────────────────┐
                    │                   CLIENTE                       │
                    │              (React/Vue/Mobile)                 │
                    └──────────────────┬──────────────────────────────┘
                                       │ HTTP/HTTPS
                                       │ JSON API
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                              EXPRESS.JS SERVER                              │
    │                                   (app.js)                                  │
    ├─────────────────────────────────────────────────────────────────────────────┤
    │  MIDDLEWARE STACK                                                           │
    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
    │  │  CORS   │→│ Session │→│  JSON   │→│ Static  │→│ Routes  │              │
    │  │         │ │         │ │ Parser  │ │ Files   │ │         │              │
    │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                ROUTES LAYER                                 │
    │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
    │  │   auth.routes   │ │  user.routes    │ │  tasks.routes   │              │
    │  │  /api/auth/*    │ │  /api/users/*   │ │  /api/tasks/*   │              │
    │  └─────────────────┘ └─────────────────┘ └─────────────────┘              │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                           MIDDLEWARE SECURITY                               │
    │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
    │  │   requireAuth   │ │ validateRequest │ │  uploadAvatar   │              │
    │  │   (JWT verify)  │ │   (Yup schema)  │ │   (Multer)      │              │
    │  └─────────────────┘ └─────────────────┘ └─────────────────┘              │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                            CONTROLLERS LAYER                               │
    │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
    │  │ auth.controller │ │ user.controller │ │tasks.controller │              │
    │  │ • register()    │ │ • getProfile()  │ │ • createTask()  │              │
    │  │ • login()       │ │ • updateProfile │ │ • getTasks()    │              │
    │  │ • logout()      │ │ • changePassword│ │ • updateTask()  │              │
    │  │                 │ │ • uploadAvatar()│ │ • deleteTask()  │              │
    │  └─────────────────┘ └─────────────────┘ └─────────────────┘              │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                              DAO LAYER                                      │
    │  ┌─────────────────┐           ┌─────────────────┐                         │
    │  │    UserDAO      │           │    TaskDAO      │                         │
    │  │ • findById()    │           │ • findById()    │                         │
    │  │ • findOne()     │           │ • findOne()     │                         │
    │  │ • find()        │           │ • find()        │                         │
    │  │ • create()      │           │ • create()      │                         │
    │  │ • update()      │           │ • update()      │                         │
    │  │ • delete()      │           │ • delete()      │                         │
    │  └─────────────────┘           └─────────────────┘                         │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                              MODELS LAYER                                   │
    │  ┌─────────────────┐           ┌─────────────────┐                         │
    │  │   User Model    │           │   Task Model    │                         │
    │  │ • userSchema    │───────────│ • taskSchema    │                         │
    │  │ • validations   │    ref    │ • validations   │                         │
    │  │ • middleware    │           │ • middleware    │                         │
    │  └─────────────────┘           └─────────────────┘                         │
    └─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                              DATABASE LAYER                                 │
    │                        ┌─────────────────────────┐                         │
    │                        │      MONGODB ATLAS      │                         │
    │                        │                         │                         │
    │                        │  ┌─────────────────┐    │                         │
    │                        │  │ users collection│    │                         │
    │                        │  └─────────────────┘    │                         │
    │                        │  ┌─────────────────┐    │                         │
    │                        │  │ tasks collection│    │                         │
    │                        │  └─────────────────┘    │                         │
    │                        └─────────────────────────┘                         │
    └─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos: Crear Tarea

```
    CLIENTE                    SERVIDOR                       BASE DE DATOS
       │                          │                               │
       │  POST /api/tasks         │                               │
       │  {title, date, time}     │                               │
       │─────────────────────────▶│                               │
       │  Authorization: Bearer   │                               │
       │                          │                               │
       │                          │ 1. CORS Check                │
       │                          │ ✓ Origin allowed              │
       │                          │                               │
       │                          │ 2. JSON Parse                │
       │                          │ ✓ Body parsed                 │
       │                          │                               │
       │                          │ 3. Route Match                │
       │                          │ → /api/tasks                  │
       │                          │ → tasksController.createTask  │
       │                          │                               │
       │                          │ 4. requireAuth()              │
       │                          │ ✓ JWT verified                │
       │                          │ → req.user = {userId: "..."}  │
       │                          │                               │
       │                          │ 5. Controller Logic           │
       │                          │ • Validate with Yup           │
       │                          │ • Prepare task data           │
       │                          │ • Add user reference          │
       │                          │                               │
       │                          │ 6. TaskDAO.create()           │
       │                          │─────────────────────────────▶│
       │                          │   new Task(data).save()      │ 7. MongoDB Insert
       │                          │                              │ ✓ Document saved
       │                          │◀─────────────────────────────│ → ObjectId returned
       │                          │   savedTask                   │
       │                          │                               │
       │                          │ 8. TaskDAO.findById()         │
       │                          │   .populate('user')           │
       │                          │─────────────────────────────▶│
       │                          │                              │ 9. MongoDB FindOne
       │                          │◀─────────────────────────────│    + Populate
       │                          │   populatedTask               │ ✓ Task with user data
       │                          │                               │
       │  HTTP 201 Created        │ 10. Response                  │
       │  {task: populatedTask}   │                               │
       │◀─────────────────────────│                               │
       │                          │                               │
```

## 🔐 Flujo de Autenticación

```
    REGISTRO DE USUARIO
    ══════════════════════════════════════════════════════════════════════════
    
    CLIENTE                CONTROLLER              DAO                DATABASE
       │                      │                    │                     │
       │ POST /auth/register  │                    │                     │
       │ {email, password}    │                    │                     │
       │─────────────────────▶│                    │                     │
       │                      │ 1. Validate Data   │                     │
       │                      │    (Yup Schema)    │                     │
       │                      │ ✓ Email format OK  │                     │
       │                      │ ✓ Password length  │                     │
       │                      │                    │                     │
       │                      │ 2. Check if exists │                     │
       │                      │─────────────────────▶ UserDAO.findOne() │
       │                      │                    │─────────────────────▶│
       │                      │                    │◀─────────────────────│
       │                      │◀─────────────────────   null (no existe)  │
       │                      │                    │                     │
       │                      │ 3. Hash Password   │                     │
       │                      │    bcrypt.hash()   │                     │
       │                      │ ✓ Password hashed  │                     │
       │                      │                    │                     │
       │                      │ 4. Create User     │                     │
       │                      │─────────────────────▶ UserDAO.create()   │
       │                      │                    │─────────────────────▶│
       │                      │                    │◀─────────────────────│
       │                      │◀─────────────────────   savedUser        │
       │                      │                    │                     │
       │                      │ 5. Generate JWT    │                     │
       │                      │    jwt.sign()      │                     │
       │                      │ ✓ Token created    │                     │
       │                      │                    │                     │
       │ HTTP 201 Created     │ 6. Response        │                     │
       │ {token, user}        │                    │                     │
       │◀─────────────────────│                    │                     │


    LOGIN DE USUARIO
    ══════════════════════════════════════════════════════════════════════════
    
    CLIENTE                CONTROLLER              DAO                DATABASE
       │                      │                    │                     │
       │ POST /auth/login     │                    │                     │
       │ {email, password}    │                    │                     │
       │─────────────────────▶│                    │                     │
       │                      │ 1. Find User       │                     │
       │                      │─────────────────────▶ UserDAO.findOne() │
       │                      │                    │─────────────────────▶│
       │                      │                    │◀─────────────────────│
       │                      │◀─────────────────────   user found       │
       │                      │                    │                     │
       │                      │ 2. Verify Password │                     │
       │                      │    bcrypt.compare() │                     │
       │                      │ ✓ Password match   │                     │
       │                      │                    │                     │
       │                      │ 3. Generate JWT    │                     │
       │                      │    jwt.sign()      │                     │
       │                      │ ✓ Token created    │                     │
       │                      │                    │                     │
       │ HTTP 200 OK          │ 4. Response        │                     │
       │ {token, user}        │                    │                     │
       │◀─────────────────────│                    │                     │


    PETICIÓN AUTENTICADA
    ══════════════════════════════════════════════════════════════════════════
    
    CLIENTE                MIDDLEWARE              CONTROLLER         DATABASE
       │                      │                      │                   │
       │ GET /api/users/me    │                      │                   │
       │ Authorization: Bearer│                      │                   │
       │─────────────────────▶│                      │                   │
       │                      │ 1. Extract Token     │                   │
       │                      │    from header       │                   │
       │                      │ ✓ Bearer token found │                   │
       │                      │                      │                   │
       │                      │ 2. Verify JWT        │                   │
       │                      │    jwt.verify()      │                   │
       │                      │ ✓ Token valid        │                   │
       │                      │                      │                   │
       │                      │ 3. Set req.user      │                   │
       │                      │    req.user = decoded│                   │
       │                      │ ✓ User data attached │                   │
       │                      │                      │                   │
       │                      │ 4. Call next()       │                   │
       │                      │─────────────────────▶│                   │
       │                      │                      │ 5. Process req    │
       │                      │                      │   using req.user  │
       │                      │                      │                   │
       │ HTTP 200 OK          │                      │ 6. Response       │
       │ {user data}          │                      │                   │
       │◀─────────────────────────────────────────────│                   │
```

## 📁 Flujo de Upload de Avatar

```
    CLIENTE                MULTER               CONTROLLER           FILESYSTEM
       │                     │                    │                     │
       │ POST /users/me/avatar│                    │                     │
       │ Content-Type:        │                    │                     │
       │ multipart/form-data  │                    │                     │
       │ Body: FormData       │                    │                     │
       │─────────────────────▶│                    │                     │
       │                     │ 1. Parse FormData  │                     │
       │                     │ ✓ File extracted   │                     │
       │                     │                     │                     │
       │                     │ 2. Validate File   │                     │
       │                     │ • Check MIME type  │                     │
       │                     │ • Check file size  │                     │
       │                     │ ✓ Image valid      │                     │
       │                     │                     │                     │
       │                     │ 3. Generate filename│                     │
       │                     │   userId-timestamp  │                     │
       │                     │ ✓ Unique name      │                     │
       │                     │                     │                     │
       │                     │ 4. Save to disk    │                     │
       │                     │─────────────────────────────────────────▶│
       │                     │                    │           uploads/avatars/
       │                     │◀─────────────────────────────────────────│
       │                     │ ✓ File saved       │                     │
       │                     │                     │                     │
       │                     │ 5. Call controller │                     │
       │                     │─────────────────────▶│                     │
       │                     │   req.file = info  │ 6. Update user     │
       │                     │                    │   avatar field      │
       │                     │                    │ UserDAO.update()    │
       │                     │                    │                     │
       │ HTTP 200 OK         │                    │ 7. Response         │
       │ {avatar: "/uploads/.."}│                  │                     │
       │◀─────────────────────────────────────────│                     │
```

## 🔄 Ciclo de Vida de una Tarea

```
                            TASK LIFECYCLE
                            ═══════════════
    
    ┌─────────────┐ createTask() ┌─────────────┐ updateTask() ┌─────────────┐
    │             │─────────────▶│             │─────────────▶│             │
    │  NO EXISTE  │              │ "Por hacer" │              │ "Haciendo"  │
    │             │              │             │              │             │
    └─────────────┘              └─────────────┘              └─────────────┘
                                        │                            │
                                        │                            │
                                        ▼                            ▼
                                 ┌─────────────┐              ┌─────────────┐
                                 │  DELETED    │              │   "Hecho"   │
                                 │             │◀─────────────│             │
                                 └─────────────┘ deleteTask() └─────────────┘
    
    
    Estados de Tarea:
    • "Por hacer" (default) - Tarea creada, pendiente de iniciar
    • "Haciendo" - Tarea en progreso
    • "Hecho" - Tarea completada
    • DELETED - Tarea eliminada (no existe en BD)
    
    
    Operaciones CRUD:
    
    CREATE:  POST /api/tasks
    ┌─────────────────────────────────────────────────┐
    │ Body: {                                         │
    │   title: "Nueva tarea",                        │
    │   detail: "Descripción opcional",              │
    │   date: "2025-09-20",                          │
    │   time: "14:30",                               │
    │   status: "Por hacer"                          │
    │ }                                               │
    └─────────────────────────────────────────────────┘
    
    READ:    GET /api/tasks (todas las tareas del usuario)
             GET /api/tasks/:id (tarea específica)
    
    UPDATE:  PUT /api/tasks/:id
    ┌─────────────────────────────────────────────────┐
    │ Body: {                                         │
    │   status: "Haciendo"  // Solo cambiar estado   │
    │ }                                               │
    └─────────────────────────────────────────────────┘
    
    DELETE:  DELETE /api/tasks/:id
```

## 🌐 Arquitectura de Despliegue

```
                            DEPLOYMENT ARCHITECTURE
                            ═══════════════════════════
    
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              INTERNET                                   │
    │                         (clients, browsers)                            │
    └─────────────────────────┬───────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                            CDN / PROXY                                  │
    │                         (Vercel, Netlify)                              │
    └─────────────────────────┬───────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         FRONTEND APPS                                   │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
    │  │   React SPA     │  │   Vue.js SPA    │  │  Mobile App     │        │
    │  │  (Vercel)       │  │  (Netlify)      │  │  (React Native) │        │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
    └─────────────────────────┬───────────────────────────────────────────────┘
                              │ API Calls
                              │ Authorization: Bearer <JWT>
                              ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         BACKEND API                                     │
    │                      TidyTask Backend                                   │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
    │  │   Heroku        │  │    Vercel       │  │    Render       │        │
    │  │  (main prod)    │  │  (staging)      │  │  (backup)       │        │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
    └─────────────────────────┬───────────────────────────────────────────────┘
                              │ MongoDB Connection
                              │ MONGODB_URI
                              ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                        DATABASE LAYER                                   │
    │                                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐    │
    │  │                     MONGODB ATLAS                               │    │
    │  │                    (Cloud Database)                             │    │
    │  │                                                                 │    │
    │  │  Cluster: tidytask-cluster                                      │    │
    │  │  Database: TaskManager                                          │    │
    │  │  Collections:                                                   │    │
    │  │  • users (authentication, profiles)                            │    │
    │  │  • tasks (user tasks, CRUD operations)                         │    │
    │  │                                                                 │    │
    │  │  Features:                                                      │    │
    │  │  • Auto-scaling                                                 │    │
    │  │  • Backup & Recovery                                            │    │
    │  │  • Security (Network access, Auth)                             │    │
    │  │  • Monitoring & Alerts                                          │    │
    │  └─────────────────────────────────────────────────────────────────┘    │
    └─────────────────────────────────────────────────────────────────────────┘
    
    
    DEPLOYMENT ENVIRONMENTS:
    
    Development:
    • Local: http://localhost:3000
    • Database: MongoDB local o Atlas
    • Frontend: http://localhost:5173
    
    Staging:
    • Backend: https://tidytask-backend-staging.vercel.app
    • Database: MongoDB Atlas (staging cluster)
    • Frontend: https://tidytask-staging.vercel.app
    
    Production:
    • Backend: https://tidytask-backend.herokuapp.com
    • Database: MongoDB Atlas (production cluster)  
    • Frontend: https://tidytask-frontend-pi1.vercel.app
```

## 🔧 Configuración de Variables por Ambiente

```
    ENVIRONMENT CONFIGURATION
    ═══════════════════════════════════════════════════════════════════
    
    LOCAL DEVELOPMENT (.env)
    ┌─────────────────────────────────────────────────────────────────┐
    │ NODE_ENV=development                                            │
    │ PORT=3000                                                       │
    │ MONGODB_URI=mongodb://localhost:27017/tidytask-dev              │
    │ JWT_SECRET=dev_secret_key_not_secure                            │
    │ FRONTEND_URL=http://localhost:5173                              │
    │ SESSION_SECRET=dev_session_secret                               │
    └─────────────────────────────────────────────────────────────────┘
    
    STAGING (Platform Environment Variables)
    ┌─────────────────────────────────────────────────────────────────┐
    │ NODE_ENV=staging                                                │
    │ PORT=3000                                                       │
    │ MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net │
    │ JWT_SECRET=staging_jwt_secret_more_secure                       │
    │ FRONTEND_URL=https://tidytask-staging.vercel.app                │
    │ SESSION_SECRET=staging_session_secret                           │
    └─────────────────────────────────────────────────────────────────┘
    
    PRODUCTION (Platform Environment Variables)
    ┌─────────────────────────────────────────────────────────────────┐
    │ NODE_ENV=production                                             │
    │ PORT=3000                                                       │
    │ MONGODB_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net    │
    │ JWT_SECRET=super_secure_production_jwt_secret                   │
    │ FRONTEND_URL=https://tidytask-frontend-pi1.vercel.app           │
    │ SESSION_SECRET=super_secure_production_session_secret           │
    └─────────────────────────────────────────────────────────────────┘
```

Esta documentación visual complementa la documentación técnica completa y proporciona una visión clara de cómo funciona toda la aplicación TidyTask Backend, desde la arquitectura general hasta los flujos específicos de datos y despliegue.