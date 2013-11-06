// Array plus visual holder for inventory items
//
//
function Inventory(numSlots,slotSrc,myContainer,x,y){
	//this.contents_ar = new Array();
	//this.slots_ar = new Array();
	this.myContainer = myContainer;
	this.contents_ar.length = numSlots;
	this.x = x;
	this.y = y;
	this.slots_ar.length = numSlots;
	this.slotSrc = slotSrc;
	// Load Slot Image
	this.preloadSlotImg();

	this.TOUCHED = this.customEvent("touched");
	
}

// Properties
Inventory.prototype.contents_ar = [];
Inventory.prototype.slots_ar = [];
Inventory.prototype.x = 0;
Inventory.prototype.y = 0;
Inventory.prototype.slotSrc = "";
//Inventory.prototype.slotWidth = 60;
// Methods
Inventory.prototype.preloadSlotImg = preloadSlotImg;
Inventory.prototype.setPosition = setPosition;
Inventory.prototype.buildSlots = buildSlots;
Inventory.prototype.hasItem = hasItem;
Inventory.prototype.addItem = addItem;
Inventory.prototype.removeItem = removeItem;
Inventory.prototype.showHilite = showHilite;
Inventory.prototype.hideHilite = hideHilite;
Inventory.prototype.loadDone_handler = loadDone_handler;
Inventory.prototype.customEvent = customEvent;


function preloadSlotImg(){
	//trace("Inventory::preloadSlotImg()");
	// create an image object
	var slotImg = new Image();
	// set what happens once the image has loaded 
	slotImg.onload = this.loadDone_handler.bind(this);
	// preload the image file
	slotImg.src=this.slotSrc;
}

function loadDone_handler(e){
	//trace("loadDone_hanler("+e.target+")");
	this.buildSlots();
	this.setPosition(this.x, this.y);
}


function buildSlots(){
	//trace("Preloading Done, building slots")
	for(var i = 0; i< this.slots_ar.length; i++){
	//	trace("<br>i: "+i);
		var slotImg = document.createElement('img');
		
		slotImg.style.position = "absolute";
		
		slotImg.src = this.slotSrc;

		this.myContainer.appendChild(slotImg);
		this.slots_ar[i] = slotImg;
		//slotImg.onmousedown = slotImg.ontouchstart = this.onTouch.bind(this);
		slotImg .ondragstart = function() { return false; };
		
	}
	this.hilite = document.createElement("img");
	this.hilite.src = "images/hilite.png";
	this.hilite.style.visibility = "hidden";
	this.hilite.style.position = "absolute";
	this.myContainer.appendChild(this.hilite);
	this.sparkle = document.createElement("img");
	this.sparkle.src = "images/sparkle.gif";
	this.sparkle.style.position = "absolute";
	//this.sparkle.src = "";
	items_div.appendChild(this.sparkle);
//	trace("items_div: "+items_div);
//	trace("sparkle.xy: "+this.sparkle.offsetLeft+", "+this.sparkle.offsetTop);
}


function onTouch(e){
	//alert("this: "+this);
	this.myElement.dispatchEvent(this.TOUCHED);
}

function setPosition(x,y){
	//trace("Inventory::setPosition::slots_ar: "+this.slots_ar);
	this.x = x;
	this.y = y;
	this.hilite.style.top = String(y)+"px";
//	this.myElement.style.left = String(x)+"px";
//	this.myElement.style.top = String(y)+"px";
	for(var i = 0; i< this.slots_ar.length; i++){
		var slot = this.slots_ar[i];
		var xNum = x+i*slot.offsetWidth;
		//var xNum = x+i*this.slotWidth;
		slot.style.left = String(xNum)+"px";
		slot.style.top = String(y)+"px";
		
		if(this.contents_ar[i] != null){
			var item = this.contents_ar[i];
			item.show();
			item.setPosition( slot.offsetLeft + slot.offsetWidth/2 - item.myElement.offsetWidth/2, 
				slot.offsetTop + slot.offsetHeight/2 - item.myElement.offsetHeight/2 );
		}
	}
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

function addItem(item){
	//trace("Inventory.addItem")
	//var foundRoom = false;
	var slotNum = -1;
	for(var i = 3; i > -1; i--){
		if(this.contents_ar[i] == null){
			foundRoom = true;
			slotNum = i;
			break;
		}else if(this.contents_ar[7-i] == null){
			foundRoom = true;
			slotNum = 7-i;
			break;
		}
	}
	if(slotNum > -1){
		// Show it in slot
		this.contents_ar[slotNum] = item;
		var slotElem = this.slots_ar[slotNum];
		item.myElement.src = "";
		item.myElement.src = item.iconSrc;
		item.setPosition(slotElem.offsetLeft+slotElem.offsetWidth/2-item.myElement.offsetWidth/2, slotElem.offsetTop+slotElem.offsetHeight/2-item.myElement.offsetHeight/2);
		this.sparkle.style.left = inttopx(slotElem.offsetLeft);
		this.sparkle.style.top = inttopx(slotElem.offsetTop);
		//trace("inttopx(sletElem.ofsetTop): "+inttopx(slotElem.offsetTop));
		//trace("this.sparkle.styel.position: "+this.sparkle.style.position);
		//this.sparkle.src = "";
		this.sparkle.style.display = "block";
		this.sparkle.src = "images/sparkle.gif";
		var spkl = this.sparkle;
		var sparkeleTimeout = setTimeout(function(e){
			//trace("sparkleDone!");
			//trace("this.sparkle: "+this.spkl);
			spkl.style.display = "none";
		},600);
		return true;
	}else{
		return false;
	}
	
	// for(var i = 0; i<this.contents_ar.length; i++){
	// 		if(this.contents_ar[i] == null){
	// 			foundRoom = true;
	// 			// Use this slot
	// 			this.contents_ar[i] = item;
	// 			var slotElem = this.slots_ar[i];
	// 			// Show it in slot
	// 			item.myElement.src = item.iconSrc;
	// 			item.setPosition(slotElem.offsetLeft+slotElem.offsetWidth/2-item.myElement.offsetWidth/2, slotElem.offsetTop+slotElem.offsetHeight/2-item.myElement.offsetHeight/2);
	// 			break;
	// 		}
	// 	}
	//return foundRoom;
}

function removeItem(item){
	var index = this.contents_ar.indexOf(item);
	if(index != -1){
		this.contents_ar[index] = null;
		item.myElement.removeEventListener("touchedInventory",itemTouchedInInventory_handler);
		if(item == activeItem){
			activeItem = null;
			this.hideHilite();
		}
	}
}

function hasItem(item){
	//trace("Inventory.hasItem("+item.myDescription+")?");
	//trace("index: "+this.contents_ar.indexOf(item));
	if(this.contents_ar.indexOf(item) == -1){
		//trace("false");
		return false;
	} else {
		//trace("true");
		return true;
	}
}

function showHilite(item){
	if(this.contents_ar.indexOf(item)!= -1){
		var index = this.contents_ar.indexOf(activeItem);
	//	trace("this.hilite: "+this.hilite);
		//Inventory.showHilite(activeItem);
		this.hilite.style.left = this.slots_ar[index].style.left;
		this.hilite.style.top = this.slots_ar[index].style.top;
		this.hilite.style.visibility = "visible";
	//	trace("this.hilite.style.visibility: "+this.hilite.style.visibility);
	}
}
function hideHilite(){
	this.hilite.style.visibility = "hidden";
}

