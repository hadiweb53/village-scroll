import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// import { EffectComposer} from 'three/examples/jsm/effects/EffectComposer'
import * as core from '@theatre/core';
import studio from '@theatre/studio'
import { types, getProject, val } from '@theatre/core';
import AnimationState from './animationfile/hanging garden.theatre-project-state(1).json'
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const scene = new THREE.Scene();
scene.background = new THREE.Color("#87CEEB");
studio.initialize()
const project = getProject("hanging garden" , { state: AnimationState });
const sheet = project.sheet("Establishing Shot");

// Playing Animation On Scroll 

const handleScroll = () => {
  const scrollValue = window.pageYOffset;
  const scrollHeight = window.innerHeight * 200;

  // Limit scrollValue to be at most scrollHeight
  const limitedScrollValue = Math.min(scrollValue, scrollHeight);

  // Assuming sheet.sequence.pointer.length represents the total duration of the sequence
  const sequenceLength = val(sheet.sequence.pointer.length);

  // Calculate the position as a fraction of the sequence length
  const positionFraction = limitedScrollValue / scrollHeight;

  // Update the playhead position in the sequence

  sheet.sequence.position = positionFraction * sequenceLength;
};

window.addEventListener("scroll", handleScroll);



document.querySelector(".glowbutton").addEventListener("click" , ()=>{
  project.ready.then(() => sheet.sequence.play({ iterationCount: Infinity }))
})



// Define objects using Theatre.js
const cranecam = sheet.object("Crane cam", {
  position: types.compound({
    x: types.number(camera.position.x, { range: [-200, 200] }),
    y: types.number(camera.position.y, { range: [-200, 200] }),
    z: types.number(camera.position.z, { range: [-200, 200] }),
  }),
  rotation: types.compound({
    x: types.number(camera.rotation.x, { range: [-10, 10] }),
    y: types.number(camera.rotation.y, { range: [-10, 10] }),
    z: types.number(camera.rotation.z, { range: [-10, 10] }),
  }),
  fov: 75,
  zoom: 1,
  near: 0.1,
  far: 90,
});

const light = sheet.object("Main Light", {
  color: core.types.rgba(),
  intensity: 1,
});

const fog = sheet.object("Fog Effect", {
  color: core.types.rgba(),
  near: 0,
  far: 100,
});
cranecam.onValuesChange((v) =>  {
camera.position.x = v.position.x
camera.position.y = v.position.y
camera.position.z = v.position.z
camera.rotation.x = v.rotation.x
camera.rotation.y = v.rotation.y
camera.rotation.z = v.rotation.z
console.log(camera.position)
});


const renderer = new THREE.WebGLRenderer({
  antialias : true,
  alpha : true
});
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled =true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.shadowMap.autoUpdate = true; 
renderer.setClearColor(0xffffff, 0);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild( renderer.domElement );

camera.position.x = -10
camera.rotation.y = 1

camera.position.z = 100
camera.position.y = 20
// const controls = new OrbitControls(camera, renderer.domElement);
// scene.add(controls)
// camera.position.set(
//   55.6873839652003
//   ,
//    18.11066266492596
//   ,
//    -7.735138631584289

// )
const rgb = new RGBELoader()
rgb.load('assets/lights/HDR_112_River_Road_2_Env.hdr' , (e)=>{
e.mapping = THREE.EquirectangularReflectionMapping;
scene.environment =e
rgb.castShadow = true
scene.castShadow = true;
})

scene.fog = new THREE.FogExp2(0xaaaaaa, 0.002);


const directionalLight = new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(  22.150089126930617
 , 
   35.48279294803425
,
 -15.959817612230017);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.height = 1096;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 200; 
scene.add(directionalLight);

const light4 = new THREE.DirectionalLight(0xffffff,1)
light4.position.set( -21.861329637226937
  ,
   19.413523050936966
  ,
   -5.119427613953172 );
   light4.castShadow = true;
light4.shadow.mapSize.height = 1096;
light4.shadow.bias = -0.001;
light4.shadow.camera.near = 1;
light4.shadow.camera.far = 200; 
scene.add(light4)

const light5 = new THREE.DirectionalLight(0xffffff,1)
light5.position.set(10.103608766149165
  ,
   10.793397781368373
  ,
   -21.8122503947905  );
   light5.castShadow = true;
light5.shadow.mapSize.height = 1096;
light5.shadow.bias = -0.001;
light5.shadow.camera.near = 1;
light5.shadow.camera.far = 200; 
scene.add(light5)
const gltfLoader = new GLTFLoader();
let tower, water; 
renderer.shadowMap.enabled = true;
gltfLoader.load("assets/model/issum_the_town_on_capital_isle.glb", (gltf) => {
  gltf.scene.traverse(item => {
    if (item.name === 'Mill-wind.001_0') {
      tower = item;
    }
    if (item.name === 'mff_island_large_0') {
      water = item;
    }

    item.castShadow = true;
    item.receiveShadow = true;
  });

  scene.add(gltf.scene);
});
// const btn = document.querySelector(".glowbutton");


// btn.addEventListener("click", (e) => {
//     console.log("clicked");
// btn.style.display  = "none"


//     gsap.to(camera.position, {
//         x: 22.60262265134105,
//         y: 2.278892145868347,
//         z: -2.235536921125053,
//         duration: 2, 
//         delay: 0.1,
//         easing: "easeInOutQuad",
//         onUpdate: () => {
//             controls.update();
//         },
//     });
// });


// gsap.registerPlugin(ScrollTrigger)
// const t1 = gsap.timeline({
//   ease : "power1",
//   scrollTrigger :{
//     markers:true,
//     trigger:"satrt",
//     scrub:7,
//     endtrigger:"satrt1"
//   }
// })
// ScrollTrigger.config({ 
//   limitCallbacks: true,
//   ignoreMobileResize: true,
//   syncInterval: 999999999 
// });





window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
	requestAnimationFrame( animate );
  // controls.update()
  // console.log(camera.position)
  // console.log(camera.rotation)
	renderer.render( scene, camera );
}

animate();