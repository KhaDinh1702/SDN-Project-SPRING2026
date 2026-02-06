export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  //email
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_REGISTERED_WITH_GOOGLE: 'Email already registered with Google',

  //user
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  ACCOUNT_REGISTERED_WITH_GOOGLE:
    'This account was registered with Google. Please use Google login instead.',

  REGISTER_SUCCESS: 'Register successfully',

  LOGIN_SUCCESS: 'Login successfully',
  GOOGLE_LOGIN_SUCCESS: 'Google authentication successful',

  LOGOUT_SUCCESS: 'Logout is successful',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',

  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_EXPIRED: 'Refresh token is expired',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',

  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',

  USER_NOT_FOUND: 'User not found',
  ROLE_NOT_FOUND: 'Role not found',

  ACCOUNT_HAS_BEEN_BANNED: 'Account has been banned',

  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_YOUR_EMAIL: 'Check your email for change password',

  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_NOT_MATCH: 'Forgot password token not match',

  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token success',
  VERIFY_FORGOT_PASSWORD_TOKEN_IS_INVALID:
    'Verify forgot password token is invalid',

  RESET_PASSWORD_SUCCESS: 'Reset password success',

  GET_ME_SUCCESS: 'Get user profile success',

  UPDATE_PROFILE_SUCCESS: 'Update profile success',

  USERNAME_ALREADY_EXISTS: 'Username already exists',

  CHANGE_PASSWORD_SUCCESS: 'Change password success',

  UPLOAD_IMAGE_SUCCESS: 'Upload image success',
  UPLOAD_VIDEO_SUCCESS: 'Upload video success',

  ACCOUNT_DISABLED: 'Account-disabled',

  PERMISSION_DENIED: 'Only authorized users can perform this action',

  REQUIRE: 'Product name and price are required',
  EXPIRY_DATE: 'Expiry date must be in the future',
  CATEGORY_NOT_FOUND: 'Category not found',
  STOCK_QUANTITY: 'Stock quantity must be greater than or equal to 0',
  PRICE: 'Price must be greater than or equal to 0',

  PRODUCT_NOT_FOUND: 'Product not found',
};
