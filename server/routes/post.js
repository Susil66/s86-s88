const express = require("express");
const { createPost, getPosts, updatePost, deletePost } = require("../controllers/postController");
const {verify , verifyAdmin} = require("..auth.js");
const { deletePostAdmin } = require("../controllers/user");
const router = express.Router();
/* User Only Routes */
router.get("/",verify, getPosts);
router.post("/",verify, createPost);
router.put("/:id",verify, updatePost);
router.delete("/:id",verify, deletePost);
/* Admin Only Routes */
router.delete("/admin",verify,verifyAdmin, deletePostAdmin);
module.exports = router;
