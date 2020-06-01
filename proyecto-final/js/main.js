var container, renderer;
var scene;
var camera;
var light;
var mesh;
var plane;
var axes;
var rotate_axis;
var raycaster, intersects;
var mouse;
var orbit, animation;
var angle, radius, lineCount, parameters, gui;
var angleR;
var constellationSource, constellationData, constellationsGroups;
var scaleFactor, controls;

function main()
{
    constellationData = new Object();
    constellationSource = "js/constellations.json";

    scaleFactor = 40;
    lineCount = 0;

    constellationsGroups = [];//new THREE.Object3D();
    // RENDERER
    container = document.createElement('div');
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000 ); // black background
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);

    //RAYCASTER
    raycaster = new THREE.Raycaster();
    intersects = null;
    mouse = new THREE.Vector2(), THREE.INTERSECTED;

    //GEOMETRY and MATERIAL

    // CAMERAS
    orbit = false;
    animation = false;
    angleR = 0.1;
    angle = 0;
    radius = 10.;
    camera = new THREE.PerspectiveCamera(55.,  window.innerWidth / window.innerHeight, 1, 1000000.);  // CAMERA
    camera.position.set(-0.5, 0., 0.);
    camera.lookAt(new THREE.Vector3(-0, -50, 0));
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.coupleCenters = true;

    // SCENE
    scene = new THREE.Scene();

    scene.background = new THREE.CubeTextureLoader().setPath( 'textures/cubeMaps/').load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] );
    scene.add(camera);

    var listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    var sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../sounds/fondo.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 0.2 );
      sound.play();
    });

    // GUI
    gui = new dat.GUI();
    parameters = {}

    //LOAD CONSTELLATIONS

    httpRequest2.open("GET", constellationSource);
    httpRequest2.send();

    gui.open();


    // EVENTS
    initEventHandler();

    // ACTION
    requestAnimationFrame(renderLoop);              // RENDER LOOP
}

function renderLoop() {

    requestAnimationFrame(renderLoop);
    // find intersections
    raycaster.setFromCamera( mouse, camera );

		intersects = raycaster.intersectObjects( scene.children );

    renderer.render(scene, camera);
    updateMarkers(Markers.markers, camera);
}
