/**
 * web scrapper for books
 */
const puppeteer = require('puppeteer')
const random_useragent = require('random-useragent')
const fs = require('fs')
const { url } = require('./config')

;(async () => {
    //open Browser
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    
    //setUp browser
    await page.setDefaultTimeout(10000)
    await page.setViewport({ width: 1200, height: 800 })
    await page.setUserAgent(random_useragent.getRandom())

    //get data from browser
    const name_selector = '.product_main > h1'
    const price_selector = '.price_color'
    await page.goto(url)
    await page.waitForSelector(name_selector)
    await page.waitForSelector(price_selector)
    const name = await page.$eval(name_selector, e => e.innerHTML)
    const price = await page.$eval(price_selector, e => e.innerHTML)

    const nameTrim = name.trim()
    const priceTrim = price.trim()

    

    //Get current date and time
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1 
    const year = date.getFullYear()
    const fullDate = `${day}/${month}/${year}`

    console.log('DATE: '+ fullDate)
    console.log('NAME OF BOOK: ' + nameTrim)
    console.log('PRICE OF BOOK: ' + priceTrim)
    
    //save data to the text file 
    const logger = fs.createWriteStream('log.txt', { flags: 'a' })
    logger.write(`${fullDate} - ${nameTrim} - ${priceTrim}\n`)
    logger.close()



    await browser.close()

})().catch(error => {
    console.log(error)
    process.exit(1)
})