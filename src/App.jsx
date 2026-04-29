import { useState } from "react"
import { useFlightSearch } from "./hooks/useFlightSearch"
import { useSeatViewStore } from "./store/useSeatViewStore"
import { AIRCRAFT_MAP } from "./data/aircraft"
import CabinViewer from "./components/viewer/CabinViewer"
import SeatInfoPanel from "./components/ui/SeatInfoPanel"

function App() {
  const [input, setInput] = useState("")
  const { searchFlight } = useFlightSearch()
  const { flightData, isLoading, error } = useSeatViewStore()

  const handleSearch = (e) => {
    e.preventDefault()
    searchFlight(input)
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#0c1a2e", color: "white" }}>

      {/* Navbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid #1e3a5f", flexShrink: 0 }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>SeatView ✈️</h1>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Flight number e.g. AI171"
            style={{ padding: "8px 16px", borderRadius: "8px", background: "#112240", border: "1px solid #1e3a5f", color: "white", fontFamily: "monospace", fontSize: "14px", width: "260px", outline: "none" }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: "8px 20px", background: "#0ea5e9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
          >
            {isLoading ? "..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <p style={{ color: "#f87171", textAlign: "center", padding: "8px", flexShrink: 0 }}>{error}</p>
      )}

      {/* Main content */}
      {!flightData ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontSize: "48px" }}>✈️</p>
          <p style={{ color: "#94a3b8" }}>Search a flight to explore the cabin in 3D</p>
          <p style={{ color: "#475569", fontSize: "14px" }}>Try: AI171 · 6E201 · SG101</p>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

          {/* Left sidebar */}
          <div style={{ width: "280px", flexShrink: 0, borderRight: "1px solid #1e3a5f", padding: "16px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
            <div style={{ background: "#112240", borderRadius: "12px", padding: "16px" }}>
              <p style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>Flight</p>
              <p style={{ fontSize: "28px", fontWeight: "bold", fontFamily: "monospace" }}>{flightData.flightNumber}</p>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>{flightData.airline}</p>
              <p style={{ color: "#38bdf8", fontWeight: "600" }}>{flightData.from} → {flightData.to}</p>
              <p style={{ color: "#64748b", fontSize: "12px" }}>Aircraft: {flightData.aircraft}</p>
            </div>
            <SeatInfoPanel />
          </div>

          {/* 3D Viewer */}
          <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            <CabinViewer aircraftData={AIRCRAFT_MAP[flightData.aircraft]} />
          </div>

        </div>
      )}
    </div>
  )
}

export default App