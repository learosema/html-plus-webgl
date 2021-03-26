import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/default.vert';
import fragmentShader from './shaders/default.frag';
type SketchOptions = {
  dom: HTMLCanvasElement;
};

export class Sketch {
  renderer: THREE.WebGLRenderer;
  container: HTMLCanvasElement;
  width: number;
  height: number;
  controls: OrbitControls;
  scene = new THREE.Scene();
  geometry = new THREE.PlaneGeometry(0.5, 0.5, 100, 100);
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(this.geometry, this.material);
  clock = new THREE.Clock();
  camera: THREE.PerspectiveCamera;
  dpr = 1;
  frame = -1;

  constructor(options: SketchOptions) {
    this.container = options.dom;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.container.appendChild(this.renderer.domElement);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.onResize();
    window.addEventListener('resize', this.onResize, false);
    this.camera.position.z = 1;
    this.clock.start();
    this.addObjects();
    this.playing = true;
  }

  addObjects() {
    this.scene.add(this.mesh);
  }

  get playing(): boolean {
    return this.frame > -1;
  }

  set playing(value: boolean) {
    if (this.frame === -1 && value === true) {
      this.frame = requestAnimationFrame(this.render);
    }
    if (this.frame > -1 && value === false) {
      cancelAnimationFrame(this.frame);
      this.frame = -1;
    }
  }

  render = () => {
    const time = this.clock.getElapsedTime();
    //this.mesh.rotation.x = time * 1.2;
    // this.mesh.rotation.y = time * 1.5;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.frame = requestAnimationFrame(this.render);
  };

  onResize = () => {
    this.width = innerWidth;
    this.height = innerHeight;
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    if (!this.playing) {
      this.renderer.render(this.scene, this.camera);
    }
  };
}
