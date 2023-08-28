Apify scraper - DMP clients
Create Apify actor which will load clients from DMP website and converts them to JSON.

Technologies
Apify (https://apify.com/) and Crawlee (https://crawlee.dev/docs/quick-start)
Use crawler of your choice - Cheerio, Puppeteer or Playwright
The actor will be written in JavaScript (no Python)
GIT for versioning
Functional requirements
Load all clients from this page https://www.dmpublishing.cz/en/references (make sure that you really load all :))
Load them only from English website
The actor will produce JSON which will look like this
{
    "TotalItems": x,
    "Clients": [
        {
            "Name": "Peugeot",
            "Annotation": "A car brand produced by the French company Automobiles Peugeot.",
            "Content": "Virtual online catalogue environment for price lists and catalogues of all Peugeot models",
            "Link": "http://peugeot.ecpaper.cz/osobni/2008/2008-new/Peugeot-2008-new-cenik/#page=1",
            "Image": "https://dmpublishing.blob.core.windows.net/imagehandler/Media/ContentItems/45_00045/m_max__w_500__h_281__o/peugeot-small.jpeg"
        },
        ...
    ]
}