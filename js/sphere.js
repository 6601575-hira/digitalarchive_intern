var myData = "";
var img1;


//JSONファイルの読み込み + アノテーションの作成
function readJson(){
	httpObj = new XMLHttpRequest();
	httpObj.open("get", "annotation.json", true);
	httpObj.onload = function(){
		myData = JSON.parse(this.responseText);
		console.log(myData);
		
		var text = "";
		
		text = text + "<div id=currentPanoramaImage onmouseover=document.all.item(\"explanatoryText\").style.visibility=\"visible\" onmouseout=document.all.item(\"explanatoryText\").style.visibility=\"hidden\">" + myData.currentPanoramaImage.displayName + "</div><br>"
			   + "<div id=\"explanatoryText\" style=\"visibility:hidden\">" + myData.currentPanoramaImage.explanatoryText + "</div><br>";
		document.getElementById("currentPanoramaImage").innerHTML += text;
		
		for(var i = 0; i < myData.aroundPanoramaImage.length; i++){
			text = "";
			text = text + "<a id=\"aroundPanoramaImage" + i + "\" href=\"" + myData.aroundPanoramaImage[i].path + "\">" + myData.aroundPanoramaImage[i].displayName + "</a><br>";
			document.getElementById("aroundPanoramaImage").innerHTML += text;
		}
		
		for(var i = 0; i < myData.sound.length; i++){
			text = "";
			text = text + "<p><input type=\"button\" value=\"" + myData.sound[i].displayName + "\" onclick=\"soundCtrl()\"></p><br>";
			document.getElementById("sound").innerHTML += text;
		}
	}
	httpObj.send(null);
	console.log(myData);
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
function setAroundPanoramaObject(){
	console.log(myData);
	/*
	var aroundPanoramaImage = myData.aroundPanoramaImage;
	
	*/
	var targetList = []; 
	var geometry1 = new THREE.SphereGeometry( 8, 30, 30 );
	var material1 = new THREE.MeshBasicMaterial({color: 0x7fff00});
	var sphere = new THREE.Mesh( geometry1, material1 );
	sphere.position.set(-30,0,-52);
	
	img1.scene.add( sphere );
	
	targetList.push(sphere);
	
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
		if(intersects.length >0) {
			window.location.href = "../nishiguchi/index.html";
		}
	};
}


//立体音響の生成
function setSound (){
	console.log(myData);
	var sound = myData.sound;
	console.log(sound);
	console.log(sound.length);

	for(var i = 0; i < sound.length; i++){
		var listener = new THREE.AudioListener();
		img1.camera.add(listener);
		
		var cube = new THREE.BoxGeometry(20,20,20);
		var material = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map: THREE.ImageUtils.loadTexture("../../assets/textures/animals/cat.jpg")
		});
		
		var mesh = new THREE.Mesh(cube, material);
		mesh.position.set(sound[i].coordinate.x, sound[i].coordinate.y, sound[i].coordinate.z);
		img1.scene.add(mesh);
		
		console.log("mesh1:" + mesh);
		console.log("img1:" + img1);
		
	    var cat = new THREE.Audio(listener);
		cat.autoplay = true;
	    cat.load(sound[0].path);
	    cat.setRefDistance(100);
	    cat.setLoop(true);
	    cat.setRolloffFactor(2);
	    mesh.add(cat);
	}	
	
	
	/*
	var listener1 = new THREE.AudioListener();
	img1.camera.add(listener1);
	
	var cube = new THREE.BoxGeometry(20,20,20);
	//var textureLoader = new THREE.TextureLoader();
	var material2 = new THREE.MeshBasicMaterial({
		color : 0xffffff,
		map: THREE.ImageUtils.loadTexture("../../assets/textures/animals/cat.jpg")
	});
	
	var mesh1 = new THREE.Mesh(cube, material2);
	mesh1.position.set(-70, -25, 60);
	img1.scene.add(mesh1);
	
	console.log("mesh1:" + mesh1);
	console.log("img1:" + img1);
	
    cat = new THREE.Audio(listener1);
	//cat.autoplay = true;
    cat.load("../../assets/audio/cat.ogg");
    cat.setRefDistance(100);
    cat.setLoop(true);
    cat.setRolloffFactor(2);
    mesh1.add(cat);

	console.log("cat:" + cat);
	*/

}


//音のオンオフ

function soundCtrl(){
	console.log("sound:" + cat);
	if(cat.isPlaying){
		cat.stop();
	}
	else{cat.play();}
}




//処理の実行
$(function (){

	readJson();
	setCurrentPanoramaImage();
	setAroundPanoramaObject();
	setSound();
});




