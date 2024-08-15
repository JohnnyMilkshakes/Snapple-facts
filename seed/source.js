import puppeteer from 'puppeteer'
import mongoose from'mongoose'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})


import SnappleFact from '../models/snapple-fact.js'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const connect = async () => {
    console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Launch a new browser instance
    const browser = await puppeteer.launch({ headless: false })
    
    // Create a new page
    const page = await browser.newPage()
    
    let number = 824
    
    while(true) {

        let isRetired = false
        let source = `https://www.snapple.com/real-facts/${number}`

        // Navigate to the webpage
        await page.goto(source)
        

        //Extract the text content
        const fact = await page.evaluate(() => {
            const element = document.querySelector('.fact.pt-3')
            return element ? element.innerText : 'MISSING'
        })
        
        if (fact === 'MISSING') {
            isRetired = true
            source = []
            console.log(`Snapple Fact is retired \n`)
        } else {
            source = [source]
            console.log(`Storing new Snapple fact! \n`)
        }

        const output = await addSnappleFact({fact, number, isRetired, source})
        console.log(output)
    
        await delay(500) //rate limit
        number = number + 1
    }
}

const addSnappleFact = async (fact) => {
    const response = await SnappleFact.create(fact)
    return response
}

connect()