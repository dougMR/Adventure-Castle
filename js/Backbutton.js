function Backbutton(myContainer){
	this.myContainer = myContainer;
	

	
	this.TOUCHED = this.customEvent("touched");
	// this.UNLOCKED = this.customEvent("unlocked");
	// this.LOADED = this.customEvent("loaded");
	
//	this.initElement();
	// Core Level
	
	var backButton_img = document.createElement("img");
	backButton_img.src = "images/back_arrow.png";
	backButton_img.style.position = "absolute";
	
	myContainer.appendChild(backButton_img);
	
	this.myElement = backButton_img;
	
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
}

/*
*   --------------
*     PROPERTIES
*   --------------
*/
// Backbutton.prototype.loaded = false;
Backbutton.prototype.myTarget = null;
// Backbutton.prototype.x = 0;
// Backbutton.prototype.y = 0;
/*
*   --------------
*     BIND METHODS
*   --------------
*/
Backbutton.prototype.onTouch = onTouch;
Backbutton.prototype.customEvent = customEvent;
Backbutton.prototype.setPosition = setPosition;


Backbutton.prototype.show = show;
Backbutton.prototype.hide = hide;

// Backbutton.prototype.load = load;
// Backbutton.prototype.imageLoaded_handler = imageLoaded_handler;
// Backbutton.prototype.initElement = initElement;


/*
*   --------------
*     CREATE METHODS
*   --------------
*/
// function initElement(){
// 	this.myElement = document.createElement('img');
// 	this.myElement.style.position = "absolute";
// 	this.myElement.style.display = "none";
// 	this.myElement.myObject = this;
// }
// 
// function imageLoaded_handler(e){
// 	this.numLoaded ++;
// 	//trace("Backbutton[::]"+this.myDescription+"] imageLoaded: "+this.numLoaded+" of "+this.numToLoad);
// 	if(this.numLoaded == this.image_ar.length){
// 	  // All Images Loaded
// 		//trace("Backbutton::"+this.myDescription+" - Loaded");
// 		this.loaded = true;
// 		this.myElement.src = this.image_ar[0];
// 		this.setPosition(this.x,this.y);
// 	}else if(!this.loaded){
// 		//trace("Backbutton::loadNextImage: "+this.image_ar[this.numLoaded]);
// 		this.myElement.src = this.image_ar[this.numLoaded];
// 	}
// }
// function load(){
// 	//trace("Backbutton ["+this.myDescription+"]::load()");
// 	this.myElement.onload = this.imageLoaded_handler.bind(this);
// 	this.myElement.src = this.image_ar[0];
// 	this.myContainer.appendChild(this.myElement);
// 	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
// 	this.myElement.dispatchEvent(this.LOADED);
// }

function onTouch(e){
	//trace("Backbutton::onTouch()");
	this.myElement.dispatchEvent(this.TOUCHED);
}

function setPosition(x,y){
	this.myElement.style.left = String(x)+"px";
	this.myElement.style.top = String(y)+"px";
	this.x = x;
	this.y = y;
}

function customEvent(eventName){
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	return evtObj;
}

Function.prototype.bind = function(obj) { 
  var method = this, 
   temp = function() { 
    return method.apply(obj, arguments); 
   }; 
  return temp; 
}


function show(){
	//trace("show "+this.myDescription);
	this.myElement.style.display = "block";
}
function hide(){
	//trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}