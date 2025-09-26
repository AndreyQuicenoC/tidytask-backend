import User from "../  ../models/user.model.js";

/**
 * @module UserDAO
 * @description Data Access Object that encapsulates persistence operations
 * for the `User` Mongoose model. Methods return Mongoose Query objects when
 * appropriate so callers can chain `select`, `populate` or `exec` and `await`.
 */

/**
 * Find a user by its ID
 * @param {string|Object} id - Mongoose ObjectId or string representation
 * @returns {import('mongoose').Query} Mongoose query resolving to the user document
 */
const findById = (id) => User.findById(id);

/**
 * Find a single user by filter
 * @param {Object} filter - Mongoose filter object
 * @returns {import('mongoose').Query} Mongoose query resolving to the user document
 */
const findOne = (filter) => User.findOne(filter);

/**
 * Find multiple users by filter
 * @param {Object} filter - Mongoose filter object
 * @returns {import('mongoose').Query} Mongoose query resolving to an array of users
 */
const find = (filter) => User.find(filter);

/**
 * Find one document and update it
 * @param {Object} filter - Query filter
 * @param {Object} update - Update object
 * @param {Object} [options] - Mongoose findOneAndUpdate options
 * @returns {import('mongoose').Query}
 */
const findOneAndUpdate = (filter, update, options) =>
  User.findOneAndUpdate(filter, update, options);

/**
 * Find a document by id and update it
 * @param {string|Object} id - Document id
 * @param {Object} update - Update object
 * @param {Object} [options] - Mongoose options
 * @returns {import('mongoose').Query}
 */
const findByIdAndUpdate = (id, update, options) =>
  User.findByIdAndUpdate(id, update, options);

/**
 * Find a document by id and delete it
 * @param {string|Object} id - Document id
 * @returns {import('mongoose').Query}
 */
const findByIdAndDelete = (id) => User.findByIdAndDelete(id);

/**
 * Create a new user document
 * @param {Object} data - User data
 * @returns {Promise<import('mongoose').Document>} Saved user document
 */
const create = (data) => new User(data).save();

const UserDAO = {
  findById,
  findOne,
  find,
  findOneAndUpdate,
  findByIdAndUpdate,
  findByIdAndDelete,
  create,
};

export default UserDAO;
