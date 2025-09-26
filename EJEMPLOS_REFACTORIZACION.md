# Ejemplos de Código: Antes vs Después - Implementación DAO

## Comparativa de Refactorización

### 1. Controlador de Usuarios - Método getProfile

#### ANTES (Acceso directo al modelo)
```javascript
async getProfile(req, res) {
  try {
    const userId = req.user.userId;
    
    // Acceso directo a Mongoose Model
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires -googleId"
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    
    res.status(200).json({
      success: true,
      data: { /* ... */ }
    });
  } catch (error) {
    // Manejo de errores
  }
}
```

#### DESPUÉS (Usando DAO)
```javascript
async getProfile(req, res) {
  try {
    const userId = req.user.userId;
    
    // Acceso a través del DAO
    const user = await UserDAO.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires -googleId"
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    
    res.status(200).json({
      success: true,
      data: { /* ... */ }
    });
  } catch (error) {
    // Manejo de errores (sin cambios)
  }
}
```

### 2. Controlador de Tareas - Método createTask

#### ANTES
```javascript
async createTask(req, res) {
  try {
    const { title, detail, date, time, status } = req.body;
    
    // Instancia directa del modelo Mongoose
    const newTask = new Task({
      title,
      detail,
      date,
      time: time || null,
      status: status || 'Por hacer',
      user: userId
    });

    // Guardado directo
    const savedTask = await newTask.save();
    
    // Consulta adicional para popular
    const populatedTask = await Task.findById(savedTask._id)
      .populate('user', 'firstName lastName email');
    
    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    // Manejo de errores
  }
}
```

#### DESPUÉS
```javascript
async createTask(req, res) {
  try {
    const { title, detail, date, time, status } = req.body;
    
    // Objeto plano preparado para el DAO
    const newTask = {
      title,
      detail,
      date,
      time: time || null,
      status: status || 'Por hacer',
      user: userId
    };

    // Creación a través del DAO
    const savedTask = await TaskDAO.create(newTask);
    
    // Consulta adicional usando el DAO
    const populatedTask = await TaskDAO.findById(savedTask._id)
      .populate('user', 'firstName lastName email');
    
    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    // Manejo de errores (sin cambios)
  }
}
```

## Estructura de los DAOs Implementados

### UserDAO - Estructura Completa
```javascript
import User from "../../models/user.model.js";

/**
 * @module UserDAO
 * @description Data Access Object that encapsulates persistence operations
 * for the `User` Mongoose model. Methods return Mongoose Query objects when
 * appropriate so callers can chain `select`, `populate` or `exec` and `await`.
 */

const UserDAO = {
  /**
   * Find a user by its ID
   * @param {string|Object} id - Mongoose ObjectId or string representation
   * @returns {import('mongoose').Query} Mongoose query resolving to the user document
   */
  findById: (id) => User.findById(id),
  
  /**
   * Find a single user by filter
   * @param {Object} filter - Mongoose filter object
   * @returns {import('mongoose').Query} Mongoose query resolving to the user document
   */
  findOne: (filter) => User.findOne(filter),
  
  /**
   * Find multiple users by filter
   * @param {Object} filter - Mongoose filter object
   * @returns {import('mongoose').Query} Mongoose query resolving to an array of users
   */
  find: (filter) => User.find(filter),
  
  /**
   * Find one document and update it
   * @param {Object} filter - Query filter
   * @param {Object} update - Update object
   * @param {Object} [options] - Mongoose findOneAndUpdate options
   * @returns {import('mongoose').Query}
   */
  findOneAndUpdate: (filter, update, options) =>
    User.findOneAndUpdate(filter, update, options),
  
  /**
   * Find a document by id and update it
   * @param {string|Object} id - Document id
   * @param {Object} update - Update object
   * @param {Object} [options] - Mongoose options
   * @returns {import('mongoose').Query}
   */
  findByIdAndUpdate: (id, update, options) =>
    User.findByIdAndUpdate(id, update, options),
  
  /**
   * Find a document by id and delete it
   * @param {string|Object} id - Document id
   * @returns {import('mongoose').Query}
   */
  findByIdAndDelete: (id) => User.findByIdAndDelete(id),
  
  /**
   * Create a new user document
   * @param {Object} data - User data
   * @returns {Promise<import('mongoose').Document>} Saved user document
   */
  create: (data) => new User(data).save(),
};

export default UserDAO;
```

### TaskDAO - Estructura Completa
```javascript
import Task from "../../models/task.model.js";

/**
 * @module TaskDAO
 * @description Data Access Object for the `Task` model. Exposes basic CRUD
 * operations used by task controllers. Returned values are Mongoose Query
 * objects when appropriate so callers can chain `populate`/`select`.
 */

const TaskDAO = {
  /**
   * Find task by id
   * @param {string|Object} id - Task id
   * @returns {import('mongoose').Query}
   */
  findById: (id) => Task.findById(id),
  
  /**
   * Find one task by filter
   * @param {Object} filter - Mongoose filter
   * @returns {import('mongoose').Query}
   */
  findOne: (filter) => Task.findOne(filter),
  
  /**
   * Find tasks by filter
   * @param {Object} filter - Mongoose filter
   * @returns {import('mongoose').Query}
   */
  find: (filter) => Task.find(filter),
  
  /**
   * Find one and update
   * @param {Object} filter - Query filter
   * @param {Object} update - Update object
   * @param {Object} [options] - Mongoose options
   * @returns {import('mongoose').Query}
   */
  findOneAndUpdate: (filter, update, options) =>
    Task.findOneAndUpdate(filter, update, options),
  
  /**
   * Find by id and update
   * @param {string|Object} id - Task id
   * @param {Object} update - Update object
   * @param {Object} [options] - Mongoose options
   * @returns {import('mongoose').Query}
   */
  findByIdAndUpdate: (id, update, options) =>
    Task.findByIdAndUpdate(id, update, options),
  
  /**
   * Find one and delete
   * @param {Object} filter - Query filter
   * @returns {import('mongoose').Query}
   */
  findOneAndDelete: (filter) => Task.findOneAndDelete(filter),
  
  /**
   * Create new task
   * @param {Object} data - Task data
   * @returns {Promise<import('mongoose').Document>} Saved task document
   */
  create: (data) => new Task(data).save(),
};

export default TaskDAO;
```

## Casos de Uso de Testing Facilitados

### Antes - Difícil de testear
```javascript
// Era necesario mockear Mongoose directamente
jest.mock('../models/user.model.js', () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  // ... complicado de mantener
}));
```

### Después - Fácil de testear
```javascript
// Mock simple del DAO
const mockUserDAO = {
  findById: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockCreatedUser),
  // ... mucho más simple y mantenible
};

// Test del controlador
describe('UserController', () => {
  beforeEach(() => {
    // Inyectar mock del DAO
    UserController.__setDAO(mockUserDAO);
  });
  
  test('should get user profile', async () => {
    const result = await UserController.getProfile(mockReq, mockRes);
    expect(mockUserDAO.findById).toHaveBeenCalledWith('userId123');
    expect(result.status).toBe(200);
  });
});
```

## Ventajas Específicas por Método

### 1. Métodos de Búsqueda (find*)
- **Consistencia**: Mismo patrón en UserDAO y TaskDAO
- **Flexibilidad**: Mantienen compatibilidad con chaining de Mongoose
- **Claridad**: Nombres descriptivos y autodocumentados

### 2. Métodos de Actualización
- **Seguridad**: Encapsulación de opciones de actualización
- **Validación**: Punto único para agregar validaciones futuras
- **Logging**: Posibilidad de agregar auditoría centralizada

### 3. Método de Creación
- **Simplificación**: Interfaz limpia para controladores
- **Consistencia**: Mismo patrón create() en ambos DAOs
- **Extensibilidad**: Fácil agregar hooks pre/post creación

## Conclusión de la Refactorización

La implementación del patrón DAO ha transformado el código de:

**Código Monolítico → Código Modular**
- Separación clara de responsabilidades
- Bajo acoplamiento entre capas
- Alta cohesión dentro de cada DAO

**Testing Difícil → Testing Simplificado**
- Mocks simples y mantenibles
- Aislamiento de la lógica de base de datos
- Tests más rápidos y confiables

**Mantenimiento Complejo → Mantenimiento Directo**
- Cambios centralizados en una sola capa
- Interfaz consistente across toda la app
- Documentación clara con JSDoc