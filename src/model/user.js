const bcrypt = require("bcrypt"); //
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const EmailService = require("../services/email");

// const imageNormalize = require("../../utils/imageNormalize");
const UploadAvatarService = require("../services/local-upload");
const { User } = require("../db/usersModel");
const {
  NotAuthorized,
  RegistrationConflictError,
} = require("../helpers/errors");
// const registration = async (req, res, next) => {
//   try {
//     const user = await Users.findByEmail(req.body.email);

//     if (user) {
//       return res.status(HttpCode.CONFLICT).json({
//         status: "error",
//         code: HttpCode.CONFLICT,
//         message: "Email is already used",
//       });
//     }

//     const { id, name, email, gender, avatar, verifyToken } = await Users.create(
//       req.body
//     );

//     try {
//       const emailService = new EmailService(
//         process.env.NODE_ENV,
//         new CreateSenderSendGrid()
//       );
//       await emailService.sendVerifyEmail(verifyToken, email, name);
//     } catch (error) {
//       console.log(error.message);
//     }

//     return res.status(HttpCode.CREATED).json({
//       status: "success",
//       code: HttpCode.CREATED,
//       data: { id, name, email, avatar },
//     });
//   } catch (e) {
//     next(e);
//   }
// };
const registration = async ({ email, password }) => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new RegistrationConflictError("Email  is already used");
  }
  const user = new User({
    email,
    password,
  });
  const newUser = await user.save();

  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatar: newUser.avatar,
  };
};
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  console.log("user:  ", user);

  if (!user) {
    throw new NotAuthorized("Email  is wrong");
  }

  if (password !== user.password) {
    console.log("password:  ", password);
    throw new NotAuthorized("Password is wrong");
  }
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      subscription: user.subscription,
    },
    process.env.JWT_SECRET
  );
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { token } },
    { new: true }
  );
  return updatedUser;
};

const logout = async ({ userId, token }) => {
  try {
    const logoutUser = await User.findOne(
      { _id: userId, token },
      { $set: { token: null } },
      { new: true }
    );
    if (!logoutUser) {
      throw new NotAuthorized("Not authorized");
    }
    return logoutUser();
  } catch (error) {}
};

const getCurrentUser = async ({ userId, token }) => {
  const currentUser = await User.findById({ _id: userId, token });

  console.log("currentUser", currentUser);
  if (!currentUser) {
    throw new NotAuthorized("Not authorized");
  }
  return currentUser;
};
const updateSubscription = async ({ token, subscription }, userId) => {
  try {
    const updateUserSubscription = await User.findById(
      { _id: userId, token },
      { $set: { subscription } },
      { new: true }
    );
    if (!updateUserSubscription) {
      throw new NotAuthorized("Not authorized");
    }
    return updateUserSubscription;
  } catch (error) {}
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });

    try {
      await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
    } catch (e) {
      console.log(e.message);
    }

    await Users.updateAvatar(id, avatarUrl);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  avatars,
};
