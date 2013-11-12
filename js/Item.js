var imgPath = "images/";
function Item(myContainer, imgSrc, iconSrc, myID, myTargetID, myDescription, x, y){
console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');


	this.myContainer = myContainer;
	this.myID = myID;
	this.myTargetID = myTargetID;
	this.inInventory = false;
	this.myDescription = myDescription;
	this.imgSrc = imgPath+imgSrc;
	this.iconSrc = imgPath + iconSrc;
	this.images_ar = [this.imgSrc];
	if(imgSrc != iconSrc){
		this.images_ar.push(this.iconSrc);
	}
	this.numImagesLoaded = 0;

	this.x = x;
	this.y = y;
	
	this.TOUCHED = this.customEvent("touched");
	this.TOUCHED_INVENTORY = this.customEvent("touchedInventory");

	this.usesRemaining = 1;	
	this.initElement();

	// Core Level
	items_ar.push(this);
	setListener(this,"touched",itemTouched_handler);
	
	console.log('this(Item).load is: '+this.load);
	console.log(this);
	
	
}

/*
*   --------------
*     INHERITENCE
*   --------------
*/
//subclass extends superclass
Item.prototype = Object.create(AdventureGameObject.prototype);
Item.prototype.constructor = Item;

// console.log('Item.tallyImagesComplete is: '+Item.prototype.tallyImagesComplete);
// console.log('Item.loadImage is: '+Item.loadImage);



///////////////
// Properties
///////////////
Item.prototype.numImagesLoaded = 0;
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

////////////
// Methods
///////////
var itemMethods = defineItemMethods();
// Item.prototype.imageLoaded_handler = itemMethods.imageLoaded_handler;
Item.prototype.onTouch = itemMethods.onTouch;
// Item.prototype.customEvent = customEvent;
Item.prototype.setPosition = itemMethods.setPosition;
//Item.prototype.setListeners = setListeners;
Item.prototype.die = itemMethods.die;

Item.prototype.load = itemMethods.load;
Item.prototype.initElement = itemMethods.initElement;

Item.prototype.show = itemMethods.show;
Item.prototype.hide = itemMethods.hide;

function defineItemMethods(){

	return {
		// create the object methods
		initElement : function (){
			this.myElement = document.createElement('img');
			// v TEMP
			this.myElement.style.border = "3px dashed green";
			// ^ TEMP
			this.myContainer.appendChild(this.myElement);
			this.myElement.myObject = this;
			this.myElement.style.position = "absolute";
			this.myElement.style.display = "none";
			this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
		},

		// function imageLoaded_handler(e){
		// 	this.numImagesLoaded ++;
		// 	//trace("Item[::]"+this.myDescription+"] imageLoaded: "+this.numImagesLoaded+" of "+this.numToLoad);
		// 	if(this.numImagesLoaded == this.images_ar.length){
		// 	  // All Images Loaded
		// 		//trace("Item::"+this.myDescription+" - Loaded");
		// 		this.myElement.dispatchEvent(this.LOADED);
		// 		this.loaded = true;
		// 		this.myElement.src = this.images_ar[0];
		// 		this.setPosition(this.x,this.y);
		// 		this.hide();
		// 	}else if(!this.loaded){
		// 		//trace("Door::loadNextImage: "+this.images_ar[this.numImagesLoaded]);
		// 		this.myElement.src = this.images_ar[this.numImagesLoaded];
		// 	}
		// }

		load : function (){
			//trace("Item ["+this.myDescription+"] load()")
			// set what happens once the image has loaded 
			console.log('ITEM::load()')
			console.log('this is: '+this);
			console.log(this);
			// console.log('this.imageLoaded_handler is: '+this.imageLoaded_handler);

			
			this.myElement.onload = this.imageLoaded_handler.bind(this);
			// preload the image file
			// this.myElement.src = this.images_ar[0];
			this.startImagesLoad();
		},
		onTouch : function (e){
			//alert("this: "+this);
			if(this.inInventory){
				// READY FOR USE
				this.myElement.dispatchEvent(this.TOUCHED_INVENTORY);
		
			}else{
				// PICK UP
				this.myElement.dispatchEvent(this.TOUCHED);
			}
	
		},

		setPosition : function (x,y){
			//trace("settingPosition: "+this.myDescription+" :: "+x+", "+y);
			this.myElement.style.left = String(x)+"px";
			this.myElement.style.top = String(y)+"px";
	
		},

		customEvent : function (eventName){
			var evtObj = document.createEvent("Event");
			evtObj.initEvent(eventName,true,true);
			//alert (evtObj+"\n type: "+evtObj.type);
			return evtObj;
		},


		// Function.prototype.bind = function(obj) { 
		//   var method = this, 
		//    temp = function() { 
		//     return method.apply(obj, arguments); 
		//    }; 
		//   
		//   return temp; 
		// }

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

		die : function (){
			// ?? Remove Event Listeners ??
			this.myElement.parentNode.removeChild(this.myElement);
			// ?? Delete Object ??
		},

		// function used(){
		// 	this.usesRemaining -- ;
		// 	if(this.usesRemaining == 0){
		// 		this.die();
		// 	}
		// }
		show : function (){
			//trace("show "+this.myDescription);
			if(!this.invisible){
				// How does this know if it's in a container and should remain hidden?
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
}