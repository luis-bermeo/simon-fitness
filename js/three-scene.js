/**
 * SIMÓN FITNESS - THREE.JS 3D SCENE & ENGINE (v2.2 Ultra-Clean & Transparent)
 * Escena 3D transparente con Mancuernas, Cinta de Correr, Bicicleta Estática y Engranajes.
 */

window.SimonFitness3D = (function () {
  'use strict';

  let scene, camera, renderer;
  let canvas;

  // Grupos 3D
  const modelsGroup = new THREE.Group();
  let dumbbellGroup = new THREE.Group();
  let treadmillGroup = new THREE.Group();
  let exerciseBikeGroup = new THREE.Group();
  let gearsGroup = new THREE.Group();
  let particlesGroup = new THREE.Group();

  // Estado del Scroll interpolado (Lerp)
  let targetProgress = 0;
  let currentProgress = 0;

  // Interacción del ratón
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

    // Escena Transparente Sin Fog denso
    scene = new THREE.Scene();

    // Cámara Perspectiva
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    // Renderizador WebGL Transparente
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% Fondo Transparente
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Iluminación de Estudio Cinemática
    setupStudioLighting();

    // Creación de Modelos 3D Limpios
    createParticles();
    createDumbbellModel();      // Hero: Mancuerna Metálica
    createTreadmillModel();     // Servicio 1: Cinta de Correr
    createExerciseBikeModel();  // Servicio 2: Bicicleta Estática / Spinning 3D
    createGearsModel();         // Servicio 3: Engranajes & Mantenimiento 3D

    scene.add(modelsGroup);

    // Eventos
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Render Loop
    animate();
  }

  function setupStudioLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
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
    const count = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xE30613,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    particlesGroup = new THREE.Points(geometry, material);
    scene.add(particlesGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 1: MANCUERNA METÁLICA DE GIMNASIO (HERO)
  // --------------------------------------------------------------------------
  function createDumbbellModel() {
    dumbbellGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.15 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e1e24, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7, roughness: 0.2 });

    // Barra Central
    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.4, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    // Discos Izquierdos Hexagonales
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.1 - i * 0.1, 1.1 - i * 0.1, 0.24, 6);
      const plate = new THREE.Mesh(plateGeo, ironMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = -0.9 - i * 0.28;
      dumbbellGroup.add(plate);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.12, 0.03, 16, 32);
        const ring = new THREE.Mesh(ringGeo, redMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = -0.76;
        dumbbellGroup.add(ring);
      }
    }

    // Discos Derechom Hexagonales
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.1 - i * 0.1, 1.1 - i * 0.1, 0.24, 6);
      const plate = new THREE.Mesh(plateGeo, ironMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = 0.9 + i * 0.28;
      dumbbellGroup.add(plate);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.12, 0.03, 16, 32);
        const ring = new THREE.Mesh(ringGeo, redMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = 0.76;
        dumbbellGroup.add(ring);
      }
    }

    modelsGroup.add(dumbbellGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 2: CINTA DE CORRER 3D (SERVICIO 1)
  // --------------------------------------------------------------------------
  function createTreadmillModel() {
    treadmillGroup = new THREE.Group();

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1e1e26, metalness: 0.9, roughness: 0.2 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.9 });
    const redAccent = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6, roughness: 0.2 });

    const deckGeo = new THREE.BoxGeometry(4.0, 0.2, 1.8);
    const deck = new THREE.Mesh(deckGeo, darkMetal);
    treadmillGroup.add(deck);

    const beltGeo = new THREE.BoxGeometry(3.5, 0.22, 1.5);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    treadmillGroup.add(belt);

    const railGeo = new THREE.BoxGeometry(4.0, 0.08, 0.12);
    const railL = new THREE.Mesh(railGeo, redAccent);
    railL.position.set(0, 0.12, 0.82);
    treadmillGroup.add(railL);

    const railR = new THREE.Mesh(railGeo, redAccent);
    railR.position.set(0, 0.12, -0.82);
    treadmillGroup.add(railR);

    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 16);
    const postL = new THREE.Mesh(postGeo, darkMetal);
    postL.position.set(1.4, 1.0, 0.8);
    postL.rotation.z = -0.25;
    treadmillGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, darkMetal);
    postR.position.set(1.4, 1.0, -0.8);
    postR.rotation.z = -0.25;
    treadmillGroup.add(postR);

    const consoleGeo = new THREE.BoxGeometry(0.6, 0.5, 1.4);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkMetal);
    consoleMesh.position.set(1.6, 1.8, 0);
    consoleMesh.rotation.z = -0.2;
    treadmillGroup.add(consoleMesh);

    treadmillGroup.position.set(20, 0, 0);
    modelsGroup.add(treadmillGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 3: BICICLETA ESTÁTICA / SPINNING 3D REALISTA (SERVICIO 2)
  // (Sustituye la estructura antigua por una bicicleta limpia)
  // --------------------------------------------------------------------------
  function createExerciseBikeModel() {
    exerciseBikeGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    // 1. Rueda de Inercia Frontal (Flywheel)
    const flywheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(1.2, 0, 0);
    exerciseBikeGroup.add(flywheel);

    // Disco protector con bisel rojo
    const discGeo = new THREE.TorusGeometry(1.22, 0.04, 16, 48);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    exerciseBikeGroup.add(disc);

    // 2. Chasis Principal de Acero
    const frameGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 16);
    const mainTube = new THREE.Mesh(frameGeo, blackMat);
    mainTube.rotation.z = -0.6;
    mainTube.position.set(0.2, 0.5, 0);
    exerciseBikeGroup.add(mainTube);

    // Tubo del Asiento
    const seatPostGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.6, 1.1, 0);
    exerciseBikeGroup.add(seatPost);

    // Asiento Ergonómico
    const seatGeo = new THREE.BoxGeometry(0.6, 0.12, 0.35);
    const seat = new THREE.Mesh(seatGeo, blackMat);
    seat.position.set(-0.6, 1.9, 0);
    exerciseBikeGroup.add(seat);

    // 3. Manillar Deportivo
    const handleBarGeo = new THREE.TorusGeometry(0.4, 0.04, 16, 32, Math.PI);
    const handleBar = new THREE.Mesh(handleBarGeo, redMat);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(0.9, 1.8, 0);
    exerciseBikeGroup.add(handleBar);

    // 4. Pedales
    const pedalGeo = new THREE.BoxGeometry(0.3, 0.08, 0.4);
    const pedalL = new THREE.Mesh(pedalGeo, blackMat);
    pedalL.position.set(0.2, -0.4, 0.5);
    exerciseBikeGroup.add(pedalL);

    const pedalR = new THREE.Mesh(pedalGeo, blackMat);
    pedalR.position.set(0.2, -0.8, -0.5);
    exerciseBikeGroup.add(pedalR);

    exerciseBikeGroup.position.set(-20, 0, 0);
    modelsGroup.add(exerciseBikeGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 4: ENGRANAJES DE PRECISIÓN 3D (SERVICIO 3 - MANTENIMIENTO)
  // --------------------------------------------------------------------------
  function createGearsModel() {
    gearsGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7, roughness: 0.2 });

    // Engranaje Principal Grande
    const gearGeo1 = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 12);
    const gear1 = new THREE.Mesh(gearGeo1, metalMat);
    gear1.position.set(0, 0, 0);
    gearsGroup.add(gear1);

    // Engranaje Secundario Rojo
    const gearGeo2 = new THREE.CylinderGeometry(0.9, 0.9, 0.25, 8);
    const gear2 = new THREE.Mesh(gearGeo2, redMat);
    gear2.position.set(1.6, 0.8, 0);
    gearsGroup.add(gear2);

    gearsGroup.position.set(0, -20, 0);
    modelsGroup.add(gearsGroup);
  }

  // --------------------------------------------------------------------------
  // INTERPRETACIÓN DEL SCROLL Y POSICIONAMIENTO LIMPIO EN 2 COLUMNAS
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Lerp
    currentProgress += (targetProgress - currentProgress) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const isDesktop = window.innerWidth >= 992;

    // Desvanecimiento suave en las últimas secciones (Opiniones / Contacto / Footer)
    let globalOpacity = 1;
    if (currentProgress > 0.65) {
      globalOpacity = Math.max(0, 1 - (currentProgress - 0.65) * 5);
    }
    if (canvas) {
      canvas.style.opacity = globalOpacity.toFixed(2);
    }

    // 1. HERO (Mancuerna): Se ubica en la Columna Derecha en escritorio
    if (dumbbellGroup) {
      dumbbellGroup.rotation.y += 0.01;
      dumbbellGroup.rotation.x = 0.2 + mouseY * 0.2;

      const posX = isDesktop ? 3.2 : 0;
      const posY = isDesktop ? 0 : -1.8;
      const scale = Math.max(0, 1 - currentProgress * 3.5);

      dumbbellGroup.scale.set(scale, scale, scale);
      dumbbellGroup.position.set(posX, posY, 0);
    }

    // 2. CINTA DE CORRER (Servicio 1): Transición limpia a la derecha
    if (treadmillGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.15) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.35) * 4));

      const targetX = isDesktop ? 3.2 : 0;
      const inX = (1 - factor) * 15 + targetX;
      const finalX = inX - exitFactor * 15;

      treadmillGroup.position.x += (finalX - treadmillGroup.position.x) * 0.1;
      treadmillGroup.position.y = isDesktop ? 0 : -1.8;
      treadmillGroup.rotation.y = -0.5 + factor * 1.5 + mouseX * 0.2;
    }

    // 3. BICICLETA ESTÁTICA 3D (Servicio 2): Transición limpia
    if (exerciseBikeGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.32) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.52) * 4));

      const targetX = isDesktop ? 3.2 : 0;
      const inX = (1 - factor) * 15 + targetX;
      const finalX = inX - exitFactor * 15;

      exerciseBikeGroup.position.x += (finalX - exerciseBikeGroup.position.x) * 0.1;
      exerciseBikeGroup.position.y = isDesktop ? 0 : -1.8;
      exerciseBikeGroup.rotation.y = 0.5 - factor * 1.5 + mouseX * 0.2;
    }

    // 4. ENGRANAJES 3D (Servicio 3): Mantenimiento
    if (gearsGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.48) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.65) * 4));

      const targetX = isDesktop ? 3.2 : 0;
      gearsGroup.position.x = targetX;
      gearsGroup.position.y = -15 + factor * 15 - exitFactor * 15;
      gearsGroup.rotation.z += 0.01;
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
