var images_folder = "images/";
function Container(myId, srcClosed, srcOpen, myDescription, myContentsIDarray, x_ar, y_ar, switch_ar){
	
	this.myContainer = containers_div;
	this.myID = myId;
	this.myDescription = myDescription;
	
	if(switch_ar == null){
		switch_ar = [];
	}
	this.switch_ar = switch_ar;
	
	this.x_ar = x_ar;
	this.y_ar = y_ar;
	this.width_ar = [];
	this.height_ar = [];
	this.images_ar = [];
	
	if(srcClosed.substring(0,5) == "blank"){
		var xIndex = srcClosed.indexOf("x");
		this.images_ar[0] = images_folder+"blank.gif";
		this.width_ar[0] = Number(srcClosed.substring(6,xIndex));
		this.height_ar[0] = Number(srcClosed.substring(xIndex+1,srcClosed.length));
		trace("this.closedWidth: "+this.width_ar[0]);
		trace("this.closedHeight: "+this.height_ar[0]);
	}else{
		this.images_ar[0] = images_folder+srcClosed;
	}
	if(srcOpen.substring(0,5) == "blank"){
		var xIndex = srcOpen.indexOf("x");
		this.images_ar[1] = images_folder+"blank.gif";
		this.width_ar[1] = Number(srcOpen.substring(6,xIndex));
		this.height_ar[1] = Number(srcOpen.substring(xIndex+1,srcOpen.length));
		trace("this.openWidth: "+this.width_ar[1]);
		trace("this.openHeight: "+this.height_ar[1]);
	}else{
		this.images_ar[1] = images_folder+srcOpen;
	}
	

	// Hide Contents
	this.contents_ar = myContentsIDarray;
	this.TOUCHED = this.customEvent("touched");
	this.UNLOCKED = this.customEvent("unlocked");
	this.LOADED = this.customEvent("loaded");
	
	this.numToLoad = this.images_ar.length;
	
	this.initElement();
	// Core Level
	containers_ar.push(this);
}

/*
*   --------------
*     PROPERTIES
*   --------------
*/
Container.prototype.loaded = false;
Container.prototype.contents_ar = [];
Container.prototype.myElement = null;
Container.prototype.numLoaded = 0;
Container.prototype.img_ar = [];
Container.prototype.state = "locked"; // locked, unlocked, open
Container.prototype.hidden = false;
Container.prototype.invisible = false;
/*
*   --------------
*     BIND METHODS
*   --------------
*/
Container.prototype.onTouch = onTouch;
Container.prototype.customEvent = customEvent;
Container.prototype.setPosition = setPosition;
Container.prototype.setSize = setSize;
Container.prototype.unlock = unlock;
Container.prototype.open = open;

Container.prototype.load = load;
Container.prototype.imageLoaded_handler = imageLoaded_handler;
Container.prototype.initElement = initElement;

Container.prototype.hide = hide;
Container.prototype.show = show;

/*
*   --------------
*     CREATE METHODS
*   --------------
*/
function initElement(){
	this.myElement = document.createElement('img');
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	this.myElement.myObject = this;
	this.myContainer.appendChild(this.myElement);
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
}

function imageLoaded_handler(e){
	var filename = this.myElement.src.replace(/^.*(\\|\/|\:)/, '');
	if(filename != "blank.gif"){
		this.width_ar[this.numLoaded] = this.myElement.offsetWidth;
		this.height_ar[this.numLoaded] = this.myElement.offsetHeight;
	}
	trace("Container::"+filename+" w/h: "+this.width_ar[this.numLoaded]+", "+this.height_ar[this.numLoaded]);
	this.numLoaded ++;
	if(this.numLoaded == this.images_ar.length){
	  // All Images Loaded
		this.loaded = true;
		this.myElement.dispatchEvent(this.LOADED);
		
		this.setPosition(this.x_ar[0],this.y_ar[0]);
		this.myElement.src = this.images_ar[0];
 		this.setSize(this.width_ar[0],this.height_ar[0]);
		this.myElement.style.display = "none";
		this.myElement.style.visibility = "visible";
		this.hide();
		trace("Container::loaded()<br> - width_ar: "+this.width_ar);
	}else if(!this.loaded){
		this.myElement.src = this.images_ar[this.numLoaded];
		
	}
}
function load(){
	//trace("Container ["+this.myDescription+"]::load()");
	this.myElement.style.display = "block";
		this.myElement.style.visibility = "hidden";
	this.myElement.onload = this.imageLoaded_handler.bind(this);
	this.myElement.src = this.images_ar[0];

}

function onTouch(e){
	this.myElement.dispatchEvent(this.TOUCHED);
	
}

function setPosition(x,y){
	this.myElement.style.left = String(x)+"px";
	this.myElement.style.top = String(y)+"px";
}
function setSize(w,h){
	this.myElement.style.width = String(w)+"px";
	this.myElement.style.height = String(h)+"px";
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
function open() {
	this.state = "open";
	this.myElement.src = this.images_ar[1];
	this.setPosition(this.x_ar[1],this.y_ar[1]);
	this.setSize(this.width_ar[1],this.height_ar[1]);

	for(var i in this.contents_ar){
		contents = this.contents_ar[i];
		contents.invisible = false;
		if(contents.myScene == activeScene){
			contents.show();
		}

	}
}
function unlock() {
	this.myElement.dispatchEvent(this.UNLOCKED);
	this.open();
}
function show(){
	if(!this.invisible){
		this.myElement.style.display = "block";
		this.hidden = false;
	}
}
function hide(){
	this.myElement.style.display = "none";
	this.hidden = true;
}