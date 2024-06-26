import {
  createUser,
  loginUser,
  logoutUser,
  refreshSession,
  resetPassword,
  sendResetEmail,
} from '../services/auth.js';

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
};

export const registerUserController = async (req, res) => {
  const user = await createUser(req.body);

  res.json({
    status: 201,
    message: `Successfully created user!`,
    data: { user },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSessionCookies(res, session);
  res.json({
    status: 200,
    message: `User successfully loged in!`,
    data: { accessToken: session.accessToken },
  });
};
export const logoutUserController = async (req, res) => {
  await logoutUser({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const refresUserController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;
  const session = await refreshSession({ sessionId, sessionToken });

  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Token refreshed successfully!',
    data: { accessToken: session.accessToken },
  });
};
export const sendResetEmailController = async (req, res) => {
  await sendResetEmail(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
