import puppeteer from 'puppeteer'
import mongoose from'mongoose'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})


const snappleFactSchema = new mongoose.Schema({
    fact: String,
    number: Number,
    isRetired: Boolean,
    source: Array
})

const SnappleFact = mongoose.model('Snapplefact', snappleFactSchema )

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Launch a new browser instance
    const browser = await puppeteer.launch({ headless: false })
    
    // Create a new page
    const page = await browser.newPage()

    try {

        await page.goto(`https://web.archive.org/web/20181008024855/https://www.snapple.com/real-facts/2`, {timeout: 10000})

    } catch (err) {

        const facts = await page.evaluate(() => {

            // Select the ordered list by its id, class, or other selector
            let ol = document.querySelector('#fact-list');

            // Get all the list items within the ordered list
            let listItems = ol.querySelectorAll('li');

            const arr = []

            // Convert NodeList to an array and return the text content of each item
            Array.from(listItems).forEach((item) => {

                const newObj = {
                    number: item.getAttribute('value'), 
                    fact: item.innerText 
                }

                arr.push(newObj)
            });

            return arr
            
        });

        facts.forEach(async (fact) => {
            console.log(await updateSnappleFact(fact))
        })
    }    
}

const updateSnappleFact = async (snappleFact) => {
    const response = await SnappleFact.findOneAndUpdate(
        {number: snappleFact.number},
        {fact: snappleFact.fact, source: ["https://web.archive.org/web/20181008024855/https://www.snapple.com/real-facts/2"]}
    )
    return response
}

connect()