import app from './app.js';
import http from 'http';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

// Crear servidor HTTP explícito
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://tidytask-frontend.vercel.app/',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['X-Requested-With','Content-Type','Accept','Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Interceptar todas las respuestas para garantizar encabezados CORS
// server.on('request', (req, res) => {
//   const originalEnd = res.end;
  
//   // Reemplazar el método end para asegurar que los encabezados CORS siempre estén presentes
//   res.end = function() {
//     // Forzar encabezados CORS en todas las respuestas como último recurso
//     if (process.env.NODE_ENV === 'production') {
//       res.setHeader('Access-Control-Allow-Origin', 'https://tidytasks-v1.onrender.com');
//       res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//       res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Authorization');
//       res.setHeader('Access-Control-Allow-Credentials', 'true');
//     }
    
//     // Llamar al método original
//     return originalEnd.apply(this, arguments);
//   };
// });

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`👉 Frontend URL: ${process.env.FRONTEND_URL || 'https://tidytasks-v1.onrender.com'}`);
  }
});