var activeItem = null;
var activeScene = null;
//var lastScene = null;
var inventory_ar = [];
var myInventory;
var windowW, windowH, centerX, centerY;
var messageTimeout;
var back_ar = [];
var backingUp = false;
//var scrollboxColors = ["#eadbb5","#e4edff"];

// Ensure indexOf method for arrays
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

Function.prototype.bind = function(obj) { 
  var method = this, 
   temp = function() { 
    return method.apply(obj, arguments); 
   }; 
  return temp; 
}

	function loadScene(scene){
		//trace("loadScene: "+scene.myDescription);
		//trace("scene.loaded: "+scene.loaded);
		if(!scene.loaded){
			setListener(scene, "loaded", sceneLoaded_handler);
			scene.load();
		}else{
			switchToScene(scene);
		}	
	}
	
	// Once it loads...
	function sceneLoaded_handler(e){
		var scene = e.target.myObject;
		switchToScene(scene);
	}
	function switchToScene(scene){
		//trace("switchToScene()"+backingUp);
		scene.myElement.removeEventListener(Scene.LOADED, sceneLoaded_handler);
		//trace("sceneLoaded: "+scene.myDescription);
		//trace("blackCover_div: "+blackCover_div);
		//trace("getOpacity(blackCover_div): "+getOpacity.blackCover_div);
		blackCover_div.style.display = "block";
		if(blackCover_div.fadeIntervalId != null){
			clearInterval(blackCover_div.fadeIntervalId);
		}
		setOpacity(blackCover_div,0);
		fadein(blackCover_div,250,function(){
			//trace("fadeIn Done!!");
			document.getElementById("messagebox").style.visibility = "hidden";
			// Show Scene and all its members
			if(activeScene != null){
				//trace("activeScene: "+activeScene.myDescription);
				activeScene.hide();
			}
			scene.show();
			//trace("scene.subscene: "+scene.subscene);
			if(scene.subscene){ 
			//trace("- subscene.");
			//trace("backingUp: "+backingUp);
				backbutton.myElement.style.display = "block";
				if(!backingUp){
					back_ar.push(activeScene);
					//trace("back_ar.length(adding): "+back_ar.length);
				}
				//backbutton.myTarget = activeScene;
			}else{
				backbutton.myElement.style.display = "none";
			}
			backingUp = false;
			activeScene = scene;
			//trace("activeScene: "+scene.myDescription,true);
			positionScene();
			//trace("blackCover_div.getOpacity: "+getOpacity(blackCover_div));
			//trace("new activeScene: "+activeScene.myDescription);
			fadeout(blackCover_div,750,function(){
				//trace("COVEr FADED OUT");
				blackCover_div.style.display = "none";
				//trace("blackCover_div.style.display: "+blackCover_div.style.display,true);
				if(activeScene.myDescription != "" && activeScene.numvisits < 1){
					showMessage(activeScene.myDescription);
					activeScene.numvisits ++;
				}
			});
		});
	}

//
//  CHECK IF Item, Door, Switch, Container, Hotspot - or, built-in types
//
function isType(object, typeString){
	// Return a boolean value telling whether // the first argument is an Array object. 
	if (typeof arguments[0] == 'object') {  
		var regex = new RegExp(typeString, "i");
		var criterion = arguments[0].constructor.toString().match(regex); 
	 	return (criterion != null);  
	}
	return false;
}

//
//  CREATE CUSTOM EVENT 
//
function customEvent(eventName){
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	//alert (evtObj+"\n type: "+evtObj.type);
	return evtObj;
}

//
//   GET SCREEN DIMS
//
function getScreenDims(){
	var dims = getWindowDimensions();
	windowW = dims.width;
	windowH = dims.height;
	centerX = windowW/2;
	centerY = windowH/2;
	if(document.getElementById("messagebox").style.visibility == "visible"){
		showMessage(document.getElementById("messagebox").innerHTML);
	}
}
function showScrollMessage(msg){
	scrollbox_div.innerHTML= msg+"<br><span style=\"color: #775601;\">   ~  ~  ~ </span><br>"+scrollbox_div.innerHTML;
	scrollbox_div.scrollTop = 0;//scrollbox_div.scrollHeight;
	//trace("scrollbox_div.scrollHeight: "+scrollbox_div.scrollHeight);
}
function showMessage(msg,duration){
	
	if(messageTimeout != null){
		clearTimeout(messageTimeout);
	}
	var message = document.getElementById("messagebox");
	if(message.fadeIntervalId){
		clearInterval(message.fadeIntervalId);
	}
	//message.style.height = message.style.width = "auto";
	//message.style.width = "600px";
	setOpacity(message, 0);
	fadein(message,750);
	message.style.visibility = "visible";
	message.innerHTML = "<p>" + msg + "</p>";
	//trace("message ["+msg+"]"+(50*message.innerHTML.length)/1000);
	if(duration == null){
		duration = 750+Math.round(50 * message.innerHTML.length);//3000;
	}
	message.style.top = inttopx(pxtoint(wrap_div.style.top) / 2);// "0px"; //String(windowH/2-message.offsetHeight*.6)+"px";
	message.style.left = String(windowW/2-message.offsetWidth/2)+"px";
	if(duration!=0){
		messageTimeout = setTimeout(hideMessage,duration);
	}
	
	// Show in Scrollbox
	showScrollMessage(msg);
	
}
function hideMessage(){
	//document.getElementById("messagebox").style.visibility = "hidden";

	var message = document.getElementById("messagebox");
	//trace("hide message: "+message);
	fadeout(message,3000);
}
function setOpacity(element, value) {
	// 0 - 1
	value = Math.min( 1, Math.max(0, roundHundredths(value)));
	//trace("setOpacity: "+value);
	element.style.opacity = String(value);
	element.style.filter = 'alpha(opacity=' + Math.round(value*100) + ')';
}
function getOpacity(element){
	var opacity;
	//trace("element: "+element);
	if(element.style.opacity != undefined){
		opacity = element.style.opacity;
	} else {
		opacity = element.filters.alpha.opacity / 100;		
	}
	opacity = opacity;
	//trace("getOpacity:: "+opacity);
	return Number(opacity);
}
function fadein(element, ms, callback){
	//trace(" - start fadein()");
	element.style.visibility = "visible";
	if(ms == null){
		ms = 1000;
	}
	var interval = 50;
	var step = Number(interval/ms);
	step = roundHundredths(step);
	element.fadeIntervalId =  setInterval(function(){
		//trace("<br>In:")
		
		var newOpacity = getOpacity(element) + step;
		setOpacity(element, newOpacity);
		//trace("newOpacity(in): "+newOpacity+" ["+element.fadeIntervalId+"]");
			
		//trace("in["+element.fadeIntervalId+"]newOpacity: "+newOpacity);
		if(newOpacity >= 1){
			
			clearInterval(element.fadeIntervalId);
			//trace(" - done fadeIntervalId[in]: "+element.fadeIntervalId);
			
			//trace("fade in done, new opacity: "+roundHundredths(newOpacity);
			//element.style.visibility = "hidden";
			setOpacity(element,1);
			//trace("callback: "+callback);
			if(callback){
				callback();
				//trace("   -- Did CALLBACK");
			}
			
		}
	},step);
}
function fadeout(element,ms,callback)
{
	//trace(" - start fadeout()");
	if(ms == null){
		ms = 1000;
	}
	var interval = 50;
	var step = interval/ms;
	step = roundHundredths(step);
	
	element.fadeIntervalId =  setInterval(function(){
		//trace("<br>Out:")
		//trace("opacity: "+getOpacity(element));
		//trace("-step: "+step);
		var newOpacity = getOpacity(element) - step;
		setOpacity(element, newOpacity);
		//trace("out["+element.fadeIntervalId+"]newOpacity: "+newOpacity);
		//trace("newOpacity( out ): "+newOpacity);	
		if(newOpacity <= 0){
			//trace(" - done fadeIntervalId[out]: "+element.fadeIntervalId);
			//trace("element: "+element.myDescription);
			clearInterval(element.fadeIntervalId);
			//trace("fade out done, new opacity: "+roundHundredths(newOpacity);
			element.style.visibility = "hidden";
			//setOpacity(element,1);
			//trace("callback: "+callback);
			if(callback){
				callback();
				//trace("   -- Did CALLBACK");
			}
			
		}
	},step);
}


function trace(msg,startNew){
	var pre = "";
	if(!startNew){
		pre = document.getElementById("output").innerHTML+"<br>";
	}
	document.getElementById("output").innerHTML = pre+String(msg);
}
function setListener(object,eventType,handler){
	//trace("setListener : "+object+": "+object.myDescription);
	if( object.myElement.addEventListener ) {
		object.myElement.addEventListener(eventType,handler,false);
	} else if( this.attachEvent ) {
		object.myElement.attachEvent(eventType,handler);		
	}
}

function makePickupable(item){
	setListener(item,"touched",itemTouched_handler);	
}
function putInInventory(item){
	if( !myInventory.hasItem(item) ){
		if(myInventory.addItem(item)){
			Sounds.play(harp);
			setListener(item,"touchedInventory",itemTouchedInInventory_handler);
			item.inInventory = true;	
		}else{
			//trace("No room for the "+item.myDescription+" in Inventory.");
			showMessage("No room for the "+item.myDescription+" in Inventory.");
		}
	}
}

	
function itemTouched_handler(e){
	//trace("You put the "+e.target.myObject.myDescription+" in your Inventory.");
	showMessage("You put the "+e.target.myObject.myDescription+" in your Inventory.");
	e.target.removeEventListener("touched",itemTouched_handler);
	putInInventory(e.target.myObject);
}
function itemTouchedInInventory_handler(e){
	activeItem = e.target.myObject;
	//trace("You select the "+e.target.myObject.myDescription+".");
	showMessage("You select the "+e.target.myObject.myDescription+".");
	//e.target.removeEventListener("touchedInventory",itemTouchedInInventory_handler);
	// hilite Inventory slot
	myInventory.showHilite(activeItem);	
}

function addToLocks(lock){
	setListener(lock,"touched",lockTouched_handler);
}
function addToContainers(container){
	//alert("container.myElement: "+containers_div);
	setListener(container,"touched",containerTouched_handler);
	containers_div.appendChild(container.myElement);
}
function addToDoors(door){
	//alert("container.myElement: "+containers_div);
	setListener(door,"touched",doorTouched_handler);
	//door_div.appendChild(door.myElement);
}
function destroyItem(item){
	if(myInventory.hasItem(item)){ myInventory.removeItem(item)};
	if(item == activeItem) {activeItem = null};
	
	item.die();
}
function lockTouched_handler(e){
	//trace("e.target: "+e.target);
	var lock = e.target.myObject;
	//trace("lock: "+lock);
	if(lock.isLocked){
		if(activeItem != null){
			//trace("activeItem.myType: "+activeItem.myType+" vs lock.myType: "+lock.myType);
			if(activeItem.myType == lock.myType){
				// Use Item to Unlock Lock
				//trace("you unlock the "+lock.myDescription+" with the "+activeItem.myDescription);
				showMessage("You unlock the "+lock.myDescription+" with the "+activeItem.myDescription);
				activeItem.usesRemaining -- ;
				if(activeItem.usesRemaining == 0){
					destroyItem(activeItem);
				}
			} else {
				//trace("the "+activeItem.myDescription+" has no effect on the "+lock.myDescription);
				showMessage("The "+activeItem.myDescription+" has no effect on the "+lock.myDescription);
			} 
		} else {
			//trace("this is a "+e.target.myObject.myDescription);
			showMessage("This is a "+e.target.myObject.myDescription);
		}
	}else{
		// do it's function?
		//trace("The "+e.target.myObject.myDescription+" is unlocked.");
		showMessage("The "+e.target.myObject.myDescription+" is unlocked.");
	}
}
function containerTouched_handler(e){
	var container = e.target.myObject;
	if(container.state == "locked"){
		if(activeItem != null){
			if(activeItem.myTarget == container){
				//trace("you unlock the "+container.myDescription+" with the "+activeItem.myDescription+", and find...");
				var message = ("You unlock the "+container.myDescription+" with the "+activeItem.myDescription+", and find...");
				for(var i = 0; i < container.contents_ar.length; i++){
					//trace("a "+container.contents_ar[i].myDescription+"!");
					message += ("<br>a "+container.contents_ar[i].myDescription+"!");
				}
				showMessage(message);
				container.unlock();
				activeItem.usesRemaining -- ;
				if(activeItem.usesRemaining == 0){
					destroyItem(activeItem);
				}
			} else {
				//trace("The "+activeItem.myDescription+" has no effect on the "+container.myDescription);
				showMessage("The "+activeItem.myDescription+" has no effect on the "+container.myDescription);
			} 
		} else {
			//trace("This is a "+e.target.myObject.myDescription);
			showMessage("This is a "+e.target.myObject.myDescription);
		}
	}else if(container.state == "open"){
		// do it's function?
		//trace("The "+container.myDescription+" is open.");
		showMessage("The "+container.myDescription+" is open.");
	}else if(container.state == "unlocked"){
		//trace("You open the "+container.myDescription+".");
		showMessage("You open the "+container.myDescription+".");
		container.open();
	}
}
function doorTouched_handler(e){
	var door = e.target.myObject;
	//trace("door.state: "+door.state);
	if(door.state == "locked"){
		//trace("activeItem: "+activeItem.myDescription);
		if(activeItem != null){
			if(activeItem.myTarget == door){
				//trace("You unlock the "+door.myDescription+" with the "+activeItem.myDescription+".");
				showMessage("You unlock the "+door.myDescription+" with the "+activeItem.myDescription+".");
				door.unlock();
				activeItem.usesRemaining -- ;
				if(activeItem.usesRemaining == 0){
					destroyItem(activeItem);
				}
			} else {
				//trace("The "+activeItem.myDescription+" has no effect on the "+door.myDescription);
				showMessage("The "+activeItem.myDescription+" has no effect on the "+door.myDescription);
			} 
		} else {
			//trace("This is a "+e.target.myObject.myDescription);
			showMessage("This is a "+e.target.myObject.myDescription);
		}
	}else if(door.state == "unlocked"){
		door.open();
		//trace("The "+door.myDescription+" opens.");
		showMessage("The "+door.myDescription+" opens.");
	}else if(door.state == "open"){
		// do it's function?
		//trace("doorTouched_handler::open");
		//door.myDestinationScene.openMe();
		//trace("door.myDescription: "+door.myDescription);
		//trace("door.myDestinationScene: "+door.myTarget.myDescription);
		loadScene(door.myTarget);
	}
}

function hotspotTouched_handler(e){
	var hotspot = e.target.myObject;
	//trace("touchd hs");
	if(hotspot.myTarget != null && hotspot.state != "locked"){
		// Door Spot
		//trace("hotspot.myDestinationScene: "+hotspot.myTarget.myDescription);
		loadScene(hotspot.myTarget);
	}else{
		// Just an Info Spot
		//trace(hotspot.myDescription);
		//trace("hotspot.state: "+hotspot.state);
		//trace("hs.myTarget: "+hotspot.myTarget);
		showMessage(hotspot.myDescription);
	}
}

function hideObject(obj){
	obj.myElement.style.display = "none";
}
function showObject(obj){
	obj.myElement.style.display = "block";
}

//
//   PX STRING TO INT
//
function pxtoint(str){
	// cuts "px" off the end
	var num = Number(str.substring(0,str.length-2));
	return num;
}
//
//   INT TO PX
//
function inttopx(num){
	return String(num)+"px";
}
//
//  ROUND TO 2 DECIMALS !! use .toFixed()
//
function roundHundredths(num){
	return Math.round(Number(num)*100)/100;
}




Function.prototype.bind = function(obj) { 
	
  var method = this, 
   temp = function() { 
    return method.apply(obj, arguments); 
   }; 
  return temp; 

}