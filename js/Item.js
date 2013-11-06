var imgPath = "images/";
function Item(myContainer, imgSrc, iconSrc, myID, myTargetID, myDescription, x, y){

	this.myContainer = myContainer;
	this.myID = myID;
	this.myTargetID = myTargetID;
	this.inInventory = false;
	this.myDescription = myDescription;
	this.imgSrc = imgPath+imgSrc;
	this.iconSrc = imgPath + iconSrc;
	this.image_ar = [this.imgSrc];
	if(imgSrc != iconSrc){
		this.image_ar.push(this.iconSrc);
	}
	this.x = x;
	this.y = y;
	
	this.TOUCHED = this.customEvent("touched");
	this.TOUCHED_INVENTORY = this.customEvent("touchedInventory");
	// this.LOADED = this.customEvent("loaded");

	this.usesRemaining = 1;	
	this.initElement();
	//this.load();
	//this.setListeners();
	// Core Level
	items_ar.push(this);
	setListener(this,"touched",itemTouched_handler);
}

/*
*   --------------
*     INHERITENCE
*   --------------
*/
//subclass extends superclass
Item.prototype = Object.create(AdventureGameObject.prototype);
Item.prototype.constructor = Item;



// Properties
Item.prototype.numLoaded = 0;
Item.prototype.myTarget = "";
// Item.prototype.loaded = false;
Item.prototype.hidden = false;
Item.prototype.invisible = false;
//Item.prototype.inClosedContainer = false;
Item.prototype.inInventory = false;
//Item.prototype.myID = "generic";
//Item.prototype.myDescription = "this is difficult to describe";
Item.prototype.myElement = null;
Item.prototype.usesRemaining = 1;

// Methods
Item.prototype.onTouch = onTouch;
// Item.prototype.customEvent = customEvent;
Item.prototype.setPosition = setPosition;
//Item.prototype.setListeners = setListeners;
Item.prototype.die = die;

Item.prototype.load = load;
Item.prototype.imageLoaded_handler = imageLoaded_handler;
Item.prototype.initElement = initElement;

Item.prototype.show = show;
Item.prototype.hide = hide;

// create the object methods
function initElement(){
	this.myElement = document.createElement('img');
	this.myContainer.appendChild(this.myElement);
	this.myElement.myObject = this;
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
}

function imageLoaded_handler(e){
	this.numLoaded ++;
	//trace("Item[::]"+this.myDescription+"] imageLoaded: "+this.numLoaded+" of "+this.numToLoad);
	if(this.numLoaded == this.image_ar.length){
	  // All Images Loaded
		//trace("Item::"+this.myDescription+" - Loaded");
		this.myElement.dispatchEvent(this.LOADED);
		this.loaded = true;
		this.myElement.src = this.image_ar[0];
		this.setPosition(this.x,this.y);
		this.hide();
	}else if(!this.loaded){
		//trace("Door::loadNextImage: "+this.image_ar[this.numLoaded]);
		this.myElement.src = this.image_ar[this.numLoaded];
	}
}

function load(){
	//trace("Item ["+this.myDescription+"] load()")
	// set what happens once the image has loaded 
	this.myElement.onload = this.imageLoaded_handler.bind(this);
	// preload the image file
	this.myElement.src = this.image_ar[0];
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
// 	alert("Item setListeners() this: "+this);
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
	//trace("show "+this.myDescription);
	if(!this.invisible){
		// How does this know if it's in a container and should remain hidden?
		this.myElement.style.display = "block";
		this.hidden = false;
	}
}
function hide(){
	//trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
	this.hidden = true;
}