/**
 * Hatching vertex shader
 *  – Sends world-space position and world-space normal
 *  – Pass-through UV
 */

precision highp float;

// Varyings
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec2 vUv;

void main() {
    vUv = uv; // Pass-through UV

    // World-space position
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    // World-space normal
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    // Final clip-space position
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
