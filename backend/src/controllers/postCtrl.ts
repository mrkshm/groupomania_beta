import { Request, Response } from "express";
const fs = require("fs");

import Post from "../entities/Post";
import Tag from "../entities/Tag";
import Comment from "../entities/Comment";
import { getRepository } from "typeorm";

// create Post
// get all Posts
// get one Post
// delete Post
// modify Post

exports.createPost = async (req: Request, res: Response) => {
  console.log(req.body);

  let newPost: any;
  if (req.body.post) {
    newPost = JSON.parse(req.body.post);
  } else {
    newPost = { ...req.body };
  }
  const { title, body, tag } = newPost;

  const imgUrl: string = req.file ? req.file.filename : "";

  const user = res.locals.user;

  // if (title.trim() === "" || body.trim() === "") {
  //   return res
  //     .status(400)
  //     .json({ message: "Titre et message ne peuvent pas etre vide" });
  // }

  try {
    const tagRecord = await Tag.findOneOrFail({ name: tag });

    const post = new Post({ title, body, imgUrl, user, tag: tagRecord });
    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;
  try {
    const posts = await Post.find({
      relations: ["comments", "votes"],
      order: { createdAt: "DESC" },
      skip: currentPage * postsPerPage,
      take: postsPerPage
    });
    posts.forEach(p => p.setUserVote(res.locals.user));
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.searchPosts = async (req: Request, res: Response) => {
  const { searchTerm } = req.params;
  if (!searchTerm || searchTerm === "") {
    return res.status(400).json({ message: "searchTerm cannot be empty" });
  }

  const searchResults = await getRepository(Post)
    .createQueryBuilder()
    .where("LOWER(title) LIKE :searchTerm", {
      searchTerm: `%${searchTerm.toLowerCase().trim()}%`
    })
    .orWhere("LOWER(body) LIKE :searchTerm", {
      searchTerm: `%${searchTerm.toLowerCase().trim()}%`
    })
    .orWhere("LOWER(Post.tagName) LIKE :searchTerm", {
      searchTerm: `%${searchTerm.toLowerCase().trim()}%`
    })
    .limit(30)
    .getMany();

  console.log(searchResults);

  return res.json(searchResults);
};

exports.getPostsWithTag = async (req: Request, res: Response) => {
  const { tagname } = req.params;
  try {
    const posts = await Post.find({
      where: {
        tagName: tagname
      },
      relations: ["comments", "votes"],
      order: { createdAt: "DESC" }
    });
    posts.forEach(p => p.setUserVote(res.locals.user));
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getPostsForUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const posts = await Post.find({
      where: {
        userName: username
      },
      relations: ["comments", "votes"],
      order: { createdAt: "DESC" }
    });
    posts.forEach(p => p.setUserVote(res.locals.user));
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getCommentsForUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const comments = await Comment.find({
      where: {
        username: username
      },
      // relations: ["post", "votes"],
      order: { createdAt: "DESC" }
    });
    comments.forEach(p => p.setUserVote(res.locals.user));
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      {
        identifier,
        slug
      },
      { relations: ["tag", "comments", "votes"] }
    );
    post.setUserVote(res.locals.user);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ error: "Le message n'a pas été trouvé" });
  }
};

exports.deletePost = (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  Post.findOne({ identifier, slug })
    .then(post => {
      if (!post) {
        return res.status(400).json({ message: "non trouvé" });
      }
      fs.unlink(`public/images/${post.imgUrl}`, () => {
        Post.delete({ identifier, slug })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Le message a été supprimé" });
          })
          .catch(error => {
            return res.status(500).json(error);
          });
      });
    })
    .catch(error => {
      return res.status(500).json(error);
    });
};

exports.modifyPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  const post = await Post.findOne({ identifier, slug });
  if (!post) {
    return res.status(400).json({ message: "Post pas trouvé" });
  }
  const newPost: Post = req.body.post
    ? JSON.parse(req.body.post)
    : { ...req.body };
  const { title, body, tagName } = newPost;

  const deleteImage: boolean = req.body.post
    ? JSON.parse(req.body.post.deleteImage)
    : req.body.deleteImage;

  if ((title && title.trim() === "") || (body && body.trim() === "")) {
    return res
      .status(400)
      .json({ message: "Titre et message ne peuvent pas etre vide" });
  }

  post.title = title ? title.trim() : post.title;
  post.body = body ? body.trim() : post.body;
  post.tagName = tagName ? tagName : post.tagName;
  if (req.file) {
    const oldImage = post.imgUrl;
    post.imgUrl = req.file.filename;
    fs.unlink(`public/images/${oldImage}`, () => {
      console.log("file deleted");
    });
  } else if (deleteImage) {
    fs.unlink(`public/images/${post.imgUrl}`, () => {
      console.log("file deleted");
    });
    post.imgUrl = "";
  } else {
    post.imgUrl = post.imgUrl;
  }

  // post.imgUrl = req.file ? req.file.filename : post.imgUrl;

  try {
    await post.save();
  } catch (error) {
    return res.status(400).json({ message: "Post pas sauvegardé" });
  }

  return res.status(200).json({ message: "Le Post a été sauvegardé" });
};
