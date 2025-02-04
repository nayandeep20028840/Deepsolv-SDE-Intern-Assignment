const puppeteer = require("puppeteer");
const Page = require("../models/page");

exports.scrapePageDetails = async (username) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navigate to the Facebook page URL
    await page.goto(`https://www.facebook.com/${username}`, { waitUntil: 'domcontentloaded' });

    // Extract the page details
    const pageDetails = await page.evaluate(() => {
        // Name of the page
        const name = document.querySelector("h1") ? document.querySelector("h1").innerText : "No name found";
        
        // Profile picture URL
        const profilePic = document.querySelector("img") ? document.querySelector("img").src : "";
        
        // Current page URL
        const url = window.location.href;
        
        // Facebook platform ID (from URL)
        const facebookId = window.location.pathname.split('/')[1];
        
        // Followers and Likes (if available)
        let followers = 0;
        let likes = 0;
        const followersElement = document.querySelector("div[data-testid='followers_count']");
        const likesElement = document.querySelector("div[data-testid='like_count']");

        if (followersElement) {
            followers = parseInt(followersElement.innerText.replace(/[^0-9]/g, ""));
        }
        if (likesElement) {
            likes = parseInt(likesElement.innerText.replace(/[^0-9]/g, ""));
        }

        // Other potential fields (email, website, category)
        const email = document.querySelector("a[href^='mailto:']") ? document.querySelector("a[href^='mailto:']").innerText : "";
        const website = document.querySelector("a[href^='http']") ? document.querySelector("a[href^='http']").innerText : "";
        const category = document.querySelector("span[data-testid='category']") ? document.querySelector("span[data-testid='category']").innerText : "";

        // Page creation date (optional, can be tricky)
        let createdAt = null; // This might not be available depending on the page.

        return {
            name,
            profile_pic: profilePic,
            url,
            facebook_id: facebookId,
            followers,
            likes,
            email,
            website,
            category,
            created_at: createdAt
        };
    });

    await browser.close();

    // Validate that all required fields are present before saving
    if (!pageDetails.url || !pageDetails.facebook_id || !pageDetails.name) {
        throw new Error("Scraping failed: Missing required fields (url, facebook_id, name).");
    }

    // Create a new Page instance and save to DB
    const newPage = new Page({
        username,
        name: pageDetails.name,
        profile_pic: pageDetails.profile_pic,
        url: pageDetails.url,
        facebook_id: pageDetails.facebook_id,
        followers: pageDetails.followers,
        likes: pageDetails.likes,
        email: pageDetails.email,
        website: pageDetails.website,
        category: pageDetails.category,
        created_at: pageDetails.created_at
    });

    await newPage.save();
    return newPage;
};
