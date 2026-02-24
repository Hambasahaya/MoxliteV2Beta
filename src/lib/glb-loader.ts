import * as THREE from "three";

export interface LoadedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

let loaderInstance: any = null;

const getGLTFLoader = async () => {
  if (loaderInstance) return loaderInstance;
  
  try {
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    loaderInstance = new GLTFLoader();
    return loaderInstance;
  } catch (error) {
    console.error("Failed to load GLTFLoader:", error);
    throw error;
  }
};

export const loadGLBModel = async (path: string): Promise<LoadedModel> => {
  const loader = await getGLTFLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf: any) => {
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
      (progress: any) => {
        console.log(`Loading GLB: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
      },
      // Error callback
      (error: any) => {
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
