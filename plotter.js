function Grid(){}
Grid.items = {};
Grid.scale = new THREE.Vector3(1,1,1);
Grid.lineWidth = 0.002;
Grid.grids = {};
Grid.init = function(){
	for(var x in Grid.items){
		scene.remove(Grid.items[x]);
	}
	var items = Grid.items = {};
	Grid.items.x = Grid.makeLine(new THREE.Vector3(0.1, 0, 0), 1000);
	Grid.items.y = Grid.makeLine(new THREE.Vector3(0, 0.1, 0), 1000);
	Grid.items.z = Grid.makeLine(new THREE.Vector3(0, 0, 0.1), 1000);
	Grid.items.x.material.color.set(0xAA0044);
	Grid.items.y.material.color.set(0x44AA00);
	Grid.items.z.material.color.set(0x0044AA);
	for(var x in Grid.items){
		scene.add(items[x]);
	}
	// grids
	for(var x in Grid.grids){
		scene.remove(Grid.grids[x]);
	}
	var grids = Grid.grids = {};
	grids.xz = new THREE.GridHelper(100, 100);
	grids.yz = new THREE.GridHelper(100, 100);
	grids.xy = new THREE.GridHelper(100, 100);
	grids.yz.rotation.z = Math.PI/2.0;
	grids.xy.rotation.x = Math.PI/2.0;
	for(var x in Grid.grids){
		scene.add(grids[x]);
	}
}
Grid.build = function(){
	var grids = Grid.grids;
	grids.xz.scale.x = Grid.scale.x;
	grids.xz.scale.z = Grid.scale.z;
	grids.yz.scale.x = Grid.scale.y;
	grids.yz.scale.z = Grid.scale.z;
	grids.xy.scale.x = Grid.scale.x;
	grids.xy.scale.z = Grid.scale.y;
}
Grid.makeLine = function(vec, steps){	
	var material = new MeshLineMaterial({
		color:0xFFFFFF,
		lineWidth: Grid.lineWidth,
		sizeAttenuation: 0,
	});
	var geometry = new THREE.Geometry();
	var offset = -steps/2;
	for(var i = 0; i < steps; i++){
		geometry.vertices.push(new THREE.Vector3(
			vec.x*(offset+i), 
			vec.y*(offset+i), 
			vec.z*(offset+i) 
		));
	}	
	var line = new MeshLine();
	line.setGeometry(geometry);
	var mesh = new THREE.Mesh(line.geometry, material);
	mesh.line = line;
	return mesh;
}
Grid.update = function(){
	if(cameraMode == "perspective"){
		for(var x in Grid.items){
			Grid.items[x].material.lineWidth = Grid.lineWidth;
		}
	} else {				
		for(var x in Grid.items){
			Grid.items[x].material.lineWidth = Grid.lineWidth * 0.08 * getCamera().zoom;
		}		
	}	
	for(var x in Grid.items){
		Grid.items[x].material.near = getCamera().near;
		Grid.items[x].material.far = getCamera().far;
	}
}

function MiniGrid(){}
MiniGrid.mesh;
MiniGrid.scene;
MiniGrid.camera;
MiniGrid.init = function(){	
	// scene
	MiniGrid.scene = new THREE.Scene();
	
	// camera
	MiniGrid.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
	MiniGrid.camera.position.set(0,0,50);
	MiniGrid.camera.lookAt(new THREE.Vector3(0,0,0));
	
	// light
    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 0.5;
    MiniGrid.scene.add(ambientLight);
    
	var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
	directionalLight.position.set(0, 20, 20);
	directionalLight.intensity = 0.75;
	MiniGrid.scene.add(directionalLight); 
	
	// grid
	var group = new THREE.Group();
	group.add(MiniGrid.buildArrow(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,1), 0xAA0044));
	group.add(MiniGrid.buildArrow(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,2), 0x44AA00));
	group.add(MiniGrid.buildArrow(new THREE.Vector3(0,0,1), new THREE.Vector3(-1,0,0), 0x0044AA));
	var scale = 0.4;
	group.scale.set(scale, scale, scale);
	MiniGrid.mesh = group;
	MiniGrid.scene.add(MiniGrid.mesh);
}
MiniGrid.buildArrow = function(position, rotation, color){	
	var length = 2;
	var geometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8, 1);
	var material = new THREE.MeshLambertMaterial({color:color});
	var group = new THREE.Group();
	var axis;
	// cone
	axis = new THREE.Mesh(geometry, material);
	axis.position.x = position.x*length/2;
	axis.position.y = position.y*length/2;
	axis.position.z = position.z*length/2;
	axis.rotation.x = rotation.x * Math.PI/2;
	axis.rotation.y = rotation.y * Math.PI/2;
	axis.rotation.z = rotation.z * Math.PI/2;
	group.add(axis);
	// cone
	var length2 = 0.5;
	geometry = new THREE.CylinderGeometry(0.2, 0, length2, 8, 1);
	axis = new THREE.Mesh(geometry, material);
	axis.position.x = position.x*length2/2 + position.x*length;
	axis.position.y = position.y*length2/2 + position.y*length;
	axis.position.z = position.z*length2/2 + position.z*length;
	axis.rotation.x = rotation.x * Math.PI/2;
	axis.rotation.y = rotation.y * Math.PI/2;
	axis.rotation.z = rotation.z * Math.PI/2;
	group.add(axis);
	return group;
}
MiniGrid.update = function(){
/*	MiniGrid.mesh.rotation.x = camera.rotation.x;
	MiniGrid.mesh.rotation.y = camera.rotation.y;
	MiniGrid.mesh.rotation.z = camera.rotation.z; */
	MiniGrid.mesh.quaternion.copy(getCamera().quaternion);
	MiniGrid.mesh.quaternion.inverse();
}
MiniGrid.render = function(){
	var size = window.innerHeight/3;
	renderer.setViewport(0, 0, size, size);
	renderer.render(MiniGrid.scene, MiniGrid.camera);
}
MiniGrid.resize = function(){
/*	MiniGrid.camera.aspect = 1;
	MiniGrid.camera.far = 5000;
	MiniGrid.camera.near = 0.1;
	MiniGrid.camera.fov = 90;
	MiniGrid.camera.updateProjectionMatrix(); */
}

function Plotter(){}
Plotter.time = 0;
Plotter.line = null;
Plotter.volume = null;
Plotter.lineWidth = 0.002;
Plotter.animation = false;
Plotter.expression = {
	x: "sin(t)", 
	y: "cos(t)", 
	z: "0",
};
Plotter.compiledExpression = {
	x: null, y: null, z: null,
};
Plotter.results = [];
Plotter.bounds = {
	min: -Math.PI*2.0*8.0,
	max: Math.PI*2.0*8.0,
};
Plotter.step = Math.PI*2.0/256.0;
Plotter.plot = function(expression){
	try {
		if(expression !== undefined){
			Plotter.expression = expression;
		}
		if(Plotter.line !== null){
			Plotter.line.mesh.material.dispose();
			Plotter.line.mesh.geometry.dispose();
			Plotter.line.geometry.dispose();
			scene.remove(Plotter.line.mesh);
		}
		if(Plotter.volume !== null){
			var group = Plotter.volume;
			for (var i = group.children.length - 1; i >= 0; i--) {
				group.children[i].material.dispose();
				group.children[i].geometry.dispose();
				scene.remove(group.children[i]);
			}
			scene.remove(Plotter.volume);
		}
		Plotter.precalc();	
		Plotter.plotLine();
		Plotter.plotVolumeAxis(new THREE.Vector3(1,0,0).normalize());
	//	Plotter.plotVolumeLine(0.3);
	} catch(e){
		console.error(e);
		return false;
	}
	return true;
}
Plotter.setAnimationState = function(b){
	Plotter.animation = b;
}
Plotter.precalc = function(){
	Plotter.results = [];
	var k = Plotter.time;
	var expression = Plotter.expression;
	var compiled = Plotter.compiledExpression = {};
	compiled.x = math.compile(expression.x);
	compiled.y = math.compile(expression.y);
	compiled.z = math.compile(expression.z);
	var numSteps = (Plotter.bounds.max - Plotter.bounds.min) / Plotter.step;
	var offset = Plotter.bounds.min;
	for(var i = 0; i <= numSteps; i++){
		var t = offset + i * Plotter.step;
		var result = new THREE.Vector3(
			compiled.x.eval({t:t, k:k})*Grid.scale.x,
			compiled.y.eval({t:t, k:k})*Grid.scale.y,
			compiled.z.eval({t:t, k:k})*Grid.scale.z
		);
		Plotter.results.push(result);
	}
}
Plotter.update = function(){
	if(Plotter.animation){
		Plotter.time += Time.deltaTime;
		$(".animation-time").html(roundToFixed(Plotter.time, 3));
	}
	if(cameraMode == "perspective"){
		Plotter.line.mesh.material.lineWidth = Plotter.lineWidth;
	} else {
		Plotter.line.mesh.material.lineWidth = Plotter.lineWidth * 0.08 * getCamera().zoom;
	}
	Plotter.line.mesh.material.near = getCamera().near;
	Plotter.line.mesh.material.far = getCamera().far;
}
Plotter.plotLine = function(){
	var material = new MeshLineMaterial({
		color:0xFFFFFF,
		lineWidth: Plotter.lineWidth,	
		sizeAttenuation: 0,
	});
	var geometry = new THREE.Geometry();
	for(var i = 0; i < Plotter.results.length; i++){
		geometry.vertices.push(Plotter.results[i]);
	}
	var line = Plotter.line = new MeshLine();
	line.setGeometry(geometry);
	var mesh = line.mesh = new THREE.Mesh(line.geometry, material);
	scene.add(mesh);
}
Plotter.plotVolumeAxis = function(axis){
	var frontMaterial = new THREE.MeshLambertMaterial({
		color:0x00FFFF,
		side: THREE.FrontSide,
		wireframe: true,
	});
	var geometry = new THREE.Geometry();
	// precalc matrices
	var numAngles = 32;
	var angleStep = angleStep = Math.PI*2 / numAngles;
	var matrices = [];
	for(var i = 0; i < numAngles; i++){
		var mat = new THREE.Matrix4();
		mat.makeRotationAxis(axis, i*angleStep);
		matrices[i] = mat;
	}
	// generate vertices
	var lineStep = 4;
	var numSteps = 0;
	for(var i = 0; i < Plotter.results.length; i += lineStep){
		var v = Plotter.results[i];
		for(var j = 0; j < numAngles; j++){
			var vector = new THREE.Vector3(v.x, v.y, v.z);
			vector.applyMatrix4(matrices[j]);
			geometry.vertices.push(vector);
		}
		numSteps++;
	}
	// generate faces
	var off = 0;
	var iam = numAngles-1;
	for(var i = 0; i < numSteps-1; i++){
		for(var ia = 0; ia < numAngles; ia++){
			var i1 = off;
			var i2 = off+1;
			if(iam == ia) i2 -= numAngles;
			var i3 = i1+numAngles;
			var i4 = i2+numAngles;
			var face;
			face = new THREE.Face3(i1, i2, i3);
			face.materialIndex = 0;
			geometry.faces.push(face);
			face = new THREE.Face3(i4, i3, i2);
			face.materialIndex = 0;
			geometry.faces.push(face);
			off++;
		}
	}
	geometry.computeVertexNormals();
	var mesh = new THREE.Mesh(geometry, frontMaterial);
	
	// clone
	var mesh2 = mesh.clone();
	var backMaterial = new THREE.MeshLambertMaterial({
		color:0x006666,
		side: THREE.BackSide,
	});
	mesh2.material = backMaterial;
	if(frontMaterial.wireframe){
		mesh2.visible = false;
	}
	
	// group
	var group = new THREE.Group();
	group.add(mesh);
	group.add(mesh2);
	group.areaMesh = mesh;
	Plotter.volume = group;
	scene.add(group);	
}
Plotter.plotVolumeLine = function(radius){
	var geometry = new THREE.Geometry();
	var r = Plotter.results;
	// generate vertices
	var matrix = new THREE.Matrix4();
	var numAngles = 32;
	var angleStep = Math.PI*2/numAngles;
	var point = new THREE.Vector3();
	var axis = new THREE.Vector3();
	var perp = new THREE.Vector3();
	var lineStep = 4;
	var numSteps = Math.floor((Plotter.results.length/lineStep));
	var up = new THREE.Vector3(0,1,0);
	for(var i = 0; i < numSteps; i++){
		var r1 = (i-1)*lineStep;
		var r2 = (i)*lineStep;
		var r3 = (i+1)*lineStep;
		if(r1 < 0) r1 = r2;
		if(r3 >= Plotter.results.length) r3 = r2;	
		point.set(r[r2].x, r[r2].y, r[r2].z);
		axis.set(r[r3].x-r[r1].x, r[r3].y-r[r1].y, r[r3].z-r[r1].z);
		axis.normalize();
		perp.crossVectors(axis, up);
		perp.setLength(radius);
		for(var a = 0; a < numAngles; a++){
			var angle = a*angleStep;
			matrix.makeRotationAxis(axis, angle);
			var v = perp.clone();
			v.applyMatrix4(matrix);
			v.add(point);
			geometry.vertices.push(v);
		}
	}
	// generate faces
	var off = 0;
	var iam = numAngles-1;
	for(var i = 0; i < numSteps-1; i++){
		for(var ia = 0; ia < numAngles; ia++){
			var i1 = off;
			var i2 = off+1;
			if(iam == ia) i2 -= numAngles;
			var i3 = i1+numAngles;
			var i4 = i2+numAngles;
			var face;
			face = new THREE.Face3(i1, i2, i3);
			face.materialIndex = 0;
			geometry.faces.push(face);
			face = new THREE.Face3(i4, i3, i2);
			face.materialIndex = 0;
			geometry.faces.push(face);
			off++;
		}
	}
	geometry.computeVertexNormals();
	
	// front mesh
	var frontMaterial = new THREE.MeshLambertMaterial({
		color:0x00FFFF,
		side: THREE.FrontSide,
	});
	var mesh = new THREE.Mesh(geometry, frontMaterial);
	
	// back mesh
	var backMaterial = new THREE.MeshLambertMaterial({
		color:0x006666,
		side: THREE.BackSide,
	});
	var mesh2 = mesh.clone();
	mesh2.material = backMaterial; 
	
	// group
	var group = new THREE.Group();
	group.add(mesh);
	group.add(mesh2);
	group.areaMesh = mesh;
	Plotter.volume = group;
	scene.add(group);
}
Plotter.calcSurfaceArea = function(){
	var mesh = Plotter.volume.areaMesh;
	var area = 0;
	var q = new THREE.Vector3();
	var p = new THREE.Vector3();
	var c = new THREE.Vector3();
	for(var i = 0; i < mesh.geometry.faces.length; i++){
		var face = mesh.geometry.faces[i];
		var v1 = mesh.geometry.vertices[face.a];
		var v2 = mesh.geometry.vertices[face.b];
		var v3 = mesh.geometry.vertices[face.c];
		q.subVectors(v3,v1);
		p.subVectors(v3,v2);
		c.crossVectors(q,p);
		var length = c.length();
		area += length/2;
	}
	return area;
}






























