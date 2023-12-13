// ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
  const sceneRef = useRef();

  useEffect(() => {
    let scene, camera, renderer, cube;

    const init = () => {
      // Inicjalizacja sceny, kamery i renderera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneRef.current.appendChild(renderer.domElement);

      // Dodaję oświetlenie
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Oświetlenie otoczenia
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Kierunkowe światło
      directionalLight.position.set(5, 5, 5);
      scene.add(ambientLight, directionalLight);

      // Dodaję kolorową kostkę z teksturą
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ map: texture });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Ustaw kamerę
      camera.position.z = 5;

      // Dodaję interakcje myszy
      const controls = new OrbitControls(camera, renderer.domElement);

      // Dodaję podłogę
      const floorGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
      const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);

      // Funkcja animacji
      const animate = () => {
        requestAnimationFrame(animate);

        // Obracaj kostkę
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;

        // Renderuj scenę
        renderer.render(scene, camera);
      };

      // Rozpocznij animację
      animate();

      // Event listener do dostosowywania rozmiarów renderera w przypadku zmiany rozmiarów okna
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Czyszczenie event listenerów po odmontowaniu komponentu
      return () => {
        window.removeEventListener('resize', handleResize);
        controls.dispose();
      };
    };

    init();
  }, []);

  return <div ref={sceneRef} style={{ backgroundColor: '#f0f0f0' }}></div>;
};

export default ThreeScene;