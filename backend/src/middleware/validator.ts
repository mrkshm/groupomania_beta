import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).max(50).required()
});

const postSchema = Joi.object({
  title: Joi.string().max(100).trim(),
  body: Joi.string().max(999).trim(),
  tag: Joi.string().max(30).trim()
});

const commentSchema = Joi.object({
  body: Joi.string().max(999).trim()
});

const tagSchema = Joi.object({
  name: Joi.string().max(50).trim(),
  description: Joi.string().max(500).trim()
});

// The Validation Functions

const userValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cleanUser = await userSchema.validateAsync({
      email: req.body.email,
      password: req.body.password
    });
    console.log(cleanUser);

    next();
  } catch (error) {
    return res.status(400).json({
      message:
        "La validation a échouée. Veuillez vérifier les données renseignées."
    });
  }
};

const postValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cleanPost = await postSchema.validateAsync({
      title: req.body.title,
      body: req.body.body,
      tag: req.body.tag
    });
    console.log(cleanPost);

    next();
  } catch (error) {
    return res.status(400).json({
      message:
        "La validation a échouée. Veuillez vérifier les données renseignées."
    });
  }
};

const commentValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cleanComment = await commentSchema.validateAsync({
      body: req.body.body
    });
    console.log(cleanComment);

    next();
  } catch (error) {
    return res.status(400).json({
      message:
        "La validation a échouée. Veuillez vérifier les données renseignées."
    });
  }
};

const tagValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cleanTag = await tagSchema.validateAsync({
      name: req.body.name,
      description: req.body.description
    });
    console.log(cleanTag);

    next();
  } catch (error) {
    return res.status(400).json({
      message:
        "La validation a échouée. Veuillez vérifier les données renseignées."
    });
  }
};

module.exports = {
  userValidator,
  postValidator,
  commentValidator,
  tagValidator
};
