import { Request, Response } from "express";
const fs = require("fs");
import bcrypt from "bcrypt";

import User from "../entities/User";

// get list of all Users
// get own profile
// modify own profile
// get profile of :username

exports.getUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({
      order: { username: "ASC" }
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.me = (_: Request, res: Response) => {
  console.log(res.locals.user);

  return res.status(200).json(res.locals.user);
};

exports.modifyMe = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const oldImg = user.imageUrn;
  const newMe: User = req.body.user
    ? JSON.parse(req.body.user)
    : { ...req.body };

  const { username, email, password, body } = newMe;

  if (
    (username && username.trim() === "") ||
    (email && email.trim() === "") ||
    (password && password.trim() === "")
  ) {
    return res.status(400).json({
      message:
        "Nom d'utilisateur, email et mot de passe ne peuvent pas être vide"
    });
  }

  const newPassword: string = password
    ? await bcrypt.hash(password.trim(), 7)
    : "";

  user.username = username ? username.trim() : user.username;
  user.email = email ? email.trim() : user.email;
  user.body = body ? body.trim() : user.body;
  user.password = password ? newPassword : user.password;
  user.imageUrn = req.file ? req.file.filename : user.imageUrn;

  if (req.file) {
    fs.unlink(`public/images/${oldImg}`, () => {
      console.log("ok");
    });
  }

  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: "Le profile n'a pas été changé" });
  }

  return res.status(200).json(user);
};

exports.deletePhoto = async (_: Request, res: Response) => {
  const user = res.locals.user;
  fs.unlink(`public/images/${user.imageUrn}`, () => {
    user.imageUrn = "";
  });
  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: "L'image n'a pas été effacé" });
  }
  return res.status(200).json(user);
};

exports.getProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Utilisateur·rice pas trouvé(e)" });
  }

  return res.status(200).json(user);
};
