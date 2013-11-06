function Scene(srcImg, items_ar, containers_ar, switches_ar, doors_ar, myDescription, myContents, x, y){
	this.items_ar = items_ar;
	this.containers_ar = containers_ar;
	this.switches_ar = switches_ar;
	this.doors_ar = doors_ar;
}

/*
*   --------------
*     PROPERTIES
*   --------------
*/
Scene.prototype.items_ar = [];
Scene.prototype.containers_ar = [];
Scene.prototype.switches_ar = [];
Scene.prototype.doors_ar = [];
/*
*   --------------
*     BIND METHODS
*   --------------
*/
Scene.prototype.onTouch = onTouch;
Scene.prototype.customEvent = customEvent;
Scene.prototype.setPosition = setPosition;
Scene.prototype.unlock = unlock;

Scene.prototype.preloadImages = preloadImages;
Scene.prototype.imageLoaded_handler = imageLoaded_handler;
Scene.prototype.initMyImgElement = initMyImgElement;


/*
*   --------------
*     CREATE METHODS
*   --------------
*/

function buildHolders(){
	
}



