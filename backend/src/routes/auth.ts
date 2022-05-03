import { Router } from "express";
const { userValidator } = require("../middleware/validator");

import auth from "../middleware/auth";
const { isAdmin } = require("../middleware/permissions");
const multer = require("../middleware/multer-config");
const loginCtrl = require("../controllers/loginCtrl");
const userCtrl = require("../controllers/userCtrl");
const adminCtrl = require("../controllers/adminCtrl");

const router = Router();

// loginCtrl
router.post("/register", userValidator, loginCtrl.register);
router.post("/login", userValidator, loginCtrl.login);
router.get("/logout", auth, loginCtrl.logout);
router.post("/reset-password", loginCtrl.pwResetRequest);
router.get("/reset-password/:username/:token", loginCtrl.pwReset);
router.post("/reset-password/:username/:token", loginCtrl.newPassword);

// userCtrl
// Get own profile
router.get("/me", auth, userCtrl.me);
// Get profile of user with :username
router.get("/profile/:username", auth, userCtrl.getProfile);
// modify own profile
router.post("/me", auth, multer, userCtrl.modifyMe);
// delete user's photo
router.delete("/me", auth, userCtrl.deletePhoto);
// get a list of all users
router.get("/users", auth, userCtrl.getUsers);

// Admin Controller
router.post("/deactivate/:username", auth, adminCtrl.deactivate);
router.post("/reactivate/:username", auth, isAdmin, adminCtrl.reactivate);
router.post("/promote/:username", auth, isAdmin, adminCtrl.makeAdmin);
router.post("/demote/:username", auth, isAdmin, adminCtrl.demoteAdmin);
// delete sets username/email/pw to random string, preserves but anonymyzes posts/comments/votes
router.delete("/delete/:username", auth, isAdmin, adminCtrl.deleteAccount);
// annihilate deletes user with all dependant posts/comments/votes !USE WITH CARE!
router.delete("/annihilate/:username", auth, isAdmin, adminCtrl.annihilate);

export default router;
