/**
 * Hatching fragment shader (texture-based only)
 *  – Uses a 6-level PNG hatch library (uHatchTex[0‥5])
 *  – Pure-white paper; Lambert term controls stroke density only
 */

precision highp float;

// Varyings
varying vec3 vWorldNormal;
varying vec2 vUv;

// Uniforms
uniform vec3 uLightDir; // world-space directional light
uniform vec3 uBaseColor; // paper tint; usually vec3(1.0)
uniform sampler2D uHatchTex[6]; // 0 = darkest, 5 = lightest
uniform vec2 uUVScale; // tiling
uniform int uFlatShade; // 1 ⇒ ignore lighting

void main() {
    // Lighting (Lambert)
    float NdL = max(dot(normalize(vWorldNormal), normalize(uLightDir)), 0.0);
    float shade = (uFlatShade == 1) ? 1.0 : NdL;

    // Paper color
    vec3 paper = uBaseColor;

    // Select one of six hatch textures
    vec3 sampleColor;
    if (shade < 0.15) {
        sampleColor = texture2D(uHatchTex[5], vUv * uUVScale).rgb;
    } else if (shade < 0.30) {
        sampleColor = texture2D(uHatchTex[4], vUv * uUVScale).rgb;
    } else if (shade < 0.45) {
        sampleColor = texture2D(uHatchTex[3], vUv * uUVScale).rgb;
    } else if (shade < 0.60) {
        sampleColor = texture2D(uHatchTex[2], vUv * uUVScale).rgb;
    } else if (shade < 0.75) {
        sampleColor = texture2D(uHatchTex[1], vUv * uUVScale).rgb;
    } else {
        sampleColor = texture2D(uHatchTex[0], vUv * uUVScale).rgb;
    }

    // Compute luminance (perceived brightness)
    float luminance = dot(sampleColor, vec3(0.299, 0.587, 0.114));

    // White -> 0 ink, black -> 1 ink
    float ink = 1.0 - luminance;

    // Composite ink over paper
    vec3 finalColor = mix(paper, vec3(0.0), ink);
    gl_FragColor = vec4(finalColor, 1.0);
}
