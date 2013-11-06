/* 
Preload Images
*/
function LoadQueue(){
	
	this.QUEUE_LOADED = customEvent("queueLoaded");
	this.myElement = document.createElement("div");

}

LoadQueue.prototype.queue_ar = [];
LoadQueue.prototype.numLoaded = 0;

LoadQueue.prototype.addtoQueue = addtoQueue;
LoadQueue.prototype.preloadImage = preloadImage;
LoadQueue.prototype.imageLoaded_handler = imageLoaded_handler;
LoadQueue.prototype.startLoad = startLoad;


// create the object methods

function addtoQueue(image_ar){
	
	this.queue_ar = this.queue_ar.concat(image_ar);
	//trace("this.queue_ar: "+this.queue_ar.length);
	//this.queue_ar.push(imageSrc);
	
}

function startLoad(){
	for(var i = 0; i< this.queue_ar.length; i++){
		this.preloadImage(this.queue_ar[i]);
	}
	
}

function preloadImage(imgSrc){
	//trace("this:: "+this);
	//trace("LoadQueue::preloadImage;")
	// create an image object
	var img = new Image();
	// set what happens once the image has loaded 
	img.onload = this.imageLoaded_handler.bind(this);
	// preload the image file
	img.src = imgSrc;
		
}

function imageLoaded_handler(e){
	//trace("target: "+e.target);
	//trace("this: "+this);
	//trace("Item::imageLoaded_handler");
	this.numLoaded ++;
	trace("numLoaded: "+this.numLoaded);
	
	if(this.numLoaded == this.queue_ar.length){
		this.myElement.dispatchEvent(this.QUEUE_LOADED);
		delete this.myElement;
	}
	
}

