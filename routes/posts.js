const mongoose = require('mongoose');  // Add this import
const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const User = require('../Models/User');
const verifyToken = require('../middleware/verifyToken');

// Create a new post
router.post("/create", verifyToken, async (req, res) => {
    const newPost = new Post({
        userId: req.body.userId,  // Should be ObjectId of the user
        desc: req.body.desc || "",  // Optional description
        photo: req.body.photo || "",  // Optional photo
        like: 0,  // Default value for like
        comments: [],  // Default value for comment
        date: new Date().toISOString(),  // Automatically set the post's creation date
    });

    try {
        const savedPost = await newPost.save();  // Save the new post to the database
        res.status(200).json(savedPost);
    } catch (err) {
        console.log("error: ", err)
        res.status(500).json(err);
    }
});

// Get comments for a specific post
router.get('/:postId/comments', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.status(200).json(post.comments); // Assuming comments are stored in the post document
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add a comment to a post
router.post('/:postId/comments', async (req, res) => {
    try {
        console.log('Request body:', req.body);

        // Find the post by ID
        const post = await Post.findById(req.params.postId);
        console.log('Found post:', post);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Fetch the username from the User model using the userId
        const user = await User.findById(req.body.userId);
        console.log('Found user:', user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new comment with a unique _id
        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            userId: req.body.userId,
            text: req.body.text,
            username: user.username,
            createdAt: new Date()
        };

        // Push the comment into the comments array of the post
        post.comments.push(newComment);
        console.log('Updated post with new comment:', post.comments);

        // Save the updated post
        await post.save();
        res.status(200).json(newComment);
    } catch (err) {
        console.error('Error while adding comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a comment from a post
router.delete('/:postId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        // Find the post by its ID
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json("Post not found");

        // Find the comment by its ID in the comments array
        const commentIndex = post.comments.findIndex(comment => comment && comment._id && comment._id.toString() === req.params.commentId);

        // Handle the case where the comment is not found
        if (commentIndex === -1) return res.status(404).json("Comment not found");

        const comment = post.comments[commentIndex];

        // Check if the user is either the comment's author or an admin
        if (comment.userId === req.body.userId || req.body.isAdmin) { // Delete allowed by author or admin
            // Remove the comment from the array
            post.comments.splice(commentIndex, 1);
            await post.save();  // Save the updated post
            res.status(200).json("Comment deleted");
        } else {
            res.status(403).json("You can only delete your own comments or be an admin to delete");
        }
    } catch (err) {
        console.error('Error while deleting comment:', err);
        res.status(500).json("Internal server error");
    }
});


// Edit a post
router.put("/:postId/edit", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        const user = await User.findById(req.body.userId)
        if (post.userId === req.body.userId || user.isAdmin) { // Update allowed by author or admin
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post is updated");

        } else {
            res.status(403).json("User is not owner of post")
        }
    } catch (err) {
        res.status(500).json(err);
    }
})


// delete a post
router.delete("/:postId/delete", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        const user = await User.findById(req.body.userId);
        if (post.userId === req.body.userId || user.isAdmin) { // Removal allowed by author or admin
            await post.deleteOne();
            res.status(200).json("The post is deleted");

        } else {
            res.status(403).json("User is not owner of post")
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//like a post
router.put("/:postId/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        if (!post.likes.includes(req.body.userId)) {
            console.log("3")
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post is liked by the user");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post is disliked by the user");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//get a post
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get all posts or filter by userId, sorted by newest first
router.get("/", verifyToken, async (req, res) => {
    console.log("User making request:", req.user);  // Log the user making the request
    console.log("Fetching posts...");

    try {
        const { userId } = req.query; // Get the userId from query parameters

        let posts;
        if (userId) {
            // Fetch posts only for the specific userId, sorted by creation date
            posts = await Post.find({ userId }).sort({ createdAt: -1 }); // Sort by descending creation date
            console.log(`Posts fetched for userId ${userId}:`, posts);
        } else {
            // Fetch all posts, sorted by creation date
            posts = await Post.find().sort({ createdAt: -1 }); // Sort by descending creation date
            console.log("All posts fetched:", posts);
        }

        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);  // Log any errors
        res.status(500).json("Error fetching posts");
    }
});


// //get all following user's post
// router.get("/user/timeline", async (req, res) => {
//     let postArray = [];

//     try {
//         const currentUser = await User.findById(req.body.userId);
//         const userPosts = await Post.find({ userId: currentUser._id });
//         const friendPosts = await Promise.all(
//             currentUser.following.map((friendId) => {
//                 return Post.find({ userId: friendId })
//             })
//         );
//         console.log(friendPosts);
//         res.status(200).json(userPosts.concat(...friendPosts));
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })


module.exports = router;