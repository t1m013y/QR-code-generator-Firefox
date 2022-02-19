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
	let qr_img = qr.qrcode.createImgTag(cellSize, margin);
	qr_img = stringToElement(qr_img);
	qr_img.id = "qrCode";
	qr_img = qr_img.outerHTML;
	placeholder.innerHTML = qr_img;
	qrCodeText.innerHTML = qr.data;
}

function qrCodeError() {
	let placeholder = document.getElementById("placeholder");
	let qrCodeText = document.getElementById("qrCodeText");
	placeholder.innerHTML = "";
	qrCodeText.innerHTML = "<span id=\"error\">Ошибка. </span>";
}

let tabs_querying = browser.tabs.query({currentWindow: true, active: true});
tabs_querying.then(tabs_fulfilled, qrCodeError);

function tabs_fulfilled(tabs) {
	if (tabs.length != 1) {
		qrCodeError();
		return;
	}
	let currentTab = tabs[0];
	let currentTabUrl = currentTab.url;
	let qr = makeQrCode(currentTabUrl);
	updateQrCode(qr);
}

function stringToElement(string) {
	let template = document.createElement('template');
	template.innerHTML = string;
	return template.content.firstChild;
}
