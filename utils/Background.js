import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import AvengersModel from './background.glb';

const _ = require('lodash');
// import Back from "../assets/background.jpg";

export default class Background {
  constructor(container) {
    this.container = container;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.camera = undefined;
    this.scene = undefined;
    this.renderer = undefined;
    this.composer = undefined;
    this.controls = undefined;
    this.loader = undefined;
    this.loader2 = undefined;
    this.mousePos = new THREE.Vector3();
    this.light = undefined;

    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.handleOrientation = this.handleOrientation.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('rgb(0, 0, 0)');
    this.light = new THREE.AmbientLight(0x404040, 5);
    this.light.position.set(1, 1, 1).normalize();
    this.scene.add(this.light);
    const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add( axesHelper );

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.addEventListener(
        'deviceorientation',
        this.handleOrientation,
        true
      );
    } else {
      document.body.addEventListener(
        'mousemove',
        _.throttle(this.onMouseMove, 100)
      );
    }
    this.loader = new GLTFLoader();
    this.loader.load(AvengersModel, (gltf) => {
      const obj = gltf.scene;
      obj.position.set(0, -0.1, 0.25);
      obj.rotation.y = 0;
      this.scene.add(obj);
    });
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.container.appendChild(this.renderer.domElement);
  }

  start() {
    this.init();
    this.animate();
    this.resize();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.composer.render();
  }

  resize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  handleOrientation(event) {
    const yMIN = -0.02;
    const yMAX = 0.1;
    const xMIN = -1;
    const xMAX = 1;
    const rotateX = event.gamma;
    const rotateY = event.beta;
    gsap.to(this.mousePos, 4, {
      x: Math.min(Math.max(rotateX, xMIN), xMAX),
      y: -Math.min(Math.max(rotateY / 1000, yMIN), yMAX),
      onUpdate: () => {
        this.camera.lookAt(this.mousePos);
      },
    });
  }

  onMouseMove(event) {
    const yMIN = -0.02;
    const yMAX = 0.1;
    const xMIN = -0.3;
    const xMAX = 0.3;
    const isMobile = false;
    gsap.to(this.mousePos, 4, {
      x: Math.min(
        Math.max((event.clientX / window.innerWidth) * 2 - 1, xMIN),
        xMAX
      ),
      y: -Math.min(
        Math.max((event.clientY / window.innerHeight) * 2 - 1, yMIN),
        yMAX
      ),
      onUpdate: () => {
        this.camera.lookAt(this.mousePos);
      },
    });
  }
}
