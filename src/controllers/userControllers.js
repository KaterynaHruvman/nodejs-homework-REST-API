const {
  login,
  registration,
  logout,
  getCurrentUser,
  updateSubscription,
  avatars,
} = require("../model/user");
const { CreateSenderSendGrid } = require("../services/email-sender");
require("dotenv").config();
const registrationController = async (req, res, next) => {
  const { email, password } = req.body;
  await registration({ email, password });
  res.status(201).json({ status: "created" });
};
const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const token = await login({ email, password });
  return res.status(200).json({ token });
};
const logoutController = async (req, res) => {
  const { userId } = req.user;
  const token = req.token;
  await logout({
    userId,
    token,
  });

  res.status(204).json({ status: "No Content" });
};
const getCurrentUserController = async (req, res, next) => {
  const token = req.token;
  const { _id: userId } = req.user;
  const currentUser = await getCurrentUser({ userId, token });
  return res.status(200).json({ currentUser });
};
const updateSubscriptionController = async (req, res, next) => {
  const token = req.token;
  const { subscription } = req.body;
  const { _id: userId } = req.user;
  const currentUser = await updateSubscription({ token, subscription }, userId);
  res.status(200).json({ currentUser });
};
//Idcloudavatar поемнять на локальный

const updateAvatar = async (id, avatar, dCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar });
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: "success",
        code: 200,
        data: { message: "Success!" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Verification token isn't valid",
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { name, email, isVerified, verifyToken } = user;
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: "success",
          code: 200,
          data: { message: "Resubmitted success!" },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email has been verified",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  updateAvatar,
  verify,
  repeatEmailVerification,
};
