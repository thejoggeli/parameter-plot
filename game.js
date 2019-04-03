var scene, camera, orthoCamera, renderer;
var cameraControls, orthoCameraControls;
var cameraMode = "ortho";
var plotMesh = null;
var plotWireframe = null;
var tubeMesh = null;
var tubeWireframe = null;
var ambientLight, directionalLight;

$(document).ready(function(){
	Monitor.setup({showTitle: false});
	// setup Gfw 
	Gfw.setup({height:256});
	Gfw.createCanvas("main", {"renderMode": RenderMode.None});
	Gfw.getCanvas("main").setActive();
	Gfw.onUpdate = update;
	Gfw.onRender = render;
	Gfw.onResize = resize;
	// init
	Ui.init();
	init();
	// start
	Gfw.start();	
});

function resize(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.far = 5000;
	camera.near = 0.1;
	camera.fov = 60;
	camera.updateProjectionMatrix();
	var aspect = window.innerWidth / window.innerHeight;
	var h = 15.0;
	var w = h*aspect;
	orthoCamera.left = -w/2.0;
	orthoCamera.right = w/2.0;
	orthoCamera.top = h/2.0;
	orthoCamera.bottom = -h/2.0;
	orthoCamera.updateProjectionMatrix();
	MiniGrid.resize();	
}

function init(){	
	// scene
	scene = new THREE.Scene();
	
	// renderer
	renderer = new THREE.WebGLRenderer({canvas:Gfw.getCanvas("main").element,antialias:true});
	renderer.setClearColor(new THREE.Color(0), 1);
	
	// camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(5,5,10);
	camera.lookAt(new THREE.Vector3(0,0,0));
	cameraControls = new THREE.OrbitControls(camera, Gfw.inputOverlay[0]);
	
	// ortho
	var w = window.innerWidth;
	var h = window.innerHeight;
	orthoCamera	= new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, -1000, 1000);
	orthoCamera.position.set(5,5,10);
	orthoCamera.lookAt(new THREE.Vector3(0,0,0));
	orthoCameraControls = new THREE.OrbitControls(orthoCamera, Gfw.inputOverlay[0]);
	
	// ambi light
    ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 0.35;
    scene.add(ambientLight);
    
	directionalLight = new THREE.DirectionalLight(0xFFFFFF);
	directionalLight.position.set(0, 20, 20);
	directionalLight.intensity = 1;
	scene.add(directionalLight); 
	
	Grid.init();
	Grid.build();
	MiniGrid.init();
	Ui.beginPlot();
	
//	scene.fog = new THREE.Fog("magenta", 5.0, 10.0);
	
	setCameraMode("ortho");
	
}

function setCameraMode(mode){
	cameraMode = mode;
	if(mode == "ortho"){
		cameraControls.enabled = false;
		orthoCameraControls.enabled = true;
	} else {
		cameraControls.enabled = true;
		orthoCameraControls.enabled = false;
	}
}
function getCamera(){
	return cameraMode == "ortho" ? orthoCamera : camera;
}

function update(){
	if(Input.keyDown(32)){
		setCameraMode(cameraMode == "ortho" ? "perspective" : "ortho");
	}
/*	var snapDistance = 10;	
	if(Input.keyDown(49)){
		getCamera().position.set(0, 0, snapDistance);
	}
	if(Input.keyDown(50)){
		getCamera().position.set(0, 0, -snapDistance);
	}
	if(Input.keyDown(51)){
		getCamera().position.set(0, snapDistance, 0);
	}
	if(Input.keyDown(52)){
		getCamera().position.set(0, -snapDistance, 0);
	}
	if(Input.keyDown(53)){
		getCamera().position.set(snapDistance, 0, 0);
	}
	if(Input.keyDown(54)){
		getCamera().position.set(-snapDistance, 0, 0);
	} */
	var camera = getCamera();
	directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z);
	MiniGrid.update();
	Grid.update();
	if(Plotter.animation) Plotter.plot();
	Plotter.update();
	if(Input.keyDown(48)){
		console.log("Area: " + Plotter.calcSurfaceArea());
		console.log("Volume: " + Plotter.calcVolume());
	}
	// monitor stuffs
	Monitor.set("FPS", Time.fps);
	Monitor.set("Camera", cameraMode == "ortho" ? "Orthographic" : "Perspective");
}

function render(){
	renderer.autoClear = false;
	renderer.clear();
	
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, getCamera());
		
	renderer.clearDepth(); // important! clear the depth buffer
	MiniGrid.render();
		
}













