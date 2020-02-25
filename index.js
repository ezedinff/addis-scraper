const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");


(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(`http://www.addisababa.gov.et/de/web/guest/sub-cities`);
    await page.waitForSelector("ul.level-2>li");

    await page.evaluate(() => {
      var urls = document.querySelectorAll(`ul.level-2>li>a`);
      urls.forEach(url => this.goToSubCityAndReturnData(this.browser, url.getAttribute('href')));
    });
    // console.log(news);
    await browser.close();
    // // Writing the news inside a json file
    // fs.writeFile("hackernews.json", JSON.stringify(news), function(err) {
    //   if (err) throw err;
    //   console.log("Saved!");
    // });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();

goToSubCityAndReturnData(browser, url) {
    var page = await browser.newPage();
    await page.goto(url);
    console.log(url)
 }