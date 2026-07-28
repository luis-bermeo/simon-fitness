/**
 * SIMÓN FITNESS - THREE.JS 3D SCENE & ENGINE
 * Experiencia 3D Scrollytelling interactiva a 60 FPS para móviles y desktop.
 */

window.SimonFitness3D = (function () {
  'use strict';

  let scene, camera, renderer, container;
  let canvas;
  let isLowPerformance = false;

  // Grupos 3D para cada modelo/sección
  const modelsGroup = new THREE.Group();
  let heroRingGroup = new THREE.Group();
  let treadmillGroup = new THREE.Group();
  let ellipticalGroup = new THREE.Group();
  let motorExplodedGroup = new THREE.Group();
  let particlesGroup = new THREE.Group();

  // Piezas despiezadas para animar en la sección de mantenimiento
  const explodedParts = [];

  // Estado del Scroll interpolado (Lerp)
  let targetProgress = 0;
  let currentProgress = 0;
  let targetSection = 0;
  let currentSection = 0;

  // Coordenadas del ratón/touch para interacción sutil
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

    // Configuración de la Escena
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.035);

    // Cámara
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    // Renderizador WebGL
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance',
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Iluminación Cinemática
    setupLighting();

    // Construcción de Objetos 3D
    createParticles();
    createHeroRing();
    createTreadmillModel();
    createEllipticalModel();
    createMotorExplodedModel();

    scene.add(modelsGroup);

    // Eventos
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Loop de renderizado
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Luz principal Blanca/Plata estilo Apple
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    // Luz de Acento Rojo Simón Fitness (#E30613)
    const redPointLight = new THREE.PointLight(0xE30613, 4, 25);
    redPointLight.position.set(-4, -2, 4);
    scene.add(redPointLight);

    // Luz de Relleno Azul/Cyan sutil
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);
  }

  // --------------------------------------------------------------------------
  // CREACIÓN DE MODELOS PROCEDURALES 3D ALTA FIDELIDAD
  // --------------------------------------------------------------------------

  function createParticles() {
    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const redColor = new THREE.Color(0xE30613);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixColor = Math.random() > 0.7 ? redColor : whiteColor;
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particlesGroup = new THREE.Points(geometry, material);
    scene.add(particlesGroup);
  }

  // HERO: Anillo Holográfico SF de Precisión
  function createHeroRing() {
    heroRingGroup = new THREE.Group();

    // Torus principal de metal oscuro
    const torusGeo = new THREE.TorusGeometry(2.5, 0.08, 32, 100);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.9,
      roughness: 0.2
    });
    const ringMesh = new THREE.Mesh(torusGeo, metalMat);
    heroRingGroup.add(ringMesh);

    // Anillo interno brillante Neón Rojo
    const innerRingGeo = new THREE.TorusGeometry(2.2, 0.03, 16, 80);
    const redNeonMat = new THREE.MeshBasicMaterial({
      color: 0xE30613,
      wireframe: true
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, redNeonMat);
    heroRingGroup.add(innerRingMesh);

    // Isotipo central SF estilizado (Cubo central con acento rojo)
    const cubeGeo = new THREE.OctahedronGeometry(0.8, 2);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0xE30613,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x550005
    });
    const coreMesh = new THREE.Mesh(cubeGeo, cubeMat);
    heroRingGroup.add(coreMesh);

    heroRingGroup.position.set(0, 0, 0);
    modelsGroup.add(heroRingGroup);
  }

  // SECCIÓN CINTAS DE CORRER 3D
  function createTreadmillModel() {
    treadmillGroup = new THREE.Group();

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x16161a, metalness: 0.85, roughness: 0.2 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.9, metalness: 0.1 });
    const redAccentMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.5, roughness: 0.3 });

    // Plataforma principal (Deck)
    const deckGeo = new THREE.BoxGeometry(4.2, 0.25, 1.8);
    const deckMesh = new THREE.Mesh(deckGeo, darkMetal);
    treadmillGroup.add(deckMesh);

    // Cinta de tapiz en movimiento
    const beltGeo = new THREE.BoxGeometry(3.6, 0.27, 1.5);
    const beltMesh = new THREE.Mesh(beltGeo, rubberMat);
    treadmillGroup.add(beltMesh);

    // Raíles laterales de aluminio con acento rojo
    const railLGeo = new THREE.BoxGeometry(4.2, 0.1, 0.15);
    const railL = new THREE.Mesh(railLGeo, redAccentMat);
    railL.position.set(0, 0.15, 0.8);
    treadmillGroup.add(railL);

    const railR = new THREE.Mesh(railLGeo, redAccentMat);
    railR.position.set(0, 0.15, -0.8);
    treadmillGroup.add(railR);

    // Postes verticales del manillar
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
    const postL = new THREE.Mesh(postGeo, darkMetal);
    postL.position.set(1.5, 1.1, 0.8);
    postL.rotation.z = -0.25;
    treadmillGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, darkMetal);
    postR.position.set(1.5, 1.1, -0.8);
    postR.rotation.z = -0.25;
    treadmillGroup.add(postR);

    // Consola digital táctil futurista
    const consoleGeo = new THREE.BoxGeometry(0.8, 0.6, 1.6);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkMetal);
    consoleMesh.position.set(1.8, 2.0, 0);
    consoleMesh.rotation.z = -0.2;
    treadmillGroup.add(consoleMesh);

    // Pantalla LED interactiva
    const screenGeo = new THREE.PlaneGeometry(0.5, 1.3);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0xE30613 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(1.79, 2.0, 0);
    screenMesh.rotation.y = -Math.PI / 2;
    screenMesh.rotation.x = 0.2;
    treadmillGroup.add(screenMesh);

    treadmillGroup.position.set(15, -1, 0); // Posición inicial fuera de pantalla
    modelsGroup.add(treadmillGroup);
  }

  // SECCIÓN ELÍPTICAS Y BICICLETAS 3D
  function createEllipticalModel() {
    ellipticalGroup = new THREE.Group();

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.95, roughness: 0.1 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.7, roughness: 0.3 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6, roughness: 0.2 });

    // Rueda de inercia (Flywheel)
    const flywheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chromeMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(-1.2, 0, 0);
    ellipticalGroup.add(flywheel);

    // Disco protector externo de inercia
    const discGeo = new THREE.TorusGeometry(1.25, 0.05, 16, 60);
    const disc = new THREE.Mesh(discGeo, redMat);
    disc.position.copy(flywheel.position);
    ellipticalGroup.add(disc);

    // Chasis principal arqueado
    const frameGeo = new THREE.TorusGeometry(2.0, 0.08, 16, 40, Math.PI * 0.8);
    const frame = new THREE.Mesh(frameGeo, blackMat);
    frame.rotation.z = Math.PI * 0.1;
    ellipticalGroup.add(frame);

    // Pedales
    const pedalGeo = new THREE.BoxGeometry(0.8, 0.1, 0.4);
    const pedalL = new THREE.Mesh(pedalGeo, blackMat);
    pedalL.position.set(-0.5, -0.8, 0.6);
    ellipticalGroup.add(pedalL);

    const pedalR = new THREE.Mesh(pedalGeo, blackMat);
    pedalR.position.set(-1.5, -0.4, -0.6);
    ellipticalGroup.add(pedalR);

    // Brazos de palanca superiores
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16);
    const armL = new THREE.Mesh(armGeo, chromeMat);
    armL.position.set(0.5, 1.2, 0.5);
    armL.rotation.z = -0.15;
    ellipticalGroup.add(armL);

    const armR = new THREE.Mesh(armGeo, chromeMat);
    armR.position.set(0.5, 1.2, -0.5);
    armR.rotation.z = 0.15;
    ellipticalGroup.add(armR);

    ellipticalGroup.position.set(-15, -1, 0);
    modelsGroup.add(ellipticalGroup);
  }

  // SECCIÓN MOTOR / DESPIECE MECÁNICO (Mantenimiento preventivo)
  function createMotorExplodedModel() {
    motorExplodedGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x2a2a35, metalness: 0.9, roughness: 0.2 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const redRingMat = new THREE.MeshStandardMaterial({ color: 0xE30613, metalness: 0.6, roughness: 0.2 });

    // Core central: Estator
    const statorGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.8, 32);
    const stator = new THREE.Mesh(statorGeo, copperMat);
    motorExplodedGroup.add(stator);
    explodedParts.push({ mesh: stator, basePos: new THREE.Vector3(0, 0, 0), dir: new THREE.Vector3(0, 0, 0) });

    // Carcasa externa izquierda
    const housingLGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.6, 32, 1, true);
    const housingL = new THREE.Mesh(housingLGeo, metalMat);
    housingL.position.set(0, 1.4, 0);
    motorExplodedGroup.add(housingL);
    explodedParts.push({ mesh: housingL, basePos: new THREE.Vector3(0, 1.4, 0), dir: new THREE.Vector3(0, 1.8, 0) });

    // Carcasa externa derecha
    const housingR = new THREE.Mesh(housingLGeo, metalMat);
    housingR.position.set(0, -1.4, 0);
    motorExplodedGroup.add(housingR);
    explodedParts.push({ mesh: housingR, basePos: new THREE.Vector3(0, -1.4, 0), dir: new THREE.Vector3(0, -1.8, 0) });

    // Rodamientos / Cojinetes metálicos (Bearings)
    const bearingGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 32);
    const bearingTop = new THREE.Mesh(bearingGeo, redRingMat);
    bearingTop.rotation.x = Math.PI / 2;
    bearingTop.position.set(0, 2.2, 0);
    motorExplodedGroup.add(bearingTop);
    explodedParts.push({ mesh: bearingTop, basePos: new THREE.Vector3(0, 2.2, 0), dir: new THREE.Vector3(0, 2.6, 0) });

    const bearingBottom = new THREE.Mesh(bearingGeo, redRingMat);
    bearingBottom.rotation.x = Math.PI / 2;
    bearingBottom.position.set(0, -2.2, 0);
    motorExplodedGroup.add(bearingBottom);
    explodedParts.push({ mesh: bearingBottom, basePos: new THREE.Vector3(0, -2.2, 0), dir: new THREE.Vector3(0, -2.6, 0) });

    // Eje central de transmisión (Rotor shaft)
    const shaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.0, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    motorExplodedGroup.add(shaft);
    explodedParts.push({ mesh: shaft, basePos: new THREE.Vector3(0, 0, 0), dir: new THREE.Vector3(0, 0, 0) });

    motorExplodedGroup.position.set(0, -20, 0);
    modelsGroup.add(motorExplodedGroup);
  }

  // --------------------------------------------------------------------------
  // INTERPRETACIÓN DEL SCROLL Y ANIMACIÓN DE CÁMARA / ESCENA
  // --------------------------------------------------------------------------

  function setScrollProgress(progress, sectionIndex) {
    targetProgress = progress;
    targetSection = sectionIndex;
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

    // Lerp de progreso de scroll y ratón
    currentProgress += (targetProgress - currentProgress) * 0.08;
    currentSection += (targetSection - currentSection) * 0.08;
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Rotación pasiva de partículas y efectos de fondo
    if (particlesGroup) {
      particlesGroup.rotation.y += 0.001;
      particlesGroup.rotation.x = mouseY * 0.1;
    }

    // TRANSICIONES DE ESCENA VINCULADAS AL SCROLL (Scrollytelling 3D)

    // Sección 0: Hero (Anillo holográfico central)
    if (heroRingGroup) {
      heroRingGroup.rotation.y += 0.01;
      heroRingGroup.rotation.x = mouseY * 0.3;
      heroRingGroup.rotation.z = mouseX * 0.2;

      // Al hacer scroll se aleja y escala suavemente
      const heroScale = Math.max(0.1, 1 - currentProgress * 2.5);
      heroRingGroup.scale.set(heroScale, heroScale, heroScale);
      heroRingGroup.position.z = -currentProgress * 8;
    }

    // Sección 1 & 2: Cintas de Correr (Aparece girando desde la derecha)
    if (treadmillGroup) {
      const treadmillFactor = Math.max(0, Math.min(1, (currentProgress - 0.15) * 4));
      const targetX = (1 - treadmillFactor) * 12 + (window.innerWidth < 768 ? 0 : 2.5);
      treadmillGroup.position.x += (targetX - treadmillGroup.position.x) * 0.1;
      treadmillGroup.position.y = -0.5 + Math.sin(Date.now() * 0.0015) * 0.1;
      treadmillGroup.rotation.y = -0.6 + treadmillFactor * 1.8 + mouseX * 0.2;
      treadmillGroup.rotation.x = 0.2 + mouseY * 0.1;
    }

    // Sección 3: Elípticas y Bicicletas (Entra desde la izquierda)
    if (ellipticalGroup) {
      const ellipticalFactor = Math.max(0, Math.min(1, (currentProgress - 0.35) * 4));
      const targetX = (-1 + ellipticalFactor) * -12 - (window.innerWidth < 768 ? 0 : 2.5);
      ellipticalGroup.position.x += (targetX - ellipticalGroup.position.x) * 0.1;
      ellipticalGroup.position.y = -0.4 + Math.cos(Date.now() * 0.0015) * 0.1;
      ellipticalGroup.rotation.y = 0.8 - ellipticalFactor * 2.0 + mouseX * 0.2;
    }

    // Sección 4: Motor & Despiece Mecánico (Exploded View en mantenimiento)
    if (motorExplodedGroup) {
      const motorFactor = Math.max(0, Math.min(1, (currentProgress - 0.6) * 3));
      motorExplodedGroup.position.y = -15 + motorFactor * 15;
      motorExplodedGroup.rotation.y += 0.008;
      motorExplodedGroup.rotation.z = Math.PI / 4;

      // Efecto Exploded View (Las piezas se desensamblan según el scroll)
      const explodeAmount = Math.sin(motorFactor * Math.PI) * 1.2;
      explodedParts.forEach(part => {
        part.mesh.position.set(
          part.basePos.x + part.dir.x * explodeAmount,
          part.basePos.y + part.dir.y * explodeAmount,
          part.basePos.z + part.dir.z * explodeAmount
        );
      });
    }

    // Control de cámara sutil según ratón
    camera.position.x = mouseX * 0.5;
    camera.position.y = -mouseY * 0.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  return {
    init: init,
    setScrollProgress: setScrollProgress
  };
})();
