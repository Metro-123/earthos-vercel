import "./globals.css"
import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function Home() {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const earthRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a20)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 2, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    document.getElementById("container")!.appendChild(renderer.domElement)

    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64)

    // Earth material with day/night
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: null,
      color: 0x2b1b0c,
      roughness: 0.8,
      metalness: 0.1,
    })

    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.castShadow = true
    earth.receiveShadow = true
    scene.add(earth)
    earthRef.current = earth

    // Sun light
    const sun = new THREE.DirectionalLight(0xffffff, 1.5)
    sun.position.set(5, 3, 7)
    sun.castShadow = true
    scene.add(sun)

    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambient)

    // Stars
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 3000
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const radius = 5 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = radius * Math.cos(phi)

      starSizes[i] = 1 + Math.random() * 2
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32)
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xd3d3d3,
      roughness: 0.8,
    })
    const moon = new THREE.Mesh(moonGeometry, moonMaterial)
    moon.position.set(3, 0, 0)
    scene.add(moon)

    // Render loop
    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()

      // Rotate Earth
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.002
      }

      // Orbit Moon
      if (moon) {
        moon.position.x = 3 * Math.sin(elapsed * 0.5)
        moon.position.z = 3 * Math.cos(elapsed * 0.5)
      }

      // Rotate stars
      if (stars) {
        stars.rotation.y -= 0.0001
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      document.getElementById("container")!.removeChild(renderer.domElement)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <main className="min-h-screen bg-earth text-white">
      <div id="container" style={{ height: "100%" }}></div>
    </main>
  )
}