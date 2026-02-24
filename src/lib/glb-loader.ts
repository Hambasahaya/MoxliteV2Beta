import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const loader = new GLTFLoader();

export interface LoadedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export const loadGLBModel = (path: string): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center the model
        gltf.scene.position.sub(center);

        // Scale to fit within a standard size (e.g., 10 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDim;
        gltf.scene.scale.multiplyScalar(scale);

        resolve({
          scene: gltf.scene,
          animations: gltf.animations,
        });
      },
      // Progress callback
      (progress) => {
        console.log(`Loading GLB: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
      },
      // Error callback
      (error) => {
        console.error("Error loading GLB model:", error);
        reject(error);
      }
    );
  });
};

export const disposeModel = (model: THREE.Group) => {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }
  });
};
