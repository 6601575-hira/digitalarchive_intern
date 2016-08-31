//JSONファイルの読み込み + データのセット
function readJson(path){
	httpObj = new XMLHttpRequest();
	httpObj.open("get", path, true);
	httpObj.onload = function(){
		//カレントのJSON取得
		if(currentFlag == true){
			currentJsonData = JSON.parse(this.responseText);
			sound = currentJsonData.sound;
			if(sound != undefined){sound.type = "here";}
			for(i = 0; i < currentJsonData.aroundPanorama.length; i++){
				path = currentJsonData.aroundPanorama[i].path + "annotation.json";
				currentFlag = false;
				readJson(path);
			}
			
		//隣接した全天球のJSON取得
		}else{
			if(sound == undefined){
				var str = JSON.parse(this.responseText);
				sound = str.sound;
				if(sound != undefined){
					sound.type = "next";
					for(i = 0; i < currentJsonData.aroundPanorama.length; i++){
						if(currentJsonData.aroundPanorama[i].name == str.currentPanorama.name){
							sound[0].coordinate = ({x:0, y:0, z:0});
						}
					}
				}
			}
			aroundJsonData.push(JSON.parse(this.responseText));
			aroundPanoramaDisplayName.push(JSON.parse(this.responseText).currentPanorama.displayName);
		}

		if(aroundPanoramaDisplayName.length == currentJsonData.aroundPanorama.length){
			makeAnnotation(currentJsonData, aroundPanoramaDisplayName, sound);
			setAroundPanoramaObject(currentJsonData);
			if(sound != undefined){
				setSound(sound);
			}
		}
	}
	httpObj.send(null);
}

//アノテーションの作成
function makeAnnotation(currentPanorama, aroundPanorama, sound){
	var text = "";
	
	text = text + "<div id=currentPanoramaText>" + currentPanorama.currentPanorama.displayName + "</div><br>"
		   + "<div id=\"explanatoryText\">" + currentPanorama.currentPanorama.explanatoryText + "</div><br>";
	document.getElementById("currentPanorama").innerHTML += text;
	
	for(var i = 0; i < aroundPanorama.length; i++){
		text = "";
		text = text + "<a id=\"aroundPanorama" + i + "\" href=\"" + currentPanorama.aroundPanorama[i].path + "\">" + aroundPanorama[i] + "</a><br>";
		document.getElementById("aroundPanorama").innerHTML += text;
	}
	if(sound != undefined && sound.type == "here"){
		for(var i = 0; i < sound.length; i++){
			text = "";
			text = text + "<p><input type=\"button\"value=\"\"onclick=changeOpacity(\""+sound[i].name+"\")></p><br>";
			text = text + "<p><input type=\"button\"value=\"Look\"onclick=lookSound("+sound[i].coordinate.x+","+sound[i].coordinate.y+","+sound[i].coordinate.z+")></p><br>";
			document.getElementById("sound").innerHTML += text;
		}
	}
}

//現在地の全天球をセット
function setCurrentPanorama(){
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
	var aroundPanorama = myData.aroundPanorama;
	var geometry1 = new THREE.SphereGeometry( 8, 30, 30 );
	var material1 = new THREE.MeshBasicMaterial({color: 0x7fff00});
	var sphere = [];
	var coordinate = [];
	
	for(i = 0; i < aroundPanorama.length; i++){
		coordinate[i] = aroundPanorama[i].coordinate;
		sphere[i] = new THREE.Mesh(geometry1, material1);
		sphere[i].position.set(coordinate[i].x, coordinate[i].y, coordinate[i].z);
		img1.scene.add(sphere[i]);
		sphere[i].name = aroundPanorama[i].name;
		targetList.push(sphere[i]);
	}

	
	//オブジェクトクリックによる処理
	img1.element.onclick = function(e){
		
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
		for(i = 0; i < targetList.length; i++){
			if(intersects.length >0){
				if(intersects[0].object.name == aroundPanorama[i].name){
					var path = aroundPanorama[i].path + "index.html"
					window.location.href = aroundPanorama[i].path;
				}
				if(mesh[i] != undefined && intersects[0].object.name == mesh[i].name){
					mesh[i].material.opacity = 1;
					answer();
				}
			}
		}
	};
}


//立体音響の生成
function setSound (sound){
	var listener = [];
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
		mesh[i].name = sound[i].name;
		mesh[i].position.set(
			sound[i].coordinate.x,
			sound[i].coordinate.y,
			sound[i].coordinate.z
		);
	    name[i] = new THREE.Audio(listener[i]);
		name[i].autoplay = true;
	    name[i].load(sound[0].path);
	    name[i].setRefDistance(100);
	    name[i].setLoop(true);
	    name[i].setRolloffFactor(2);
		if(sound.type == "here"){
			mesh[i].material.opacity = 0.1;
			mesh[i].material.transparent = true;
			mesh[i].position.y += 10;
		    name[i].gain.gain.value = 2.0;
		}else if(sound.type == "next"){
			mesh[i].visible = false;
		    name[i].gain.gain.value = 0.8;
		}

		img1.scene.add(mesh[i]);
		targetList.push(mesh[i]);	    
	    mesh[i].add(name[i]);
	}	
	

}


//正解の文字表示
function answer(){
	var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
	var materialArray = [ materialFront, materialSide ];
	var textGeometry = new THREE.TextGeometry( "Correct!", {
		size: 10, height: 4, curveSegments: 3,
		font: "helvetiker", weight: "bold", style: "normal",
		bevelThickness: 1, bevelSize: 1, bevelEnabled: true,
		material: 0, extrudeMaterial: 1
	});
	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeometry, textMaterial );

	textMesh.rotation.set(0, Math.PI/1.4, 0);
	textMesh.scale.x = 1.0;
	textMesh.scale.y = 1.0;
	textMesh.scale.z = 0.5;
	textMesh.position.x = -35;
	textMesh.position.y = 0;
	textMesh.position.z = 60;
	img1.scene.add(textMesh);
}


//音声アノテーションのボタンイベント 透明度
function changeOpacity(name){
	for(i = 0; i < mesh.length; i++){
		if(mesh[i].material.opacity < 1 && mesh[i].material.opacity >= 0.1){
			mesh[i].material.opacity += 0.1;
		}else{
			mesh[i].material.opacity = 0.1;
		}
	}
}


//音声アノテーションのボタン処理 視線
function lookSound(x, y, z){
	img1.camera.lookAt({x:x, y:y, z:z});
}


//処理の実行
var img1;
var mesh = [];
var targetList = [];
var currentJsonData;
var aroundJsonData = [];
var aroundPanoramaDisplayName = [];
var currentFlag = true;
var path = "annotation.json";

var sound;
$(function (){
	readJson(path);
	setCurrentPanorama();
});




