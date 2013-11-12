/*
In this incarnation, only one state (keystate) has any effect.
That effect is to unlock a target object. If all that object's 
switches (.switch_ar) are in their keystate
*/

var images_folder = "images/";
function Switch(myID, keyStateNum, myImgs_ar, x_ar, y_ar, myTargetID, myDescription, mySuccessMessage){
//trace("Switch::constructor()");
	this.myContainer = switches_div;
	this.myID = myID;
	this.myTargetID = myTargetID;
	this.myDescription = myDescription;
	this.mySuccessMessage = mySuccessMessage;
	this.images_ar = [];
	this.x_ar = x_ar;
	this.y_ar = y_ar;
	this.keyState = keyStateNum;
	this.width_ar = new Array();
	this.height_ar = new Array();
	this.height_ar.length = this.width_ar.length = myImgs_ar.length;

	for(var i =0; i< myImgs_ar.length; i++){
		var nextSrcStr = myImgs_ar[i];
		if(nextSrcStr.substring(0,5) == "blank"){
			var xIndex = nextSrcStr.indexOf("x");
			this.images_ar[i] = images_folder+"blank.gif";
			this.width_ar[i] = Number(nextSrcStr.substring(6,xIndex));
			this.height_ar[i] = Number(nextSrcStr.substring(xIndex+1,nextSrcStr.length));
		}else{
			this.images_ar[i] = images_folder+nextSrcStr;
		}
		//trace("Switch::images_ar["+i+"]: "+this.images_ar[i]);
	}	
	
	this.numStates = this.images_ar.length;
	this.TOUCHED = this.customEvent("touched");
	this.LOADED = this.customEvent("loaded");
	//this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
	
	this.initElement();
	// Core Level
	switches_ar.push(this);
}
// Properties
Switch.prototype.loaded = false;
Switch.prototype.state = 0;
Switch.prototype.myElement = null;
Switch.prototype.numLoaded = 0;
Switch.prototype.myTarget = null;
// Methods
//Switch.prototype.onTouch = onTouch;
Switch.prototype.customEvent = customEvent;
Switch.prototype.setPosition = setPosition;
Switch.prototype.initElement = initElement;

Switch.prototype.touched_handler = touched_handler;
Switch.prototype.imageLoaded_handler = imageLoaded_handler;
Switch.prototype.load = load;
Switch.prototype.show = show;
Switch.prototype.hide = hide;

Switch.prototype.switchMe = switchMe;

// create the object methods

function switchMe(){
	this.state = (this.state + 1) % (this.numStates);
	trace("Switch::state: "+this.state+" vs "+this.keyState);
	this.myElement.src = this.images_ar[this.state];
	this.setPosition(this.x_ar[this.state],this.y_ar[this.state]);
	if(this.state == this.keyState){
	trace("this.myTarget.switch_ar.length: "+this.myTarget.switch_ar.length);
		// check my target's list of switches
		var allon = true;
		for(var i = 0; i < this.myTarget.switch_ar.length; i++){
			var nextSwitch = this.myTarget.switch_ar[i];
			if(nextSwitch.state != nextSwitch.keyState){
				allon = false;
				break;
			}
		}
		if(allon){
			this.myTarget.unlock();
			trace("Switch::myTarget: "+this.myTarget.myDescription);
			showMessage(this.mySuccessMessage);
		}
	}
}

function initElement(){
	//trace("Switch::initElement()");
	this.myElement = document.createElement('img');
	// v TEMP
	this.myElement.style.border = "3px dashed orange";
	// ^ TEMP
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	this.myElement.myObject = this;
	this.myElement.onmousedown = this.myElement.ontouchstart = this.touched_handler.bind(this);
	//trace("this.myElement: "+this.myElement);
}
function imageLoaded_handler(e){
	//trace("Switch::imageload_handler()");

	this.numLoaded ++;
	
	//trace("numLoaded: "+this.numLoaded+" vs "+this.images_ar.length);
	if(this.numLoaded == this.images_ar.length){
	//trace("Switch:: all loaded");
	  // All Images Loaded
		this.loaded = true;
		this.myElement.dispatchEvent(this.LOADED);
		this.setPosition(this.x_ar[0],this.y_ar[0]);
		this.myElement.src = this.images_ar[0];
		if(this.src == "blank.gif"){
			this.setSize(this.closedWidth,this.closedHeight);
		}
				//trace("this.myElement.onLoad: "+this.myElement.onload);
		this.myElement.removeEventListener('onload', this.imageLoaded_handler);
				//trace("this.myElement.onLoad2: "+this.myElement.onload);

		this.myElement.onload = null;
	}else if(!this.loaded){
		this.myElement.src = this.images_ar[this.numLoaded];
	}
}
function load(){
	//trace("Switch ["+this.myDescription+"]::load()");
	//trace("Switch.myElement: "+this.myElement);
	this.myElement.onload = this.imageLoaded_handler.bind(this);
	//trace("Switch::images_ar[0]: "+this.images_ar[0]);
	this.myElement.src = this.images_ar[0];
	this.myContainer.appendChild(this.myElement);
//	
}

function show(){
	//trace("show "+this.myDescription);
	this.myElement.style.display = "block";

}
function hide(){
	//trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}

/*function onTouch(e){
	//alert("this: "+this);
	this.myElement.dispatchEvent(this.TOUCHED);
}*/

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
	//alert (evtObj+"\n type: "+evtObj.type);
	return evtObj;
}

// Function.prototype.bind = function(obj) { 
//   var method = this, 
//    temp = function() { 
//     return method.apply(obj, arguments); 
//    }; 
//   return temp; 
// }

function touched_handler(e){
	//trace("Switch::touched - "+this.myDescription);
	// ^ does function know "this" from binding? yes
	//var switch = e.target.myObject;
	this.myElement.dispatchEvent(this.TOUCHED);
	this.switchMe();
}
