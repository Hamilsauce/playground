import { TableScraper } from './scraper.js';

const TABLE_SELECT0R = '.directory-listing-table'
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')



const scraper = new TableScraper();
scraper.setSourceTable(document.querySelector(TABLE_SELECT0R))
const tableData = scraper.scrape()
console.log('tableData', tableData)