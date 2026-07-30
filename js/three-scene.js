/**
 * SIMÓN FITNESS - BOUNDED CANVAS THREE.JS ENGINE (v3.0 Zig-Zag Containers)
 * Encapsulamiento 3D en tarjetas acotadas con Progressive Enhancement para móvil.
 */

window.SimonFitness3D = (function () {
  'use strict';

  let isMobile = false;
  const scenes = [];

  function checkMobile() {
    isMobile = window.innerWidth < 992;
  }

  function init() {
    checkMobile();
    window.addEventListener('resize', onWindowResize, false);

    // Si estamos en móvil, pausamos el renderizado 3D pesado para máxima velocidad
    if (isMobile) {
      console.log('Modo Móvil: Renderizado 3D pausado para optimización de batería y rendimiento.');
      return;
    }

    if (typeof THREE === 'undefined') return;

    // Inicializar escenas 3D en sus respectivos contenedores acotados
    setupHeroCard3D();
    setupService1Card3D();
    setupService2Card3D();

    animate();
  }

  // 1. TARJETA HERO 3D (Mancuerna Metálica)
  function setupHeroCard3D() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Luces de Estudio
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);
    const redLight = new THREE.PointLight(0xE30613, 5, 15);
    redLight.position.set(-2, -2, 3);
    scene.add(redLight);

    // Modelo 3D: Mancuerna Metálica de Alta Fidelidad
    const dumbbellGroup = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.15 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.0 - i * 0.08, 1.0 - i * 0.08, 0.22, 6);
      const plateL = new THREE.Mesh(plateGeo, ironMat);
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -0.85 - i * 0.25;
      dumbbellGroup.add(plateL);

      const plateR = new THREE.Mesh(plateGeo, ironMat);
      plateR.rotation.z = Math.PI / 2;
      plateR.position.x = 0.85 + i * 0.25;
      dumbbellGroup.add(plateR);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.02, 0.03, 16, 32);
        const ringL = new THREE.Mesh(ringGeo, redMat);
        ringL.rotation.y = Math.PI / 2;
        ringL.position.x = -0.72;
        dumbbellGroup.add(ringL);

        const ringR = new THREE.Mesh(ringGeo, redMat);
        ringR.rotation.y = Math.PI / 2;
        ringR.position.x = 0.72;
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
      update: () => {
        dumbbellGroup.rotation.y += 0.008;
        dumbbellGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
      }
    });
  }

  // 2. TARJETA SERVICIO 1 3D (Cinta de Correr)
  function setupService1Card3D() {
    const canvas = document.getElementById('service1-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 1.0, 7.0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);

    const treadmillGroup = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1e1e26, metalness: 0.9, roughness: 0.2 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.9 });
    const redAccent = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6 });

    const deckGeo = new THREE.BoxGeometry(3.6, 0.18, 1.6);
    const deck = new THREE.Mesh(deckGeo, darkMetal);
    treadmillGroup.add(deck);

    const beltGeo = new THREE.BoxGeometry(3.1, 0.2, 1.35);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    treadmillGroup.add(belt);

    const railGeo = new THREE.BoxGeometry(3.6, 0.07, 0.1);
    const railL = new THREE.Mesh(railGeo, redAccent);
    railL.position.set(0, 0.11, 0.75);
    treadmillGroup.add(railL);

    const railR = new THREE.Mesh(railGeo, redAccent);
    railR.position.set(0, 0.11, -0.75);
    treadmillGroup.add(railR);

    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 16);
    const postL = new THREE.Mesh(postGeo, darkMetal);
    postL.position.set(1.2, 0.9, 0.7);
    postL.rotation.z = -0.25;
    treadmillGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, darkMetal);
    postR.position.set(1.2, 0.9, -0.7);
    postR.rotation.z = -0.25;
    treadmillGroup.add(postR);

    const consoleGeo = new THREE.BoxGeometry(0.5, 0.45, 1.2);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkMetal);
    consoleMesh.position.set(1.4, 1.6, 0);
    consoleMesh.rotation.z = -0.2;
    treadmillGroup.add(consoleMesh);

    scene.add(treadmillGroup);

    scenes.push({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      camera: camera,
      group: treadmillGroup,
      update: () => {
        treadmillGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.4 - 0.2;
      }
    });
  }

  // 3. TARJETA SERVICIO 2 3D (Bicicleta Estática)
  function setupService2Card3D() {
    const canvas = document.getElementById('service2-3d-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0.8, 6.5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainLight.position.set(5, 6, 5);
    scene.add(mainLight);

    const bikeGroup = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const flywheelGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.16, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(0.9, 0, 0);
    bikeGroup.add(flywheel);

    const discGeo = new THREE.TorusGeometry(1.02, 0.035, 16, 48);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    bikeGroup.add(disc);

    const frameGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.2, 16);
    const mainTube = new THREE.Mesh(frameGeo, blackMat);
    mainTube.rotation.z = -0.6;
    mainTube.position.set(0.1, 0.4, 0);
    bikeGroup.add(mainTube);

    const seatPostGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 16);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.5, 1.0, 0);
    bikeGroup.add(seatPost);

    const seatGeo = new THREE.BoxGeometry(0.5, 0.1, 0.3);
    const seat = new THREE.Mesh(seatGeo, blackMat);
    seat.position.set(-0.5, 1.7, 0);
    bikeGroup.add(seat);

    scene.add(bikeGroup);

    scenes.push({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      camera: camera,
      group: bikeGroup,
      update: () => {
        bikeGroup.rotation.y = Math.sin(Date.now() * 0.0008) * 0.4 + 0.2;
      }
    });
  }

  function onWindowResize() {
    checkMobile();
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
    if (isMobile) return; // Pausado en móvil para velocidad extrema

    scenes.forEach(item => {
      if (item.update) item.update();
      item.renderer.render(item.scene, item.camera);
    });
  }

  return {
    init: init
  };
})();
