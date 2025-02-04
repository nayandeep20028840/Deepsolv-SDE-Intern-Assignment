const Page = require("../models/page");
const Post = require("../models/Post");
const Follower = require("../models/Follower");
const Following = require("../models/Following");
const Comment = require("../models/Comment");
const { scrapePageDetails } = require("../services/scraperService");

// Get page details by username
exports.getPageDetails = async (req, res) => {
    const { username } = req.params;
    try {
        let page = await Page.findOne({ username });
        if (!page) {
            page = await scrapePageDetails(username);
            if (!page) {
                return res.status(404).json({ message: "Page not found or scraping failed." });
            }
            await page.save();
        }
        res.json(page);
    } catch (err) {
        console.error("Error fetching page details:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch pages by filters (minFollowers, maxFollowers, name, category, etc.)
exports.getPagesByFilters = async (req, res) => {
    const { minFollowers, maxFollowers, name, category, page = 1, limit = 10 } = req.query;
    const filter = {};
    try {
        if (minFollowers || maxFollowers) {
            filter.followers = { $gte: minFollowers || 0, $lte: maxFollowers || Infinity };
        }
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (category) {
            filter.category = category;
        }
        const pages = await Page.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(pages);
    } catch (err) {
        console.error("Error fetching pages by filters:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get followers for a given page
exports.getFollowerList = async (req, res) => {
    const { username } = req.params;
    try {
        const page = await Page.findOne({ username });
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }
        const followers = await Follower.find({ page_id: page._id }).populate("user_id");
        res.json(followers);
    } catch (err) {
        console.error("Error fetching followers:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get following list for a given page
exports.getFollowingList = async (req, res) => {
    const { username } = req.params;
    try {
        const page = await Page.findOne({ username });
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }
        const following = await Following.find({ page_id: page._id }).populate("user_id");
        res.json(following);
    } catch (err) {
        console.error("Error fetching following list:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get recent posts for a given page
exports.getRecentPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const page = await Page.findOne({ username });
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }
        const posts = await Post.find({ page_id: page._id })
            .sort({ created_at: -1 }) // Sort by creation date in descending order
            .limit(15);
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get comments for a specific post on a page
exports.getPostComments = async (req, res) => {
    const { username, postId } = req.params;
    try {
        const page = await Page.findOne({ username });
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }
        const post = await Post.findOne({ _id: postId, page_id: page._id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comments = await Comment.find({ post_id: post._id });
        res.json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
