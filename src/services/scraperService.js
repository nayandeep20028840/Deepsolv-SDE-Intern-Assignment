const puppeteer = require("puppeteer");
const Page = require("../models/page");

exports.scrapePageDetails = async (username) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`https://www.facebook.com/${username}`, { waitUntil: 'domcontentloaded' });
    const pageDetails = await page.evaluate(() => {
        const name = document.querySelector("h1") ? document.querySelector("h1").innerText : "No name found";
        const profilePic = document.querySelector("img") ? document.querySelector("img").src : "";
        const url = window.location.href;
        const facebookId = window.location.pathname.split('/')[1];
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

        const email = document.querySelector("a[href^='mailto:']") ? document.querySelector("a[href^='mailto:']").innerText : "";
        const website = document.querySelector("a[href^='http']") ? document.querySelector("a[href^='http']").innerText : "";
        const category = document.querySelector("span[data-testid='category']") ? document.querySelector("span[data-testid='category']").innerText : "";

        let createdAt = null;

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

    if (!pageDetails.url || !pageDetails.facebook_id || !pageDetails.name) {
        throw new Error("Scraping failed: Missing required fields (url, facebook_id, name).");
    }

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
