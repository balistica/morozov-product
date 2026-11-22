/* ==========================================================================
   DENIS MOROZOV — KINETIC 3D ENGINE & INTERACTION CONTROLLER
   ========================================================================== */
(function () {
  // 1. Preloader Counter & Curtain Reveal
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('loader-counter');
  const fillEl = document.getElementById('loader-fill');
  if (preloader && counterEl && fillEl) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 14) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        counterEl.textContent = '100%';
        fillEl.style.width = '100%';
        setTimeout(() => preloader.classList.add('loaded'), 320);
      } else {
        counterEl.textContent = String(progress).padStart(2, '0') + '%';
        fillEl.style.width = progress + '%';
      }
    }, 35);
  }

  // 2. Magnetic Custom Luxury Cursor
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (dot && ring) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    document.querySelectorAll('a, button, input, .magnetic-target').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hovered');
        const label = el.getAttribute('data-cursor');
        ring.textContent = label || '';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hovered');
        ring.textContent = '';
      });
    });
  }

  // 3. Magnetic Buttons
  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.24}px, ${y * 0.24}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // 4. Spatial 3D Card Tilt + Gold Glare Spotlight
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 5. Intersection Observer Scroll Reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));

  // 6. Interactive Product Engineer Design Token & Physics Lab
  const radiusSlider = document.getElementById('sim-radius');
  const blurSlider = document.getElementById('sim-blur');
  const elevationSlider = document.getElementById('sim-elevation');
  const previewCard = document.getElementById('live-token-card');
  const codeReadout = document.getElementById('token-code-readout');

  function updateLab() {
    if (!radiusSlider || !blurSlider || !elevationSlider || !previewCard) return;
    const r = radiusSlider.value;
    const b = blurSlider.value;
    const el = elevationSlider.value;

    document.getElementById('val-radius').textContent = r + 'px';
    document.getElementById('val-blur').textContent = b + 'px';
    document.getElementById('val-elevation').textContent = el + 'dp';

    previewCard.style.borderRadius = r + 'px';
    previewCard.style.backdropFilter = `blur(${b}px)`;
    previewCard.style.transform = `translateY(${-el * 0.25}px) scale(${1 + el * 0.0012})`;
    previewCard.style.boxShadow = `0 ${el * 1.4}px ${el * 3.2}px rgba(212, 175, 106, ${0.08 + el * 0.004})`;

    if (codeReadout) {
      codeReadout.innerHTML =
        `--surface-radius: ${r}px;<br>` +
        `--glass-refraction: blur(${b}px);<br>` +
        `--z-elevation-spring: ${el}dp; // 60fps GPU composited`;
    }
  }

  [radiusSlider, blurSlider, elevationSlider].forEach((s) => {
    if (s) s.addEventListener('input', updateLab);
  });
  updateLab();

  // 7. Three.js Procedural Marble & Gold Kinetic Sculpture
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Sculptural Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Outer Champagne Gold Architectural Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.75, 0.42, 220, 36, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af6a,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      wireframe: false
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    sculptureGroup.add(knotMesh);

    // Inner Obsidian Marble Wireframe Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(2.65, 2);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0xf3d99b,
      wireframe: true,
      transparent: true,
      opacity: 0.11
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    sculptureGroup.add(latticeMesh);

    // Floating Gold Dust Particles
    const particlesCount = 420;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.028,
      color: 0xf3d99b,
      transparent: true,
      opacity: 0.65
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Dramatic Luxury Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xfff0d4, 2.6, 25);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xd4af6a, 2.2, 25);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const emeraldRim = new THREE.PointLight(0x3ce8b5, 0.9, 20);
    emeraldRim.position.set(0, -6, -3);
    scene.add(emeraldRim);

    // Position sculpture elegantly to the right on desktop
    const updatePosition = () => {
      if (window.innerWidth > 900) {
        sculptureGroup.position.x = 2.35;
      } else {
        sculptureGroup.position.x = 0;
        sculptureGroup.position.y = 0.6;
      }
    };
    updatePosition();

    let targetRotX = 0;
    let targetRotY = 0;
    let scrollY = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.65;
      targetRotX = ny * 0.45;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updatePosition();
    });

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      knotMesh.rotation.y = elapsed * 0.22 + targetRotY;
      knotMesh.rotation.x = elapsed * 0.14 + targetRotX + scrollY * 0.0012;
      latticeMesh.rotation.y = -elapsed * 0.08;
      latticeMesh.rotation.z = elapsed * 0.05;
      particlesMesh.rotation.y = elapsed * 0.03;

      // Subtle breathing scale
      const scale = 1 + Math.sin(elapsed * 1.4) * 0.03;
      knotMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Dynamic Year
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
