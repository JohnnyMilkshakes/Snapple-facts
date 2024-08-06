import puppeteer from 'puppeteer'
import mongoose from'mongoose'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})


import SnappleFact from '../models/snapple-fact.js'

let source = `https://web.archive.org/web/20181008024855/https://www.snapple.com/real-facts/2`

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Launch a new browser instance
    const browser = await puppeteer.launch({ headless: false })
    
    // Create a new page
    const page = await browser.newPage()

    try {

        await page.goto(source, {timeout: 10000})

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

        // console.log(facts)

        facts.forEach(async (fact) => {
            await updateSnappleFact(fact)
        })
    }    
}

const updateSnappleFact = async (snappleFact) => {
    const factObject = await SnappleFact.findOne({number: snappleFact.number})

    // console.log(factObject)
   
    if (!factObject) {
        console.log(`No document found with number: ${snappleFact.number}`);
    } else if (factObject.fact === 'MISSING') {
        console.log('Found a missing fact! Updating database...');
        factObject.fact = snappleFact.fact
    } else {
        console.log('Already found, adding source to array');
    }
    factObject.source.push(source)

    console.log(factObject)

    await factObject.save()
}

connect()