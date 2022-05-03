import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Tag from "../entities/Tag";
const { ownsTag } = require("../middleware/permissions");
import auth from "../middleware/auth";
import isAdmin from "../middleware/auth";
import Post from "../entities/Post";

const { tagValidator } = require("../middleware/validator");

const createTag = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const user: User = res.locals.user;

  try {
    const errors: any = {};
    if (isEmpty(name)) errors.name = "Le nom ne peut pas être vide";

    const tag = await getRepository(Tag)
      .createQueryBuilder("tag")
      .where("lower(tag.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (tag) errors.name = "Ce tag existe déjà";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const tag = new Tag({ name, description, user });
    await tag.save();

    return res.json(tag);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getTags = async (_: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    const newTags = await Promise.all(
      tags.map(async tag => {
        const tagCount = await Post.find({ tagName: tag.name });
        tag.setTagCount(tagCount.length);
      })
    );

    console.log(newTags);

    return res.json(tags);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTag = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const tag = await Tag.findOne({ slug });
  const tagCount = await Post.find({ tagName: tag.name });
  tag.setTagCount(tagCount.length);

  if (!tag) {
    return res.status(400).json({ message: "Tag pas trouvé" });
  }
  return res.json(tag);
};

const modifyTag = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const tag = await Tag.findOne({ slug });
  if (!tag) {
    return res.status(400).json({ message: "Tag pas trouvé" });
  }
  if (req.body.name && req.body.name === "") {
    return res.status(400).json({ message: "Nom doit être renseigné" });
  }
  tag.name = req.body.name ? req.body.name : tag.name;
  tag.description = req.body.description
    ? req.body.description
    : tag.description;

  try {
    tag.save();
  } catch (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json({ message: "Le tag a été bien modifié" });
};

const cleanTags = async (_: Request, res: Response) => {
  const tags = await Tag.find();

  console.log(tags);

  const newTags = await Promise.all(
    tags.map(async tag => {
      const tagCount = await Post.find({ tagName: tag.name });
      tag.setTagCount(tagCount.length);

      const slug = tag.slug;

      if (tag.tagCount < 1) {
        try {
          Tag.delete({ slug });
        } catch (error) {
          console.log(error);
        }
      }
    })
  );
  console.log("newTags", newTags);

  return res.status(200).json({ message: "a-ok" });
};

const deleteTag = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const tag = await Tag.findOne({ slug }, { relations: ["posts"] });

  if (!tag) {
    return res.status(400).json({ message: "Tag pas trouvé" });
  }

  if (tag.posts.length > 0) {
    return res
      .status(400)
      .json({ message: "Il y a encore des posts associés avec ce tag." });
  }
  try {
    Tag.delete({ slug });
  } catch (error) {
    return res.status(400).json(error);
  }

  return res.status(200).json({ message: "La Tag a été supprimé" });
};

const router = Router();

router.post("/", auth, tagValidator, createTag);
router.get("/", auth, getTags);
router.get("/clean/tags", auth, isAdmin, cleanTags);
router.get("/:slug", auth, getTag);
router.put("/:slug", auth, ownsTag, tagValidator, modifyTag);
router.delete("/:slug", auth, ownsTag, deleteTag);

export default router;
