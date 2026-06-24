/**
 * User DTOs (Data Transfer Objects)
 */

const CreateUserRequest = (data) => ({
  name: data.name,
  email: data.email,
  password: data.password,
});

const UpdateUserRequest = (data) => ({
  name: data.name,
  email: data.email,
  password: data.password,
});

const UserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
};
