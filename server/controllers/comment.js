const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
    const { content, postId } = req.body;
    try {
        const comment = new Comment({ content, author: req.user.id, post: postId });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Allow only the author or admin to edit the comment
        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        comment.content = content; // Update the content
        await post.save();

        res.json(comment); // Return the updated comment
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ post: postId }).populate("author", "username");
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCommentAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Allow only the author or admin to delete the comment
        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await comment.remove();
        res.json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
