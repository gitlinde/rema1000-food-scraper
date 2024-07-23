
console.log(convertSubtitleToTitle('CIABATTA BAGUETTE', '1 STK. / BAVINCHI'))
console.log('\n')
console.log(convertSubtitleToTitle('TOMATER VEJ SELV', '0.12 KG. / HOLLAND KL.1'))
console.log('\n')
console.log(convertSubtitleToTitle('LIMPAN', '900 GR. / PÅGEN'))
console.log('\n')
console.log(convertSubtitleToTitle('SIGNATURBRØD', '375 GR. / GILLELEJE HAVN'))
console.log('\n')
console.log(convertSubtitleToTitle('SIGNATURBRØD', '750 GR. / GILLELEJE HAVN'))
console.log('\n')

console.log(convertSubtitleToTitle('SUN LOLLY', '480 ML. / VINDRUE'))
console.log('\n')		
console.log(convertSubtitleToTitle('VERMOUTH BIANCO 14,8%', '1 LTR. / TOSO'))
console.log('\n')
console.log(convertSubtitleToTitle('KIRSEBÆRVIN 14%', '75 CL. / DANSK FRUGTVIN'))
console.log('\n')
console.log(convertSubtitleToTitle('GRØN TUBORG', '1.98 LTR. / 6 PAK'))
console.log('\n')
console.log(convertSubtitleToTitle('ONE ENERGY', '25 CL.'))
console.log('\n')


function convertSubtitleToTitle(title, subtitle) {
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
			return 'STK, incompatible.'
		case 'BDT':
			return 'BDT, incompatible'
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
			return 'Unkown unit, incompatible'
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
