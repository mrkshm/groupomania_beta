import { NextFunction, Request, Response } from "express";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import Tag from "../entities/Tag";

const ownsPost = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user.username;
  const { identifier } = req.params;
  const post = await Post.findOne({ identifier }, { relations: ["user"] });
  if (!post) {
    return res.status(400).json({ message: "non trouvé" });
  }
  const owner = post.user.username;

  if (user == owner) {
    next();
  } else {
    return res
      .status(401)
      .json({ error: "Vous n'êtes pas autorisé(e) à faire ça" });
  }
};

const ownsComment = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user.username;
  const { identifier } = req.params;
  const comment = await Comment.findOne(
    { identifier },
    { relations: ["user"] }
  );
  if (!comment) {
    return res.status(400).json({ message: "non trouvé" });
  }
  const owner = comment.user.username;

  if (user == owner) {
    next();
  } else {
    return res
      .status(401)
      .json({ error: "Vous n'êtes pas autorisé(e) à faire ça" });
  }
};

const ownsCommentOrIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const { identifier } = req.params;
  const comment = await Comment.findOne(
    { identifier },
    { relations: ["user"] }
  );
  if (!comment) {
    return res.status(400).json({ message: "non trouvé" });
  }
  const owner = comment.user.username;
  console.log("owner is ", owner);
  console.log(user.isAdmin);
  console.log(user.username);

  if (user == owner || user.isAdmin) {
    next();
  } else {
    return res
      .status(401)
      .json({ error: "Vous n'êtes pas autorisé(e) à faire ça" });
  }
};

const ownsTag = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user.username;
  const { name } = req.params;
  const tag = await Tag.findOne({ name }, { relations: ["user"] });
  if (!tag) {
    return res.status(400).json({ message: "Tag non trouvé" });
  }
  const owner = tag.user.username;

  if (user == owner || res.locals.user.isAdmin) {
    next();
  } else {
    return res
      .status(401)
      .json({ error: "Vous n'êtes pas autorisé(e) à faire ça" });
  }
};

const isAdmin = (_: Request, res: Response, next: NextFunction) => {
  res.locals.user.isAdmin
    ? next()
    : res.status(403).json({ message: "Ceci n'est pas autorisé(e)" });
};

module.exports = {
  ownsPost,
  ownsComment,
  ownsTag,
  isAdmin,
  ownsCommentOrIsAdmin
};
