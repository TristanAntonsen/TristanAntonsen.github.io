import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'
import { STLExporter } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/exporters/STLExporter.js';
import { STLLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/STLLoader.js'

import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/postprocessing/SAOPass.js';

let scene, camera, renderer, geo, controls, loadFile, sayHey, newColor, inputTheme;
let composer, renderPass, saoPass;
// loadFile = function(event) {
//     let image = document.getElementById('output');
//     image.src = URL.createObjectURL(event.target.files[0]);
//     console.log("hey")
// };

// nput = document.getElementById('output')
// input.addEventListener( 'change',loadFile,false)

function init() {

    //Inputs
    const color1 = new THREE.Color( 0xffffff );
    const color2 = new THREE.Color( 0x06a7e2 );
    const color3 = new THREE.Color( 0x555555 );
    const color4 = new THREE.Color( 0x111111 );
    const materialList = {
        0: color1,
        1: color2,
        2: color3,
        3: color4
    }
    let inputMaterial = '';
    const updateMaterial = function() {
        inputVal = document.getElementById("inputColor").value
        inputMaterial = materialList[inputVal]
        // console.log(materialList[inputVal])
        material.color.set(inputMaterial);
    }
    const updateTheme = function() {
        if (document.getElementById("customSwitch1").checked) {
            console.log('checked')
            document.getElementById("underlay").style.background="black";
        } else {
            console.log('not checked')
            document.getElementById("underlay").style.background="white";
        }
    }
    const updateGrid = function() {
        if (document.getElementById("customSwitch1").checked) {
            console.log('checked')
            document.getElementById("underlay").style.background="black";
        } else {
            console.log('not checked')
            document.getElementById("underlay").style.background="white";
        }
    }
    // }


    //Dropdown
    let inputVal = ''
    const input = document.getElementById('inputColor')
    input.addEventListener( 'mouseup', updateMaterial,false)
    input.addEventListener( 'touchend', updateMaterial,false)
    //Switch
    let inputTheme = document.getElementById('customSwitch1')
    inputTheme.addEventListener( 'change', updateTheme,false)

    // Scene
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    camera.position.set(0,2.5,10);
    let darkMode = false;
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;
    renderer.capabilities.maxTextureSize = 2160;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.body.appendChild(renderer.domElement);
    const devicePixelRatio = window.devicePixelRatio || 1;

    
    // loading
    const texture = new THREE.TextureLoader().load('textures/gordon.jpg')
    const normalMap = new THREE.TextureLoader().load('textures/normalMap.jpg')


    // material



    let matColor = 0x06a7e2
    // const material = new THREE.MeshStandardMaterial( {color: matColor, map: texture} );
    // const material = new THREE.MeshStandardMaterial( {color: inputMaterial} );

    // let material = new THREE.MeshStandardMaterial();
    // material.roughness = 0.75;
    // material.metalness = 0.25;

    // material.shading = THREE.FlatShading;
    // material.shading = THREE.SmoothShading;
    // material.normalMap = normalMap;

    // TEST WIREFRAME

    let material = new THREE.MeshPhongMaterial( {
        // color: 0xff0000,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    } );
    

    // geometry
    let size = 2;
    // const geometry = new THREE.BoxGeometry( size, size, size );
    const geometry = new THREE.SphereGeometry( size, 32,32 );
    geo = new THREE.Mesh( geometry, material );
    geo.position.set(0,size,0)
    scene.add( geo );


    // Binary files
    // const loader = new STLLoader();
    // loader.load( 'models/aptivpartsmall.stl', function ( geometry ) {

    //     const mesh = new THREE.Mesh( geometry, material );
    //     mesh.castShadow = true;
    //     mesh.receiveShadow = true;

    //     scene.add( mesh );
    // // wireframe
    //     let edges = new THREE.EdgesGeometry( mesh.geometry, 30 ); // or WireframeGeometry
    //     let mat = new THREE.LineBasicMaterial( { color: 0xf6f6f6 } );
    //     let wireframe = new THREE.LineSegments( edges, mat );
    //     mesh.add( wireframe );
    //     mesh.receiveShadow = true;
    //     mesh.castShadow = true;
    // } );

    // controls
    controls = new OrbitControls( camera, renderer.domElement  )
    
    // lights
    const color = 0xFFFFFF;
    const warm = 0xffffea;
    const cool = 0xeafeff;
    const blue = 0x6effff;
    const purple = 0x828ff6;

    const intensity = 1;

    const light = new THREE.AmbientLight(color, intensity*0);
    const light1 = new THREE.DirectionalLight(warm,intensity*.1);
    // const light1 = new THREE.HemisphereLight(warm,intensity*.01);
    // const light2 = new THREE.DirectionalLight(purple, intensity*4);
    // const light3 = new THREE.DirectionalLight(blue, intensity*2);
    const light2 = new THREE.DirectionalLight(cool, intensity);
    const light3 = new THREE.DirectionalLight(color, intensity);
    
    const span = 3
    light1.position.set(0, 10, 0);
    // light1.target.position.set(0,0,0);
    light2.position.set(10, 5, 7.5);
    light2.castShadow = true;
    light2.shadow.mapSize.width = 2160;
    light2.shadow.mapSize.width = 2160;

    light2.shadow.camera.left = -span;
    light2.shadow.camera.right = span;
    light2.shadow.camera.bottom = -span;
    light2.shadow.camera.top = span;
    light3.position.set(-7.5, 5, -7.5);
    scene.add(light);
    scene.add(light1);
    // // // scene.add(light1.target);
    scene.add(light2);
    scene.add(light3);

    // light helpers

    // const sphereSize = 1;
    // const pointLightHelper1 = new THREE.PointLightHelper( light1, sphereSize );
    // scene.add( pointLightHelper1 );
    // const pointLightHelper2 = new THREE.PointLightHelper( light2, sphereSize );
    // scene.add( pointLightHelper2 );
    // const pointLightHelper3 = new THREE.PointLightHelper( light3, sphereSize );
    // scene.add( pointLightHelper3 );
    // const pointLightHelper4 = new THREE.PointLightHelper( light4, sphereSize );
    // scene.add( pointLightHelper4 );

    // grid
    const gridSize = 25;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper( gridSize, divisions, 0x005675,0x353535);

    scene.add( gridHelper );

    composer = new EffectComposer( renderer );
    renderPass = new RenderPass( scene, camera );
    // composer.addPass( renderPass );
    // saoPass = new SAOPass( scene, camera, false, true );
    // composer.addPass( saoPass );
    // saoPass.params.saoScale = 120;
    // saoPass.params.saoBlurRadius = 2;
    // saoPass.params.saoKernelRadius = 20;
    // saoPass.params.saoIntensity = 0.18;


    controls.update();
}

function animate() {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    controls.update()
    renderer.render(scene,camera)
    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();