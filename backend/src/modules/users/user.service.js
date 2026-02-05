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
}

export default new UserService();
