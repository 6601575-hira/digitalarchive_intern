//óßëÃâπãøÇÃê∂ê¨
$(function (){
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
	
    var cat = new THREE.Audio(listener1);
	//cat.autoplay = true;
    cat.load("../../assets/audio/cat.ogg");
    cat.setRefDistance(50);
    cat.setLoop(true);
    cat.setRolloffFactor(2);
    mesh1.add(cat);

	console.log("cat:" + cat);
});

