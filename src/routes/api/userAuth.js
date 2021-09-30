const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/userControllers");
const {
  authorizationValidation,
  subscriptionValidation,
} = require("../../middlwarer/validation");
const { asyncWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlwarer/authMiddleware");
const upload = require("../../helpers/upload");

const {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  verify,
  repeatEmailVerification,
  udateAvatar,
} = require("../../controllers/userControllers");

router.post(
  "/registration",
  authorizationValidation,
  asyncWrapper(registrationController)
);
router.post("/login", authorizationValidation, asyncWrapper(loginController));
router.post("/logout", authMiddleware, asyncWrapper(logoutController));
router.get("/current", authMiddleware, asyncWrapper(getCurrentUserController));
router.patch(
  "/",
  authMiddleware,
  subscriptionValidation,
  asyncWrapper(updateSubscriptionController)
);
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  ctrl.updateAvatar
);
router.get("/verify/:token", ctrl.verify);
router.post("/verify", ctrl.repeatEmailVerification);
module.exports = router;
