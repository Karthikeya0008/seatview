import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useSeatViewStore } from "../../store/useSeatViewStore"

function Seat({ position, rowNum, col, exitRows }) {
  const [hovered, setHovered] = useState(false)
  const { selectedSeat, setSelectedSeat } = useSeatViewStore()

  const isExit = exitRows?.includes(rowNum)
  const seatId = `${rowNum}${col}`
  const isSelected = selectedSeat?.id === seatId

  let color = "#1e3a5f"
  if (isExit) color = "#854d0e"
  if (hovered) color = "#0ea5e9"
  if (isSelected) color = "#22c55e"

  const handleClick = () => {
    setSelectedSeat({
      id: seatId,
      row: rowNum,
      col,
      isExit,
      isWindow: col === "A" || col === "F",
      isAisle:  col === "C" || col === "D",
      isMiddle: col === "B" || col === "E",
      zone: rowNum <= 4 ? "Business" : "Economy",
    })
  }

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
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
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#1e3a5f]">
      <Canvas camera={{ position: [0, 8, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <CabinGrid aircraftData={aircraftData} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          panSpeed={1.5}
          zoomSpeed={1.2}
          minDistance={2}
          maxDistance={40}
        />
      </Canvas>
    </div>
  )
}