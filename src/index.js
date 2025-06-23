/* eslint-disable no-console */
import { initScene } from "./scene.js";
import { setupInput } from "./input.js";
import { buildIndicator, buildHelp } from "./ui.js";
import { animate, onWindowResize } from "./animate.js";

let shaderEnabled = false;

/**
 * Application entry point.
 */
initScene()
.then(ctx => {
    const {
        renderer,
        scene,
        camera,
        cameraYaw,
        cameraPitch,
        controls,
        lights,
        pushLightDir,
        updateMaterials
    } = ctx;

    const indicatorEl = buildIndicator();
    buildHelp();

    window.addEventListener("resize", () => {
        onWindowResize(renderer, camera);
    });

    setupInput(controls, () => {
        shaderEnabled = !shaderEnabled;
        if (typeof updateMaterials === "function") {
            updateMaterials(shaderEnabled);
        }
        indicatorEl.textContent = "Shader: " + (shaderEnabled ? "ON" : "OFF");
        indicatorEl.style.color = shaderEnabled ? "#0f0" : "#f00";
    });

    animate(
        renderer,
        scene,
        camera,
        cameraYaw,
        cameraPitch,
        controls,
        lights,
        pushLightDir
    );
})
.catch(err => console.error("[Init] ERROR:", err));
