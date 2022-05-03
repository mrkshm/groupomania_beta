import { Request, Response } from "express";
import User from "../entities/User";
import { makeId } from "../util/helpers";
const fs = require("fs");

// deactivate
// reactivate
// makeAdmin
// demoteAdmin
// deleteAccount (anonymize)
// annihilateAccount (really delete !USE WITH CARE!)

exports.deactivate = async (req: Request, res: Response) => {
  const { username } = req.params;
  const authUser = res.locals.user.username;

  if (username == authUser || res.locals.user.isAdmin) {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Utilisateur·rice pas trouvé(e)" });
    }
    if (!user.isActive) {
      return res
        .status(400)
        .json({ message: "Utilisateur·rice déjà dèsactivé(e)" });
    }
    user.isActive = false;
    try {
      await user.save();
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Utilisateur·rice pas sauvegardé(e)" });
    }
    return res.status(200).json({ message: "Utilisateur·rice dèsactivé(e)" });
  } else {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à faire ça" });
  }
};

exports.reactivate = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Utilisateur·rice pas trouvé(e)" });
  }
  if (user.isActive) {
    return res.status(400).json({ message: "Utilisateur·rice déjà activé(e)" });
  }
  user.isActive = true;
  try {
    await user.save();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Utilisateur·rice pas sauvegardé(e)" });
  }
  return res.status(200).json({ message: "Utilisateur·rice réactivé(e)" });
};

exports.makeAdmin = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Utilisateur·rice pas trouvé(e)" });
  }
  if (user.isAdmin) {
    return res
      .status(400)
      .json({ message: "Utilisateur·rice déjà administrateur·rice" });
  }
  user.isAdmin = true;
  try {
    await user.save();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Utilisateur·rice pas sauvegardé(e)" });
  }
  return res.status(200).json({
    message: `Utilisateur·rice ${username} est maintenant administrateur·rice`
  });
};

exports.demoteAdmin = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas trouvé(e)` });
  }
  if (!user.isAdmin) {
    return res.status(400).json({
      message: `Utilisateur·rice ${username} n'est pas administrateur·rice`
    });
  }
  user.isAdmin = false;
  try {
    await user.save();
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas sauvegardé(e)` });
  }
  return res.status(200).json({
    message: `Utilisateur·rice ${username} n'est plus administrateur·rice`
  });
};

exports.deleteAccount = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas trouvé(e)` });
  }
  const deletedUserId = makeId(6);
  if (user.imageUrn !== "") {
    fs.unlink(`public/images/${user.imageUrn}`, () => {
      console.log("ok");
    });
  }

  user.username = `DeletedUser-${deletedUserId}`;
  user.password = makeId(7);
  user.email = `${deletedUserId}@deleted.del`;
  user.imageUrn = "";
  user.isActive = false;
  user.isAdmin = false;

  try {
    await user.save();
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas supprimeé(e)` });
  }
  return res
    .status(200)
    .json({ message: `Compte de l'utilisateur·rice ${username} supprimeé(e)` });
};

exports.annihilate = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas trouvé(e)` });
  }

  if (user.imageUrn !== "") {
    fs.unlink(`public/images/${user.imageUrn}`, () => {
      console.log("ok");
    });
  }

  try {
    await User.delete({ username });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Utilisateur·rice ${username} pas supprimeé(e)` });
  }
  return res
    .status(200)
    .json({ message: `Compte de l'utilisateur·rice ${username} supprimeé(e)` });
};
