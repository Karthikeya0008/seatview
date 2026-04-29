import { useRef } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useSeatViewStore } from "../../store/useSeatViewStore"
import * as THREE from "three"

function CabinModel() {
  const { scene } = useGLTF("/models/cabin.glb")
  const { setSelectedSeat } = useSeatViewStore()

  const seatGroups = []
  scene.traverse((child) => {
    if (child.name.toLowerCase().includes("seats")) {
      const pos = new THREE.Vector3()
      child.getWorldPosition(pos)
      seatGroups.push({ name: child.name, pos })
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    const clickPos = e.point

    let nearest = null
    let nearestDist = Infinity
    seatGroups.forEach((seat) => {
      const dist = clickPos.distanceTo(seat.pos)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = seat
      }
    })

    if (!nearest || nearestDist > 1.5) return

    const row = Math.max(1, Math.min(32, Math.round((14 - nearest.pos.z) / 0.76) + 1))

    let col
    if (nearest.pos.x > 0) {
      if (clickPos.x > 1.3) col = "F"
      else if (clickPos.x > 1.0) col = "E"
      else col = "D"
    } else {
      if (clickPos.x < -1.3) col = "A"
      else if (clickPos.x < -1.0) col = "B"
      else col = "C"
    }

    const seatId = `${row}${col}`
    setSelectedSeat({
      id: seatId,
      row,
      col,
      isExit: [14, 15].includes(row),
      isWindow: col === "A" || col === "F",
      isAisle: col === "C" || col === "D",
      isMiddle: col === "B" || col === "E",
      zone: row <= 4 ? "Business" : "Economy",
    })
  }

  return <primitive object={scene} onClick={handleClick} />
}

function CameraController({ moveRef, controlsRef }) {
  const { camera } = useThree()

  useFrame(() => {
    if (!moveRef.current) return

    const speed = 0.08
    const direction = new THREE.Vector3()

    if (moveRef.current === "forward") direction.set(0, 0, -speed)
    else if (moveRef.current === "backward") direction.set(0, 0, speed)
    else if (moveRef.current === "left") direction.set(-speed, 0, 0)
    else if (moveRef.current === "right") direction.set(speed, 0, 0)

    direction.applyQuaternion(camera.quaternion)

    camera.position.add(direction)
    if (controlsRef.current) {
      controlsRef.current.target.add(direction)
      controlsRef.current.update()
    }
  })

  return null
}

export default function CabinViewer({ aircraftData }) {
  const moveRef = useRef(null)
  const controlsRef = useRef(null)

  const startMove = (dir) => moveRef.current = dir
  const stopMove = () => moveRef.current = null

  const btnStyle = {
    background: "rgba(14, 165, 233, 0.8)",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    backdropFilter: "blur(4px)",
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>

      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 0], fov: 75 }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <CabinModel />
        <CameraController moveRef={moveRef} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          panSpeed={2}
          zoomSpeed={1.5}
          rotateSpeed={0.5}
          minDistance={0.5}
          maxDistance={40}
          screenSpacePanning={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
        />
      </Canvas>

      {/* Navigation overlay */}
      <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <button style={btnStyle} onMouseDown={() => startMove("forward")} onMouseUp={stopMove} onMouseLeave={stopMove} onTouchStart={() => startMove("forward")} onTouchEnd={stopMove}>⬆</button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={btnStyle} onMouseDown={() => startMove("left")} onMouseUp={stopMove} onMouseLeave={stopMove} onTouchStart={() => startMove("left")} onTouchEnd={stopMove}>⬅</button>
          <button style={btnStyle} onMouseDown={() => startMove("backward")} onMouseUp={stopMove} onMouseLeave={stopMove} onTouchStart={() => startMove("backward")} onTouchEnd={stopMove}>⬇</button>
          <button style={btnStyle} onMouseDown={() => startMove("right")} onMouseUp={stopMove} onMouseLeave={stopMove} onTouchStart={() => startMove("right")} onTouchEnd={stopMove}>➡</button>
        </div>
      </div>

      {/* Hint */}
      <div style={{ position: "absolute", bottom: "24px", right: "24px", color: "rgba(148,163,184,0.7)", fontSize: "12px", textAlign: "right" }}>
        <p>Hold arrows to move</p>
        <p>Left drag to look around</p>
      </div>

    </div>
  )
}