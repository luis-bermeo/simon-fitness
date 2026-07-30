/**
 * SIMÓN FITNESS - THREE.JS 3D SCENE ENGINE (v2.3 Responsive Camera & Responsive 3D)
 * Control de breakpoints (Mobile <768px, Tablet <1024px, Desktop >1024px)
 * Cero recortes en móvil y desvanecimiento total en secciones con tarjetas.
 */

window.SimonFitness3D = (function () {
  'use strict';

  let scene, camera, renderer;
  let canvas;
  let resizeObserver;

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

    scene = new THREE.Scene();

    // Cámara Perspectiva con ajuste FOV según Aspect
    const aspect = window.innerWidth / window.innerHeight;
    const initialFov = aspect < 1 ? Math.min(65, 45 / aspect) : 45;

    camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Renderizador WebGL
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    setupStudioLighting();

    // Modelos 3D
    createParticles();
    createDumbbellModel();      // Hero: Mancuerna Metálica
    createTreadmillModel();     // Servicio 1: Cinta de Correr
    createExerciseBikeModel();  // Servicio 2: Bicicleta Estática
    createGearsModel();         // Servicio 3: Engranajes

    scene.add(modelsGroup);

    // Listeners y ResizeObserver
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    setupResizeObserver();

    // Render Loop
    animate();
  }

  // Configuración de Breakpoints Responsivos Dinámicos
  function getResponsiveSettings() {
    const w = window.innerWidth;
    if (w < 768) {
      // Móviles: Objeto Centrado, escala al 48% para evitar recortes
      return { x: 0, y: -0.6, scale: 0.48, isMobile: true, isTablet: false };
    } else if (w < 1024) {
      // Tablet: Ligeramente desplazado a la derecha, escala al 72%
      return { x: 1.6, y: -0.2, scale: 0.72, isMobile: false, isTablet: true };
    } else {
      // Desktop (> 1024px): Columna Derecha (x: 2.5), escala 100%
      return { x: 2.5, y: 0, scale: 1.0, isMobile: false, isTablet: false };
    }
  }

  function setupStudioLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
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
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xE30613,
      transparent: true,
      opacity: 0.45,
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
    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    // Discos Izquierdos
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.05 - i * 0.09, 1.05 - i * 0.09, 0.22, 6);
      const plate = new THREE.Mesh(plateGeo, ironMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = -0.85 - i * 0.26;
      dumbbellGroup.add(plate);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.07, 0.03, 16, 32);
        const ring = new THREE.Mesh(ringGeo, redMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = -0.72;
        dumbbellGroup.add(ring);
      }
    }

    // Discos Derechos
    for (let i = 0; i < 3; i++) {
      const plateGeo = new THREE.CylinderGeometry(1.05 - i * 0.09, 1.05 - i * 0.09, 0.22, 6);
      const plate = new THREE.Mesh(plateGeo, ironMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = 0.85 + i * 0.26;
      dumbbellGroup.add(plate);

      if (i === 0) {
        const ringGeo = new THREE.TorusGeometry(1.07, 0.03, 16, 32);
        const ring = new THREE.Mesh(ringGeo, redMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = 0.72;
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

    treadmillGroup.position.set(20, 0, 0);
    modelsGroup.add(treadmillGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 3: BICICLETA ESTÁTICA 3D (SERVICIO 2)
  // --------------------------------------------------------------------------
  function createExerciseBikeModel() {
    exerciseBikeGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.85, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7 });

    const flywheelGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.16, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(1.0, 0, 0);
    exerciseBikeGroup.add(flywheel);

    const discGeo = new THREE.TorusGeometry(1.02, 0.035, 16, 48);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    exerciseBikeGroup.add(disc);

    const frameGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.2, 16);
    const mainTube = new THREE.Mesh(frameGeo, blackMat);
    mainTube.rotation.z = -0.6;
    mainTube.position.set(0.15, 0.4, 0);
    exerciseBikeGroup.add(mainTube);

    const seatPostGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 16);
    const seatPost = new THREE.Mesh(seatPostGeo, chromeMat);
    seatPost.position.set(-0.5, 1.0, 0);
    exerciseBikeGroup.add(seatPost);

    const seatGeo = new THREE.BoxGeometry(0.5, 0.1, 0.3);
    const seat = new THREE.Mesh(seatGeo, blackMat);
    seat.position.set(-0.5, 1.7, 0);
    exerciseBikeGroup.add(seat);

    const handleBarGeo = new THREE.TorusGeometry(0.35, 0.035, 16, 32, Math.PI);
    const handleBar = new THREE.Mesh(handleBarGeo, redMat);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(0.75, 1.6, 0);
    exerciseBikeGroup.add(handleBar);

    exerciseBikeGroup.position.set(-20, 0, 0);
    modelsGroup.add(exerciseBikeGroup);
  }

  // --------------------------------------------------------------------------
  // MODELO 4: ENGRANAJES 3D (SERVICIO 3 - MANTENIMIENTO)
  // --------------------------------------------------------------------------
  function createGearsModel() {
    gearsGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.7, roughness: 0.2 });

    const gearGeo1 = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 12);
    const gear1 = new THREE.Mesh(gearGeo1, metalMat);
    gearsGroup.add(gear1);

    const gearGeo2 = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 8);
    const gear2 = new THREE.Mesh(gearGeo2, redMat);
    gear2.position.set(1.4, 0.7, 0);
    gearsGroup.add(gear2);

    gearsGroup.position.set(0, -20, 0);
    modelsGroup.add(gearsGroup);
  }

  // --------------------------------------------------------------------------
  // LÓGICA DE CONTROL DE SCROLL & RESIZE DE CÁMARA
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
    // Ajustar FOV si la pantalla es muy estrecha/vertical (iPhone / Android)
    if (aspect < 1) {
      camera.fov = Math.min(65, Math.max(45, 45 / aspect));
    } else {
      camera.fov = 45;
    }
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && canvas) {
      resizeObserver = new ResizeObserver(() => {
        onWindowResize();
      });
      resizeObserver.observe(canvas.parentElement || document.body);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    currentProgress += (targetProgress - currentProgress) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const config = getResponsiveSettings();

    // GESTIÓN DE VISIBILIDAD & FADE-OUT COMPLETO AL LLEGAR A TARJETAS/CONTACTO
    // Cuando el scroll pasa del 45% (secciones de opiniones/contacto/nosotros), la opacidad cae a 0.
    let globalOpacity = 1;
    if (currentProgress > 0.42) {
      globalOpacity = Math.max(0, 1 - (currentProgress - 0.42) * 8);
    }

    if (canvas) {
      canvas.style.opacity = globalOpacity.toFixed(2);
      canvas.style.pointerEvents = 'none';
    }

    // 1. HERO (Mancuerna)
    if (dumbbellGroup) {
      dumbbellGroup.rotation.y += 0.01;
      dumbbellGroup.rotation.x = 0.2 + mouseY * 0.2;

      const scale = Math.max(0, config.scale - currentProgress * 2.8);
      dumbbellGroup.scale.set(scale, scale, scale);
      
      // Si progress es mayor de 0.35, desplazar fuera de pantalla
      const hideOffsetY = currentProgress > 0.35 ? -30 : 0;
      dumbbellGroup.position.set(config.x, config.y + hideOffsetY, 0);
    }

    // 2. CINTA DE CORRER (Servicio 1)
    if (treadmillGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.12) * 5));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.30) * 5));

      const inX = (1 - factor) * 15 + config.x;
      const finalX = inX - exitFactor * 15;
      const scale = Math.max(0, config.scale - exitFactor * config.scale);

      treadmillGroup.scale.set(scale, scale, scale);
      treadmillGroup.position.x += (finalX - treadmillGroup.position.x) * 0.1;
      treadmillGroup.position.y = config.y;
      treadmillGroup.rotation.y = -0.5 + factor * 1.5 + mouseX * 0.2;
    }

    // 3. BICICLETA ESTÁTICA (Servicio 2)
    if (exerciseBikeGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.25) * 5));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.40) * 5));

      const inX = (1 - factor) * 15 + config.x;
      const finalX = inX - exitFactor * 15;
      const scale = Math.max(0, config.scale - exitFactor * config.scale);

      exerciseBikeGroup.scale.set(scale, scale, scale);
      exerciseBikeGroup.position.x += (finalX - exerciseBikeGroup.position.x) * 0.1;
      exerciseBikeGroup.position.y = config.y;
      exerciseBikeGroup.rotation.y = 0.5 - factor * 1.5 + mouseX * 0.2;
    }

    // 4. ENGRANAJES (Servicio 3)
    if (gearsGroup) {
      const factor = Math.max(0, Math.min(1, (currentProgress - 0.36) * 6));
      const exitFactor = Math.max(0, Math.min(1, (currentProgress - 0.45) * 6));

      const scale = Math.max(0, (config.scale * 0.9) - exitFactor * config.scale);
      gearsGroup.scale.set(scale, scale, scale);
      gearsGroup.position.x = config.x;
      gearsGroup.position.y = -15 + factor * 15 - exitFactor * 15;
      gearsGroup.rotation.z += 0.01;
    }

    camera.position.x = mouseX * 0.25;
    camera.position.y = -mouseY * 0.25;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  return {
    init: init,
    setScrollProgress: setScrollProgress
  };
})();
