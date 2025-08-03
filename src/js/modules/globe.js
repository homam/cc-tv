// 3D Globe module using Three.js
import { latLonToVector3, tween, easeInOutCubic } from '../utils/helpers.js';
import { state } from '../config/data.js';

export class Globe {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.group = null;
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.rotX = 0;
        this.rotY = 0;
        this.GLOBE_RADIUS = 100;
        this.isFocused = false;
        this.autoRotate = true;
        this.originalCameraZ = 250;
    }

    init() {
        const container = document.getElementById('globe-container');
        if (!container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
        this.camera.position.z = this.originalCameraZ;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
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
        loader.load('https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg', (texture) => {
            const sphereGeo = new THREE.SphereGeometry(this.GLOBE_RADIUS, 64, 64);
            const sphereMat = new THREE.MeshPhongMaterial({ 
                map: texture, 
                color: 0xaaaaaa, 
                specular: 0x333333, 
                shininess: 5 
            });
            this.globe = new THREE.Mesh(sphereGeo, sphereMat);
            this.group.add(this.globe);
            this.drawBankHQs();
            this.animate();
        });

        // Event listeners
        container.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        container.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onMouseDown(event) {
        if (!this.isFocused) {
            this.isMouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }
    }

    onMouseUp() {
        this.isMouseDown = false;
    }

    onMouseMove(event) {
        if (this.isMouseDown && !this.isFocused) {
            const deltaX = event.clientX - this.mouseX;
            const deltaY = event.clientY - this.mouseY;
            this.rotY += deltaX * 0.005;
            this.rotX += deltaY * 0.005;
            this.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotX));
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }
    }

    onWindowResize() {
        const container = document.getElementById('globe-container');
        if (!container) return;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (!this.isFocused) {
            if (this.autoRotate && !this.isMouseDown) {
                this.rotY += 0.0005;
            }
            this.group.rotation.y += (this.rotY - this.group.rotation.y) * 0.1;
            this.group.rotation.x += (this.rotX - this.group.rotation.x) * 0.1;
        }
        this.renderer.render(this.scene, this.camera);
    }

    zoomToCountry(countryData) {
        this.isFocused = true;
        this.autoRotate = false;

        const startQuaternion = new THREE.Quaternion().copy(this.group.quaternion);
        const targetQuaternion = new THREE.Quaternion();
        const countryVector = latLonToVector3(countryData.lat, countryData.lon, 1).normalize();
        const cameraVector = new THREE.Vector3(0, 0, 1);
        targetQuaternion.setFromUnitVectors(countryVector, cameraVector);

        tween({ t: 0 }, { t: 1 }, 2000, 
            (val) => {
                THREE.Quaternion.slerp(startQuaternion, targetQuaternion, this.group.quaternion, val.t);
            }, null, easeInOutCubic);
        
        tween({ z: this.camera.position.z }, { z: 180 }, 2000, 
            (val) => this.camera.position.z = val.z, null, easeInOutCubic);
    }

    zoomOut() {
        tween({ z: this.camera.position.z }, { z: this.originalCameraZ }, 2000, 
            (val) => this.camera.position.z = val.z, 
            () => {
                const euler = new THREE.Euler().setFromQuaternion(this.group.quaternion, 'YXZ');
                this.rotX = euler.x;
                this.rotY = euler.y;
                this.isFocused = false;
                this.autoRotate = true;
            }, 
            easeInOutCubic
        );
    }

    drawBankHQs() {
        Object.values(state.banks).forEach(bank => {
            const pos = latLonToVector3(bank.lat, bank.lon, this.GLOBE_RADIUS + 0.5);
            const bankGeo = new THREE.SphereGeometry(1.5, 16, 16);
            const bankMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.7 });
            const bankMesh = new THREE.Mesh(bankGeo, bankMat);
            bankMesh.position.copy(pos);
            this.group.add(bankMesh);
        });
    }

    createAcquisitionEvent(lat, lon) {
        if (!this.group) return;
        const position = latLonToVector3(lat, lon, this.GLOBE_RADIUS);
        
        // Adjust beam size based on focus state
        const beamSize = this.isFocused ? 2 : 1;
        const beamHeight = this.isFocused ? 60 : 40;
        
        const beamGeo = new THREE.CylinderGeometry(beamSize, beamSize * 1.5, beamHeight, 8, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.copy(position);
        beam.lookAt(position.clone().multiplyScalar(2));
        this.group.add(beam);

        let opacity = 1;
        const animateEffect = () => {
            opacity -= 0.03;
            beam.scale.y = opacity;
            beam.material.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animateEffect);
            } else {
                this.group.remove(beam);
                beam.geometry.dispose();
                beam.material.dispose();
            }
        };
        animateEffect();
    }

    createRevenueArc(startLat, startLon, endLat, endLon) {
        if (!this.group) return;
        const startVec = latLonToVector3(startLat, startLon, this.GLOBE_RADIUS);
        const endVec = latLonToVector3(endLat, endLon, this.GLOBE_RADIUS);
        const midVec = startVec.clone().add(endVec).multiplyScalar(0.5).setLength(this.GLOBE_RADIUS * 1.3);
        const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Adjust arc appearance based on focus state
        const lineWidth = this.isFocused ? 5 : 3;
        const arcMaterial = new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.9, linewidth: lineWidth });
        const arc = new THREE.Line(geometry, arcMaterial);
        this.group.add(arc);
        
        // Adjust particle size based on focus state
        const particleSize = this.isFocused ? 2.5 : 1.5;
        const particleGeo = new THREE.SphereGeometry(particleSize, 8, 8);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });
        const particle = new THREE.Mesh(particleGeo, particleMat);
        this.group.add(particle);

        let progress = 0;
        const animateArc = () => {
            progress += 0.012;
            if (progress < 1) {
                const point = curve.getPoint(progress);
                particle.position.copy(point);
                requestAnimationFrame(animateArc);
            } else {
                this.group.remove(arc);
                arc.geometry.dispose();
                arc.material.dispose();
                this.group.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        };
        animateArc();
    }

    createViewSpark() {
        if (!this.group) return;
        const lat = Math.random() * 180 - 90;
        const lon = Math.random() * 360 - 180;
        this.createViewSparkAtLocation(lat, lon);
    }

    createViewSparkAtLocation(lat, lon) {
        if (!this.group) return;
        const position = latLonToVector3(lat, lon, this.GLOBE_RADIUS + 0.5);
        
        // Adjust spark size based on focus state
        const sparkSize = this.isFocused ? 1.2 : 0.6;
        const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
        const sparkMat = new THREE.MeshBasicMaterial({ color: 0xe0e7ff, transparent: true, opacity: 0.9 });
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        spark.position.copy(position);
        this.group.add(spark);
        
        let opacity = 1;
        const animateSpark = () => {
            opacity -= 0.05;
            spark.material.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animateSpark);
            } else {
                this.group.remove(spark);
                spark.geometry.dispose();
                spark.material.dispose();
            }
        };
        animateSpark();
    }

    createLeadSparkAtLocation(lat, lon) {
        if (!this.group) return;
        const position = latLonToVector3(lat, lon, this.GLOBE_RADIUS + 0.5);
        
        // Adjust spark size based on focus state
        const sparkSize = this.isFocused ? 1.4 : 0.8;
        const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
        const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 });
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        spark.position.copy(position);
        this.group.add(spark);
        
        let opacity = 1;
        const animateSpark = () => {
            opacity -= 0.04;
            spark.material.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animateSpark);
            } else {
                this.group.remove(spark);
                spark.geometry.dispose();
                spark.material.dispose();
            }
        };
        animateSpark();
    }

    createTransactionSparkAtLocation(lat, lon) {
        if (!this.group) return;
        const position = latLonToVector3(lat, lon, this.GLOBE_RADIUS + 0.5);
        
        // Adjust spark size based on focus state
        const sparkSize = this.isFocused ? 1.6 : 1.0;
        const sparkGeo = new THREE.SphereGeometry(sparkSize, 8, 8);
        const sparkMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.9 });
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        spark.position.copy(position);
        this.group.add(spark);
        
        let opacity = 1;
        const animateSpark = () => {
            opacity -= 0.03;
            spark.material.opacity = opacity;
            if (opacity > 0) {
                requestAnimationFrame(animateSpark);
            } else {
                this.group.remove(spark);
                spark.geometry.dispose();
                spark.material.dispose();
            }
        };
        animateSpark();
    }

    get isFocused() {
        return this._isFocused;
    }

    set isFocused(value) {
        this._isFocused = value;
    }
} 