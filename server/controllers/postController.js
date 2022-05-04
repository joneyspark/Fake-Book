import Post from "../models/post.js"
import mongoose from "mongoose"
export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 3;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Post.countDocuments({});

        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await Post.find({ $or: [{ title: title }, { tags: { $in: tags.split(',') } }] });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createNewPost = async (req, res) => {
    const postBody = req.body;
    const newPost = new Post({ ...postBody, creator: req.userId, createdAt: new Date().toISOString() });

    console.log(newPost);

    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No Post Found with that Id")

    const updatePost = await Post.findByIdAndUpdate(_id, post, { new: true })

    res.json(updatePost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Post Found with that ID");

    await Post.findByIdAndRemove(id)

    res.json({ message: 'Post Deleted Successfully' })
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Post Found with that ID");

    const post = await Post.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }
    const updateLikePost = await Post.findByIdAndUpdate(id, post, { new: true })

    res.json(updateLikePost);
}

export const CommentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body

    const post = await Post.findById(id);
    post.comments.push(value);

    const updatePost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.json(updatePost);


}
