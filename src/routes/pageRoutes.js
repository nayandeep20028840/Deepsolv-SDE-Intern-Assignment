const express = require("express");
const { 
    getPageDetails, 
    getPagesByFilters, 
    getRecentPosts, 
    getPostComments, 
    getFollowingList, 
    getFollowerList 
} = require("../controllers/pageController");
const router = express.Router();

router.get("/:username", getPageDetails);
router.get("/", getPagesByFilters);
router.get("/:username/followers", getFollowerList);
router.get("/:username/following", getFollowingList);
router.get("/:username/posts", getRecentPosts);
router.get("/:username/posts/:postId/comments", getPostComments);

module.exports = router;
