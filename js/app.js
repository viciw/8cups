var htmlActuator = {
	cupsContainer: document.querySelector("#cups"),	
	updateCupsContainer: function(cups){		
		this.cupsContainer.textContent = cups;
	}
};

var localStorageManager = {
	cupsKey: 'dwcCups',
	dateKey: 'dwcDate',
	storage: window.localStorage,
	getCups: function() {
		return this.storage.getItem(this.cupsKey) || 0;
	},
	setCups: function(cups) {
		this.storage.setItem(this.cupsKey, cups);
	},
	getDate: function() {
		return this.storage.getItem(this.dateKey);
	},
	setDate: function(date) {
		return this.storage.setItem(this.dateKey, date);
	}
}

var canvasRender = {
	canvas: document.querySelector("#waterCanvas"),	
	drawContainer: function() {
		var context = this.canvas.getContext("2d");
		context.save();
		context.beginPath();
		context.moveTo(10, 10);
		context.lineTo(30, 125);
		context.lineTo(110, 125);
		context.lineTo(130, 10);
		context.lineTo(120, 10);
		context.lineTo(100, 110);
		context.quadraticCurveTo(70, 120, 40, 110);
		context.lineTo(20, 10);
		context.lineTo(10, 10);
		context.shadowColor = 'rgba(0,100,100,0.2)';   
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;  
		context.shadowBlur = 10;  
		context.fillStyle='#fff';
		context.fill();
		context.strokeStyle = 'grey';
		context.lineWidth = 0.1;
		context.stroke();
		context.closePath();
		context.restore();

	},
	drawWater: function(cups){
		var context = this.canvas.getContext("2d");
		context.beginPath();
		context.moveTo(100, 110);
		context.quadraticCurveTo(70, 120, 40, 110);		
		context.lineTo(40 - 2.5 * cups, 110 - 12.5 * cups); 
		context.lineTo(100 + 2.5 * cups, 110 - 12.5 * cups); 
		context.lineTo(100, 110); 
		var grd = context.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
		grd.addColorStop(0, '#8ED6FF');   
		grd.addColorStop(1, '#004CB3');
		context.fillStyle = grd;
		context.fill();;
		context.closePath();		
	}
}

function init() {
	var prevDate = localStorageManager.getDate();
	var date = new Date();
	var today = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
	if ( !prevDate || prevDate != today) {
		localStorageManager.setCups(0);
		localStorageManager.setDate(today);
	}
	var cups = localStorageManager.getCups();
	htmlActuator.updateCupsContainer(cups);
	canvasRender.drawContainer();
	if (cups > 0) canvasRender.drawWater(cups);
	if (cups < 9) canvasRender.canvas.addEventListener('click', drink); 
}

function drink(){
	var cups = localStorageManager.getCups();
	cups++;
	if (cups < 9) {
		htmlActuator.updateCupsContainer(cups);
		canvasRender.drawWater(cups);
		localStorageManager.setCups(cups);
	} else {
		canvasRender.canvas.removeEventListener('click');
	}
}

window.addEventListener('load', init);








