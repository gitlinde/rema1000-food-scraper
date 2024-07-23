import puppeteer from "puppeteer";
// await page.screenshot({
// 	path: 'hn.png',
// });
const rema100Data = {
	"Brød & Bavinchi": {
		link: "https://shop.rema1000.dk/brod-bavinchi",
		// "Baguette/flutes": { 
			// 60309: {
			// 	name: "flutes",
			// 	subName: "REMA 1000"
			// 	weight: 300,
			// 	price: 6.50,
			// 	nutritionValues: {
			// 		energy: 249,
			// 		fat: 1,
			// 		ofSaturatedFat: 0.3,
			// 		carbohydrate: 50,
			// 		ofSugar: 3.1,
			// 		fibre: 2.5,
			// 		protein: 8.7,
			// 		salt: 1.3
			// 	}
			// }
		// },
	},
	"Nemt & hurtigt": {
		link: "https://shop.rema1000.dk/nemt-hurtigt",
	},
	"Kød, fisk & fjerkræ": {
		link: "https://shop.rema1000.dk/kod-fisk-fjerkrae",
	},
	"Køl": {
		link: "https://shop.rema1000.dk/kol",
	},
	"Ost m.v.": {
		link: "https://shop.rema1000.dk/ost-mv",
	},
	"Frost": {
		link: "https://shop.rema1000.dk/frost",
	},
	"Mejeri": {
		link: "https://shop.rema1000.dk/mejeri",
	},
	"Kolonial": {
		link: "https://shop.rema1000.dk/kolonial",
	},
	"Drikkevarer": {
		link: "https://shop.rema1000.dk/drikkevarer"
	},
	"Slik": {
		link: "https://shop.rema1000.dk/slik"
	}
};

{(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// https://shop.rema1000.dk/varer/21896
	// await page.goto('https://shop.rema1000.dk/brod-bavinchi', {
	// 	waitUntil: 'networkidle2',
	// });
	await page.goto("https://shop.rema1000.dk", {
		waitUntil: "networkidle2",
	});
	console.log("Current URL: " + page.url())
	await page.click('button');
	console.log("Cookies clicked \n")

	for(let foodCategory in rema100Data) {
		// console.log(foodCategory + " " + rema100Data[foodCategory].link)
		await page.goto(rema100Data[foodCategory].link, {
			waitUntil: 'networkidle2',
		});
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log("Current url: " + page.url())
		console.log("Waitng for .all selector \n")
		await page.waitForSelector('.all');
		const categories = await page.evaluate(() => {
			return Array.from(document.querySelectorAll('.all')).map(category => category.getAttribute('href'));
		});
		// let urlArray = [];
		
		for(let i = 0; i < categories.length; i++) {
			console.log(`Selector found. Connecting to https://shop.rema1000.dk${categories[i]}`)
			await page.goto("https://shop.rema1000.dk" + categories[i], {
				waitUntil: "networkidle2",
			});

			//add baguetteflutes to the object
			let splitUrl = page.url().split('/');
			splitUrl = splitUrl[splitUrl.length-1]
			rema100Data[foodCategory][splitUrl] = {}


			await page.waitForSelector('[related]')	
			const relatedValues = await page.evaluate(() => {
				const element = document.querySelector('[related]');
				return element.getAttribute('related');
			});
			
			let idArray = relatedValues.split(',')
			for(let i = 0; i < idArray.length; ++i) {
				rema100Data[foodCategory][splitUrl][idArray[i]] = {}
			}

			// rema100Data[foodCategory].link
			console.log("\n" + splitUrl + ": " + JSON.stringify(rema100Data[foodCategory][splitUrl]))
			for(let id in rema100Data[foodCategory][splitUrl]) {
				
				// await page.goto()
				await page.goto(convertIdToUrl(id), {
					waitUntil: "networkidle2",
				});

				console.log("\n" + "page.goto(): " + convertIdToUrl(id))
		
				let title = await findCSSElement('.top.wrap .header .header-left .title')
				let subtitle = await findCSSElement('.top.wrap .header .header-left .sub')

				rema100Data[foodCategory][splitUrl][id].name = convertTitlesToObject(title,subtitle).name
				rema100Data[foodCategory][splitUrl][id].subName = convertTitlesToObject(title,subtitle).subName
				rema100Data[foodCategory][splitUrl][id].grams = convertTitlesToObject(title,subtitle).grams
				console.log(rema100Data[foodCategory][splitUrl][id])
				
				await new Promise(resolve => setTimeout(resolve, 1000));
				try {
					await page.waitForSelector('.nut-line');
					const nutritionContent = await page.evaluate(() => {
						const elements = document.querySelectorAll('.nut-line');
						return Array.from(elements).map(element => element.innerText);
					});

					rema100Data[foodCategory][splitUrl][id].nutrionalValues = {}

					for(let i = 1; i < nutritionContent.length; i++) {
						switch (i) {
							case 1:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.energy = spliceString(nutritionContent[i], 'kcal')
								break;
							case 2:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.fat = nutritionContent[i].replace(/Fedt\s*/g, '')
								break;
							case 3:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.ofSaturatedFat = nutritionContent[i].replace(/Heraf mættede fedtsyrer\s*/g, '')
								break;
							case 4:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.carbohydrate = nutritionContent[i].replace(/Kulhydrat\s*/g, '')
								break;
							case 5:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.ofSugar = nutritionContent[i].replace(/Heraf sukkerarter\s*/g, '');
								break;
							case 6:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.fibre = nutritionContent[i].replace(/Kostfibre\s*/g, '');
								break;
							case 7:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.protein = nutritionContent[i].replace(/Protein\s*/g, '');
								break;
							case 8:
								rema100Data[foodCategory][splitUrl][id].nutrionalValues.salt = nutritionContent[i].replace(/Salt\s*/g, '');
								break;
							default:
								console.log(`DEFAULT REACHED NOT SUPPOSED TO HAPPEN TA`)
								break;
						}
					}
					
					for(let nutrition in rema100Data[foodCategory][splitUrl][id].nutrionalValues) {
						rema100Data[foodCategory][splitUrl][id].nutrionalValues[nutrition] = rema100Data[foodCategory][splitUrl][id].nutrionalValues[nutrition]
							.replace('< ','')
							.replace(',', '.')
							rema100Data[foodCategory][splitUrl][id].nutrionalValues[nutrition] = parseFloat(rema100Data[foodCategory][splitUrl][id].nutrionalValues[nutrition])
					}
	
					console.log('nutritionalValues: ')
					console.log(rema100Data[foodCategory][splitUrl][id].nutrionalValues)
					
				} catch (error) {
					console.log(error)
				}

				async function findCSSElement(CSSPath) {
					try {
						await page.waitForSelector(CSSPath, { timeout: 10000 });
						let element = await page.$(CSSPath);
						if (element) {
							let textContent = await page.evaluate(el => el.textContent, element);
							// console.log("\n title/sub: " + textContent);
							// console.log(textContent)
							return textContent;
						} else {
							console.log('Product not found');
							return;
						}
					} catch (error) {
						console.log(error)
						await new Promise(resolve => setTimeout(resolve, 1000))
					}
				}
			}
			console.log(rema100Data["Brød & Bavinchi"])
			console.log(JSON.stringify(rema100Data["Brød & Bavinchi"]))
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}





	
	



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


function convertTitlesToObject(title, subtitle) {
	let grams = ''
	let subtitleArray = subtitle.split('/')
	let units = ''
	for(let i = 0; i < subtitleArray[0].length; ++i) {
		if (isNumber(subtitleArray[0].charAt(i)) == true || subtitleArray[0].charAt(i) == '.') {
			grams += subtitleArray[0].charAt(i)
		} else {
			units += subtitleArray[0].charAt(i)
		}
	}

	grams = parseFloat(grams)
	switch (units.split(' ')[1]) {
		case 'STK':
			console.log('STK, incompatible')
			return {}
		case 'BDT':
			console.log('BDT, incompatible')
			return {}
		case 'LTR':
			grams *= 1000
			units = 'GR'
			break
		case 'KG':
			grams *= 1000
			units = 'GR'
			break
		case 'CL':
			grams *= 10
			units = 'GR'
			break
		case 'GR':
			units = units.split(' ')[1] // same as 'GR'
			break
		case 'ML':
			units = 'GR'
			break
		default:
			console.log('Unkown unit, incompatible')
			return {}
			break;
	}

	if(subtitle.split('/')[1]) {
		let subSplit = subtitle.split('/')[1]
		let name = title.toLowerCase()
		let subName = subSplit.toLowerCase()
		name = sanitizeKey(name)
		subName = sanitizeKey(subName)
		return {name, subName, grams}
	} else {
		let name = title.toLowerCase()
		name = sanitizeKey(name)
		let subName = subtitle
		subName = sanitizeKey(subName)
		return {name, subName, grams}
	}

	function sanitizeKey(key) {
		const validCharacters = /^[a-zA-Z0-9_-åæøÅÆØ]*$/;

		return key.split('').filter(char => validCharacters.test(char)).join('');
	}

	function isNumber(char) {
		return !isNaN(char) && char.trim() !== '';
	}
}
