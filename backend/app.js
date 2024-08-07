const express = require("express");
const puppeteer = require("puppeteer");
var cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.post("/analyze", async (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    const performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));

    const metrics = {
      pageLoadTime: performanceTiming.loadEventEnd - performanceTiming.navigationStart,
      totalRequestSize: 0,
      numberOfRequests: 0,
    };

    res.json({ data: metrics, msg: "🥳Website analyzed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error analyzing the website" });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => console.log(`Server running on port 3000`));