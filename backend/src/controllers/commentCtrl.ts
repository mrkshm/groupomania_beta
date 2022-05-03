import { Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";

exports.createComment = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { body } = req.body;

  try {
    const post = await Post.findOneOrFail({
      identifier,
      slug
    });

    const comment = new Comment({
      body,
      user: res.locals.user,
      post
    });

    await comment.save();
    return res.json(comment);
  } catch (error) {
    return res.status(404).json({ error: "Le post n'a pas été trouvé" });
  }
};

exports.modifyComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;
  const comment = await Comment.findOne({ identifier });
  if (!comment) {
    return res.status(400).json({ message: "Commentaire pas trouvé" });
  }

  comment.body = body;

  try {
    await comment.save();
  } catch (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json({ message: "Le commentaire a été modifié" });
};

exports.deleteComment = (req: Request, res: Response) => {
  const { identifier } = req.params;

  Comment.findOne({ identifier })
    .then(comment => {
      if (!comment) {
        return res.status(400).json({ message: "non trouvé" });
      }
      Comment.delete({ identifier })
        .then(() => {
          return res
            .status(200)
            .json({ message: "Le commentaire a été supprimé" });
        })
        .catch(error => {
          return res.status(500).json(error);
        });
    })
    .catch(error => {
      return res.status(500).json(error);
    });
};

exports.getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    // code
    const post = await Post.findOneOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"]
    });

    if (res.locals.user) {
      comments.forEach(c => c.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
};
