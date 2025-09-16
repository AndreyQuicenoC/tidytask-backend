/**
 * Task Data Access Object (DAO)
 * Provides common DB operations for Task model used by controllers.
 */
import Task from "../../models/task.model.js";

/**
 * @module TaskDAO
 * @description Data Access Object for the `Task` model. Exposes basic CRUD
 * operations used by task controllers. Returned values are Mongoose Query
 * objects when appropriate so callers can chain `populate`/`select`.
 */

/**
 * Find task by id
 * @param {string|Object} id - Task id
 * @returns {import('mongoose').Query}
 */
const findById = (id) => Task.findById(id);

/**
 * Find one task by filter
 * @param {Object} filter - Mongoose filter
 * @returns {import('mongoose').Query}
 */
const findOne = (filter) => Task.findOne(filter);

/**
 * Find tasks by filter
 * @param {Object} filter - Mongoose filter
 * @returns {import('mongoose').Query}
 */
const find = (filter) => Task.find(filter);

/**
 * Find one and update
 * @param {Object} filter - Query filter
 * @param {Object} update - Update object
 * @param {Object} [options] - Mongoose options
 * @returns {import('mongoose').Query}
 */
const findOneAndUpdate = (filter, update, options) =>
  Task.findOneAndUpdate(filter, update, options);

/**
 * Find by id and update
 * @param {string|Object} id - Task id
 * @param {Object} update - Update object
 * @param {Object} [options] - Mongoose options
 * @returns {import('mongoose').Query}
 */
const findByIdAndUpdate = (id, update, options) =>
  Task.findByIdAndUpdate(id, update, options);

/**
 * Find one and delete
 * @param {Object} filter - Query filter
 * @returns {import('mongoose').Query}
 */
const findOneAndDelete = (filter) => Task.findOneAndDelete(filter);

/**
 * Create new task
 * @param {Object} data - Task data
 * @returns {Promise<import('mongoose').Document>} Saved task document
 */
const create = (data) => new Task(data).save();

const TaskDAO = {
  findById,
  findOne,
  find,
  findOneAndUpdate,
  findByIdAndUpdate,
  findOneAndDelete,
  create,
};

export default TaskDAO;
