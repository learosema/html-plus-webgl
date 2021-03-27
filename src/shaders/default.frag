varying float vNoise;

void main() {
  vec3 color1 = vec3(1., 0., 0.);
  vec3 color2 = vec3(1., 1., 1.);
  vec3 finalColor = mix(color2, color1, .5 + vNoise * .5);
  gl_FragColor = vec4(finalColor, 1.);
}