import puppeteer from "puppeteer";
// await page.screenshot({
// 	path: 'hn.png',
// });
const food = {
	"Brød & Bavinchi": {
		"Baguette/flutes": {
			60309: {
				name: "flutes",
				weight: 300,
				price: 6.50,
				nutritionValues: {
					energy: 249,
					fat: 1,
					ofSaturatedFat: 0.3,
					carbohydrate: 50,
					ofSugar: 3.1,
					fibre: 2.5,
					protein: 8.7,
					salt: 1.3
				}
			}
		},
	}
};


const manuallyAddedCategories = [
	'https://shop.rema1000.dk/brod-bavinchi',
	'https://shop.rema1000.dk/nemt-hurtigt',
	'https://shop.rema1000.dk/kod-fisk-fjerkrae',
	'https://shop.rema1000.dk/kol',
	'https://shop.rema1000.dk/ost-mv',
	'https://shop.rema1000.dk/frost',
	'https://shop.rema1000.dk/mejeri',
	'https://shop.rema1000.dk/kolonial',
	'https://shop.rema1000.dk/drikkevarer',
	'https://shop.rema1000.dk/slik'
]

const nutrionalValues = {

};



{(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// https://shop.rema1000.dk/varer/21896
	await page.goto('https://shop.rema1000.dk/brod-bavinchi', {
		waitUntil: 'networkidle2',
	});




	await page.click('button');


	// findCSSElement('.header-left > div:nth-child(1)');
	// findCSSElement('.header-left > .sub');

	// async function findCSSElement(CSSPath) {
	// 	let element = await page.$(CSSPath)
	// 	if (element) {
	// 		let textContent = await page.evaluate(el => el.textContent, element);
	// 		console.log(textContent);
	// 	}
	// }


	await page.waitForSelector('.all');
	const categories = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('.all')).map(category => category.getAttribute('href'));
	});
	let urlArray = [];
	for(let i = 0; i < categories.length; i++) {
		await page.click(`a[href="${categories[i]}"]`);
		await page.waitForSelector('[related]')	
		const relatedValues = await page.evaluate(() => {
			const element = document.querySelector('[related]');
			return element.getAttribute('related');
		});
		console.log(page.url());
		console.log(relatedValues.split(','))
		let idArray = relatedValues.split(',')
		for(let i = 0; i < idArray.length; ++i) {
			urlArray.push(convertIdToUrl(idArray[i]))
		}
		await new Promise(resolve => setTimeout(resolve, 1000));
	}


	console.log(urlArray)
	
	


	// console.log(JSON.stringify(categories))
	await page.waitForSelector('.nut-line');
	const nutritionContent = await page.evaluate(() => {
		const elements = document.querySelectorAll('.nut-line');
		return Array.from(elements).map(element => element.innerText);
	});

	for(let i = 1; i < nutritionContent.length; i++) {
		switch (i) {
			case 1:
				nutrionalValues.energy = spliceString(nutritionContent[i], 'kcal')
				break;
			case 2:
				nutrionalValues.fat = nutritionContent[i].replace(/Fedt\s*/g, '')
				break;
			case 3:
				nutrionalValues.ofSaturatedFat = nutritionContent[i].replace(/Heraf mættede fedtsyrer\s*/g, '')
				break;
			case 4:
				nutrionalValues.carbohydrate = nutritionContent[i].replace(/Kulhydrat\s*/g, '')
				break;
			case 5:
				nutrionalValues.ofSugar = nutritionContent[i].replace(/Heraf sukkerarter\s*/g, '');
				break;
			case 6:
				nutrionalValues.fibre = nutritionContent[i].replace(/Kostfibre\s*/g, '');
				break;
			case 7:
				nutrionalValues.protein = nutritionContent[i].replace(/Protein\s*/g, '');
				break;
			case 8:
				nutrionalValues.salt = nutritionContent[i].replace(/Salt\s*/g, '');
				break;
			default:
				console.log(`DEFAULT REACHED NOT SUPPOSED TO HAPPEN TA`)
				break;
		}
	}
	
	for(let nutrition in nutrionalValues) {
		nutrionalValues[nutrition] = nutrionalValues[nutrition]
			.replace('< ','')
			.replace(',', '.')
		nutrionalValues[nutrition] = parseFloat(nutrionalValues[nutrition])
	}

	console.log('\n' + JSON.stringify(nutrionalValues))

	
	



	// await page.goto('https://shop.rema1000.dk/varer/440065', {
	// 	waitUntil: 'networkidle2',
	// });
	// await page.waitForSelector('.nut-line');
	// const nutritionContent1 = await page.evaluate(() => {
	// 	const elements = document.querySelectorAll('.nut-line');
	// 	return Array.from(elements).map(element => element.innerText);
	// });

	// for (let i = 0; i < nutritionContent1.length; i++) {
	// 	console.log(nutritionContent1[i])
	// 	console.log('\n')
	// }

	await browser.close();
})()};

function spliceString(inputString, stringToSplice) {
    // Split the input string by ' / '
    let parts = inputString.split(' / ');
    
    // Extract the part that contains the unit
    let unitPart = parts[1];
    
    // Remove the specified unit from the part and trim any extra spaces
    let number = unitPart.replace(stringToSplice, '').trim();
    
    return number;
}

function convertIdToUrl(id) {
	return `https://shop.rema1000.dk/varer/${id}`
}


