/**
 * User Model - Supabase PostgreSQL
 * Replace the old MongoDB User.js with this
 * 
 * Database Table Schema:
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   password VARCHAR(255) NOT NULL,
 *   first_name VARCHAR(100),
 *   last_name VARCHAR(100),
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

const supabase = require('../Config/supabase');

/**
 * Create a new user
 */
exports.createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
};

/**
 * Get user by email
 */
exports.getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    // User not found is normal, return null instead of throwing
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
};

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
};

/**
 * Update user
 */
exports.updateUser = async (userId, updates) => {
  // Map camelCase to snake_case for database
  const dbUpdates = {
    first_name: updates.firstName,
    last_name: updates.lastName,
    email: updates.email,
    password: updates.password,
  };

  // Remove undefined values
  Object.keys(dbUpdates).forEach(
    key => dbUpdates[key] === undefined && delete dbUpdates[key]
  );

  const { data, error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
};

/**
 * Delete user
 */
exports.deleteUser = async (userId) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  return { success: true };
};

/**
 * Check if user exists
 */
exports.userExists = async (email) => {
  const user = await exports.getUserByEmail(email);
  return user !== null;
};
