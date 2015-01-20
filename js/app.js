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
		context.lineTo(30, 250);
		context.lineTo(110, 250);
		context.lineTo(130, 10);
		context.lineTo(120, 10);
		context.lineTo(100, 220);
		context.quadraticCurveTo(70, 240, 40, 220);
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
		if (cups == 1) {
			context.moveTo(100, 220);
			context.quadraticCurveTo(70, 240, 40, 220);	
			context.lineTo(100, 220); 
		} else {
			var x1 = 40 - 2.7 * (cups - 1);
			var y1 = 220 - 28 * (cups - 1);
			var x2 = 100 + 2.7 * (cups - 1);
			var y2 = y1;
			var x3 = 100 + 2.7 * (cups - 2);
			var y3 = 220 - 28 * (cups - 2);
			var x4 = 40 - 2.7 * (cups - 2);
			var y4 = y3;
			context.moveTo(x1, y1);
			context.lineTo(x2, y2);
			context.lineTo(x3, y3);
			context.lineTo(x4, y4);		
		}
		var grd = context.createRadialGradient(70, 240, 10, 70, 240, 240);
		grd.addColorStop(0, '#004CB3');   
		grd.addColorStop(1, '#8ED6FF');
		context.fillStyle = grd;
		context.fill();
		context.closePath();		
	}
}

var notificationManager = {
	timer: null,
	start: function() {
		if (window.Notification) {
			if(Notification.permission != 'granted'){
				Notification.requestPermission();
			}			
			this.timer = setInterval(this.notify, 1000 * 60 * 60);
		}	
	},
	notify: function() {
		var notification = new Notification('8 Cups a Day', { 
			body: 'How much water did you drink today?',
			icon: 'res/icon.png'
		});	
	},
	stop: function() {
		clearInterval(this.timer);
	}
}

function init() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var date = now.getDate();
	var midnight = new Date(year, month, date + 1, 0, 0, 0);
	var msTillMidnight = midnight.getTime() - now.getTime();
	setTimeout('document.location.reload()', msTillMidnight);
	
	var today = [year, month + 1, date].join('-');
	var prevDate = localStorageManager.getDate();
	if ( !prevDate || prevDate != today) {
		localStorageManager.setCups(0);
		localStorageManager.setDate(today);
	}

	var cups = localStorageManager.getCups();
	htmlActuator.updateCupsContainer(cups);
	canvasRender.drawContainer();
	for (var i = 1; i <= cups; i++) {
		canvasRender.drawWater(i);
	}

	if (cups < 8) {
		notificationManager.start();
		canvasRender.canvas.addEventListener('click', drink);
	}
}

function drink(){
	var cups = localStorageManager.getCups();
	cups++;
	if (cups > 7) {	
		notificationManager.stop();
		canvasRender.canvas.removeEventListener('click', drink);
	}
	htmlActuator.updateCupsContainer(cups);
	canvasRender.drawWater(cups);
	localStorageManager.setCups(cups);
}
 
window.addEventListener('load', init);








