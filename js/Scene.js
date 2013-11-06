var imagesFolder = "images/";
function Scene(bgImg, items_ar, containers_ar, switches_ar, doors_ar, hotspots_ar, myID, myDescription, isSubscene){
	//trace("Scene:: "+bgImg);
	//trace("items_ar.length: "+items_ar.length);
	
	if(isSubscene){
		this.subscene = true;
	}
	this.numvisits = 0;
	this.myID = myID;
	this.items_ar = items_ar;//.concat();
	this.containers_ar = containers_ar.concat();
	this.switches_ar = switches_ar.concat();
	this.doors_ar = doors_ar.concat();
	this.hotspots_ar = hotspots_ar.concat();
	this.bgImg = imagesFolder+bgImg;
	this.myContainer = backgrounds_div;
	this.myDescription = myDescription;
	// this.LOADED = this.customEvent("loaded");
	this.TOUCHED = this.customEvent("touched");
	this.init();
	// Core Level
	scenes_ar.push(this);
	// console.log('this.testVar is: '+this.testVar);

}

/*
*   --------------
*     INHERITENCE
*   --------------
*/
//subclass extends superclass
Scene.prototype = Object.create(AdventureGameObject.prototype);
Scene.prototype.constructor = Scene;

/*
*   --------------
*     PROPERTIES
*   --------------
*/
// Scene.prototype.loaded = false;
Scene.prototype.bgLoaded = false;
Scene.prototype.myContainer = null;
Scene.prototype.myDescription = "";
Scene.prototype.myElement = null;
Scene.prototype.bgImg = "";
Scene.prototype.subscene = false;
Scene.prototype.hidden = true;
// Scene.prototype.allMyContents_ar = [];
// Scene.prototype.items_ar = [];
// Scene.prototype.containers_ar = [];
// Scene.prototype.switches_ar = [];
// Scene.prototype.doors_ar = [];
// Scene.prototype.hotspots_ar =[];
Scene.prototype.width = 0;
Scene.prototype.height = 0;
Scene.prototype.x = 0;
Scene.prototype.y = 0;
/*
*   --------------
*     BIND METHODS
*   --------------
*/
Scene.prototype.onTouch = onTouch;
// Scene.prototype.customEvent = customEvent;
Scene.prototype.setPosition = setPosition;

Scene.prototype.loadBGimage = loadBGimage;
Scene.prototype.imageLoaded_handler = imageLoaded_handler;
Scene.prototype.initMyImgElement = initMyImgElement;
//Scene.prototype.loadScene = loadScene;
Scene.prototype.show = show;
Scene.prototype.hide = hide;
Scene.prototype.init = init;
Scene.prototype.load = load;
Scene.prototype.checkLoad = checkLoad;

// Scene.prototype.addItem = addItem;
// Scene.prototype.addContainer = addContainer;
// Scene.prototype.addSwitch = addSwitch;
// Scene.prototype.addDoor = addDoor;
// Scene.prototype.addHotspot = addHotspot;

Scene.prototype.addObjects =addObjects;




/*
*   --------------
*     CREATE METHODS
*   --------------
*/

function init(){
	// console.log("Scene.init()");
	// trace("Scene::init()"+this);
	this.myElement = new Image();
	this.myElement.style.position = "absolute";
	this.myElement.style.display = "none";
	this.myElement.myObject = this;
	this.myContainer.appendChild(this.myElement);
	
	// this.items_ar = [];
	// this.containers_ar = [];
	// this.switches_ar = [];
	// this.doors_ar = [];
	this.allMyContents_ar = this.items_ar.concat(this.containers_ar,this.switches_ar,this.doors_ar,this.hotspots_ar);
	//trace("this.items_ar.length: "+this.items_ar.length);
	//for(var i = 0; i< this.allMyContents_ar.length; i++){
		//this.allMyContents_ar[i].setScene(this);
	//}

}


function loadBGimage(){
	//trace("Scene::loadBGimage: "+this.myDescription);

	
	this.myElement.onload = this.imageLoaded_handler.bind(this);
	this.myElement.onerror = this.imageError_handler;
	// preload the image file
	//img.src = this.bgImg;
	this.myElement.src = this.bgImg;
}
function imageLoaded_handler(e){
	//trace("Scene:: BGimageLoaded ["+this.myElement.src+"]");
	this.initMyImgElement();
	this.setPosition(this.x,this.y);
	this.bgLoaded = true;
}
function initMyImgElement(){
	//trace("scene:: initMyImgElement");
	this.width = this.myElement.offsetWidth;
	this.height = this.myElement.offsetHeight;
	this.myElement.onmousedown = this.myElement.ontouchstart = this.onTouch.bind(this);
	//this.myElement.display = "none";
}
// function imageError_handler(e){
// 	console.log('----------------------');
// 	console.log('IMAGE LOADING ERROR (Scene)');
// 	console.log('e is: '+e);
// 	console.log(e);
// 	console.log('this is: '+this);
// 	console.log(this);
// }



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

// function customEvent(eventName){
// 	
// 	var evtObj = document.createEvent("Event");
// 	evtObj.initEvent(eventName,true,true);
// 	//alert (evtObj+"\n type: "+evtObj.type);
// 	return evtObj;
// 	
// }


// Function.prototype.bind = function(obj) { 
// 	
//   var method = this, 
//    temp = function() { 
//     return method.apply(obj, arguments); 
//    }; 
//   return temp; 
// 
// }

function die(){
	// ?? Remove Event Listeners ??
	this.myElement.parentNode.removeChild(this.myElement);
	// ?? Delete Object ??
}

function load(){
	trace("<br>Scene ["+this.myDescription+"] load()");
	//trace("loaded: "+this.loaded);
	if(!this.loaded){
		this.loadBGimage();
		for(var i = 0; i< this.allMyContents_ar.length; i++){
			trace("Scene loading ["+this.allMyContents_ar[i].myDescription+"]");
			if(!this.allMyContents_ar[i].loaded){
				this.allMyContents_ar[i].load();
			}
			this.allMyContents_ar[i].myElement.ondragstart = function() { return false; };
			this.allMyContents_ar[i].myScene = this;
		}
		this.myElement.ondragstart = function() { return false; };
		// Wait for all to load
		loadCheckInterval = setInterval(checkLoad.bind(this),100);
	}else{
		this.show();
	}
}
function checkLoad(){
	trace("checkLoad this: "+this.myDescription);
	var numLoaded = 0;
	for(var i = 0; i< this.allMyContents_ar.length; i++){
	trace(i+":: "+this.allMyContents_ar[i].loaded);
		if(this.allMyContents_ar[i].loaded){
			numLoaded++;
		};
	}
	//trace("loaded: "+numLoaded +" / "+this.allMyContents_ar.length);
	if(this.bgLoaded && numLoaded == this.allMyContents_ar.length){
		clearInterval(loadCheckInterval);
		this.loaded = true;
		trace("Scene ["+this.myDescription+"] Loaded, myElement: "+this.myElement.src);
		this.myElement.dispatchEvent(this.LOADED);
		return true;
	}
	return false;
}
function show(){
	//trace("Scene::show "+this.myDescription);
	this.hidden = false;
	this.myElement.style.display = "block";
	//trace("<br><br>this.allMyContents_ar.length: "+this.allMyContents_ar.length);
	for(var i = 0; i< this.allMyContents_ar.length; i++){
		//trace("contents: "+this.allMyContents_ar[i].myDescription);
		this.allMyContents_ar[i].show();
	}
	// for (i = 0; i< this.containers_ar.length; i++){
// 		var cont = this.containers_ar[i];
// 		if(cont.state != "open"){
// 			for (var c = 0; c < cont.contents_ar.length; c++){
// 				cont.contents_ar[c].myElement.style.display = "none";
// 			}
// 		}
// 	}
}
function hide(){
	//trace("hide "+this.myDescription);
	this.hidden = false;
	this.myElement.style.display = "none";
	for(var i = 0; i< this.allMyContents_ar.length; i++){
		var next = this.allMyContents_ar[i];
		//if(!next.inInventory){
			next.hide();
		//}
	}
}

function addObjects(objs_ar){
	for(var i = 0; i< objs_ar.length; i++){
		var obj = objs_ar[i];
		if(this.allMyContents_ar.indexOf(obj) == -1){
			this.allMyContents_ar.push(obj);
			//trace("typeof(obj): "+typeof(obj));
			//trace("obj is Door: " +(obj is Door));
			//trace("obj.prototype: "+obj.prototype);
			//trace("obj.constructor.toString(): "+obj.constructor.toString());	
			if(isType(obj, "Door")){
				this.doors_ar.push(obj);
			}else if(isType(obj, "Item")){
				this.items_ar.push(obj);
			}else if(isType(obj, "Container")){
				this.containers_ar.push(obj);
			}else if(isType(obj, "Switch")){
				this.switches_ar.push(obj);
			}else if(isType(obj, "Hotspot")){
				this.hotspots_ar.push(obj);
			}
			// if(obj.constructor.toString().indexOf("Door") != -1){
			// 		}
			obj.show();
		}
	}
}

// function addDoor(door){
// 	if(this.allMyContents_ar.indexOf(door) == -1){
// 		this.allMyContents_ar.push(door);
// 		trace("typeof(door): "+typeof(door));
// 		//trace("door is Door: " +(door is Door));
// 		trace("door.prototype: "+door.prototype);
// 		trace("door.constructor.toString(): "+door.constructor.toString());
// 		if(door.constructor.toString().indexOf("Door") != -1){
// 			door.show();
// 			this.doors_ar.push(door);
// 		}
// 	}
// }
// function addItem(){
// 	
// }
// function addContainer(){
// 	
// }
// function addSwitch(){
// 	
// }
// function addHotspot(){
// 	
// }