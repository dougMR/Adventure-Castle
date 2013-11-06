// superclass for game objects (like Container, Item, Scene...)

function AdventureGameObject(){
	
}

AdventureGameObject.prototype.testVar = "TEST";

AdventureGameObject.prototype.LOADED = this.customEvent("loaded");

AdventureGameObject.prototype.customEvent = customEvent;

AdventureGameObject.prototype.loaded = false;



function customEvent(eventName){
	
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	//alert (evtObj+"\n type: "+evtObj.type);
	return evtObj;
	
}

function imageError_handler(e){
	console.log('----------------------');
	console.log('IMAGE LOADING ERROR (Scene)');
	console.log('e is: '+e);
	console.log(e);
	console.log('this is: '+this);
	console.log(this);
}

