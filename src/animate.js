import * as THREE from "three";

/**
 * Start the render loop.
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.Object3D} cameraYaw
 * @param {THREE.Object3D} cameraPitch
 * @param {{
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
 * }} controls
 * @param {{ ambient: THREE.AmbientLight, dir: THREE.DirectionalLight }} lights
 * @param {function} pushLightDir
 */
export function animate(
    renderer,
    scene,
    camera,
    cameraYaw,
    cameraPitch,
    controls,
    lights,
    pushLightDir
) {
    const clock = new THREE.Clock();

    function loop() {
        requestAnimationFrame(loop);

        // Update shader light direction
        pushLightDir(lights.dir);

        // Rotate camera hierarchy
        cameraYaw.rotation.y = controls.yaw;
        cameraPitch.rotation.x = controls.pitch;

        // Movement
        const delta = clock.getDelta();
        const speed = 5.0 * delta;
        const move = new THREE.Vector3(
            (controls.moveRight ? 1 : 0) - (controls.moveLeft ? 1 : 0),
            (controls.moveUp ? 1 : 0) - (controls.moveDown ? 1 : 0),
            (controls.moveBackward ? 1 : 0) - (controls.moveForward ? 1 : 0)
        ).multiplyScalar(speed);

        cameraYaw.position.add(
            move.applyEuler(
                new THREE.Euler(0, cameraYaw.rotation.y, 0, "YXZ")
            )
        );

        renderer.render(scene, camera);
    }

    loop();
}

/**
 * Handle window resize: update camera aspect + renderer size.
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.PerspectiveCamera} camera
 */
export function onWindowResize(renderer, camera) {
    if (!renderer || !camera) {
        return;
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
