import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useSeatViewStore } from "../../store/useSeatViewStore"
import * as THREE from "three"

function CabinModel() {
  const { scene } = useGLTF("/models/cabin.glb")
  const { setSelectedSeat } = useSeatViewStore()

  const handleClick = (e) => {
    e.stopPropagation()
    const mesh = e.object
    const worldPos = new THREE.Vector3()
    mesh.getWorldPosition(worldPos)

    // Ignore non-seat clicks (doors, floor etc.)
    if (Math.abs(worldPos.y) > 1.5) return

    // Determine row from z position
    // Front of cabin is z≈14, rows go back (decreasing z)
    // Each row is ~0.76 units apart
    const row = Math.max(1, Math.round((14 - worldPos.z) / 0.76) + 1)

    // Determine column from x position
    // Right side (x > 0) = D, E, F
    // Left side (x < 0) = A, B, C
    let col
    if (worldPos.x > 0.5) col = "D"
    else if (worldPos.x < -0.5) col = "A"
    else col = "C" // near aisle

    const seatId = `${Math.min(row, 32)}${col}`

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

    console.log("Selected:", seatId, worldPos)
  }

  return <primitive object={scene} onClick={handleClick} />
}
function CabinGrid({ aircraftData }) {
  const { totalRows, columns, seatPitch, seatWidth, aisleWidth, exitRows } = aircraftData
  const seats = []

  columns.forEach((col, i) => {
    const half = columns.length / 2
    const side = i < half ? -1 : 1
    const indexInSide = i < half ? i : i - half
    const x = side * (aisleWidth / 2 + (indexInSide + 0.5) * seatWidth)

    for (let row = 1; row <= totalRows; row++) {
      const z = -row * seatPitch
      seats.push(
        <Seat
          key={`${row}${col}`}
          position={[x, 0, z]}
          rowNum={row}
          col={col}
          exitRows={exitRows}
        />
      )
    }
  })

  return <>{seats}</>
}
export default function CabinViewer({ aircraftData }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
  style={{ width: "100%", height: "100%" }}
  camera={{ position: [0, 0, 0], fov: 75 }}
>
  <ambientLight intensity={1} />
  <directionalLight position={[5, 5, 5]} intensity={1.5} />
  <CabinModel />
  {/* <CabinGrid aircraftData={aircraftData} /> */}
  <OrbitControls
    enablePan={true}
    enableZoom={true}
    enableRotate={true}
    panSpeed={1.5}
    zoomSpeed={1.2}
    minDistance={1}
    maxDistance={40}
  />
</Canvas>
    </div>
  )
}