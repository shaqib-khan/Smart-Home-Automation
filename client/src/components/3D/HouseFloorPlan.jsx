import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Box, RotateCcw, Lightbulb, Thermometer, ShieldAlert, Tv, Wind, Fan, DoorClosed, Sparkles, Eye, EyeOff } from 'lucide-react';
import * as THREE from 'three';

export const HouseFloorPlan = () => {
  const mountRef = useRef(null);
  const { devices, rooms, toggleDevice } = useApp();
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [showOverlayCard, setShowOverlayCard] = useState(true);
  
  const sceneRef = useRef(null);
  const lightsRef = useRef({});
  const tvScreenMatRef = useRef(null);
  const fanBladesRef = useRef(null);
  const fanSpeedRef = useRef(0);
  const acGlowRef = useRef(null);
  const garageDoorRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera Setup
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 20, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(20, 30, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 3. Grid & Base Slab
    const gridHelper = new THREE.GridHelper(32, 32, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    const baseGeo = new THREE.BoxGeometry(24, 0.4, 20);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x0b1120, opacity: 0.95, transparent: true });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    // Helper: Walls
    const wallMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.7,
      shininess: 80
    });

    const createWall = (x, z, w, d, h = 2.2) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      scene.add(mesh);
    };

    // Outer & Partition Walls
    createWall(0, -9.9, 23.8, 0.3); // Back
    createWall(-11.8, 0, 0.3, 19.8); // Left
    createWall(11.8, 0, 0.3, 19.8); // Right
    createWall(-4, 9.9, 15.8, 0.3); // Front left
    createWall(0, -1, 0.3, 17); // Center divider
    createWall(-6, 2, 11, 0.3); // Living Room / Kitchen divide
    createWall(6, -2, 11, 0.3); // Bedroom / Bathroom divide

    // 4. Room Floors & Ceiling PointLights
    const roomConfigs = [
      { name: 'Living Room', x: -6, z: -5, w: 11, d: 9, color: 0x0284c7, lightColor: 0xffea9f },
      { name: 'Kitchen', x: -6, z: 5, w: 11, d: 9, color: 0x0d9488, lightColor: 0xffffff },
      { name: 'Bedroom', x: 6, z: -6, w: 11, d: 7, color: 0x7c3aed, lightColor: 0x38bdf8 },
      { name: 'Bathroom', x: 6, z: 0.5, w: 11, d: 5, color: 0x2563eb, lightColor: 0x60a5fa },
      { name: 'Garage', x: 6, z: 6, w: 11, d: 6, color: 0x475569, lightColor: 0xf59e0b }
    ];

    const clickableMeshes = [];

    roomConfigs.forEach(rc => {
      const tileGeo = new THREE.BoxGeometry(rc.w - 0.2, 0.1, rc.d - 0.2);
      const tileMat = new THREE.MeshPhongMaterial({ color: rc.color, opacity: 0.35, transparent: true });
      const tileMesh = new THREE.Mesh(tileGeo, tileMat);
      tileMesh.position.set(rc.x, 0.05, rc.z);
      scene.add(tileMesh);

      // Room Ceiling PointLight
      const pLight = new THREE.PointLight(rc.lightColor, 0, 14);
      pLight.position.set(rc.x, 3.8, rc.z);
      pLight.castShadow = true;
      scene.add(pLight);
      lightsRef.current[rc.name] = pLight;

      // Bulb Marker
      const bulbGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const bulbMat = new THREE.MeshBasicMaterial({ color: rc.lightColor });
      const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
      bulbMesh.position.set(rc.x, 3.8, rc.z);
      bulbMesh.userData = { deviceName: `${rc.name} Light` };
      scene.add(bulbMesh);
      clickableMeshes.push(bulbMesh);
    });

    // 5. Smart Appliances Detailed 3D Models

    // A. SMART TV in Living Room
    const tvFrameGeo = new THREE.BoxGeometry(4, 2.3, 0.2);
    const tvFrameMat = new THREE.MeshPhongMaterial({ color: 0x0f172a });
    const tvFrameMesh = new THREE.Mesh(tvFrameGeo, tvFrameMat);
    tvFrameMesh.position.set(-6, 2.2, -9.3);
    scene.add(tvFrameMesh);

    const tvScreenGeo = new THREE.PlaneGeometry(3.8, 2.1);
    const tvScreenMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const tvScreenMesh = new THREE.Mesh(tvScreenGeo, tvScreenMat);
    tvScreenMesh.position.set(-6, 2.2, -9.18);
    tvScreenMesh.userData = { deviceName: 'Smart TV' };
    scene.add(tvScreenMesh);
    tvScreenMatRef.current = tvScreenMat;
    clickableMeshes.push(tvScreenMesh);

    // B. REALISTIC IRL CEILING FAN in Living Room
    const fanAssemblyGroup = new THREE.Group();
    fanAssemblyGroup.position.set(-6, 3.8, -4); // Ceiling height

    // Metallic material for fan canopy and motor housing
    const fanMetalMat = new THREE.MeshPhongMaterial({ color: 0x1e293b, shininess: 90 });
    const fanAccentMat = new THREE.MeshPhongMaterial({ color: 0x0284c7, shininess: 100 });
    const fanBladeMat = new THREE.MeshPhongMaterial({ color: 0x0f172a, shininess: 60 });

    // 1. Ceiling Mount Canopy
    const canopyGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.22, 24);
    const canopyMesh = new THREE.Mesh(canopyGeo, fanMetalMat);
    canopyMesh.position.y = -0.11;
    fanAssemblyGroup.add(canopyMesh);

    // 2. Downrod
    const downrodGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.65, 16);
    const downrodMesh = new THREE.Mesh(downrodGeo, fanMetalMat);
    downrodMesh.position.y = -0.45;
    fanAssemblyGroup.add(downrodMesh);

    // 3. Motor Housing Body
    const motorGeo = new THREE.CylinderGeometry(0.65, 0.6, 0.3, 32);
    const motorMesh = new THREE.Mesh(motorGeo, fanMetalMat);
    motorMesh.position.y = -0.85;
    fanAssemblyGroup.add(motorMesh);

    // Accent Metallic Trim Ring
    const trimRingGeo = new THREE.TorusGeometry(0.66, 0.03, 16, 32);
    const trimRingMesh = new THREE.Mesh(trimRingGeo, fanAccentMat);
    trimRingMesh.rotation.x = Math.PI / 2;
    trimRingMesh.position.y = -0.85;
    fanAssemblyGroup.add(trimRingMesh);

    // Center Light Globe Dome
    const domeGeo = new THREE.SphereGeometry(0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.rotation.x = Math.PI; // Facing downward
    domeMesh.position.y = -1.0;
    fanAssemblyGroup.add(domeMesh);

    // 4. Rotating Blades Group (5 Aerodynamic Blades with Pitch Angle)
    const fanGroup = new THREE.Group();
    fanGroup.position.y = -0.88;

    const bladeCount = 5;
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i * Math.PI * 2) / bladeCount;
      const armGroup = new THREE.Group();
      armGroup.rotation.y = angle;

      // Metallic Bracket Arm
      const bracketGeo = new THREE.BoxGeometry(0.5, 0.04, 0.1);
      const bracketMesh = new THREE.Mesh(bracketGeo, fanAccentMat);
      bracketMesh.position.x = 0.55;
      armGroup.add(bracketMesh);

      // Tapered Aerodynamic Blade with 12-degree Pitch Angle
      const bladeGeo = new THREE.BoxGeometry(1.7, 0.03, 0.32);
      const bladeMesh = new THREE.Mesh(bladeGeo, fanBladeMat);
      bladeMesh.position.x = 1.5;
      bladeMesh.rotation.z = 0.22; // Aerodynamic pitch angle tilt (~12.5 deg)
      armGroup.add(bladeMesh);

      fanGroup.add(armGroup);
    }

    fanGroup.userData = { deviceName: 'Ceiling Fan' };
    fanAssemblyGroup.add(fanGroup);
    scene.add(fanAssemblyGroup);

    fanBladesRef.current = fanGroup;
    clickableMeshes.push(fanGroup);

    // C. AIR CONDITIONER in Bedroom
    const acGeo = new THREE.BoxGeometry(2.5, 0.8, 0.6);
    const acMat = new THREE.MeshPhongMaterial({ color: 0xf8fafc });
    const acMesh = new THREE.Mesh(acGeo, acMat);
    acMesh.position.set(6, 3, -9.2);
    scene.add(acMesh);

    const acGlowGeo = new THREE.PlaneGeometry(2.2, 0.15);
    const acGlowMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const acGlowMesh = new THREE.Mesh(acGlowGeo, acGlowMat);
    acGlowMesh.position.set(6, 2.7, -8.88);
    acGlowMesh.userData = { deviceName: 'Air Conditioner' };
    scene.add(acGlowMesh);
    acGlowRef.current = acGlowMat;
    clickableMeshes.push(acGlowMesh);

    // D. GARAGE DOOR
    const gDoorGeo = new THREE.BoxGeometry(6.5, 2.8, 0.2);
    const gDoorMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, opacity: 0.85, transparent: true });
    const gDoorMesh = new THREE.Mesh(gDoorGeo, gDoorMat);
    gDoorMesh.position.set(6, 1.4, 8.9);
    gDoorMesh.userData = { deviceName: 'Garage Door' };
    scene.add(gDoorMesh);
    garageDoorRef.current = gDoorMesh;
    clickableMeshes.push(gDoorMesh);

    // 6. Mouse Interaction & Raycasting for 3D Device Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let mouseDownPos = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = false;
      mouseDownPos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (Math.abs(e.clientX - mouseDownPos.x) > 5 || Math.abs(e.clientY - mouseDownPos.y) > 5) {
        isDragging = true;
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshes, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData?.deviceName && obj.parent) {
          obj = obj.parent;
        }

        if (obj && obj.userData?.deviceName) {
          const targetDevName = obj.userData.deviceName;
          const dev = devices.find(d => d.name.toLowerCase().includes(targetDevName.toLowerCase()));
          if (dev) {
            toggleDevice(dev._id);
          }
        }
      }
    };

    // Orbit Drag Controls (Mouse & Mobile Touch)
    let previousMousePosition = { x: 0, y: 0 };
    let isOrbiting = false;

    const handleOrbitDown = (e) => {
      isOrbiting = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleOrbitMove = (e) => {
      if (!isOrbiting) return;
      const deltaX = e.clientX - previousMousePosition.x;

      const rotationSpeed = 0.005;
      camera.position.x = camera.position.x * Math.cos(deltaX * rotationSpeed) + camera.position.z * Math.sin(deltaX * rotationSpeed);
      camera.position.z = camera.position.z * Math.cos(deltaX * rotationSpeed) - camera.position.x * Math.sin(deltaX * rotationSpeed);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleOrbitUp = () => { isOrbiting = false; };

    // Mobile Touch Orbit Controls
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isOrbiting = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isOrbiting || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const rotationSpeed = 0.006;
      camera.position.x = camera.position.x * Math.cos(deltaX * rotationSpeed) + camera.position.z * Math.sin(deltaX * rotationSpeed);
      camera.position.z = camera.position.z * Math.cos(deltaX * rotationSpeed) - camera.position.x * Math.sin(deltaX * rotationSpeed);
      camera.lookAt(0, 0, 0);
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => { isOrbiting = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    domEl.addEventListener('mousedown', handleOrbitDown);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    domEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    domEl.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleOrbitMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseup', handleOrbitUp);

    // 7. Render Animation Loop with Dynamic 3D Fan Rotation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate fan blades with smooth physics momentum
      const fanDev = devices.find(d => d.name.includes('Fan'));
      if (fanBladesRef.current) {
        if (fanDev && fanDev.state) {
          fanSpeedRef.current = Math.min(fanSpeedRef.current + 0.008, 0.18);
        } else {
          fanSpeedRef.current = Math.max(fanSpeedRef.current - 0.004, 0);
        }
        if (fanSpeedRef.current > 0) {
          fanBladesRef.current.rotation.y += fanSpeedRef.current;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleWindowResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleWindowResize);
      domEl.removeEventListener('mousedown', handleMouseDown);
      domEl.removeEventListener('mousedown', handleOrbitDown);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      domEl.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleOrbitMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseup', handleOrbitUp);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Real-Time Device States to 3D Villa Materials
  useEffect(() => {
    if (!lightsRef.current) return;

    // A. Room Lights
    const roomLightsMap = [
      { room: 'Living Room', deviceName: 'Living Room Light' },
      { room: 'Bedroom', deviceName: 'Bedroom Light' },
      { room: 'Kitchen', deviceName: 'Kitchen Light' }
    ];

    roomLightsMap.forEach(rl => {
      const dev = devices.find(d => d.name === rl.deviceName);
      if (lightsRef.current[rl.room]) {
        lightsRef.current[rl.room].intensity = (dev && dev.state) ? 2.8 : 0.2;
      }
    });

    // B. Smart TV Screen Glow
    const tvDev = devices.find(d => d.name.includes('Smart TV'));
    if (tvScreenMatRef.current) {
      if (tvDev && tvDev.state) {
        tvScreenMatRef.current.color.setHex(0x38bdf8); // Bright Cyan Movie Display Glow!
      } else {
        tvScreenMatRef.current.color.setHex(0x090d16); // Dark OFF Screen
      }
    }

    // C. Air Conditioner Indicator
    const acDev = devices.find(d => d.name.includes('Air Conditioner'));
    if (acGlowRef.current) {
      if (acDev && acDev.state) {
        acGlowRef.current.color.setHex(0x06b6d4); // Cool Blue Breeze LED
      } else {
        acGlowRef.current.color.setHex(0x090d16);
      }
    }

    // D. Garage Door Position
    const gDoorDev = devices.find(d => d.name.includes('Garage Door'));
    if (garageDoorRef.current && gDoorDev) {
      garageDoorRef.current.position.y = gDoorDev.state ? 3.4 : 1.4; // Open / Closed
    }
  }, [devices]);

  const activeRoomData = rooms.find(r => r.name === selectedRoom) || { temperature: 24, humidity: 50, status: 'Optimal' };
  const roomDevices = devices.filter(d => d.room === selectedRoom);

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="glass-panel p-4 sm:p-6 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-lg sm:text-xl font-extrabold text-cyan-400 flex items-center gap-2.5 sm:gap-3">
            <Box className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            3D Interactive Villa Floor Plan
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Click directly on 3D TV, Bulbs, Fans, or Garage Door to toggle state in 3D WebGL space!
          </p>
        </div>

        {/* Room Switcher Tabs - Horizontally scrollable on small mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 max-w-full overflow-x-auto whitespace-nowrap">
          {['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Garage'].map(rm => (
            <button
              key={rm}
              onClick={() => setSelectedRoom(rm)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedRoom === rm
                  ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {rm}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport + Interactive Overlay */}
      <div className="relative glass-panel rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl min-h-[420px] sm:min-h-[500px]">
        <div ref={mountRef} className="w-full h-[420px] sm:h-[500px] lg:h-[560px] cursor-grab active:cursor-grabbing" />

        {/* Floating Telemetry Badges */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-cyan-500/40 text-xs space-y-1.5 sm:space-y-2 shadow-xl max-w-[200px] sm:max-w-none pointer-events-none">
          <div className="text-[10px] uppercase font-black text-cyan-400 hud-title flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live 3D Spatial Mesh
          </div>
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-[11px] sm:text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
            <span>Click 3D Objects / Drag to Rotate</span>
          </div>
        </div>

        {/* Overlay Toggle Button */}
        <button
          onClick={() => setShowOverlayCard(!showOverlayCard)}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[11px] font-bold text-cyan-300 shadow-xl hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 z-10"
        >
          {showOverlayCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">{showOverlayCard ? 'Hide Panel' : 'Show Panel'}</span>
        </button>

        {/* Floating Room Overlay Card for Desktop/Tablet */}
        {showOverlayCard && (
          <div className="hidden sm:block absolute bottom-5 right-5 w-80 glass-panel p-5 border border-cyan-500/40 shadow-2xl animate-in fade-in z-10">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60 mb-2.5">
              <h4 className="hud-title text-sm font-black text-cyan-300">{selectedRoom}</h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {activeRoomData.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp
                </div>
                <div className="text-base font-black text-amber-300 mt-0.5">{activeRoomData.temperature}°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> Humidity
                </div>
                <div className="text-base font-black text-cyan-300 mt-0.5">{activeRoomData.humidity}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400 hud-title">Room Appliances</div>
              {roomDevices.map(d => (
                <div key={d._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-200 truncate pr-2 text-xs">{d.name}</span>
                  <button
                    onClick={() => toggleDevice(d._id)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all flex-shrink-0 ${
                      d.state ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {d.state ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Telemetry Panel (Rendered Below 3D Viewport to keep 3D Model 100% Unobstructed) */}
      {showOverlayCard && (
        <div className="sm:hidden glass-panel p-4 border border-cyan-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <h4 className="hud-title text-xs font-black text-cyan-300">{selectedRoom} Controls</h4>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {activeRoomData.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                <Thermometer className="w-3 h-3 text-amber-400" /> Temp
              </div>
              <div className="text-sm font-black text-amber-300 mt-0.5">{activeRoomData.temperature}°C</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                <Lightbulb className="w-3 h-3 text-cyan-400" /> Humidity
              </div>
              <div className="text-sm font-black text-cyan-300 mt-0.5">{activeRoomData.humidity}%</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[9px] font-black uppercase text-slate-400 hud-title">Room Appliances</div>
            {roomDevices.map(d => (
              <div key={d._id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-200 truncate pr-2 text-xs">{d.name}</span>
                <button
                  onClick={() => toggleDevice(d._id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex-shrink-0 ${
                    d.state ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {d.state ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
