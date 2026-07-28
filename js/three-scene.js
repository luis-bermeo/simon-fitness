/**
 * SIMÓN FITNESS - THREE.JS 3D SCENE & ENGINE (v2.1 Refined)
 * Escena 3D ultra realista con Mancuerna Metálica 3D, Cintas, Elípticas y Despiece Mecánico.
 * Desplazamiento y desvanecimiento inteligente para cero solapamientos de texto.
 */

window.SimonFitness3D = (function () {
  'use strict';

  let scene, camera, renderer;
  let canvas;

  // Grupos 3D
  const modelsGroup = new THREE.Group();
  let dumbbellGroup = new THREE.Group();
  let treadmillGroup = new THREE.Group();
  let ellipticalGroup = new THREE.Group();
  let motorExplodedGroup = new THREE.Group();
  let particlesGroup = new THREE.Group();

  const explodedParts = [];

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

    // Escena y Niebla Oscura Premium
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.04);

    // Cámara Perspectiva
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    // Renderizador WebGL de Alto Rendimiento
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Iluminación de Estudio Industrial
    setupStudioLighting();

    // Creación de Modelos 3D Realistas
    createParticles();
    createDumbbellModel();      // Reemplazo: Mancuerna Metálica Realista
    createTreadmillModel();     // Cinta de Correr
    createEllipticalModel();    // Elíptica
    createMotorExplodedModel(); // Despiece Mecánico

    scene.add(modelsGroup);

    // Eventos
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Render Loop
    animate();
  }

  function setupStudioLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Luz Key Principal Plata/Blanco estilo Apple
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    // Luz de Relleno Fría
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    fillLight.position.set(-6, 4, 4);
    scene.add(fillLight);

    // Luz de Acento Rojo Simón Fitness (#E30613) en contorno
    const redRimLight = new THREE.PointLight(0xE30613, 5, 20);
    redRimLight.position.set(0, -3, 3);
    scene.add(redRimLight);
  }

  function createParticles() {
    const count = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xE30613,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    particlesGroup = new THREE.Points(geometry, material);
    scene.add(particlesGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 1: MANCUERNA METÁLICA REALISTA DE GIMNASIO (Reemplaza figura abstracta)
  // --------------------------------------------------------------------------
  function createDumbbellModel() {
    dumbbellGroup = new THREE.Group();

    // Materiales Metálicos de Alta Fidelidad
    const chromeBarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15
    });

    const ironPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      metalness: 0.85,
      roughness: 0.25
    });

    const redAccentMat = new THREE.MeshStandardMaterial({
      color: 0xE30613,
      metalness: 0.7,
      roughness: 0.2
    });

    // 1. Barra Central con Agarres
    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.4, 32);
    const barMesh = new THREE.Mesh(barGeo, chromeBarMat);
    barMesh.rotation.z = Math.PI / 2;
    dumbbellGroup.add(barMesh);

    // 2. Discos Izquierdos (Hexagonales)
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.1 - i * 0.1, 1.1 - i * 0.1, 0.22, 6);
      const plateMesh = new THREE.Mesh(plateGeo, ironPlateMat);
      plateMesh.rotation.z = Math.PI / 2;
      plateMesh.position.x = -0.9 - i * 0.26;
      dumbbellGroup.add(plateMesh);

      // Anillo de acento rojo en el disco exterior
      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.12, 0.03, 16, 32);
        const ringMesh = new THREE.Mesh(ringGeo, redAccentMat);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.x = -0.78;
        dumbbellGroup.add(ringMesh);
      }
    }

    // 3. Discos Derechom (Hexagonales)
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.1 - i * 0.1, 1.1 - i * 0.1, 0.22, 6);
      const plateMesh = new THREE.Mesh(plateGeo, ironPlateMat);
      plateMesh.rotation.z = Math.PI / 2;
      plateMesh.position.x = 0.9 + i * 0.26;
      dumbbellGroup.add(plateMesh);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.12, 0.03, 16, 32);
        const ringMesh = new THREE.Mesh(ringGeo, redAccentMat);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.x = 0.78;
        dumbbellGroup.add(ringMesh);
      }
    }

    // Posicionamiento Inicial de la Mancuerna en Pantalla
    dumbbellGroup.position.set(0, 0, 0);
    modelsGroup.add(dumbbellGroup);
  }

  // MODELO 2: CINTA DE CORRER 3D
  function createTreadmillModel() {
    treadmillGroup = new THREE.Group();

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x18181f, metalness: 0.9, roughness: 0.2 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.9 });
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

    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16);
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

    treadmillGroup.position.set(20, -1, 0); // Fuera de pantalla inicialmente
    modelsGroup.add(treadmillGroup);
  }

  // MODELO 3: ELÍPTICA 3D
  function createEllipticalModel() {
    ellipticalGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8, roughness: 0.3 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6 });

    const flywheelGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.28, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(-1.0, 0, 0);
    ellipticalGroup.add(flywheel);

    const discGeo = new THREE.TorusGeometry(1.15, 0.04, 16, 60);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    ellipticalGroup.add(disc);

    const frameGeo = new THREE.TorusGeometry(1.8, 0.07, 16, 40, Math.PI * 0.8);
    const frame = new THREE.Mesh(frameGeo, blackMat);
    frame.rotation.z = Math.PI * 0.1;
    ellipticalGroup.add(frame);

    ellipticalGroup.position.set(-20, -1, 0);
    modelsGroup.add(ellipticalGroup);
  }

  // MODELO 4: DESPIECE MECÁNICO (MOTOR 3D)
  function createMotorExplodedModel() {
    motorExplodedGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.2 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const statorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32);
    const stator = new THREE.Mesh(statorGeo, copperMat);
    motorExplodedGroup.add(stator);
    explodedParts.push({ mesh: stator, basePos: new THREE.Vector3(0, 0, 0), dir: new THREE.Vector3(0, 0, 0) });

    const housingGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.5, 32, 1, true);
    const housingL = new THREE.Mesh(housingGeo, metalMat);
    housingL.position.set(0, 1.2, 0);
    motorExplodedGroup.add(housingL);
    explodedParts.push({ mesh: housingL, basePos: new THREE.Vector3(0, 1.2, 0), dir: new THREE.Vector3(0, 1.6, 0) });

    const housingR = new THREE.Mesh(housingGeo, metalMat);
    housingR.position.set(0, -1.2, 0);
    motorExplodedGroup.add(housingR);
    explodedParts.push({ mesh: housingR, basePos: new THREE.Vector3(0, -1.2, 0), dir: new THREE.Vector3(0, -1.6, 0) });

    const bearingGeo = new THREE.TorusGeometry(0.45, 0.1, 16, 32);
    const bearingTop = new THREE.Mesh(bearingGeo, redMat);
    bearingTop.rotation.x = Math.PI / 2;
    bearingTop.position.set(0, 1.9, 0);
    motorExplodedGroup.add(bearingTop);
    explodedParts.push({ mesh: bearingTop, basePos: new THREE.Vector3(0, 1.9, 0), dir: new THREE.Vector3(0, 2.3, 0) });

    const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.2, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    motorExplodedGroup.add(shaft);
    explodedParts.push({ mesh: shaft, basePos: new THREE.Vector3(0, 0, 0), dir: new THREE.Vector3(0, 0, 0) });

    motorExplodedGroup.position.set(0, -25, 0);
    modelsGroup.add(motorExplodedGroup);
  }

  // --------------------------------------------------------------------------
  // LÓGICA DE CONTROL POR SCROLL & EVITACIÓN DE SOLAPAMIENTO CON TEXTO
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

    // Lerp suave
    currentProgress += (targetProgress - currentProgress) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const isDesktop = window.innerWidth >= 992;
    const isMobile = window.innerWidth < 768;

    // CONTROL DE VISIBILIDAD GLOBAL (Desaparece en Opiniones, Contacto y Footer)
    // Progress va de 0 (inicio) a 1 (final). Las opiniones/contacto empiezan ~0.65.
    let globalOpacity = 1;
    if (currentProgress > 0.62) {
      globalOpacity = Math.max(0, 1 - (currentProgress - 0.62) * 5);
    }

    if (canvas) {
      canvas.style.opacity = globalOpacity.toFixed(2);
    }

    // 1. MANCUERNA (Sección Hero: 0 - 0.22)
    if (dumbbellGroup) {
      dumbbellGroup.rotation.y += 0.008;
      dumbbellGroup.rotation.x = 0.3 + mouseY * 0.2;
      dumbbellGroup.rotation.z = mouseX * 0.2;

      // En escritorio se desplaza a la derecha para no tapar el texto
      const posX = isDesktop ? 2.8 : 0;
      const posY = isMobile ? -1.8 : 0;
      
      // Escalado y desvanecimiento al bajar
      const scale = Math.max(0, 1 - currentProgress * 3.5);
      dumbbellGroup.scale.set(scale, scale, scale);
      dumbbellGroup.position.set(posX, posY, -currentProgress * 5);
    }

    // 2. CINTA DE CORRER (Sección Servicios: 0.18 - 0.42)
    if (treadmillGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.15) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.38) * 4));

      const targetX = isDesktop ? 3.0 : 0;
      const targetY = isMobile ? -2.0 : -0.4;

      const inX = (1 - factor) * 15 + targetX;
      const finalX = inX - exitFactor * 15;

      treadmillGroup.position.x += (finalX - treadmillGroup.position.x) * 0.1;
      treadmillGroup.position.y = targetY + Math.sin(Date.now() * 0.0015) * 0.08;
      treadmillGroup.rotation.y = -0.5 + factor * 1.5 + mouseX * 0.2;
    }

    // 3. ELÍPTICA (Sección Marcas / Por Qué Elegirnos: 0.35 - 0.58)
    if (ellipticalGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.32) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.52) * 4));

      const targetX = isDesktop ? -3.2 : 0;
      const inX = (-1 + factor) * -15 + targetX;
      const finalX = inX + exitFactor * 15;

      ellipticalGroup.position.x += (finalX - ellipticalGroup.position.x) * 0.1;
      ellipticalGroup.position.y = -0.4 + Math.cos(Date.now() * 0.0015) * 0.08;
      ellipticalGroup.rotation.y = 0.8 - factor * 1.8 + mouseX * 0.2;
    }

    // 4. DESPIECE DE MOTOR (Sección Diagnóstico: 0.50 - 0.65)
    if (motorExplodedGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.48) * 4));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.62) * 4));

      motorExplodedGroup.position.y = -20 + factor * 20 - exitFactor * 20;
      motorExplodedGroup.rotation.y += 0.008;

      const explodeAmount = Math.sin(factor * Math.PI) * 1.0;
      explodedParts.forEach(part => {
        part.mesh.position.set(
          part.basePos.x + part.dir.x * explodeAmount,
          part.basePos.y + part.dir.y * explodeAmount,
          part.basePos.z + part.dir.z * explodeAmount
        );
      });
    }

    // Render de cámara
    camera.position.x = mouseX * 0.4;
    camera.position.y = -mouseY * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  return {
    init: init,
    setScrollProgress: setScrollProgress
  };
})();
