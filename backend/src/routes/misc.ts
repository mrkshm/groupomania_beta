import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import User from "../entities/User";
import Vote from "../entities/Vote";
import Comment from "../entities/Comment";

import auth from "../middleware/auth";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;
  console.log(req.body);

  // validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res
      .status(400)
      .json({ message: "le vote ne peut être que -1, 0 ou 1" });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // If there is a comment identifier, find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // Else find vote by post
      vote = await Vote.findOne({ user, post });
    }

    // if ((!vote && !comment) || (!post && !vote)) {
    //   return res
    //     .status(400)
    //     .json({ message: "commentaire ou post pas trouvé" });
    // }
    // console.log("votevalue", vote.value, "value", value);

    if (!vote && value === 0) {
      // if no vote and value = 0 return error
      return res.status(404).json({ error: "Vote not found" });
    } else if (!vote) {
      // If no vote, create it
      vote = new Vote({ user, value });
      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }
      await vote.save();
    } else if (value === 0) {
      // if vote exists and value == 0, remove vote from DB
      await vote.remove();
    } else if (vote.value === value) {
      vote.value = 0;
      await vote.save();
    } else if (vote.value !== value) {
      // If vote, and value has changed, update vote
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOne(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "tag", "votes"] }
    );
    post.setUserVote(user);
    post.comments.forEach(c => c.setUserVote(user));

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post("/vote", auth, vote);

export default router;
