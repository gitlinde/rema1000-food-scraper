import puppeteer from "puppeteer";

const foodData = {};

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://shop.rema1000.dk/varer/440065', {
		waitUntil: 'networkidle2',
	});

	await page.click('button');
	// await page.screenshot({
	// 	path: 'hn.png',
	// });

	await page.waitForSelector('.nut-line');
	const nutritionContent = await page.evaluate(() => {
		const elements = document.querySelectorAll('.nut-line');
		return Array.from(elements).map(element => element.innerText);
	});

	for (let i = 1; i < nutritionContent.length; i++) {
		switch (i) {
			case 1:
				// foodData.energy = spliceString(spliceString(nutritionContent[i], 'kcal'));
				console.log("energy: " + spliceString(nutritionContent[i], 'kcal')+" kcal");
				break;
			case 2:
				foodData.fat = nutritionContent[i].replace(/Fedt\s*/g, '')
				console.log("fat: "+ nutritionContent[i].replace(/Fedt\s*/g, ''));
				break;
			case 3:
				foodData.ofSaturatedFat = nutritionContent[i].replace(/Heraf mættede fedtsyrer\s*/g, '')
				console.log("ofSaturatedFat: "+ nutritionContent[i].replace(/Heraf mættede fedtsyrer\s*/g, ''));
				break;
			case 4:
				foodData.carbohydrate = nutritionContent[i].replace(/Kulhydrat\s*/g, '')
				console.log("carbohydrate: "+ nutritionContent[i].replace(/Kulhydrat\s*/g, ''));
				break;
			case 5:
				foodData.ofSugar = nutritionContent[i].replace(/Heraf sukkerarter\s*/g, '');
				console.log("ofSugar: "+ nutritionContent[i].replace(/Heraf sukkerarter\s*/g, ''));
				break;
			case 6:
				foodData.fibre = nutritionContent[i].replace(/Kostfibre\s*/g, '');
				console.log("fibre: "+ nutritionContent[i].replace(/Kostfibre\s*/g, ''));
				break;
			case 7:
				foodData.protein = nutritionContent[i].replace(/Protein\s*/g, '');
				console.log("protein: "+ nutritionContent[i].replace(/Protein\s*/g, ''));
				break;
			case 8:
				foodData.salt = nutritionContent[i].replace(/Salt\s*/g, '');
				console.log("salt: "+ nutritionContent[i].replace(/Salt\s*/g, ''));
				break;
			default:
				console.log(`LOGGED:\n ${nutritionContent[i]} \n index: ${i}\n`)
				break;
		}
	}
	console.log('\n' + JSON.stringify(foodData))

	
	



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
})();

function spliceString(inputString, stringToSplice) {
    // Split the input string by ' / '
    let parts = inputString.split(' / ');
    
    // Extract the part that contains the unit
    let unitPart = parts[1];
    
    // Remove the specified unit from the part and trim any extra spaces
    let number = unitPart.replace(stringToSplice, '').trim();
    
    return number;
}



const food = {
	"Brød & Bavinchi": {
		"Baguette/flutes": {
			440065: {
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



// class nutrionalValues {
//     constructor(energy, fat, ofSaturatedFat, carbohydrateofSugar, fibre, protein, salt) {
//         this.energy,
//         this.fat
//         this.ofSaturatedFat
//         this.carbohydrate,
//         this.ofSugar,
// 		this.fibre
//         this.protein,
//         this.salt
//     }
// }

// new nutrionalValues()


