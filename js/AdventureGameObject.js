// superclass for game objects (like Container, Item, Scene...)

function AdventureGameObject(){
	
}


AdventureGameObject.prototype.testVar = "TEST";

AdventureGameObject.prototype.LOADED = this.customEvent("loaded");

AdventureGameObject.prototype.loaded = false;

AdventureGameObject.prototype.numImagesLoaded = 0;

AdventureGameObject.prototype.images_ar = [];

////////////////
// METHODS
////////////////

var gameObjectMethods = defineGameObjectMethods();

AdventureGameObject.prototype.customEvent = customEvent;

AdventureGameObject.prototype.startImagesLoad = gameObjectMethods.startImagesLoad;

AdventureGameObject.prototype.loadImage = gameObjectMethods.loadImage;

AdventureGameObject.prototype.imageLoaded_handler = gameObjectMethods.imageLoaded_handler;

AdventureGameObject.prototype.imageError_handler = gameObjectMethods.imageError_handler;

AdventureGameObject.prototype.tallyImagesComplete = gameObjectMethods.tallyImagesComplete;

AdventureGameObject.prototype.loadComplete = gameObjectMethods.loadComplete;





function customEvent(eventName){
	
	var evtObj = document.createEvent("Event");
	evtObj.initEvent(eventName,true,true);
	//alert (evtObj+"\n type: "+evtObj.type);
	return evtObj;
	
}



function defineGameObjectMethods(){
	return {
		startImagesLoad : function (){
			// Set up and start first image load
			this.myElement.onload = this.imageLoaded_handler.bind(this);
			this.myElement.onerror = this.imageError_handler.bind(this);
			this.loadImage( this.myElement, this.images_ar[0] );
		},
		
		tallyImagesComplete : function (){

			this.numImagesLoaded ++;
			console.log('tallyImagesComlete()');
			console.log('this.numImagesLoaded is: '+this.numImagesLoaded);
			console.log('this.images_ar.length is: '+this.images_ar.length);
			
			if(this.numImagesLoaded == this.images_ar.length){
			 	// All Images Loaded (or failed)
				this.loadComplete();
			}else if(!this.loaded){
				// Load Next Image
				this.loadImage( this.myElement, this.images_ar[this.numImagesLoaded] );
			}
		},
		
		loadImage : function ( elem, src ){
			console.log('GameObject.loadImage()');
			console.log('elem is: '+elem);
			console.log('src is: '+src);

			if(src === null){
				// Setting src to null won't load or error
				// so manually count it as handled
				this.tallyImagesComplete();
			} else {
				this.myElement.src = src;
			}
		},
		
		imageLoaded_handler : function ( e ){
			console.log('GameObject.imageLoaded_handler:this is: '+this.imageLoaded_handler);
			console.log(this);
			this.tallyImagesComplete();
		},

		imageError_handler : function (e){
			console.log('GameObject.imageError_handler()');
			console.log(this);
			this.images_ar[this.numImagesLoaded] = null;
			this.tallyImagesComplete();
		},

		loadComplete : function (){
			this.myElement.dispatchEvent(this.LOADED);
			this.loaded = true;
			this.myElement.src = this.images_ar[0];
			this.setPosition(this.x,this.y);
			this.hide();
		}
	}
}






