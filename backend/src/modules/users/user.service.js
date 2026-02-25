import Role from '../../models/Role.js';
import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import { ErrorWithStatus } from '../../utils/error.js';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { USERS_MESSAGES } from '../../constants/messages.js';

class UserService {
  async createUser(payload) {
    const { email, password, role, username, first_name, last_name } = payload;

    if (!email || !password || !username || !first_name || !last_name) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Missing required fields',
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    }

    const userRole = await Role.findOne({ name: role });
    if (!userRole) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.ROLE_NOT_FOUND,
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      first_name,
      last_name,
      password_hash,
      role_id: userRole._id,
    });

    return {
      id: user._id,
      email: user.email,
      username: user.username,
      role,
    };
  }

  async getMyProfile(userId) {
    const user = await User.findById(userId).populate('role_id');
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND,
      });
    }
    return user;
  }

  async updateMyProfile(userId, payload) {
    const { email, username, first_name, last_name, password } = payload;

    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND,
      });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
        });
      }
      user.email = email;
    }

    if (username) user.username = username;
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }

    await user.save();

    return {
      id: user._id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }

  async setUserActiveStatus(userId, isActive) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND,
      });
    }

    if (!user.is_active && isActive === false) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'User already banned',
      });
    }

    if (user.is_active && isActive === true) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'User already active',
      });
    }

    user.is_active = isActive;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };
  }

  async getAllUsers() {
    const users = await User.find().populate('role_id');
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role_id.name,
    }));
  }
}

export default new UserService();
