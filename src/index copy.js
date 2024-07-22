import puppeteer from "puppeteer";
// console.log('xd')

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://shop.rema1000.dk/varer/22251', {
    waitUntil: 'networkidle2',
  });

  await page.click('button');
  await page.screenshot({
    path: 'hn.png',
  });

  await page.waitForSelector('span');
  const nutritionContent = await page.evaluate(() => {
    // return 8*2
    return document.querySelectorAll('.nut-line')
    //  return document.querySelectorAll()

    // const spans = document.querySelectorAll('span');
    // const spanArray = []
    // spans.forEach((span, index) => {
    //   spanArray[index] = span;
    // })
    // return spanArray;

  })
  // console.log(JSON.stringify(nutritionContent));
  console.log(nutritionContent)
  console.log('\n')
  console.log(nutritionContent[1])
  console.log(nutritionContent[1].innerText)
  // console.log(nutritionContent);
  // console.log(JSON.stringify(nutritionContent))
  // console.log(JSON.stringify(nutritionContent))
  await browser.close();
})();

// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// await page.goto('https://shop.rema1000.dk/varer/22251', {
//   waitUntil: 'networkidle2',
// });

// await page.locator('button').click();
// await page.screenshot({
//   path: 'hn.png',
// });


// await page.waitForSelector('nut-line');
// console.log('AHHAHAHA')
// await browser.close();






// const nutritionContent = await page.evaluate(() => {
//   const nutLineElement = document.querySelector('nut-line');
//   return nutLineElement.innerText;
// })

// await page.$('nut-line')




// console.log(nutritionContent)

// (async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Navigate the page to a URL
//   await page.goto('https://developer.chrome.com/');

//   // Set screen size
//   await page.setViewport({width: 1080, height: 1024});

//   // Type into search box
//   await page.type('.devsite-search-field', 'automate beyond recorder');

//   // Wait and click on first result
//   const searchResultSelector = '.devsite-result-item-link';
//   await page.waitForSelector(searchResultSelector);
//   await page.click(searchResultSelector);

//   // Locate the full title with a unique string
//   const textSelector = await page.waitForSelector(
//     'text/Customize and automate'
//   );
//   const fullTitle = await textSelector?.evaluate(el => el.textContent);

//   // Print the full title
//   console.log('The title of this blog post is "%s".', fullTitle);

//   await browser.close();
// })();