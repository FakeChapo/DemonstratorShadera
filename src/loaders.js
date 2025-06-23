import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Fetch a text resource (e.g. GLSL source).
 * @param {string} url - Absolute or relative URL.
 * @returns {Promise<string>} Resolves to file content.
 */
export async function loadText(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Could not load " + url);
    }
    return res.text();
}

/**
 * Load six hash-based PNG hatch textures (1.png  6.png).
 * @returns {Promise<THREE.Texture[]>}
 */
export async function loadHatchTextures() {
    const loader = new THREE.TextureLoader();
    const promises = [];

    for (let i = 1; i <= 6; i += 1) {
        promises.push(new Promise((resolve, reject) => {
            loader.load(
                `/textures/hatches_${i}.png`,
                tex => {
                    tex.wrapS = THREE.RepeatWrapping;
                    tex.wrapT = THREE.RepeatWrapping;
                    tex.minFilter = THREE.LinearMipMapLinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    resolve(tex);
                },
                undefined,
                err => reject(new Error("Could not load hatch texture " + i + ": " + err))
            );
        }));
    }

    return Promise.all(promises);
}

/**
 * Load an EXR file
 * @param {string} url
 * @returns {Promise<THREE.DataTexture>}
 */
export function loadEXRTexture(url) {
    return new Promise((resolve, reject) => {
        const loader = new EXRLoader();
        loader.load(url, resolve, undefined, reject);
    });
}

/**
 * Load a GLTF file.
 * @param {string} url
 * @returns {Promise<THREE.GLTF>}
 */
export function loadGLTF(url) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(url, resolve, undefined, reject);
    });
}