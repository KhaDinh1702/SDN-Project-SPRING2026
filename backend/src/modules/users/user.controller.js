import HTTP_STATUS from '../../constants/httpStatus.js';
import { USERS_MESSAGES } from '../../constants/messages.js';
import { ErrorWithStatus } from '../../utils/error.js';
import userService from './user.service.js';

export const createUserController = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getMyProfileController = async (req, res) => {
  const userId = req.user.user_id;
  const result = await userService.getMyProfile(userId);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result,
  });
};

export const updateMyProfileController = async (req, res) => {
  const userId = req.user.user_id;
  const payload = req.body;

  const result = await userService.updateMyProfile(userId, payload);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Update profile successfully',
    data: result,
  });
};

export const setUserActiveStatusController = async (req, res) => {
  const { is_active } = req.body;

  if (typeof is_active !== 'boolean') {
    throw new ErrorWithStatus({
      status: 400,
      message: 'is_active is required and must be boolean',
    });
  }

  const result = await userService.setUserActiveStatus(
    req.params.id,
    is_active,
  );

  res.json({
    success: true,
    data: result,
  });
};

export const getAllUsersController = async (req, res) => {
  const result = await userService.getAllUsers();
  res.json({
    success: true,
    data: result,
  });
};
