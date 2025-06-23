import * as THREE from "three";
import { loadText, loadHatchTextures, loadEXRTexture, loadGLTF } from "./loaders.js";

/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.Object3D} */
let cameraYaw;

/** @type {THREE.Object3D} */
let cameraPitch;

/** @type {THREE.PerspectiveCamera} */
let camera;

// Ambient + directional light
let lights;

// All meshes that we swap materials on
const sceneObjects = [];

/**
 * User-input state  mutated by input handlers.
 * @type {{
 *   moveForward: boolean,
 *   moveBackward: boolean,
 *   moveLeft: boolean,
 *   moveRight: boolean,
 *   moveUp: boolean,
 *   moveDown: boolean,
 *   isMouseDown: boolean,
 *   prevMouseX: number,
 *   prevMouseY: number,
 *   yaw: number,
 *   pitch: number
 * }}
 */
const controls = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    isMouseDown: false,
    prevMouseX: 0,
    prevMouseY: 0,
    yaw: 0,
    pitch: 0
};

// Phong/fallback materials
let defaultPhongMat, floorPhongMat, skyboxPhongMat, skyboxHatchMat;

// Custom shader materials
const shaderMaterials = {};
const shaderDefs = [
    {
        key: "hatching",
        vert: "./shaders/hatching.vert.glsl",
        frag: "./shaders/hatching.frag.glsl",
        uniforms: {
            uLightDir:      { value: new THREE.Vector3(0.5, 0.7, 1).normalize() },
            uBaseColor:     { value: new THREE.Vector3(1, 1, 1) },
            uHatchTex:      { value: [] },
            uUVScale:       { value: new THREE.Vector2(4, 4) },
            uFlatShade:     { value: 0 }
        }
    }
];
let currentShaderKey = "hatching";

/**
 * Add ambient + directional light (with shadows).
 * @param {THREE.Scene} sc
 * @returns {{ ambient: THREE.AmbientLight, dir: THREE.DirectionalLight }}
 */
function addDefaultLights(sc) {
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    sc.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(5, 10, 7);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.camera.near = 1;
    dir.shadow.camera.far = 30;
    dir.shadow.camera.left = -10;
    dir.shadow.camera.right = 10;
    dir.shadow.camera.top = 10;
    dir.shadow.camera.bottom = -10;
    sc.add(dir);

    return { ambient, dir };
}

/**
 * Copy the (normalized) directional-light vector into every custom shader.
 * @param {THREE.DirectionalLight} dir
 */
export function pushLightDir(dir) {
    const v = dir.position.clone().normalize();
    Object.values(shaderMaterials).forEach(mat => {
        if (mat.uniforms && mat.uniforms.uLightDir) {
            mat.uniforms.uLightDir.value.copy(v);
        }
    });
}

/**
 * Load a GLTF model and add it to the scene.
 * @param {string} path
 * @param {THREE.Vector3} position
 * @param {THREE.Vector3} [rotation={x:0,y:0,z:0}]
 * @param {THREE.Material} [baseMat=defaultPhongMat]
 * @param {number} [scale=1]
 * @return {Promise<void>}
 */
async function loadModel(path, position, rotation = {x:0,y:0,z:0}, baseMat = defaultPhongMat, scale=1) {
    return new Promise(async (resolve) => {
        try {
            const gltf = await loadGLTF(path);
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    const mesh = new THREE.Mesh(child.geometry, baseMat);
                    mesh.position.set(position.x, position.y, position.z);
                    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                    mesh.scale.set(scale, scale, scale);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.userData.isMesh = true;
                    mesh.userData.baseMat = baseMat;
                    scene.add(mesh);
                    sceneObjects.push(mesh);
                }
            });
        } catch (e) {}
        finally {resolve()}
    })
}


/**
 * Initialize renderer, scene, camera, lights, materials & meshes.
 * @returns {Promise<{
 *   renderer: THREE.WebGLRenderer,
 *   scene: THREE.Scene,
 *   camera: THREE.PerspectiveCamera,
 *   cameraYaw: THREE.Object3D,
 *   cameraPitch: THREE.Object3D,
 *   controls: object,
 *   lights: object,
 *   sceneObjects: THREE.Mesh[],
 *   pushLightDir: function,
 *   updateMaterials: function
 * }>}
 */
export async function initScene() {
    const hatchTextures = await loadHatchTextures();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Skybox fallback material
    try {
        const skyTex = await loadEXRTexture("./textures/skybox.exr");
        skyTex.mapping = THREE.EquirectangularReflectionMapping;
        skyTex.encoding = THREE.LinearEncoding;
        skyTex.generateMipmaps = false;
        skyTex.minFilter = THREE.LinearFilter;
        skyboxPhongMat = new THREE.MeshBasicMaterial({
            map: skyTex,
            side: THREE.BackSide
        });
    } catch (err) {
        console.error("[Init] Skybox EXR load failed:", err);
    }

    // Camera setup
    cameraYaw = new THREE.Object3D();
    cameraPitch = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    cameraPitch.add(camera);
    cameraYaw.add(cameraPitch);
    scene.add(cameraYaw);
    cameraYaw.position.set(0, 1, 5);

    // Default Phong material
    defaultPhongMat = new THREE.MeshPhongMaterial({ color: 0xffffff });

    // Compile custom shader materials
    for (const def of shaderDefs) {
        const [vs, fs] = await Promise.all([
            loadText(def.vert),
            loadText(def.frag)
        ]);
        const mat = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: THREE.UniformsUtils.clone(def.uniforms),
            side: THREE.FrontSide
        });
        mat.uniforms.uHatchTex.value = hatchTextures;
        shaderMaterials[def.key] = mat;
    }

    // Hatch variant for skybox
    if (shaderMaterials.hatching && skyboxPhongMat) {
        skyboxHatchMat = shaderMaterials.hatching.clone();
        skyboxHatchMat.uniforms = THREE.UniformsUtils.clone(
            shaderMaterials.hatching.uniforms
        );
        skyboxHatchMat.uniforms.uHatchTex.value = hatchTextures;
        skyboxHatchMat.uniforms.uFlatShade.value = 1;
        skyboxHatchMat.side = THREE.BackSide;
    }

    // Lights
    lights = addDefaultLights(scene);

    // Floor
    const floorTex = new THREE.TextureLoader().load("./textures/grass.jpg");
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(4, 4);
    floorPhongMat = new THREE.MeshPhongMaterial({
        map: floorTex,
        side: THREE.DoubleSide
    });
    const floorGeo  = new THREE.PlaneGeometry(20, 20);
    const floorMesh = new THREE.Mesh(floorGeo, floorPhongMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y  = -1.5;
    floorMesh.receiveShadow = true;
    floorMesh.userData.isFloor = true;
    scene.add(floorMesh);
    sceneObjects.push(floorMesh);

    // Attach hatch floor material
    if (shaderMaterials.hatching) {
        const hm = shaderMaterials.hatching.clone();
        hm.uniforms = THREE.UniformsUtils.clone(
            shaderMaterials.hatching.uniforms
        );
        hm.uniforms.uHatchTex.value = hatchTextures;
        hm.uniforms.uUVScale.value.set(12, 12);
        floorMesh.userData.hatchMat = hm;
    }

    // Skybox mesh
    if (skyboxPhongMat) {
        const skyGeo  = new THREE.SphereGeometry(64, 100, 100);
        const skyMat  = skyboxPhongMat;
        const skyMesh = new THREE.Mesh(skyGeo, skyMat);
        skyMesh.userData.isSkybox = true;
        scene.add(skyMesh);
        sceneObjects.push(skyMesh);
    }

    // Load models
    const car1PhongMat = new THREE.MeshPhongMaterial({color: 0x315665});
    const car2PhongMat = new THREE.MeshPhongMaterial({color: 0x97BECE});
    const housePhongMat = new THREE.MeshPhongMaterial({color: 0xEEE6BA});
    const dogPhongMat = new THREE.MeshPhongMaterial({color: 0xCEB297});
    const treePhongMat = new THREE.MeshPhongMaterial({color: 0x638550});

    // Load models and add them to the scene
    await Promise.all([
        loadModel('models/car2.glb', { x: 6, y: 0, z: -3 }, { x: 0, y: Math.PI * -0.75, z: 0 }, car1PhongMat),
        loadModel('models/car2.glb', { x: 0, y: 0, z: -5 }, { x: 0, y: 0, z: 0 }, car2PhongMat),
        loadModel('models/home2.glb', { x: -4, y: -0.9, z: 0 }, { x: Math.PI / -2, y: 0, z: 0 }, housePhongMat),
        loadModel('models/dog.glb', { x: -1, y: -0.9, z: 1.5 }, { x: 0, y: Math.PI * -0.25, z: 0 }, dogPhongMat),
        loadModel('models/tree.glb', { x: -5, y: -1.1, z: 4.5 }, { x: Math.PI * -0.5, y: 0, z: 0 }, treePhongMat, 0.25)
    ])

    /**
     * Swap materials on every relevant mesh.
     * @param {boolean} enable
     */
    function updateMaterials(enable) {
        for (const obj of sceneObjects) {
            if (enable) {
                if (obj.userData.isFloor && obj.userData.hatchMat) {
                    obj.material = obj.userData.hatchMat;
                } else if (obj.userData.isSkybox) {
                    obj.material = skyboxHatchMat || skyboxPhongMat;
                } else {
                    obj.material = shaderMaterials[currentShaderKey];
                }
            } else {
                if (obj.userData.isFloor) {
                    obj.material = floorPhongMat;
                } else if (obj.userData.isSkybox) {
                    obj.material = skyboxPhongMat;
                } else {
                    obj.material = obj.userData.baseMat || defaultPhongMat;
                }
            }
            const isSky = obj.userData.isSkybox;
            obj.castShadow = !isSky;
            obj.receiveShadow = !isSky;
        }
    }

    return {
        renderer,
        scene,
        camera,
        cameraYaw,
        cameraPitch,
        controls,
        lights,
        sceneObjects,
        pushLightDir,
        updateMaterials
    };
}
