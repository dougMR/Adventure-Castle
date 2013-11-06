function Lock(myElement, myType, myDescription, myLinkScreen){
	trace("                 **** LockLockLockLockLockLockLockLockLockLockLockLockLockLockLock");

	this.myType = myType;
	this.myDescription = myDescription;
	this.isLocked = true;
	this.myLinkScreen = myLinkScreen;

	this.myElement = myElement;
	this.myElement.myObject = this;
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "block";
	// this.TOUCHED_LOCKED = this.customEvent("touchedLocked");
	// 	this.TOUCHED_UNLOCKED = this.customEvent("touchedUnlocked");
	// 	this.UNLOCKED = this.customEvent("unlocked");
	// 	this.UNLOCK_FAILED = this.customEvent("unlockFailed");
	this.TOUCHED = this.customEvent("touched");
	//alert(this.LINK_TOUCHED+"\ntype: "+this.LINK_TOUCHED.type);
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
}
// Properties
Lock.prototype.loaded = false;
Lock.prototype.myType = "generic";
Lock.prototype.isLocked = true;
Lock.prototype.myElement = null;
Lock.prototype.myDescription = "This is a locked something."

// Methods
Lock.prototype.onTouch = onTouch;
Lock.prototype.customEvent = customEvent;
Lock.prototype.setPosition = setPosition;
Lock.prototype.show = show;
Lock.prototype.hide = hide;

// create the object methods
function onTouch(e){
	//alert("this: "+this);
	this.myElement.dispatchEvent(this.TOUCHED);
	
}

function setPosition(x,y){
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

function show(){
	trace("show "+this.myDescription);
	this.myElement.style.display = "block";
}
function hide(){
	trace("hide "+this.myDescription);
	this.myElement.style.display = "none";
}


// function setListeners(){
// 	alert("Lock.setListeners() this: "+this);
// 	if( this.myElement.addEventListener ) {
// 		this.myElement.addEventListener("touchedLocked",touchedLocked_handler,false);
// 		this.myElement.addEventListener("touchedUnlocked",touchedUnlocked_handler,false);
// 		this.myElement.addEventListener("unlocked",unlocked_handler,false);
// 		this.myElement.addEventListener("unlockFailed",unlockFailed_handler,false);
// 		
// 	} else if( this.attachEvent ) {
// 		this.myElement.attachEvent('touchedLocked',touchedLocked_handler);
// 		this.myElement.attachEvent('touchedUnlocked',touchedUnlocked_handler);
// 		this.myElement.attachEvent('unlocked',unlocked_handler);
// 		this.myElement.attachEvent('unlockFailed',unlockFailed_handler);
// 	}
// 	function touchedLocked_handler(e){
// 		trace("touchedLocked_handler<br>"+e.target+" was touched!");
// 	}
// 	function touchedUnlocked_handler(e){
// 		trace("touchedUnlocked_handler<br>"+e.target+" was touched!");
// 	}
// 	function unlocked_handler(e){
// 		trace("unlocked_handler<br>"+e.target+" was touched!");
// 	}
// 	function unlockFailed_handler(e){
// 		trace("unlockFailed_handler<br>"+e.target+" was touched!");
// 	}
// }





