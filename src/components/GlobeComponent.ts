import * as THREE from 'three';
import { latLonToVector3, tween, easeInOutCubic } from '../utils/helpers.js';
import { state } from '../config/data.js';

export class GlobeComponent {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private globe: THREE.Mesh | null = null;
  private group: THREE.Group | null = null;
  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private rotX = 0;
  private rotY = 0;
  private readonly GLOBE_RADIUS = 100;
  private _isFocused = false;
  private autoRotate = true;
  private originalCameraZ = 250;

  init(): void {
    const container = document.getElementById('globe-container');
    if (!container) {
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    this.camera.position.z = this.originalCameraZ;
    (window as any).THREE = THREE;
    (window as any).camera = this.camera;
    (window as any).zoomOut = this.zoomOut.bind(this);
    const self = this;
    (window as any).zoomToCountry = function(lat: number, lng: number) {
      self.zoomToCountry({ lat, lng });
    };
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // color fixes
    THREE.ColorManagement.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;    ;
    this.renderer.useLegacyLights = true;
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0xcccccc, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 3, 5);
    this.scene.add(dirLight);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Load globe texture
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg', 
      (texture) => {
        const sphereGeo = new THREE.SphereGeometry(this.GLOBE_RADIUS, 64, 64);
        const sphereMat = new THREE.MeshPhongMaterial({ map: texture, color: 0xaaaaaa, specular: 0x333333, shininess: 5 });
        // sphereMat.colorSpace = THREE.SRGBColorSpace;
        this.globe = new THREE.Mesh(sphereGeo, sphereMat);
        this.group!.add(this.globe);
        this.drawBankHQs();
        this.animate();
      },
      undefined,
      (error) => {
        console.error('Error loading globe texture:', error);
        // Fallback to basic material without texture
        const sphereGeo = new THREE.SphereGeometry(this.GLOBE_RADIUS, 64, 64);
        const sphereMat = new THREE.MeshPhongMaterial({ 
          color: 0x4a90e2, 
          specular: 0x333333, 
          shininess: 5 
        });
        this.globe = new THREE.Mesh(sphereGeo, sphereMat);
        this.group!.add(this.globe);
        this.drawBankHQs();
        this.animate();
      }
    );

    // Event listeners
    container.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this._isFocused) {
      this.isMouseDown = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }

  private onMouseUp(): void {
    this.isMouseDown = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isMouseDown && !this._isFocused) {
      const deltaX = event.clientX - this.mouseX;
      const deltaY = event.clientY - this.mouseY;
      this.rotY += deltaX * 0.005;
      this.rotX += deltaY * 0.005;
      this.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotX));
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }

  private onWindowResize(): void {
    const container = document.getElementById('globe-container');
    if (!container || !this.camera || !this.renderer) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    if (!this._isFocused) {
      if (this.autoRotate && !this.isMouseDown) {
        this.rotY += 0.0005;
      }
      this.group!.rotation.y += (this.rotY - this.group!.rotation.y) * 0.1;
      this.group!.rotation.x += (this.rotX - this.group!.rotation.x) * 0.1;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    } else {
      console.error('Missing renderer, scene, or camera for animation');
    }
  }


  zoomToCountry(countryData: { lat: number; lng: number }): void {
    this._isFocused = true;
    this.autoRotate = false;

    const startQuaternion = new THREE.Quaternion().copy(this.group!.quaternion);
    const targetQuaternion = new THREE.Quaternion();
    const countryVector = latLonToVector3(countryData.lat, countryData.lng, 1).normalize();
    const cameraVector = new THREE.Vector3(0, 0, 1);
    targetQuaternion.setFromUnitVectors(countryVector, cameraVector);

    tween({ t: 0 }, { t: 1 }, 2000, 
      (val) => {
        this.group!.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, val.t);
      }, undefined, easeInOutCubic);
    
    tween({ z: this.camera!.position.z }, { z: 180 }, 2000, 
      (val) => this.camera!.position.z = val.z, undefined, easeInOutCubic);
  }

  zoomOut(): void {
    // const startQuaternion = new THREE.Quaternion().copy(this.group!.quaternion);

    tween({ z: this.camera!.position.z, t: 0 }, { z: this.originalCameraZ, t: 1 }, 2000, 
      (val) => {
        this.camera!.position.z = val.z;
        // this.group!.quaternion.slerpQuaternions(startQuaternion, new THREE.Quaternion().setFromEuler(this._startQuaternion!), val.t);
      },
      () => {
        const euler = new THREE.Euler().setFromQuaternion(this.group!.quaternion, 'YXZ');
        this.rotX = euler.x;
        this.rotY = euler.y;
        this._isFocused = false;
        this.autoRotate = true;
      }, 
      easeInOutCubic
    );
  }

  private drawBankHQs(): void {
    Object.values(state.banks).forEach(bank => {
      const pos = latLonToVector3(bank.lat, bank.lng, this.GLOBE_RADIUS + 0.5);
      const bankGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const bankMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.7 });
      const bankMesh = new THREE.Mesh(bankGeo, bankMat);
      bankMesh.position.copy(pos);
      this.group!.add(bankMesh);
    });
  }

  createAcquisitionEvent(lat: number, lng: number): void {
    if (!this.group) return;
    const position = latLonToVector3(lat, lng, this.GLOBE_RADIUS);
    
    // Create multiple ripple rings
    const numRings = 3;
    const rings: THREE.Mesh[] = [];
    
    for (let i = 0; i < numRings; i++) {
      const ringGeo = new THREE.RingGeometry(2 + i * 2, 2.5 + i * 2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0x86efac, 
        transparent: true, 
        opacity: 0.8, 
        side: THREE.DoubleSide 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(position);
      ring.lookAt(position.clone().multiplyScalar(2));
      this.group!.add(ring);
      rings.push(ring);
    }

    let time = 0;
    const animateRipples = () => {
      time += 0.02;
      
      let activeRings = 0;
      rings.forEach((ring, index) => {
        const delay = index * 0.3;
        const ringTime = Math.max(0, time - delay);
        
        if (ringTime < 1.5) {
          activeRings++;
          const scale = 1 + ringTime * 3;
          const opacity = 0.8 * (1 - ringTime / 1.5);
          
          ring.scale.set(scale, scale, scale);
          (ring.material as THREE.Material).opacity = Math.max(0, opacity);
        } else {
          // Clean up ring
          if (this.group!.children.includes(ring)) {
            this.group!.remove(ring);
            ring.geometry.dispose();
            (ring.material as THREE.Material).dispose();
          }
        }
      });
      
      if (activeRings > 0) {
        requestAnimationFrame(animateRipples);
      }
    };
    animateRipples();
  }

  createRevenueArc(startLat: number, startLon: number, endLat: number, endLon: number): void {
    if (!this.group) return;
    const startVec = latLonToVector3(startLat, startLon, this.GLOBE_RADIUS);
    const endVec = latLonToVector3(endLat, endLon, this.GLOBE_RADIUS);
    const midVec = startVec.clone().add(endVec).multiplyScalar(0.5).setLength(this.GLOBE_RADIUS * 1.3);
    const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Adjust arc appearance based on focus state
    const lineWidth = this._isFocused ? 5 : 3;
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.9, linewidth: lineWidth });
    const arc = new THREE.Line(geometry, arcMaterial);
    this.group!.add(arc);
    
    // Adjust particle size based on focus state
    const particleSize = this._isFocused ? 2.5 : 1.5;
    const particleGeo = new THREE.SphereGeometry(particleSize, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });
    const particle = new THREE.Mesh(particleGeo, particleMat);
    this.group!.add(particle);

    let progress = 0;
    const animateArc = () => {
      progress += 0.012;
      if (progress < 1) {
        const point = curve.getPoint(progress);
        particle.position.copy(point);
        requestAnimationFrame(animateArc);
      } else {
        this.group!.remove(arc);
        arc.geometry.dispose();
        arc.material.dispose();
        this.group!.remove(particle);
        particle.geometry.dispose();
        particle.material.dispose();
      }
    };
    animateArc();
  }

  createViewSparkAtLocation(lat: number, lng: number): void {
    if (!this.group) return;
    const position = latLonToVector3(lat, lng, this.GLOBE_RADIUS + 0.5);
    
    // Adjust spark size based on focus state
    const sparkSize = this._isFocused ? 1.2 : 0.6;
    const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xe0e7ff, transparent: true, opacity: 0.9 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.copy(position);
    this.group!.add(spark);
    
    let opacity = 1;
    const animateSpark = () => {
      opacity -= 0.05;
      spark.material.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(animateSpark);
      } else {
        this.group!.remove(spark);
        spark.geometry.dispose();
        spark.material.dispose();
      }
    };
    animateSpark();
  }

  createLeadSparkAtLocation(lat: number, lng: number): void {
    if (!this.group) return;
    const position = latLonToVector3(lat, lng, this.GLOBE_RADIUS + 0.5);
    
    // Adjust spark size based on focus state
    const sparkSize = this._isFocused ? 1.4 : 0.8;
    const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.copy(position);
    this.group!.add(spark);
    
    let opacity = 1;
    const animateSpark = () => {
      opacity -= 0.04;
      spark.material.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(animateSpark);
      } else {
        this.group!.remove(spark);
        spark.geometry.dispose();
        spark.material.dispose();
      }
    };
    animateSpark();
  }

  createTransactionSparkAtLocation(lat: number, lng: number): void {
    if (!this.group) return;
    const position = latLonToVector3(lat, lng, this.GLOBE_RADIUS + 0.5);
    
    // Adjust spark size based on focus state
    const sparkSize = this._isFocused ? 1.6 : 1.0;
    const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.9 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.copy(position);
    this.group!.add(spark);
    
    let opacity = 1;
    const animateSpark = () => {
      opacity -= 0.03;
      spark.material.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(animateSpark);
      } else {
        this.group!.remove(spark);
        spark.geometry.dispose();
        spark.material.dispose();
      }
    };
    animateSpark();
  }

  get isFocused(): boolean {
    return this._isFocused;
  }

  set isFocused(value: boolean) {
    this._isFocused = value;
  }
} 