"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import { selectLight } from "@/store/stageSlice";
import { RootState } from "@/store/store";
import { Light } from "@/store/types";
import { loadGLBModel, disposeModel } from "@/lib/glb-loader";

interface Stage3DSceneProps {
  onLightSelected?: (lightId: string | null) => void;
}

export default function Stage3DScene({ onLightSelected }: Stage3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lightsMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const selectedLightHelperRef = useRef<THREE.SpotLightHelper | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const draggedObjectRef = useRef<THREE.Object3D | null>(null);
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragPointRef = useRef(new THREE.Vector3());
  
  // Camera control refs
  const isPanningRef = useRef(false);
  const isOrbitingRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraDistanceRef = useRef(15);
  const cameraPolarRef = useRef(Math.PI / 4);   
  const cameraAzimuthRef = useRef(Math.PI / 4);
  
  // Track if scene is initialized
  const isInitializedRef = useRef(false);
  const animationIdRef = useRef<number>(0);
  const templateModelRef = useRef<THREE.Group | null>(null);
  const stageMeshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.LineSegments | null>(null);
  const axesHelperRef = useRef<THREE.LineSegments | null>(null);
  
  // Template rotation refs
  const templateRotationRef = useRef({ x: 0, y: 0 });

  const dispatch = useDispatch();
  const stage = useSelector((state: RootState) => {
    const stageId = state.stage.currentStageId;
    return state.stage.stages.find((s) => s.id === stageId);
  });
  const selectedLightId = useSelector(
    (state: RootState) => state.stage.selectedLightId
  );

  // Helper function to update camera position
  const updateCameraPosition = (camera: THREE.PerspectiveCamera) => {
    const x = cameraDistanceRef.current * Math.sin(cameraPolarRef.current) * Math.cos(cameraAzimuthRef.current);
    const y = cameraDistanceRef.current * Math.cos(cameraPolarRef.current) + 3;
    const z = cameraDistanceRef.current * Math.sin(cameraPolarRef.current) * Math.sin(cameraAzimuthRef.current);
    
    camera.position.set(
      cameraTargetRef.current.x + x,
      cameraTargetRef.current.y + y,
      cameraTargetRef.current.z + z
    );
    camera.lookAt(cameraTargetRef.current);
  };

  useEffect(() => {
    if (!containerRef.current || !stage || isInitializedRef.current) return;
    
    isInitializedRef.current = true;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(stage.backgroundColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraDistanceRef.current = Math.max(stage.width, stage.depth) * 2;
    updateCameraPosition(camera);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(stage.width * 3, stage.depth * 3);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: stage.groundColor,
      roughness: 0.7,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Stage platform
    const stageGeometry = new THREE.BoxGeometry(
      stage.width,
      0.2,
      stage.depth
    );
    const stageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.3,
      roughness: 0.4,
    });
    const stageMesh = new THREE.Mesh(stageGeometry, stageMaterial);
    stageMesh.position.y = 0.1;
    stageMesh.castShadow = true;
    stageMesh.receiveShadow = true;
    scene.add(stageMesh);
    stageMeshRef.current = stageMesh;

    // Add stage grid
    const gridHelper = new THREE.GridHelper(stage.width * 2, 20, 0x444444, 0x222222);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.05;
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // Mouse interaction handlers
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      if (draggedObjectRef.current && !isPanningRef.current && !isOrbitingRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, dragPointRef.current);
        draggedObjectRef.current.position.copy(dragPointRef.current);
      }

      // Pan camera with right mouse button
      if (isPanningRef.current && !isOrbitingRef.current) {
        const deltaX = event.clientX - panStartRef.current.x;
        const deltaY = event.clientY - panStartRef.current.y;

        // Get camera's local coordinate system
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        
        // Get right vector (perpendicular to forward and world up)
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        // Get actual up vector (perpendicular to forward and right)
        const up = new THREE.Vector3();
        up.crossVectors(right, forward).normalize();

        // Pan speed - higher value for more responsive panning
        const panSpeed = 0.05;
        
        // Move camera target based on mouse delta
        cameraTargetRef.current.addScaledVector(right, -deltaX * panSpeed);
        cameraTargetRef.current.addScaledVector(up, deltaY * panSpeed);

        panStartRef.current.x = event.clientX;
        panStartRef.current.y = event.clientY;

        updateCameraPosition(camera);
      }

      // Orbit camera with middle mouse button
      if (isOrbitingRef.current) {
        const deltaX = event.clientX - orbitStartRef.current.x;
        const deltaY = event.clientY - orbitStartRef.current.y;

        // Only update if there's significant movement
        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
          const orbitSpeed = 0.005;
          
          // Update azimuth (rotation around Y axis) - allows unlimited 360 degree rotation
          cameraAzimuthRef.current += deltaX * orbitSpeed;
          
          // Update polar (up/down rotation) - clamp to avoid flipping
          cameraPolarRef.current += deltaY * orbitSpeed;
          cameraPolarRef.current = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPolarRef.current));

          orbitStartRef.current.x = event.clientX;
          orbitStartRef.current.y = event.clientY;

          updateCameraPosition(camera);
        }
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        // Right mouse button - pan
        event.preventDefault();
        isPanningRef.current = true;
        panStartRef.current = { x: event.clientX, y: event.clientY };
      } else if (event.button === 1) {
        // Middle mouse button - orbit rotation
        event.preventDefault();
        isOrbitingRef.current = true;
        orbitStartRef.current = { x: event.clientX, y: event.clientY };
      } else if (event.button === 0) {
        // Left mouse button - drag light
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const lightObjects = Array.from(lightsMapRef.current.values());
        const intersects = raycasterRef.current.intersectObjects(lightObjects, true);

        if (intersects.length > 0) {
          let selected = intersects[0].object;
          
          // If clicked on a child, get the parent lightGroup
          if (selected.userData.lightId) {
            const lightId = selected.userData.lightId as string;
            selected = lightsMapRef.current.get(lightId) || selected;
          }
          
          draggedObjectRef.current = selected;
          dragPlaneRef.current.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            selected.position
          );
          dispatch(selectLight((selected as any).userData?.lightId || null));
        }
      }
    };

    const onMouseUp = () => {
      draggedObjectRef.current = null;
      isPanningRef.current = false;
      isOrbitingRef.current = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      const direction = event.deltaY > 0 ? 1 : -1;
      cameraDistanceRef.current += direction * zoomSpeed * cameraDistanceRef.current;
      cameraDistanceRef.current = Math.max(1, Math.min(100, cameraDistanceRef.current));
      updateCameraPosition(camera);
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const onAuxClick = (event: MouseEvent) => {
      if (event.button === 1) {
        event.preventDefault();
      }
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("contextmenu", onContextMenu);
    renderer.domElement.addEventListener("auxclick", onAuxClick);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;

      (camera as THREE.PerspectiveCamera).aspect = newWidth / newHeight;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isInitializedRef.current = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("contextmenu", onContextMenu);
      renderer.domElement.removeEventListener("auxclick", onAuxClick);
      
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [dispatch, stage?.id]);

  // Add/update lights in scene
  useEffect(() => {
    if (!sceneRef.current || !stage) return;

    // Remove old lights
    lightsMapRef.current.forEach((lightObj) => {
      sceneRef.current?.remove(lightObj);
    });
    lightsMapRef.current.clear();

    // Add new lights
    stage.lights.forEach((light: Light) => {
      const spotLight = new THREE.SpotLight(
        light.color,
        light.intensity,
        light.range,
        (light.beamAngle * Math.PI) / 180,
        0.5,
        2
      );

      spotLight.position.set(light.position.x, light.position.y, light.position.z);
      spotLight.target.position.set(
        light.position.x + Math.sin(light.rotation.y) * 5,
        light.position.y - 5,
        light.position.z + Math.cos(light.rotation.y) * 5
      );
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;

      const lightGroup = new THREE.Group();
      lightGroup.userData.lightId = light.id;
      lightGroup.add(spotLight);
      lightGroup.add(spotLight.target);

      // Add visual representation
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: light.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.lightId = light.id;
      lightGroup.add(mesh);

      // Add cone to show beam direction
      const coneGeometry = new THREE.ConeGeometry(0.5, 2, 16);
      const coneMaterial = new THREE.MeshBasicMaterial({
        color: light.color,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.z = -1;
      cone.userData.lightId = light.id;
      lightGroup.add(cone);

      sceneRef.current?.add(lightGroup);
      lightsMapRef.current.set(light.id, lightGroup);
    });
  }, [stage?.lights]);

  // Update selected light helper
  useEffect(() => {
    if (!sceneRef.current) return;

    if (selectedLightHelperRef.current) {
      sceneRef.current.remove(selectedLightHelperRef.current);
      selectedLightHelperRef.current = null;
    }

    // First, remove highlight from all lights
    lightsMapRef.current.forEach((lightObj) => {
      const mesh = lightObj.children.find(
        (c) => c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry
      ) as THREE.Mesh;
      if (mesh && mesh.material instanceof THREE.MeshBasicMaterial) {
        mesh.material.color.setHex(0x666666);
        mesh.scale.set(1, 1, 1);
      }
    });

    // Then highlight the selected light
    if (selectedLightId && lightsMapRef.current.has(selectedLightId)) {
      const lightObj = lightsMapRef.current.get(selectedLightId);
      const spotLight = lightObj?.children.find(
        (c) => c instanceof THREE.SpotLight
      ) as THREE.SpotLight;

      if (spotLight) {
        selectedLightHelperRef.current = new THREE.SpotLightHelper(spotLight);
        sceneRef.current.add(selectedLightHelperRef.current);

        // Highlight the light
        const mesh = lightObj?.children.find(
          (c) => c instanceof THREE.Mesh && c.geometry instanceof THREE.SphereGeometry
        ) as THREE.Mesh;
        if (mesh && mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.color.setHex(0xffff00);
          mesh.scale.set(1.5, 1.5, 1.5);
        }
      }

      onLightSelected?.(selectedLightId);
    } else {
      onLightSelected?.(null);
    }
  }, [selectedLightId, onLightSelected]);

  // Load/unload template model
  useEffect(() => {
    const loadTemplate = async () => {
      // Remove existing template model
      if (templateModelRef.current && sceneRef.current) {
        disposeModel(templateModelRef.current);
        sceneRef.current.remove(templateModelRef.current);
        templateModelRef.current = null;
      }

      // Load new template if path exists
      if (stage?.templatePath && sceneRef.current) {
        try {
          const loadedModel = await loadGLBModel(stage.templatePath);
          templateModelRef.current = loadedModel.scene;
          
          // Add to scene at stage position
          if (templateModelRef.current) {
            templateModelRef.current.position.y = 0.2;
            sceneRef.current.add(templateModelRef.current);
          }
        } catch (error) {
          console.error("Failed to load template model:", error);
        }
      }
    };

    loadTemplate();

    return () => {
      // Cleanup on unmount
      if (templateModelRef.current && sceneRef.current) {
        try {
          disposeModel(templateModelRef.current);
          sceneRef.current.remove(templateModelRef.current);
        } catch (e) {
          console.error("Error disposing template model:", e);
        }
        templateModelRef.current = null;
      }
    };
  }, [stage?.templatePath]);

  // Hide/show stage platform based on template
  useEffect(() => {
    if (stageMeshRef.current && gridHelperRef.current && axesHelperRef.current) {
      const hasTemplate = !!stage?.templatePath;
      stageMeshRef.current.visible = !hasTemplate;
      gridHelperRef.current.visible = !hasTemplate;
      axesHelperRef.current.visible = !hasTemplate;
    }
  }, [stage?.templatePath]);

  // Handle template rotation
  useEffect(() => {
    if (!templateModelRef.current) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const rotationSpeed = 0.1;
      
      switch(e.key) {
        case 'ArrowRight':
          templateModelRef.current!.rotation.y += rotationSpeed;
          break;
        case 'ArrowLeft':
          templateModelRef.current!.rotation.y -= rotationSpeed;
          break;
        case 'ArrowUp':
          templateModelRef.current!.rotation.x -= rotationSpeed;
          break;
        case 'ArrowDown':
          templateModelRef.current!.rotation.x += rotationSpeed;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden"
        style={{ minHeight: "600px" }}
      />
      
      {/* Camera Controls Help */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-3 rounded pointer-events-none max-w-xs">
        <p className="font-bold mb-2">🎮 Controls:</p>
        <p>🖱️ Left Drag: Move Light</p>
        <p>🖱️ Right Drag: Pan Camera</p>
        <p>🖱️ Middle Drag: Rotate 360°</p>
        <p>🎡 Scroll: Zoom In/Out</p>
        {stage?.templatePath && (
          <div className="mt-2 pt-2 border-t border-white/30">
            <p className="font-bold mb-1">📐 Template Rotation:</p>
            <p>⬅️➡️ Arrow Keys: Rotate Left/Right</p>
            <p>⬆️⬇️ Arrow Keys: Rotate Up/Down</p>
          </div>
        )}
      </div>
    </div>
  );
}
