
import * as fs from "fs";
import puppeteer from 'puppeteer'
import {existsSync, mkdirSync} from "fs";

export class AddiScrapper {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    crawl(site: any) {
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await this.crawlInternal(page, `${this.baseUrl}`, site["children"][0]['children'], site["name"]);

            await browser.close();
        })();
    }

    /**
     * Crawling the site recursively
     * selectors is a list of selectors of child pages.
     */
    async crawlInternal(page: any, path: string, selectors, dirname: string) {
        console.log(selectors.length);
        if (!existsSync(dirname)) {
            mkdirSync(dirname);
        }
        let url = new URL(path);
        await page.goto(path, {waitUntil: 'networkidle2'});
       // await page.pdf({path: `${dirname}/${url.pathname.slice(1).replace("/", "-")}.pdf`, format: 'A4'});
        // @ts-ignore
        if (selectors.length === 0) {
            return;
        }

        // TODO: Handle multiple chid selectors.
        let items: [string] = await page.evaluate((sel) => {
            let ret = [];
            for (let item of document.querySelectorAll(sel)) {
                let href = item.getAttribute("href");
                console.log(href);
                ret.push(href);
            }
            return ret;
        }, selectors[0]);
        const subCities = [];
        for (let item of items) {
            console.log(`Capturing ${item}`);
            subCities.push(
                await this.crawlerSub(page, `${item}`, ['.journal-content-article>p'], `${dirname}/${selectors[0]}`)
            );
        }
        fs.writeFile('sub-cities.json', JSON.stringify(subCities), () => {});
    }

    async crawlerSub(page, path, selector, dire) {
        await page.goto(path, {waitUntil: 'networkidle2'});
        const data = await page.evaluate((sel, path) => {
            const params = document.querySelectorAll(sel);
            const name = document.querySelectorAll('span.portlet-title-text');
            console.log(params);
            const d = {};
            // @ts-ignore
            d['name'] = name.item(0).innerText.trim();
            for (const param of params) {
                const prop = param.innerText.trim().split(':');
                if (prop) {
                    if (prop.length == 2) {
                        if (prop[0].length > 3 && prop[1].length > 3) {
                            d[prop[0]] = prop[1].trim();
                        }
                    }
                }
            }
            d['link'] = path;
            return d;
        }, selector, path);
        console.log(data);
        return data;
    }
}
