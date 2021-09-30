const {
  login,
  registration,
  logout,
  getCurrentUser,
  updateSubscription,
  avatars,
} = require("../model/user");

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

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  updateAvatar,
};
