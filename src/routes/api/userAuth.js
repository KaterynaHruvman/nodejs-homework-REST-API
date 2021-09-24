const express = require("express");
const router = express.Router();

const {
  authorizationValidation,
  subscriptionValidation,
} = require("../../middlwarer/validation");
const { asyncWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlwarer/authMiddleware");

const {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
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

module.exports = router;
