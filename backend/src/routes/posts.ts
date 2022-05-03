import { Router } from "express";
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/postCtrl");
const commentCtrl = require("../controllers/commentCtrl");
const {
  ownsPost,
  ownsComment,
  isAdmin,
  ownsCommentOrIsAdmin
} = require("../middleware/permissions");
const { postValidator, commentValidator } = require("../middleware/validator");

import auth from "../middleware/auth";

const router = Router();

// postCtrl
router.post("/", auth, postValidator, multer, postCtrl.createPost);
router.get("/", auth, postCtrl.getPosts);
router.get("/search/:searchTerm", auth, postCtrl.searchPosts);
router.get("/posts/from/:username", auth, postCtrl.getPostsForUser);
router.get("/with/tag/:tagname", auth, postCtrl.getPostsWithTag);
router.get("/comments/from/:username", auth, postCtrl.getCommentsForUser);
router.get("/:identifier/:slug", auth, postCtrl.getPost);
router.put(
  "/:identifier/:slug",
  auth,
  ownsPost,
  postValidator,
  multer,
  postCtrl.modifyPost
);
router.delete("/:identifier/:slug", auth, isAdmin, postCtrl.deletePost);
// commentCtrl
router.get("/:identifier/:slug/comments", auth, commentCtrl.getPostComments);
router.post(
  "/:identifier/:slug/comments",
  auth,
  commentValidator,
  commentCtrl.createComment
);
router.put(
  "/:identifier",
  auth,
  ownsComment,
  commentValidator,
  commentCtrl.modifyComment
);
router.delete(
  "/:identifier",
  auth,
  ownsCommentOrIsAdmin,
  commentCtrl.deleteComment
);

export default router;
