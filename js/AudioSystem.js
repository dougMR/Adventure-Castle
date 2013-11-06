// Multi-sound audio system
// Thanks to http://www.storiesinflight.com/html5/audio.html
function AudioSystem(channel_max){
	trace("AudioSystem::constructor("+channel_max+")");
	this.soundOn = true;
	this.audiochannels = new Array();
	for (a=0;a<channel_max;a++) {									// prepare the channels
		this.audiochannels[a] = new Array();
		this.audiochannels[a]['channel'] = new Audio();						// create a new audio object
		this.audiochannels[a]['finished'] = -1;							// expected end time for this channel
		trace("new audio's loop setting: "+this.audiochannels[a]['channel'].loop);
	}
}


AudioSystem.prototype.addSound = addSound;
AudioSystem.prototype.play = play;
AudioSystem.prototype.stop = stop;
AudioSystem.prototype.toggleSound = toggleSound;
AudioSystem.prototype.setSources = setSources;

var Sounds;

function addSound(srcPath){
	trace("AudioSystem::addSound("+srcPath+")");
	// Create new Audio element, which will not be used aside from caching the sound file
	//<audio id="multiaudio5" src="audio/sweep.wav" preload="auto"></audio>
	//alert("addSound "+srcPath);
	// 'srcPath' does not include extension
	// file must be available as .mp3 .wav and .ogg for this to work
	var audioElement = document.createElement('audio');
	document.body.appendChild(audioElement);
	audioElement.waitingToPlay = false;
	audioElement.isLoaded = false;
	audioElement.rawSource = srcPath;
	
	// <source src="song.mp3" type="audio/mpeg" />
	//var sourceElements = 
	// "<source src=\""+srcPath+".mp3\" type=\"audio/mpeg\" />"
// 	+"<source src=\""+srcPath+".wav\" type=\"audio/wav, audio/x-wav, audio/wave, audio/x-pn-wav\" />"
// 	+"<source src=\""+srcPath+".ogg\" type=\"audio/ogg\" />";
	//
	 
	 
	 //audioElement.setAttribute('src', srcPath+".mp3");
	 //audioElement.setAttribute('src', srcPath+".wav");
	 //audioElement.setAttribute('src', srcPath+".ogg");
	audioElement.setAttribute('id', srcPath+"_sound");
	audioElement.setAttribute('preload', "auto");
	//audioElement.setAttribute('autoplay', '');
	audioElement.innerHTML = this.setSources(srcPath);
	//trace("audioElement.src: "+audioElement.src);
	//alert(audioElement.buffered);
	
	audioElement.onloadeddata = dataloadedFunction;
	
	audioElement.addEventListener('loadeddata', dataloadedFunction, false);
	function dataloadedFunction(e){
		e.target.isLoaded = true;
		//alert("dataloadedFunction called\n"+e.target.isLoaded+" vs "+audioElement.isLoaded);
		trace("<br>Sounds::dataloaded: "+e.target.rawSource);
		trace(" - waiting to play: "+e.target.waitingToPlay);
		trace("autoplay: "+e.target.autoplay);
	}
	
	audioElement.addEventListener('onsuspend', onsuspendFunction, false);
	function onsuspendFunction(e){
		//alert("onsuspendFunction called\n"+e.target.isLoaded+" vs "+audioElement.isLoaded);
		
	}
	
	audioElement.addEventListener('canplay',oncanplayFunction, false);
	function oncanplayFunction(e){
		//alert("oncanplayNew called\n"+e.target.isLoaded+" vs "+audioElement.isLoaded);
	}
	
	audioElement.addEventListener('canplaythrough', audioAvailableFunction, false);
	function audioAvailableFunction(e){
		e.target.isLoaded = true;
		
		trace("<br>Sounds::canplaythrough called <br>isLoaded: "
		+e.target.isLoaded+"<br>waitingToPlay: "
		+e.target.waitingToPlay);
		
		if(e.target.waitingToPlay){
			//this.play(e.target);
			trace("playing "+e.target.rawSource);
			trace("this: "+this);
			Sounds.play(e.target,e.target.looping);
			trace("sounds: "+Sounds);
			e.target.waitingToPlay = false;
		}else{
			Sounds.stop(e.target);
		}
	}
	
	audioElement.addEventListener('onerror', audioError_handler, false);
	function audioError_handler(e){
		//alert("audio:: "+e.target.src+" failed to load");
	}
	//audioElement.onplay = function(e){alert("onplay")};
	audioElement.load();
	return audioElement;

}

function play(audioElement, loopit){
	trace("Sounds.play("+audioElement.rawSource+", "+loopit+")");
	trace("isLoaded: "+audioElement.isLoaded);
	var test = loopit ? "loop" : "don't loop";
	trace("Test Loop : "+test);
	//trace("audioElement.src: "+audioElement.src);
	audioElement.looping = loopit;
	if(audioElement.isLoaded){
		// Play it
		for (a=0;a<this.audiochannels.length;a++) {
			thistime = new Date();
			if (this.audiochannels[a]['channel'].loop == false && this.audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
				this.audiochannels[a]['finished'] = thistime.getTime() + audioElement.duration*1000;
				this.audiochannels[a]['channel'].innerHTML = this.setSources(audioElement.rawSource);
				this.audiochannels[a]['channel'].load();
				if(loopit != undefined){
					if (typeof this.audiochannels[a]['channel'].loop == 'boolean')
					{
					//alert("looping by tag");
						this.audiochannels[a]['channel'].loop = loopit;// ? "loop" : null;
						trace("looping by tag");
					}
					else if(loopit)
					{
					//alert("looping manually");
						this.audiochannels[a]['channel'].addEventListener('ended', function() {
						trace("Sound::ended()<br>this: "+this);
							this.currentTime = 0;
							this.play();
						}, false);
						trace("looping manually");
					}
				}
				this.audiochannels[a]['channel'].play();
				break;
			}
		}
	}else{
		audioElement.waitingToPlay = true;
	}
}

function stop(audioElement){
audioElement.looping = false;
	if(this.soundOn){
		for (var a = 0; a < this.audiochannels.length; a++) {
			var thistime = new Date();
			if (this.audiochannels[a]['channel'].innerHTML == this.setSources(audioElement.rawSource)) {			// is this the channel?
				this.audiochannels[a]['channel'].pause();
				this.audiochannels[a]['finished'] = -1;
				this.audiochannels[a]['channel'].innerHTML = "";
				this.audiochannels[a]['channel'].loop = false;
				break;
			}
		}
	}
}

function toggleSound(){
	if(this.soundOn){
		// kill any current sounds
		for (var a=0; a<this.audiochannels.length; a++) {
			var asrc = String(this.audiochannels[a]['channel'].innerHTML);
			if(asrc!=""){
				this.stopSound({innerHTML:asrc});
			}
		}
	}
	this.soundOn = !this.soundOn;
}

function setSources(srcPath){
	var sourceElements = 
	"<source src=\""+srcPath+".mp3\" type=\"audio/mpeg\" />"
	+"<source src=\""+srcPath+".ogg\" type=\"audio/ogg\" />"
	+"<source src=\""+srcPath+".wav\" type=\"audio/wav, audio/x-wav, audio/wave, audio/x-pn-wav\" />";
	return sourceElements
}