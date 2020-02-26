import {AddiScrapper} from './addi-scrapper'
import {readFileSync} from "fs";
// @ts-ignore
import * as program from 'commander';
import {GetLandMarks} from "./GetLandMarks";

/*
let json = JSON.parse(readFileSync('./config/site.json').toString());
let c = new AddiScrapper(json["baseUrl"]);

c.crawl(json);*/
new GetLandMarks().parseData().then();
