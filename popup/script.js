'use strict';

function makeQrCode(data, typeNumber = 0, errorCorrectionLevel = 'M') {
	let qr = new qrcode(typeNumber, errorCorrectionLevel);
	qr.addData(data);
	qr.make();
	return {qrcode: qr, data: data};
}

function updateQrCode(qr, cellSize = 10, margin = cellSize * 0.7) {
	let placeholder = document.getElementById("placeholder");
	let qrCodeText = document.getElementById("qrCodeText");
	let qr_img_string = qr.qrcode.createImgTag(cellSize, margin);
	let qr_img_parser = new DOMParser().parseFromString(qr_img_string, "text/html");
	let qr_img_parsed_element = qr_img_parser.body.getElementsByTagName("img")[0];
	let qr_img_src = qr_img_parsed_element.src;
	let qr_img_element = document.createElement("img");
	qr_img_element.src = qr_img_src;
	qr_img_element.id = "qrCode";
	placeholder.appendChild(qr_img_element);
	qrCodeText.textContent = qr.data;
}

function qrCodeError() {
	let placeholder = document.getElementById("placeholder");
	let qrCodeText = document.getElementById("qrCodeText");
	placeholder.innerHTML = "";
	qrCodeText.innerHTML = "<span id=\"error\">Ошибка. </span>";
}

let tabs_querying = browser.tabs.query({currentWindow: true, active: true});
tabs_querying.then(tabs_querying_fulfilled);

function tabs_querying_fulfilled(tabs) {
	if (tabs.length != 1) {
		qrCodeError();
		return;
	}
	let currentTab = tabs[0];
	let currentTabUrl = currentTab.url;
	let qr = makeQrCode(currentTabUrl);
	updateQrCode(qr);
}