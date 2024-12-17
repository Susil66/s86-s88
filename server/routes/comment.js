const express = require("express");
const { createComment, deleteCommentUser, editComment, deleteCommentAdmin  } = require("../controllers/comment");
const {verify, verifyAdmin} = require("../auth")
const router = express.Router();

/* User Routes */
router.post("/:postId/comments", verify, createComment);
router.patch("/:postId/comments/:commentId",verify,editComment);
router.delete("/:postId/comments/:commentId", verify, deleteCommentUser);

/* Admin Routes */
router.delete("/:postId/comments/:commentId",verify, verifyAdmin, deleteCommentAdmin);

module.exports = router;
