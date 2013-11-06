function Key(myContainer, imgSrc, myType, myDescription, x, y){
trace("KEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEY");
trace("KEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEY");
trace("KEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEY");
trace("KEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEYKEY");
	this.myContainer = myContainer;
	this.myType = myType;
	this.inInventory = false;
	this.myDescription = myDescription;
	this.imgSrc = imgSrc;
	this.x = x;
	this.y = y;
	
	this.TOUCHED = this.customEvent("touched");
	this.TOUCHED_INVENTORY = this.customEvent("touchedInventory");
	this.LOADED = this.customEvent("loaded");

	this.usesRemaining = 1;	
	//this.load();
	//this.setListeners();
}
// Properties
Key.prototype.loaded = false;
Key.prototype.inClosedContainer = false;
Key.prototype.inInventory = false;
Key.prototype.myType = "generic";
Key.prototype.myDescription = "this is difficult to describe";
Key.prototype.myElement = null;
Key.prototype.usesRemaining = 1;

// Methods
Key.prototype.onTouch = onTouch;
Key.prototype.customEvent = customEvent;
Key.prototype.setPosition = setPosition;
//Key.prototype.setListeners = setListeners;
Key.prototype.die = die;

Key.prototype.load = load;
Key.prototype.imageLoaded_handler = imageLoaded_handler;
Key.prototype.initMyImgElement = initMyImgElement;

Key.prototype.show = show;
Key.prototype.hide = hide;

// create the object methods

function load(){
	this.myElement = document.createElement('img');
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	//trace("Item::load;")
	// create an image object
	var img = new Image();
	// set what happens once the image has loaded 
	img.onload = this.imageLoaded_handler.bind(this);
	// preload the image file
	img.src = this.imgSrc;	
}
function imageLoaded_handler(e){
	//trace("Item::imageLoaded_handler");
	this.initMyImgElement();
	this.setPosition(this.x,this.y);
}
function initMyImgElement(){	
	//trace("Item::initMyImgElement");	
	
	this.myElement.src = this.imgSrc;
	this.myElement.myObject = this;
	this.myContainer.appendChild(this.myElement);
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
	//trace("item:"+this.myDescription+" myElement: "+this.myElement);
	this.myElement.dispatchEvent(this.LOADED);
}	
	
function onTouch(e){
	//alert("this: "+this);
	if(this.inInventory){
		// READY FOR USE
		this.myElement.dispatchEvent(this.TOUCHED_INVENTORY);
		
	}else{
		// PICK UP
		this.myElement.dispatchEvent(this.TOUCHED);
	}
	
}

function setPosition(x,y){
	//trace("settingPosition: "+this.myDescription+" :: "+x+", "+y);
	this.myElement.style.left = String(x)+"px";
	this.myElement.style.top = String(y)+"px";
}

function customEvent(eventName){
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	//alert (evtObj+"\n type: "+evtObj.type);
	return evtObj;
}


Function.prototype.bind = function(obj) { 
  var method = this, 
   temp = function() { 
    return method.apply(obj, arguments); 
   }; 
  
  return temp; 
}

// function setListeners(){
// 	alert("Key setListeners() this: "+this);
// 	if( this.myElement.addEventListener ) {
// 		this.myElement.addEventListener("touched",touched_handler,false);
// 	
// 	} else if( this.attachEvent ) {
// 		this.myElement.attachEvent('touched',touched_handler);		
// 	}
// 	function touched_handler(e){
// 		//trace("touched_handler<br>"+e.target+" was touched!");
// 		trace("you have found a "+e.target.myObject.myDescription);
// 		e.target.myObject.inInventory = true;
// 	}
// 	function touchedInventory_handler(e){
// 		//trace("touchedInventory_handler<br>"+e.target+" was touched!");
// 		trace("you ready the "+e.target.myObject.myDescription+"from your inventory.");	
// 	}
// }

function die(){
	// ?? Remove Event Listeners ??
	this.myElement.parentNode.removeChild(this.myElement);
	// ?? Delete Object ??
}

// function used(){
// 	this.usesRemaining -- ;
// 	if(this.usesRemaining == 0){
// 		this.die();
// 	}
// }
function show(){
	trace("show "+this.myDescription);
	if(!this.inClosedContainer){
		// How does this know if it's in a container and should remain hidden?
		this.myElement.style.display = "block";
	}
}
function hide(){
	trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}