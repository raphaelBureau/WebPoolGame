import './style.css'
import * as Three from 'three'
import { Camera } from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import * as Cannon from 'cannon';

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
let poolTable;
gltfLoader.load(
    './pool/scene.gltf', (obj) => {
        //ressource loaded;
        poolTable = obj.scene.children[0].children[0].children[0];
        poolTable.castShadow = true;
        //table.scale(0.1,0.1,0.1);
        //table.rotateX(-Math.PI/2);
        scene.add(poolTable)


        rgbeLoader.load('./hdr/hdr.hdr', (envMap) => {
            console.log(poolTable);
         envMap.mapping = Three.EquirectangularReflectionMapping

         scene.environment = envMap;
         scene.background = envMap;
        })
    }
)

const scene = new Three.Scene();

//const directionalLight = new Three.DirectionalLight(0xffffff, 5)
//directionalLight.position.set(0,1,0.2);
//directionalLight.castShadow = true;
//scene.add(directionalLight);

const spotLight = new Three.SpotLight(0xffffff, 1);
spotLight.castShadow = true;
spotLight.position.set(0, 200, 0);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);

var hemiLight = new Three.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 300, 0);
scene.add(hemiLight);



//const ambientLight = new Three.AmbientLight(0xffffff,8);
//scene.add(ambientLight);


const sizes = {
    height: $(document).height(),
    width: $(document).width()
}



const world = new Cannon.World();
world.gravity.set(0, -9.82, 0);

//const floorShape = new Cannon.Plane();
//const floorBody = new Cannon.Body();
//floorBody.mass = 0;
//floorBody.addShape(floorShape);
//floorBody.quaternion.setFromAxisAngle(new Cannon.Vec3(-1, 0, 0), Math.PI / 2);
//world.addBody(floorBody);

//let ballShape = new Cannon.Sphere(2);
//ballsPhys = new Cannon.Body({
//    mass: 1,
//    shape: ballShape
//});
//ballsPhys.addShape(ballShape);
//world.addBody(ballsPhys);
//ball.position.copy(ballsPhys.position);






const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height);

camera.rotateY(Math.PI);

scene.add(camera);
camera.position.set(10, 10, 10);

const canvas = document.querySelector('.webgl');

const renderer = new Three.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);

var keys = {};
$(document).keydown(function (e) {
    keys[e.key] = true;
});
$(document).keyup(function (e) {
    delete keys[e.key];
});




camera.rotation.reorder('YZX');

let clock = new Three.Clock();
let oldElapsedTime = 0;

function Draw() {
    let elapsedTime = clock.getElapsedTime();
    let deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
    world.step(1 / 60, deltaTime, 3);
    //ball.position.copy(ballsPhys.position);
    //ball.quaternion.copy(ballsPhys.quaternion);

    //ballsPhys.velocity = new Cannon.Vec3(1, 0, 0);

    uc.Update(deltaTime);

    camera.rotation.set(uc.cameraX, uc.cameraY, 0)
    renderer.render(scene, camera);
    window.requestAnimationFrame(Draw);
}


class UserControls {
    constructor(screen) {
        this.s = screen;
        this.keyW = false;
        this.keyA = false;
        this.keyS = false;
        this.keyD = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.space= false;
        this.shift = false;
        this.cameraX = 0;
        this.cameraY = 0;
    }
    onKeyDown(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
          case 68: //d
            this.keyD = true;
            break;
          case 83: //s
            this.keyS = true;
            break;
          case 65: //a
            this.keyA = true;
            break;
          case 87: //w
            this.keyW = true;
            break;
            case 37: 
            this.arrowLeft = true;
            break;
            case 38: 
            this.arrowUp = true;
            break;
            case 39: 
            this.arrowRight = true;
            break;
            case 40: 
            this.arrowDown = true;
            break;
            case 16: 
            this.shift = true;
            break;
            case 32: 
            this.space = true;
            break;
        }
      }
      onKeyUp(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
          case 68: //d
            this.keyD = false;
            break;
          case 83: //s
            this.keyS = false;
            break;
          case 65: //a
            this.keyA = false;
            break;
          case 87: //w
            this.keyW = false;
            break;
            case 37: 
            this.arrowLeft = false;
            break;
            case 38: 
            this.arrowUp = false;
            break;
            case 39: 
            this.arrowRight = false;
            break;
            case 40: 
            this.arrowDown = false;
            break;
            case 16: 
            this.shift = false;
            break;
            case 32: 
            this.space = false;
            break;
        }
      }
      Update(deltaTime) {
        let lookSpeed = 1;
        if(this.keyA) {
            this.s.translateX(-0.5 * deltaTime * 50);
        }
        if(this.keyD) {
            this.s.translateX(0.5 * deltaTime * 50);
        }
        if(this.keyW) {
            this.s.translateZ(-0.5 * deltaTime * 50);
        }
        if(this.keyS) {
            this.s.translateZ(0.5 * deltaTime * 50);
        }
        if(this.arrowUp) {
            if (this.cameraX < (Math.PI / 2)) {
                this.cameraX += 1 * deltaTime;
            }
        }
        if(this.arrowDown) {
            if (this.cameraX > -(Math.PI / 2)) {
                this.cameraX -= 1 * deltaTime;
            }
        }
        if(this.arrowLeft) {
            this.cameraY += 1 * deltaTime;
        }
        if(this.arrowRight) {
            this.cameraY -= 1 * deltaTime;
        }
        if(this.space) {
            camera.translateY(0.5 * deltaTime * 50);
        }
        if(this.shift) {
            camera.translateY(-0.5 * deltaTime * 50);
        }
      }
    }

    const uc = new UserControls(camera);
    
    window.addEventListener("keydown", (e) => uc.onKeyDown(e), false);  //goofy ahh lambda sinon ca marche pas
window.addEventListener("keyup", (e) => uc.onKeyUp(e), false);

    Draw()
