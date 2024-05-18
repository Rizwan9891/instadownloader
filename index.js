
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const puppeteer = require('puppeteer');

app.post('/api/ins', async (req, response) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false,
            userDataDir: './tmp'
        })
        const page = await browser.newPage();
        await page.goto(req.body.url);
        await page.waitForSelector('video');
        const videos = await page.$$("video");
        for (const video of videos) {
            const v = await page.evaluate(el => el.src, video)
            response.status(200).json({
                error: false,
                message: "Data Found",
                data: v
            });
        }
    } catch (err) {
        console.log(err);
        // handle any issues with invalid links
        response.json({
            error: "There is a problem with the link you have provided."
        });
    }
})
// our sever is listening on port 3001 if we're not in production
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

module.exports = app;
