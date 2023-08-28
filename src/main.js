import {
    Actor
} from 'apify';
import {
    CheerioCrawler,
    Dataset
} from 'crawlee';

const BASE_URL = 'https://www.dmpublishing.cz/en/references';
const PAGINATION_SELECTOR = '.pagination-wrapper li.num';
const ITEM_SELECTOR = '.list-item-reference';
const HEADING_SELECTOR = '.list-item-heading';
const ANOTATION_SELECTOR = '.list-item-anotation';
const OVERLAY_TEXT_SELECTOR = '.overlay-txt';
const OVERLAY_LINK_SELECTOR = '.overlay-link a';
const ITEM_IMG_SELECTOR = '.list-item-image';
const START_PAGE = 2;

// First request to determine the total number of pages
const firstRequest = {
    url: BASE_URL,
    userData: {
        isFirstRequest: true
    }
};

let totalPageCount = 1;

const initTotalPageCount = $ => totalPageCount = $(PAGINATION_SELECTOR).length

const buildClient = element => {
    const client = {};
    client.Name = element.find(HEADING_SELECTOR).text().trim();
    client.Annotation = element.find(ANOTATION_SELECTOR).text().trim();
    client.Content = element.find(OVERLAY_TEXT_SELECTOR).text().trim();
    client.Link = element.find(OVERLAY_LINK_SELECTOR).attr('href');
    client.Image = element.find(ITEM_IMG_SELECTOR).attr('data-src');
    return client;
}

const generateStartRequests = () => {
    const requests = [];
    for (let page = START_PAGE; page <= totalPageCount; page++) {
        requests.push(`${BASE_URL}?p.Page=${page}`);
    }
    return requests;
}

await Actor.init();

const proxyConfiguration = await Actor.createProxyConfiguration();
const clients = []; // Array to hold all clients

const crawler = new CheerioCrawler({
    proxyConfiguration,
    async requestHandler({
        request,
        $
    }) {
        // If this is the first request, init the total number of pages
        if (request.userData.isFirstRequest) {
            initTotalPageCount($);
        }
        $(ITEM_SELECTOR).each(async (_, element) => clients.push(buildClient($(element))));
    },
});

await crawler.run([firstRequest]);

// Generate start requests for the rest of the pages
await crawler.run(generateStartRequests());

// Create a single object with all clients
const output = {
    TotalItems: clients.length,
    Clients: clients,
};

// Push the aggregated data to the dataset
await Dataset.pushData(output);

await Actor.exit();