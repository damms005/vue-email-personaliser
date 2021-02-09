export default {
	name: () => {
		let fakeName = ["Jack Roberts", "Chuck Norris", "Jon Doe"];
		return fakeName[getRandomInteger(0, fakeName.length)];
	},
	internet: () => {
		let fakeInternet = ["wannabe@example.com", "somebody@john.doe", "abc@xyz.com"];
		return fakeInternet[getRandomInteger(0, fakeInternet.length)];
	},
	phoneNumber: () => {
		let fakePhoneNumber = ["094 122 1938", "001 299 1223", "+001 447 1119"];
		return fakePhoneNumber[getRandomInteger(0, fakePhoneNumber.length)];
	},
	address: () => {
		let fakeAddress = ["Train Station Rd.", "Inner Memory Lane, Core Dump Ave.", "Seg Fault Station, Broadway"];
		return fakeAddress[getRandomInteger(0, fakeAddress.length)];
	},
}

function getRandomInteger(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}