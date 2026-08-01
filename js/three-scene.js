/**
 * SIMÓN FITNESS - THREE.JS 3D ENGINE (v5.1 High-Density Particle Starfield)
 * Campo de partículas rojas y blancas de alto impacto: más densas (240 por escena),
 * más grandes (size 0.09), luminosas (opacity 0.75) y con movimiento orgánico flotante.
 */

window.SimonFitness3D = (function () {
  'use strict';

  const scenes = [];
  let isMobile = false;

  function checkMobile() {
    isMobile = window.innerWidth < 992;
  }

  function init() {
    checkMobile();
    window.addEventListener('resize', onWindowResize, false);

    // En móviles (< 992px) ocultamos 3D para dejar la interfaz 100% limpia y veloz
    if (isMobile) {
      console.log('Modo Móvil: Renderizado 3D desactivado para fluidez total.');
      return;
    }

    if (typeof THREE === 'undefined') return;

    setupHeroSlot();
    setupService1Slot();
    setupService2Slot();

    animate();
  }

  // Helper: Añadir campo de partículas intensas, visibles y flotantes (Rojo Eléctrico + Blanco Puro)
  function addParticleField(scene) {
    const particleCount = 240; // Cuadruplicamos la cantidad para alta densidad visual
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const redColor = new THREE.Color(0xE30613);
    const brightRed = new THREE.Color(0xFF2E3B);
    const whiteColor = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const rand = Math.random();
      let mixColor;
      if (rand > 0.6) {
        mixColor = redColor;
      } else if (rand > 0.3) {
        mixColor = brightRed;
      } else {
        mixColor = whiteColor;
      }

      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.09, // Más de 2x tamaño anterior para máxima visibilidad
      vertexColors: true,
      transparent: true,
      opacity: 0.75, // Alta opacidad y brillo
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    return particles;
  }

  // 1. HERO SLOT: MANCUERNA METÁLICA (#hero-3d-canvas)
  function setupHeroSlot() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);
    const redLight = new THREE.PointLight(0xE30613, 6, 18);
    redLight.position.set(-2, -2, 3);
    scene.add(redLight);

    const particles = addParticleField(scene);

    const dumbbellGroup = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, metalness: 0.85, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7, roughness: 0.2 });

    const barGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.6, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.15 - i * 0.09, 1.15 - i * 0.09, 0.26, 6);
      const plateL = new THREE.Mesh(plateGeo, ironMat);
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -0.95 - i * 0.28;
      dumbbellGroup.add(plateL);

      const plateR = new THREE.Mesh(plateGeo, ironMat);
      plateR.rotation.z = Math.PI / 2;
      plateR.position.x = 0.95 + i * 0.28;
      dumbbellGroup.add(plateR);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.18, 0.035, 16, 32);
        const ringL = new THREE.Mesh(ringGeo, redMat);
        ringL.rotation.y = Math.PI / 2;
        ringL.position.x = -0.8;
        dumbbellGroup.add(ringL);

        const ringR = new THREE.Mesh(ringGeo, redMat);
        ringR.rotation.y = Math.PI / 2;
        ringR.position.x = 0.8;
        dumbbellGroup.add(ringR);
      }
    }

    scene.add(dumbbellGroup);

    scenes.push({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      camera: camera,
      group: dumbbellGroup,
      particles: particles,
      update: () => {
        dumbbellGroup.rotation.y += 0.009;
        dumbbellGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.12;
        particles.rotation.y += 0.002;
        particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
      }
    });
  }

  // 2. SERVICIO 1: CINTA DE CORRER (#service1-3d-canvas)
  function setupService1Slot() {
    const canvas = document.getElementById('service1-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 5.2);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);

    const particles = addParticleField(scene);

    const treadmillGroup = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1e1e26, metalness: 0.9, roughness: 0.2 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.9 });
    const redAccent = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6 });

    const deckGeo = new THREE.BoxGeometry(4.0, 0.22, 1.8);
    const deck = new THREE.Mesh(deckGeo, darkMetal);
    treadmillGroup.add(deck);

    const beltGeo = new THREE.BoxGeometry(3.5, 0.24, 1.5);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    treadmillGroup.add(belt);

    const railGeo = new THREE.BoxGeometry(4.0, 0.09, 0.12);
    const railL = new THREE.Mesh(railGeo, redAccent);
    railL.position.set(0, 0.13, 0.82);
    treadmillGroup.add(railL);

    const railR = new THREE.Mesh(railGeo, redAccent);
    railR.position.set(0, 0.13, -0.82);
    treadmillGroup.add(railR);

    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 16);
    const postL = new THREE.Mesh(postGeo, darkMetal);
    postL.position.set(1.4, 1.1, 0.8);
    postL.rotation.z = -0.25;
    treadmillGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, darkMetal);
    postR.position.set(1.4, 1.1, -0.8);
    postR.rotation.z = -0.25;
    treadmillGroup.add(postR);

    const consoleGeo = new THREE.BoxGeometry(0.6, 0.55, 1.35);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkMetal);
    consoleMesh.position.set(1.6, 1.9, 0);
    consoleMesh.rotation.z = -0.2;
    treadmillGroup.add(consoleMesh);

    scene.add(treadmillGroup);

    scenes.push({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      camera: camera,
      group: treadmillGroup,
      particles: particles,
      update: () => {
        treadmillGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.35 - 0.2;
        particles.rotation.y += 0.002;
        particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
      }
    });
  }

  // 3. SERVICIO 2: BICICLETA ESTÁTICA (#service2-3d-canvas)
  function setupService2Slot() {
    const canvas = document.getElementById('service2-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.8);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);

    const particles = addParticleField(scene);

    const bikeGroup = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const flywheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(1.1, 0, 0);
    bikeGroup.add(flywheel);

    const discGeo = new THREE.TorusGeometry(1.22, 0.038, 16, 48);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    bikeGroup.add(disc);

    const frameGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.5, 16);
    const mainTube = new THREE.Mesh(frameGeo, blackMat);
    mainTube.rotation.z = -0.6;
    mainTube.position.set(0.18, 0.5, 0);
    bikeGroup.add(mainTube);

    const seatPostGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.58, 1.15, 0);
    bikeGroup.add(seatPost);

    const seatGeo = new THREE.BoxGeometry(0.58, 0.1, 0.35);
    const seat = new THREE.Mesh(seatGeo, blackMat);
    seat.position.set(-0.58, 1.9, 0);
    bikeGroup.add(seat);

    const handleBarGeo = new THREE.TorusGeometry(0.4, 0.038, 16, 32, Math.PI);
    const handleBar = new THREE.Mesh(handleBarGeo, redMat);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(0.85, 1.8, 0);
    bikeGroup.add(handleBar);

    scene.add(bikeGroup);

    scenes.push({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      camera: camera,
      group: bikeGroup,
      particles: particles,
      update: () => {
        bikeGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.35 + 0.2;
        particles.rotation.y += 0.002;
        particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
      }
    });
  }

  function onWindowResize() {
    checkMobile();
    if (isMobile) return;

    scenes.forEach(item => {
      if (!item.canvas) return;
      const rect = item.canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        item.camera.aspect = rect.width / rect.height;
        item.camera.updateProjectionMatrix();
        item.renderer.setSize(rect.width, rect.height);
      }
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    if (isMobile) return;

    scenes.forEach(item => {
      if (item.update) item.update();
      item.renderer.render(item.scene, item.camera);
    });
  }

  return {
    init: init
  };
})();
