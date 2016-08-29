//JSONファイルの読み込み + アノテーションの作成
function readJson(){
	httpObj = new XMLHttpRequest();
	httpObj.open("get", "annotation.json", true);
	httpObj.onload = function(){
		var myData = JSON.parse(this.responseText);
		console.log(myData);
		makeAnnotation(myData);
		setAroundPanoramaObject(myData);
		setSound(myData);
	}
	httpObj.send(null);
}


function makeAnnotation(myData){
	console.log(myData);
	var text = "";
	
	text = text + "<div id=currentPanoramaImageText onmouseover=document.all.item(\"explanatoryText\").style.visibility=\"visible\" onmouseout=document.all.item(\"explanatoryText\").style.visibility=\"hidden\">" + myData.currentPanoramaImage.displayName + "</div><br>"
		   + "<div id=\"explanatoryText\" style=\"visibility:hidden\">" + myData.currentPanoramaImage.explanatoryText + "</div><br>";
	document.getElementById("currentPanoramaImage").innerHTML += text;
	
	for(var i = 0; i < myData.aroundPanoramaImage.length; i++){
		text = "";
		text = text + "<a id=\"aroundPanoramaImage" + i + "\" href=\"" + myData.aroundPanoramaImage[i].path + "\">" + myData.aroundPanoramaImage[i].displayName + "</a><br>";
		document.getElementById("aroundPanoramaImage").innerHTML += text;
	}
	
	for(var i = 0; i < myData.sound.length; i++){
		text = "";
		text = text + "<p><input type=\"button\" value=\"" + myData.sound[i].displayName + "\" onclick=\"soundCtrl(" + myData.sound[i].name + ")\"></p><br>";
		document.getElementById("sound").innerHTML += text;
	}
}

//現在地の全天球をセット
function setCurrentPanoramaImage(){
	img1 = new ThView({
        	id:'ph1',
        	file:'equirectangular.jpg',
        	width:800,
        	height:400,
			firstview:150,
		});
	img1.cameraDir.x = 0;
	img1.cameraDir.y = 0;
	img1.cameraDir.z = 0;

}


//周辺にある全天球のオブジェクトをセット + 全天球の切り替え処理
function setAroundPanoramaObject(myData){
	var aroundPanoramaImage = myData.aroundPanoramaImage;
	var targetList = []; 
	var geometry1 = new THREE.SphereGeometry( 8, 30, 30 );
	var material1 = new THREE.MeshBasicMaterial({color: 0x7fff00});
	var sphere = [];
	var coordinate = [];
	
	for(i = 0; i < aroundPanoramaImage.length; i++){
		//sphere[i] = aroundPanoramaImage[i].name;
		coordinate[i] = aroundPanoramaImage[i].coordinate;
		console.log("sphere:"+sphere[i]);
		console.log("coordinate:"+coordinate[i]);
		sphere[i] = new THREE.Mesh(geometry1, material1);
		sphere[i].position.set(coordinate[i].x, coordinate[i].y, coordinate[i].z);
		img1.scene.add(sphere[i]);
		sphere[i].name = aroundPanoramaImage[i].name;
		console.log(sphere[i]);
		targetList.push(sphere[i]);
	}

	
	//オブジェクトクリックによる全天球の切り替え処理
	img1.element.onclick = function(e) {
		
		e.preventDefault();

		var raycaster = new THREE.Raycaster();		
		var rect = e.target.getBoundingClientRect();    
		var mouse = new THREE.Vector2();

        mouse.x =  e.clientX - rect.left;
        mouse.y =  e.clientY - rect.top;

		mouse.x =   (mouse.x / renderer.domElement.width) * 2 -1;
		mouse.y = - (mouse.y / renderer.domElement.height) * 2 +1;
		
		raycaster.setFromCamera(mouse, img1.camera);
 
		var intersects = raycaster.intersectObjects(targetList);
		console.log(raycaster);
		console.log(intersects);
		console.log(intersects[0].object.name);
		console.log(targetList);
		for(i = 0; i < targetList.length; i++){
			if(intersects.length >0 && intersects[0].object.name == aroundPanoramaImage[i].name) {
				window.location.href = aroundPanoramaImage[i].path;
			}
		}
	};
}


//立体音響の生成
function setSound (myData){
	console.log(myData);
	var sound = myData.sound;
	console.log(sound);
	var listener = [];
	var mesh = [];
	var coordinate = [];
	var cube = new THREE.BoxGeometry(20,20,20);
	var name = [];
	for(var i = 0; i < sound.length; i++){
		listener[i] = new THREE.AudioListener();
		img1.camera.add(listener[i]);
		
		var material = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map: THREE.ImageUtils.loadTexture("../../assets/textures/animals/cat.jpg")
		});
		
		mesh[i] = new THREE.Mesh(cube, material);
		coordinate[i] = sound[i].coordinate;
		mesh[i].position.set(coordinate[i].x, coordinate[i].y, coordinate[i].z);
		img1.scene.add(mesh[i]);
		
		name[i] = sound[i].name;
		console.log(name[i]);
	    name[i] = new THREE.Audio(listener[i]);
		name[i].autoplay = true;
	    name[i].load(sound[0].path);
	    name[i].setRefDistance(100);
	    name[i].setLoop(true);
	    name[i].setRolloffFactor(2);
	    mesh[i].add(name[i]);
	}	
}


//音のオンオフ

function soundCtrl(soundName){
	console.log("sound:" + soundName);
	if(soundName.isPlaying){
		soundName.stop();
	}
	else{soundName.play();}
}


//処理の実行
var img1;
$(function (){
	readJson();
	setCurrentPanoramaImage();
});




