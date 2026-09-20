import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

// Horizontal sections: height, half-width, back, cheek plane, face center,
// and width of the central feature. Close sections preserve the carved ledges.
const PROFILE = [
  [-1.75, 0.65, -0.66, 0.38, 0.43, 0.60],
  [-1.68, 0.82, -0.82, 0.60, 0.68, 0.65],
  [-1.48, 0.90, -0.89, 0.68, 0.81, 0.67],
  [-1.10, 0.92, -0.90, 0.66, 0.87, 0.66],
  [-0.88, 0.92, -0.90, 0.64, 0.94, 0.65],
  [-0.77, 0.91, -0.89, 0.62, 1.00, 0.66], // lower lip
  [-0.68, 0.91, -0.89, 0.60, 0.72, 0.63], // recessed mouth
  [-0.58, 0.90, -0.88, 0.60, 0.71, 0.62],
  [-0.48, 0.90, -0.88, 0.61, 0.97, 0.62], // upper lip
  [-0.39, 0.89, -0.87, 0.62, 1.03, 0.58],
  [-0.31, 0.89, -0.87, 0.62, 1.53, 0.43], // flat underside of nose
  [-0.20, 0.88, -0.86, 0.61, 1.57, 0.42], // broad nose tip
  [ 0.02, 0.87, -0.85, 0.58, 1.40, 0.34],
  [ 0.34, 0.85, -0.83, 0.54, 1.16, 0.25],
  [ 0.61, 0.83, -0.81, 0.53, 0.98, 0.20], // deep eye sockets
  [ 0.72, 0.82, -0.80, 0.55, 0.99, 0.23],
  [ 0.80, 0.82, -0.80, 1.02, 1.10, 0.68], // continuous heavy brow
  [ 0.94, 0.81, -0.79, 1.03, 1.11, 0.69],
  [ 1.12, 0.78, -0.77, 0.88, 0.98, 0.66],
  [ 1.53, 0.70, -0.72, 0.57, 0.67, 0.59], // sloping forehead
  [ 1.68, 0.66, -0.68, 0.46, 0.53, 0.55],
  [ 1.75, 0.57, -0.59, 0.37, 0.43, 0.48],
]

export function createMoaiGeometry() {
  const radialSegments = 128
  const positions: number[] = []
  const indices: number[] = []
  const sections: number[][] = []

  for (let i = 0; i < PROFILE.length - 1; i++) {
    const from = PROFILE[i]
    const to = PROFILE[i + 1]
    const steps = Math.max(2, Math.ceil((to[0] - from[0]) / 0.045))
    for (let step = 0; step < steps; step++) {
      sections.push(from.map((value, column) => THREE.MathUtils.lerp(value, to[column], step / steps)))
    }
  }
  sections.push(PROFILE[PROFILE.length - 1])

  for (const [y, width, back, cheek, front, featureWidth] of sections) {
    for (let j = 0; j < radialSegments; j++) {
      const angle = j / radialSegments * Math.PI * 2
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      // Rounded rectangular sections give the statue broad, planar sides.
      const x = width * Math.sign(sin) * Math.pow(Math.abs(sin), 0.65)
      const middle = (cheek + back) / 2
      let z = middle + (cheek - back) / 2 * Math.sign(cos) * Math.pow(Math.abs(cos), 0.5)
      if (cos > 0) {
        const feature = 1 - THREE.MathUtils.smoothstep(Math.abs(x), featureWidth * 0.28, featureWidth)
        z += (front - cheek) * feature
      }
      positions.push(x, y, z)
    }
  }

  for (let row = 0; row < sections.length - 1; row++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = row * radialSegments + j
      const b = row * radialSegments + (j + 1) % radialSegments
      const c = a + radialSegments
      const d = b + radialSegments
      indices.push(a, b, c, b, d, c)
    }
  }

  // Close the crown and flat base so surface sampling covers the whole head.
  for (const row of [0, sections.length - 1]) {
    const [y, , back, cheek] = sections[row]
    const center = positions.length / 3
    positions.push(0, y, (back + cheek) / 2)
    for (let j = 0; j < radialSegments; j++) {
      const a = row * radialSegments + j
      const b = row * radialSegments + (j + 1) % radialSegments
      if (row === 0) indices.push(center, b, a)
      else indices.push(center, a, b)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function createMoaiPositions(size: number) {
  const geometry = createMoaiGeometry()
  // Fit the head into the existing camera and reveal the nose in profile.
  geometry.scale(0.6, 0.6, 0.6)
  geometry.rotateY(-0.65)

  const material = new THREE.MeshBasicMaterial()
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry, material)).build()
  const point = new THREE.Vector3()
  const data = new Float32Array(size * size * 4)

  for (let offset = 0; offset < data.length; offset += 4) {
    sampler.sample(point)
    point.toArray(data, offset)
    data[offset + 3] = 1
  }

  geometry.dispose()
  material.dispose()

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
  texture.needsUpdate = true
  return texture
}
