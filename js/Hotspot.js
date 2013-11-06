/* HOTSPOT is a clear div used for "image mapping".
// It can act as Door,
// Or just trigger message.
*/
function Hotspot(width, height, myDescription, myDestinationScene, x, y, initState){
	this.myContainer = hotspots_div;
	this.myElement = document.createElement('div');
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	//this.myElement.style.backgroundColor = "red";
	//this.myElement.style.border = "1px solid red";
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	
	this.myDescription = myDescription;
	this.myTargetID = myDestinationScene;
	
	if(initState == null){
		this.state = "open";
	}
	
	//this.UNLOCKED = this.customEvent("unlocked");
	//this.LOADED = this.customEvent("loaded");
	hotspots_ar.push(this);
	this.init();
	setListener(this, "touched", hotspotTouched_handler);
}
/*
*   --------------
*     PROPERTIES
*   --------------
*/
Hotspot.prototype.myTarget = null;
Hotspot.prototype.loaded = false;
Hotspot.prototype.state = "locked"; // locked, open
Hotspot.prototype.myKey = null;
Hotspot.prototype.x = 0;
Hotspot.prototype.y = 0;
/*
*   --------------
*     BIND METHODS
*   --------------
*/
Hotspot.prototype.onTouch = onTouch;
Hotspot.prototype.customEvent = customEvent;
Hotspot.prototype.setPosition = setPosition;
Hotspot.prototype.unlock = unlock;
Hotspot.prototype.open = open;

Hotspot.prototype.show = show;
Hotspot.prototype.hide = hide;

Hotspot.prototype.init = init;
Hotspot.prototype.load = load;


/*
*   --------------
*     CREATE METHODS
*   --------------
*/

function init(){
	this.TOUCHED = this.customEvent("touched");
	this.myContainer.appendChild(this.myElement);
	this.myElement.myObject = this;
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
	this.myElement.style.width = String(this.width)+"px";
	this.myElement.style.height = String(this.height)+"px";
	this.setPosition(this.x,this.y);
	this.loaded = true;
}

function onTouch(e){
	this.myElement.dispatchEvent(this.TOUCHED);
}

function setPosition(x,y){
	//trace("Hotspot ["+this.myDescription+"]");
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

// function unlock() {
// 	this.myElement.dispatchEvent(this.UNLOCKED);
// 	this.open();
// }
// function open(){
// 	this.state = "open";
// 	this.myElement.src = this.srcOpen;	
// }
function load(){
	this.loaded = true;
}

function show(){
	//trace("show "+this.myDescription);
	this.myElement.style.display = "block";
}
function hide(){
	//trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}