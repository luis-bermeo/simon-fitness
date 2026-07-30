/**
 * SIMÓN FITNESS - THREE.JS 3D SCENE ENGINE (v3.2 All 3 Models Synchronized)
 * Transición perfecta entre 3 modelos:
 *  1. Hero: Mancuerna Metálica
 *  2. Servicio 1: Cinta de Correr
 *  3. Servicio 2: Bicicleta Estática / Spinning
 * Desvanecimiento limpio solo a partir del 62% de scroll (Sección Reseñas / Contacto).
 */

window.SimonFitness3D = (function () {
  'use strict';

  let scene, camera, renderer;
  let canvas;

  const modelsGroup = new THREE.Group();
  let dumbbellGroup = new THREE.Group();
  let treadmillGroup = new THREE.Group();
  let exerciseBikeGroup = new THREE.Group();
  let particlesGroup = new THREE.Group();

  let targetProgress = 0;
  let currentProgress = 0;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function init() {
    canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      console.warn('Canvas o Three.js no disponibles.');
      return;
    }

    scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    const initialFov = aspect < 1 ? Math.min(65, 45 / aspect) : 45;

    camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 100);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% Transparente
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    setupStudioLighting();

    // Crear los 3 Modelos 3D de Gran Tamaño
    createParticles();
    createDumbbellModel();      // 1. Hero: Mancuerna Metálica
    createTreadmillModel();     // 2. Servicio 1: Cinta de Correr
    createExerciseBikeModel();  // 3. Servicio 2: Bicicleta Estática

    scene.add(modelsGroup);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    animate();
  }

  function setupStudioLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.4);
    fillLight.position.set(-6, 4, 4);
    scene.add(fillLight);

    const redRimLight = new THREE.PointLight(0xE30613, 6, 22);
    redRimLight.position.set(2, -2, 4);
    scene.add(redRimLight);
  }

  function createParticles() {
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xE30613,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    particlesGroup = new THREE.Points(geometry, material);
    scene.add(particlesGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 1: MANCUERNA METÁLICA (HERO)
  // --------------------------------------------------------------------------
  function createDumbbellModel() {
    dumbbellGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.15 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7, roughness: 0.2 });

    const barGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.6, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.2 - i * 0.1, 1.2 - i * 0.1, 0.26, 6);
      const plateL = new THREE.Mesh(plateGeo, ironMat);
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -1.0 - i * 0.28;
      dumbbellGroup.add(plateL);

      const plateR = new THREE.Mesh(plateGeo, ironMat);
      plateR.rotation.z = Math.PI / 2;
      plateR.position.x = 1.0 + i * 0.28;
      dumbbellGroup.add(plateR);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.22, 0.035, 16, 32);
        const ringL = new THREE.Mesh(ringGeo, redMat);
        ringL.rotation.y = Math.PI / 2;
        ringL.position.x = -0.85;
        dumbbellGroup.add(ringL);

        const ringR = new THREE.Mesh(ringGeo, redMat);
        ringR.rotation.y = Math.PI / 2;
        ringR.position.x = 0.85;
        dumbbellGroup.add(ringR);
      }
    }

    modelsGroup.add(dumbbellGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 2: CINTA DE CORRER (SERVICIO 1 - CINTAS DE CORRER)
  // --------------------------------------------------------------------------
  function createTreadmillModel() {
    treadmillGroup = new THREE.Group();

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1e1e26, metalness: 0.9, roughness: 0.2 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.9 });
    const redAccent = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6 });

    const deckGeo = new THREE.BoxGeometry(4.2, 0.22, 1.9);
    const deck = new THREE.Mesh(deckGeo, darkMetal);
    treadmillGroup.add(deck);

    const beltGeo = new THREE.BoxGeometry(3.7, 0.24, 1.6);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    treadmillGroup.add(belt);

    const railGeo = new THREE.BoxGeometry(4.2, 0.09, 0.12);
    const railL = new THREE.Mesh(railGeo, redAccent);
    railL.position.set(0, 0.13, 0.88);
    treadmillGroup.add(railL);

    const railR = new THREE.Mesh(railGeo, redAccent);
    railR.position.set(0, 0.13, -0.88);
    treadmillGroup.add(railR);

    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.1, 16);
    const postL = new THREE.Mesh(postGeo, darkMetal);
    postL.position.set(1.5, 1.1, 0.85);
    postL.rotation.z = -0.25;
    treadmillGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, darkMetal);
    postR.position.set(1.5, 1.1, -0.85);
    postR.rotation.z = -0.25;
    treadmillGroup.add(postR);

    const consoleGeo = new THREE.BoxGeometry(0.6, 0.55, 1.4);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkMetal);
    consoleMesh.position.set(1.7, 2.0, 0);
    consoleMesh.rotation.z = -0.2;
    treadmillGroup.add(consoleMesh);

    treadmillGroup.position.set(25, 0, 0); // Posición inicial reservada a la derecha
    modelsGroup.add(treadmillGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 3: BICICLETA ESTÁTICA / SPINNING (SERVICIO 2 - BICICLETAS)
  // --------------------------------------------------------------------------
  function createExerciseBikeModel() {
    exerciseBikeGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const flywheelGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.2, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(1.2, 0, 0);
    exerciseBikeGroup.add(flywheel);

    const discGeo = new THREE.TorusGeometry(1.28, 0.04, 16, 48);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    exerciseBikeGroup.add(disc);

    const frameGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 16);
    const mainTube = new THREE.Mesh(frameGeo, blackMat);
    mainTube.rotation.z = -0.6;
    mainTube.position.set(0.2, 0.5, 0);
    exerciseBikeGroup.add(mainTube);

    const seatPostGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.6, 1.2, 0);
    exerciseBikeGroup.add(seatPost);

    const seatGeo = new THREE.BoxGeometry(0.6, 0.12, 0.35);
    const seat = new THREE.Mesh(seatGeo, blackMat);
    seat.position.set(-0.6, 2.0, 0);
    exerciseBikeGroup.add(seat);

    const handleBarGeo = new THREE.TorusGeometry(0.4, 0.04, 16, 32, Math.PI);
    const handleBar = new THREE.Mesh(handleBarGeo, redMat);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(0.9, 1.9, 0);
    exerciseBikeGroup.add(handleBar);

    exerciseBikeGroup.position.set(-25, 0, 0); // Posición inicial reservada a la izquierda
    modelsGroup.add(exerciseBikeGroup);
  }

  // --------------------------------------------------------------------------
  // INTERPRETACIÓN DE SCROLL & SINCRONIZACIÓN DE LOS 3 MODELOS
  // --------------------------------------------------------------------------

  function setScrollProgress(progress) {
    targetProgress = progress;
  }

  function onMouseMove(event) {
    targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      targetMouseX = (event.touches[0].clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    camera.aspect = aspect;
    if (aspect < 1) {
      camera.fov = Math.min(65, Math.max(45, 45 / aspect));
    } else {
      camera.fov = 45;
    }
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function animate() {
    requestAnimationFrame(animate);

    currentProgress += (targetProgress - currentProgress) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const isDesktop = window.innerWidth >= 992;
    const scaleFactor = isDesktop ? 1.0 : 0.55;

    // CONTROL DE DESVANECIMIENTO GLOBAL:
    // Solo cuando el scroll pasa del 58% (Sección Por Qué Elegirnos, Reseñas, Contacto)
    let globalOpacity = 1;
    if (currentProgress > 0.58) {
      globalOpacity = Math.max(0, 1 - (currentProgress - 0.58) * 8);
    }

    if (canvas) {
      canvas.style.opacity = globalOpacity.toFixed(2);
    }

    // ------------------------------------------------------------------------
    // 1. MANCUERNA METÁLICA (HERO: Progress 0.00 -> 0.22)
    // ------------------------------------------------------------------------
    if (dumbbellGroup) {
      dumbbellGroup.rotation.y += 0.01;
      dumbbellGroup.rotation.x = 0.2 + mouseY * 0.2;

      // Desvanecimiento suave al salir del Hero
      const heroFade = Math.max(0, 1 - Math.max(0, (currentProgress - 0.14) * 8));
      const posX = isDesktop ? 3.0 : 0;
      const posY = isDesktop ? 0 : -1.8;

      dumbbellGroup.scale.set(scaleFactor * heroFade, scaleFactor * heroFade, scaleFactor * heroFade);
      dumbbellGroup.position.set(posX, posY, 0);
    }

    // ------------------------------------------------------------------------
    // 2. CINTA DE CORRER (SERVICIO 1 - CINTAS: Progress 0.15 -> 0.38)
    // ------------------------------------------------------------------------
    if (treadmillGroup) {
      // Aparición suave (inFactor) y salida suave (outFactor)
      const inFactor = Math.max(0, Math.min(1, (currentProgress - 0.12) * 6));
      const outFactor = Math.max(0, Math.min(1, (currentProgress - 0.30) * 6));
      const visFactor = inFactor * (1 - outFactor);

      const targetX = isDesktop ? 3.0 : 0;
      const inX = (1 - inFactor) * 20 + targetX;
      const finalX = inX - outFactor * 20;

      treadmillGroup.scale.set(scaleFactor * visFactor, scaleFactor * visFactor, scaleFactor * visFactor);
      treadmillGroup.position.x += (finalX - treadmillGroup.position.x) * 0.1;
      treadmillGroup.position.y = isDesktop ? 0 : -1.6;
      treadmillGroup.rotation.y = -0.5 + inFactor * 1.5 + mouseX * 0.2;
    }

    // ------------------------------------------------------------------------
    // 3. BICICLETA ESTÁTICA (SERVICIO 2 - BICICLETAS: Progress 0.32 -> 0.58)
    // ------------------------------------------------------------------------
    if (exerciseBikeGroup) {
      const inFactor = Math.max(0, Math.min(1, (currentProgress - 0.30) * 6));
      const outFactor = Math.max(0, Math.min(1, (currentProgress - 0.52) * 6));
      const visFactor = inFactor * (1 - outFactor);

      // En el Zig-Zag, la bicicleta se ubica en la Columna Izquierda (x: -3.0 en desktop)
      const targetX = isDesktop ? -3.0 : 0;
      const inX = (-1 + inFactor) * -20 + targetX;
      const finalX = inX + outFactor * 20;

      exerciseBikeGroup.scale.set(scaleFactor * visFactor, scaleFactor * visFactor, scaleFactor * visFactor);
      exerciseBikeGroup.position.x += (finalX - exerciseBikeGroup.position.x) * 0.1;
      exerciseBikeGroup.position.y = isDesktop ? 0 : -1.6;
      exerciseBikeGroup.rotation.y = 0.5 - inFactor * 1.5 + mouseX * 0.2;
    }

    camera.position.x = mouseX * 0.3;
    camera.position.y = -mouseY * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  return {
    init: init,
    setScrollProgress: setScrollProgress
  };
})();
