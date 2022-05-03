import { validate, isEmpty } from "class-validator";
import { Request, Response } from "express";
import User from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import sendEmail from "../util/sendEmail";

exports.register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    // Validation
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      return res.status(400).json("Cet(te) utilisateur·rice existe déjà");
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json("Cette adresse existe déjà");
    }

    const user = new User({ email, username, password });

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.login = async (req: Request, res: Response) => {
  // code
  const { email, password } = req.body;

  try {
    const errors: any = {};
    if (isEmpty(email)) {
      errors.email = "Utilisateur·rice ne peut pas être vide";
    }
    if (isEmpty(password)) {
      errors.password = "Le mot de passe ne peut pas être vide";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: "what" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Cet(te) utilisateur·rice n'a pas été trouvé(e)" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ message: "Le mot de passe n'est pas correct" });
    }

    const token = jwt.sign({ email }, process.env.SECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/"
      })
    );

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.logout = (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/"
    })
  );
  return res.status(200).json({ success: true });
};

exports.pwResetRequest = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // If user does not exist, send 200 to get rid of bots
  if (!user) {
    return res.status(400).json({
      message: "Cet(te) utilisateur·rice n'existe pas"
    });
  }
  // If user exists, send login link that expires in 15 minutes
  const secret = process.env.SECRET + user.password;
  const payload = { email: user.email, id: user.username };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });

  const link = `http://localhost:5500/api/auth/reset-password/${user.username}/${token}`;

  sendEmail(link);

  return res.status(200).json({ message: "reset request ok" });
};

exports.pwReset = async (req: Request, res: Response) => {
  const { username, token } = req.params;

  // check db for user with id , if no user res status 400
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(404)
      .json({ error: "Cet(te) utilisateur·rice n'existe pas" });
  }

  // we have a user with the id
  const secret = process.env.SECRET + user.password;
  console.log("the first secret: ", secret);

  try {
    const payload = jwt.verify(token, secret);
    if (payload) {
      res.redirect(`http://localhost:3000/reset/${username}/${token}`);
    }
    return res.status(200).json({ message: "Payload is ok." });
  } catch (error) {
    console.log(error);
  }
};

exports.newPassword = async (req: Request, res: Response) => {
  console.log("starting");

  const { username, token } = req.params;
  const { password, password2 } = req.body;
  console.log("all the args: ", username, password, password2, token);

  const user = await User.findOne({ username });
  if (password !== password2) {
    return res.status(400).json({ error: "Passwords don't match" });
  }
  if (!user) {
    return res
      .status(404)
      .json({ error: "Cet(te) utilisateur·rice n'existe pas" });
  }
  console.log("here is the user: ", user);

  const secret = process.env.SECRET + user.password;
  console.log("here is the secret: ", secret);

  try {
    console.log("trying...");

    const payload = jwt.verify(token, secret);
    if (payload) {
      user.password = await bcrypt.hash(password, 7);
      try {
        user.save();
      } catch (error) {
        console.log("error in here");
      }
    }
    return res.status(200).json({ message: "User is saved." });
  } catch (error) {
    console.log("errir on there");
  }
};
