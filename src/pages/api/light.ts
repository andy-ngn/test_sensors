import type { NextApiHandler } from "next";
import fs from "fs";
import lighthouse, { Flags } from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const handler: NextApiHandler = async (req, res) => {
  try {
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options: Flags = {
      logLevel: "info",
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      onlyAudits: [
        "first-meaningful-paint",
        "first-cpu-idle",
        "byte-efficiency/uses-optimized-images",
      ],

      port: chrome.port,
    };
    const runnerResult = await lighthouse("https://www.ariadne.inc/", options);

    // `.report` is the HTML report as a string
    const reportHtml = runnerResult?.report;
    console.log("Report is done for", runnerResult?.lhr.finalDisplayedUrl);
    // console.log(
    //   "Performance score was",
    //   runnerResult.lhr.categories.performance.score * 100
    // );

    chrome.kill();
    return res.json(reportHtml);
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode || 500).json(error);
  }
};

export default handler;
