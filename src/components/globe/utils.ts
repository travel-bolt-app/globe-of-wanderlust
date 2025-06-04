import * as THREE from 'three';

// Convert lat/long to 3D coordinates
export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}

// Create a starfield background
export function createStarfield(count: number = 5000): THREE.Points { // Default count increased
  const vertices = [];
  const colors = []; // Array for colors
  const color = new THREE.Color(); // THREE.Color instance

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(200); // Increased spread
    const y = THREE.MathUtils.randFloatSpread(200); // Increased spread
    const z = THREE.MathUtils.randFloatSpread(200); // Increased spread
    vertices.push(x, y, z);

    // Add subtle color variations
    if (Math.random() > 0.7) {
      color.setHSL(Math.random() * 0.1 + 0.5, 0.8, Math.random() * 0.25 + 0.75); // Bluish tints
    } else if (Math.random() > 0.5) {
      color.setHSL(Math.random() * 0.1 + 0.05, 0.8, Math.random() * 0.25 + 0.75); // Yellowish/Orangish tints
    } else {
      color.setRGB(1.0, 1.0, 1.0); // White
    }
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // Set color attribute

  const sizes = [];
  for (let i = 0; i < count; i++) {
    sizes.push(Math.random() * 2.0);
  }
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.15, // Adjusted size
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    vertexColors: true // Enable vertex colors
  });

  return new THREE.Points(geometry, material);
}

// Draw a great circle between two points on the globe
export function createArc(startLat: number, startLng: number, endLat: number, endLng: number, radius: number = 1): THREE.Line {
  // Convert to radians
  const startLatRad = startLat * (Math.PI / 180);
  const startLngRad = startLng * (Math.PI / 180);
  const endLatRad = endLat * (Math.PI / 180);
  const endLngRad = endLng * (Math.PI / 180);
  
  // Create curve
  const points = [];
  const segments = 50;
  
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    
    // Spherical linear interpolation
    const lat = startLatRad + f * (endLatRad - startLatRad);
    const lng = startLngRad + f * (endLngRad - startLngRad);
    
    // Convert to cartesian
    const x = radius * Math.cos(lat) * Math.cos(lng);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lng);
    
    points.push(new THREE.Vector3(x, y, z));
  }
  
  // Create geometry from points
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x4299E1,
    linewidth: 2,
    opacity: 0.7,
    transparent: true
  });
  
  return new THREE.Line(geometry, material);
}

// Create a glow material for atmosphere effect (GitHub-style)
export function createGlowMaterial() {
  return {
    uniforms: {
      coefficient: { value: 0.1 },
      power: { value: 2.0 },
      glowColor: { value: new THREE.Color(0x3b82f6) }  // Blue glow similar to GitHub
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float coefficient;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        float intensity = pow(coefficient - dot(vPositionNormal, vNormal), power);
        gl_FragColor = vec4(glowColor, intensity);
      }
    `
  };
}

// Create a detailed procedural earth texture
export function createDetailedEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; // Higher resolution for more detail
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error("Could not get canvas context");
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }
  
  // Draw base color (oceans)
  ctx.fillStyle = '#1a365d'; // Deep blue for oceans
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid for reference
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 1;
  
  // Latitude lines
  for (let i = 0; i < canvas.height; i += canvas.height/18) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  
  // Longitude lines
  for (let i = 0; i < canvas.width; i += canvas.width/36) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  
  // Draw continents with more accurate shapes
  ctx.fillStyle = '#68D391'; // Green for land
  
  // North America (simplified)
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.1, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.2, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.25, canvas.height * 0.25);
  ctx.lineTo(canvas.width * 0.28, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.2, canvas.height * 0.45);
  ctx.lineTo(canvas.width * 0.1, canvas.height * 0.35);
  ctx.closePath();
  ctx.fill();
  
  // South America (simplified)
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.25, canvas.height * 0.5);
  ctx.lineTo(canvas.width * 0.3, canvas.height * 0.55);
  ctx.lineTo(canvas.width * 0.28, canvas.height * 0.7);
  ctx.lineTo(canvas.width * 0.22, canvas.height * 0.8);
  ctx.lineTo(canvas.width * 0.18, canvas.height * 0.65);
  ctx.closePath();
  ctx.fill();
  
  // Europe & Africa (simplified)
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.45, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.55, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.53, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.48, canvas.height * 0.65);
  ctx.lineTo(canvas.width * 0.43, canvas.height * 0.65);
  ctx.lineTo(canvas.width * 0.38, canvas.height * 0.4);
  ctx.closePath();
  ctx.fill();
  
  // Asia (simplified)
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.55, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.85, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.8, canvas.height * 0.45);
  ctx.lineTo(canvas.width * 0.65, canvas.height * 0.5);
  ctx.lineTo(canvas.width * 0.6, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.53, canvas.height * 0.4);
  ctx.closePath();
  ctx.fill();
  
  // Australia (simplified)
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.75, canvas.height * 0.55);
  ctx.lineTo(canvas.width * 0.85, canvas.height * 0.6);
  ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7);
  ctx.lineTo(canvas.width * 0.7, canvas.height * 0.65);
  ctx.closePath();
  ctx.fill();
  
  // Add some noise to the texture for a more natural look
  addNoiseToCanvas(ctx, canvas.width, canvas.height, 0.05);
  
  console.log("Created detailed Earth texture");
  return new THREE.CanvasTexture(canvas);
}

// Add noise to the canvas for more texture
function addNoiseToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply noise to each color channel
    const noise = (Math.random() * 2 - 1) * intensity * 255;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Create a bump map for the Earth
export function createEarthBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error("Could not get canvas context for bump map");
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }
  
  // Fill with dark color (flat oceans)
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw continents with brighter color (raised)
  ctx.fillStyle = '#999999';
  
  // Use same continent shapes as in the main texture function
  // North America
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.1, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.2, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.25, canvas.height * 0.25);
  ctx.lineTo(canvas.width * 0.28, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.2, canvas.height * 0.45);
  ctx.lineTo(canvas.width * 0.1, canvas.height * 0.35);
  ctx.closePath();
  ctx.fill();
  
  // South America
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.25, canvas.height * 0.5);
  ctx.lineTo(canvas.width * 0.3, canvas.height * 0.55);
  ctx.lineTo(canvas.width * 0.28, canvas.height * 0.7);
  ctx.lineTo(canvas.width * 0.22, canvas.height * 0.8);
  ctx.lineTo(canvas.width * 0.18, canvas.height * 0.65);
  ctx.closePath();
  ctx.fill();
  
  // Europe & Africa
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.45, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.55, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.53, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.48, canvas.height * 0.65);
  ctx.lineTo(canvas.width * 0.43, canvas.height * 0.65);
  ctx.lineTo(canvas.width * 0.38, canvas.height * 0.4);
  ctx.closePath();
  ctx.fill();
  
  // Asia
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.55, canvas.height * 0.15);
  ctx.lineTo(canvas.width * 0.85, canvas.height * 0.2);
  ctx.lineTo(canvas.width * 0.8, canvas.height * 0.45);
  ctx.lineTo(canvas.width * 0.65, canvas.height * 0.5);
  ctx.lineTo(canvas.width * 0.6, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.53, canvas.height * 0.4);
  ctx.closePath();
  ctx.fill();
  
  // Australia
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.75, canvas.height * 0.55);
  ctx.lineTo(canvas.width * 0.85, canvas.height * 0.6);
  ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7);
  ctx.lineTo(canvas.width * 0.7, canvas.height * 0.65);
  ctx.closePath();
  ctx.fill();
  
  // Add strong noise for mountain ranges
  addNoiseToCanvas(ctx, canvas.width, canvas.height, 0.3);
  
  return new THREE.CanvasTexture(canvas);
}
