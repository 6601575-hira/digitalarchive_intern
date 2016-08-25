function soundCtrl(sound){
	console.log(myData.ano);
	console.log("sound:" + sound);
	if(sound.isPlaying){
		sound.autoplay = false;
	}
	else{sound.autoplay = true;}
}
