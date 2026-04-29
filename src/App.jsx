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
    <div className="min-h-screen bg-[#0c1a2e] text-white flex flex-col items-center justify-center gap-6 px-4">

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">SeatView ✈️</h1>
        <p className="text-slate-400 mt-2 text-sm">Type your flight number and explore your seat in 3D</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. AI171, 6E201, SG101"
          className="flex-1 px-4 py-3 rounded-lg bg-[#112240] border border-[#1e3a5f] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {flightData && (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 w-full max-w-md space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Flight Found ✅</p>
          <p className="text-2xl font-bold font-mono">{flightData.flightNumber}</p>
          <p className="text-slate-400 text-sm">{flightData.airline}</p>
          <p className="text-sky-400 font-semibold">{flightData.from} → {flightData.to}</p>
          <p className="text-slate-500 text-xs">Aircraft: {flightData.aircraft}</p>
        </div>
      )}

      {flightData && (
        <div className="w-full max-w-2xl">
          <CabinViewer aircraftData={AIRCRAFT_MAP[flightData.aircraft]} />
        </div>
      )}

      {flightData && <SeatInfoPanel />}

    </div>
  )
}

export default App