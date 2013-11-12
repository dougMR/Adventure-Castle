var images_folder = "images/";

function Door(srcClosed, srcOpen, myDescription, myID, myTargetID, x_ar, y_ar, switch_ar){

	this.myContainer = doors_div;
	this.myDescription = myDescription;
	
	this.myID = myID;
	this.myTargetID = myTargetID;
	
	this.x_ar = x_ar;
	this.y_ar = y_ar;
	this.width_ar = [];
	this.height_ar = [];
	
	if(switch_ar == null){
		switch_ar = [];
	}
	this.switch_ar = switch_ar;
	

	this.images_ar = [srcClosed,srcOpen];
	
	for(var i =0; i< this.images_ar.length; i++){
		var nextSrcStr = this.images_ar[i];
		if(nextSrcStr.substring(0,5) == "blank"){
			var xIndex = nextSrcStr.indexOf("x");
			this.images_ar[i] = images_folder+"blank.gif";
			this.width_ar[i] = Number(nextSrcStr.substring(6,xIndex));
			this.height_ar[i] = Number(nextSrcStr.substring(xIndex+1,nextSrcStr.length));
		}else{
			this.images_ar[i] = images_folder+nextSrcStr;
		}
	}	
	
	
	this.TOUCHED = this.customEvent("touched");
	this.UNLOCKED = this.customEvent("unlocked");
	this.LOADED = this.customEvent("loaded");
	
	this.initElement();
	// Core Level
	doors_ar.push(this);
	setListener(this,"touched", doorTouched_handler);
}

/*
*   --------------
*     PROPERTIES
*   --------------
*/
Door.prototype.loaded = false;
Door.prototype.hidden = false;
Door.prototype.invisible = false;
Door.prototype.numLoaded = 0;
Door.prototype.state = "locked"; // locked, unlocked, open
// Door.prototype.myKey = null;
Door.prototype.myTarget = null;


/*
*   --------------
*     CREATE METHODS
*   --------------
*/

var doorMethods = {
	initElement : function (){
	//trace("Door::initElement()");
		this.myElement = document.createElement('img');
		this.myElement.style.position = "absolute";
		this.myElement.style.display = "none";
		this.myElement.myObject = this;
		this.myContainer.appendChild(this.myElement);
		this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
	},

	imageLoaded_handler: function (e){
		var filename = this.myElement.src.replace(/^.*(\\|\/|\:)/, '');
		//trace("filename: "+filename);
		if(filename != "blank.gif"){
			// console.log('this.numLoaded is: '+this.numLoaded);
			// console.log('this.myElement is: '+this.myElement);
			// console.log('this.width_ar is: '+this.width_ar);
			console.log("--------------------------------")
			console.log('this is: '+this);
	console.log(this);
		
			console.log('this.width_ar is: '+this.width_ar);
			console.log(this.width_ar);
			this.width_ar[this.numLoaded] = this.myElement.offsetWidth;
			this.height_ar[this.numLoaded] = this.myElement.offsetHeight;
			//this.setSize(this.closedWidth,this.closedHeight);
		}
		this.numLoaded ++;
		//trace("Door["+this.myDescription+"] imageLoaded: "+this.numLoaded+" of "+this.images_ar.length);
		//trace(" -- "+this.images_ar[this.numLoaded-1]);
		if(this.numLoaded >= this.images_ar.length){
		  // All Images Loaded
			//trace("Door::["+this.myDescription+"] - Loaded");
			this.myElement.removeEventListener('onload', this.imageLoaded_handler);
			this.myElement.onload = function(){return false;};
			this.myElement.dispatchEvent(this.LOADED);
			this.loaded = true;
			//this.myElement.src = this.images_ar[0];
			//this.switchImage(this.images_ar[0]);
			this.switchImage();
			//trace("Door::width_ar: "+this.width_ar);
			//trace("Door::images_ar: "+this.images_ar);
			//this.setPosition(this.x_ar[0],this.y_ar[0]);
			//
			this.myElement.style.visibility = "visible";
			//this.myElement.style.display = "none";
				this.hide();
		
		}else if(!this.loaded){
			//trace("Door::loadNextImage: "+this.images_ar[this.numLoaded]);
			this.myElement.src ="";
			this.myElement.src = this.images_ar[this.numLoaded];
		}
	
		// TEMP !!
		this.myElement.style.border = "3px dashed yellow";
		// ^ TEMP
	},
	load : function (){
		//trace("Door ["+this.myDescription+"]::load()");
		this.myElement.style.display = "block";
		this.myElement.style.visibility = "hidden";
		this.myElement.onload = this.imageLoaded_handler.bind(this);
		this.myElement.src = this.images_ar[0];

	},

	onTouch : function (e){
		this.myElement.dispatchEvent(this.TOUCHED);
	},

	setPosition : function (x,y){
		this.myElement.style.left = String(x)+"px";
		this.myElement.style.top = String(y)+"px";
		//this.x = x;
		//this.y = y;
	},
	setSize : function (w,h){
		this.myElement.style.width = String(w)+"px";
		this.myElement.style.height = String(h)+"px";
	},



	// Function.prototype.bind = function(obj) { 
	//   var method = this, 
	//    temp = function() { 
	//     return method.apply(obj, arguments); 
	//    }; 
	//   return temp; 
	// }

	unlock : function () {
		//trace("Door::unlock()");
		this.myElement.dispatchEvent(this.UNLOCKED);
		this.open();
	},
	open : function (){
		//trace("Door::open()");
		//trace("Door:: "+this.this.images_ar[0]+", "+this.images_ar[1]+", "+this.myDescription+", "+this.myID+", "+this.myTargetID+", "+this.x_ar+", "+this.y_ar+", "+this.switch_ar);
		this.state = "open";
		this.switchImage();
		// if(!this.hidden && this.myElement.display == "none"){
	// 		this.show();
	// 	}
	},

	switchImage : function (){
		//trace("Door::switchImage()");
		var imageIndex = -1;
		switch(this.state){
			default:
			case "locked":
				imageIndex = 0;
				//this.switchImage(this.images_ar[0]);
				break;
			case "unlocked":
				imageIndex = 0;
				//this.switchImage(this.images_ar[0]);
				break;
			case "open":
				imageIndex = 1;
				//this.switchImage(this.images_ar[1]);
				break;
		}
		//var newSrc = this.images_ar[imageIndex];
		//var oldSrc = images_folder+this.myElement.src.replace(/^.*(\\|\/|\:)/, '');
		//trace(" -- newSrc: "+newSrc+" vs this.myElement.src: "+oldSrc);
	
		//if(oldSrc != newSrc){
			this.myElement.src = this.images_ar[imageIndex];
			this.setSize(this.width_ar[imageIndex],this.height_ar[imageIndex]);
			this.setPosition(this.x_ar[imageIndex],this.y_ar[imageIndex]);
		//}
	},

	show : function (){
		//trace("Door::show()");
		//trace("show "+this.myDescription);
		if(!this.invisible){
			this.myElement.style.display = "block";
			this.hidden = false;
		}
	},
	hide : function (){
		//trace("hide "+this.myDescription);
		this.myElement.style.display = "none";
		this.hidden = true;
	}
}

function customEvent(eventName){
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	return evtObj;
}


/*
*   --------------
*     BIND METHODS
*   --------------
*/
Door.prototype.onTouch = doorMethods.onTouch;
Door.prototype.customEvent = customEvent;

Door.prototype.setPosition = doorMethods.setPosition;
Door.prototype.setSize = doorMethods.setSize;

Door.prototype.unlock = doorMethods.unlock;
Door.prototype.open = doorMethods.open;

Door.prototype.show = doorMethods.show;
Door.prototype.hide = doorMethods.hide;

Door.prototype.load = doorMethods.load;
Door.prototype.imageLoaded_handler = doorMethods.imageLoaded_handler;
Door.prototype.initElement = doorMethods.initElement;

Door.prototype.switchImage = doorMethods.switchImage;