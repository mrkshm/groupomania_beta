import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Pas authentifié(e)");
    }
    const { email }: any = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Pas authentifié(e)");
    }
    // TODO res => next

    res.locals.user = user;
    console.log("from auth", res.locals.user);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Pas authentifié(e)" });
  }
};
