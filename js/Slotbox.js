/*
// Fill this with its Keys to unlock its Target
*/
function Slotbox( srcClosed, srcOpen, x, y, myDescription, myTargetID, myKeysID_ar, x_ar, y_ar ){
	this.keys_ar = myKeysID_ar;
	this.myTargetID = myTargetID;
	this.myContainer = containers_div;
	this.myDescription = myDescription;
	this.keysX_ar = x_ar;
	this.keysY_ar = y_ar;
	this.x = x;
	this.y = y;
	
	if(srcClosed.substring(0,5) == "blank"){
		var xIndex = srcOpen.indexOf("x");
		this.srcClosed = "images/blank.gif";
		this.closedWidth = Number(srcOpen.substring(6,xIndex));
		this.closedHeight = Number(srcOpen.substring(xIndex+1,srcOpen.length));
	}else{
		this.srcClosed = srcClosed;
	}
	
	if(srcOpen.substring(0,5) == "blank"){
		var xIndex = srcOpen.indexOf("x");
		this.srcOpen = "images/blank.gif";
		this.openWidth = Number(srcOpen.substring(6,xIndex));
		this.openHeight = Number(srcOpen.substring(xIndex+1,srcOpen.length));
	}else{
		this.srcOpen = srcOpen;
	}
		
	this.image_ar = [this.srcClosed];
	if(srcOpen != srcClosed){
		this.image_ar.push(srcClosed);
	}

	this.TOUCHED = this.customEvent("touched");
	this.UNLOCKED = this.customEvent("unlocked");
	this.LOADED = this.customEvent("loaded");
	
	// Core Level
	//setListener(this, "touched", this.touched_handler);
	
	this.initElement();
	slotboxes_ar.push(this);
}

/*
*   --------------
*     PROPERTIES
*   --------------
*/
Slotbox.prototype.loaded = false;
Slotbox.prototype.keys_ar = [];
Slotbox.prototype.keysFound = 0;
Slotbox.prototype.myElement = null;
Slotbox.prototype.numLoaded = 0;
Slotbox.prototype.state = "locked"; // locked, unlocked
Slotbox.prototype.myTarget = null;

/*
*   --------------
*     BIND METHODS
*   --------------
*/
Slotbox.prototype.customEvent = customEvent;
Slotbox.prototype.setPosition = setPosition;
Slotbox.prototype.unlock = unlock;
Slotbox.prototype.open = open;

Slotbox.prototype.load = load;
Slotbox.prototype.imageLoaded_handler = imageLoaded_handler;
Slotbox.prototype.initElement = initElement;

Slotbox.prototype.hide = hide;
Slotbox.prototype.show = show;

Slotbox.prototype.touched_handler = touched_handler;

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
	this.myElement.onmousedown = this.myElement.ontouchstart = this.touched_handler.bind(this);
}
function imageLoaded_handler(e){
	this.numLoaded ++;
	if(this.numLoaded == this.image_ar.length){
	  // All Images Loaded
		this.loaded = true;
		this.myElement.dispatchEvent(this.LOADED);
		this.setPosition(this.x,this.y);
		this.myElement.src = this.image_ar[0];
		if(this.src == "blank.gif"){
			this.setSize(this.closedWidth,this.closedHeight);
		}
	}else if(!this.loaded){
		this.myElement.src = this.image_ar[this.numLoaded];
	}
}
function load(){
	//trace("Slotbox ["+this.myDescription+"]::load()");
	this.myElement.onload = this.imageLoaded_handler.bind(this);
	this.myElement.src = this.image_ar[0];
	this.myContainer.appendChild(this.myElement);
//	
}


function setPosition(x,y){
	this.myElement.style.left = String(x)+"px";
	this.myElement.style.top = String(y)+"px";
	//this.x = x;
	//this.y = y;
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

Function.prototype.bind = function(obj) { 
  var method = this, 
   temp = function() { 
    return method.apply(obj, arguments); 
   }; 
  return temp; 
}

function unlock() {
	//trace("Slotbox::unlock");	
	this.myElement.dispatchEvent(this.UNLOCKED);
	this.state = "unlocked";
	this.myElement.src = this.srcOpen;
	//this.setPosition(this.x_ar[1],this.y_ar[1]);
	if (this.srcOpen == "blank.gif"){
		this.setSize(this.openWidth,this.openHeight);
	}else if(this.srcOpen == ""){
		this.hide();	
	}
}
function show(){
	//trace("show "+this.myDescription);
	this.myElement.style.display = "block";

}
function hide(){
	//trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}
function touched_handler(e){
	trace("Slotbox::touched - "+this.myDescription);
	// ^ does function know "this" from binding?
	var box = e.target.myObject;
	this.myElement.dispatchEvent(this.TOUCHED);
	if(box.state == "locked"){
		if(activeItem != null){
			// Look to see if activeItem goes in slots
			var fits = false;
			for(var i = 0; i< this.keys_ar.length; i++){
				if(activeItem == this.keys_ar[i]){
					// Put the item in the slot
					activeItem.src = activeItem.iconSrc;
					activeItem.setPosition(this.myElement.offsetLeft+this.keysX_ar[i],this.myElement.offsetTop+this.keysY_ar[i]);
					activeItem.myElement.style.pointerEvents = "none";
					this.keysFound++;
					var msg ="";
					if(Math.random()<.5){
						msg += ("The "+activeItem.myDescription+" fits into the "+box.myDescription+".");
					}else{
						msg += ("You find a slot for the "+activeItem.myDescription+" in the "+box.myDescription+".");
					}
					if(this.keysFound == this.keys_ar.length){
						msg += "..<br>You hear a 'click' as the "+this.myTarget.myDescription+" opens!";
						// Unlock Target
						this.myTarget.unlock();
					}
					showMessage(msg);
					fits = true;
					if(myInventory.hasItem(activeItem)){ myInventory.removeItem(activeItem)};					
					break;
				}
			}
			if(!fits){
				showMessage("The "+activeItem.myDescription+" has no effect on the "+this.myDescription);
			}
		} else {
			showMessage("This is a "+e.target.myObject.myDescription);
		}
	}else{
		// do it's function?
		showMessage("The "+e.target.myObject.myDescription+" is complete.");
	}
}
