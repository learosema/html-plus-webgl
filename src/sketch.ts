import * as THREE from 'three';

type SketchOptions = {
  dom: HTMLCanvasElement;
};

export class Sketch {
  renderer: THREE.WebGLRenderer;
  dom: HTMLCanvasElement;
  width: number;
  height: number;

  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(this.geometry, this.material);
  clock = new THREE.Clock();
  camera: THREE.PerspectiveCamera;
  dpr = 1;
  frame = -1;

  constructor(options: SketchOptions) {
    this.dom = options.dom;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.dom.appendChild(this.renderer.domElement);
    this.width = this.dom.offsetWidth;
    this.height = this.dom.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
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
    this.mesh.rotation.x = time * 1.2;
    this.mesh.rotation.y = time * 1.5;
    this.renderer.render(this.scene, this.camera);
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
