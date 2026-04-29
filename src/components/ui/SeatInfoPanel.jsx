import { useSeatViewStore } from "../../store/useSeatViewStore"

export default function SeatInfoPanel() {
  const { selectedSeat } = useSeatViewStore()

  if (!selectedSeat) return (
    <p className="text-slate-500 text-sm text-center">
      Click any seat in the 3D view to see details
    </p>
  )

  return (
    <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Selected Seat</p>
          <p className="text-4xl font-bold font-mono text-green-400">{selectedSeat.id}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          selectedSeat.zone === "Business"
            ? "bg-purple-900 text-purple-300"
            : "bg-slate-800 text-slate-300"
        }`}>
          {selectedSeat.zone}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Badge label="Window"   active={selectedSeat.isWindow} />
        <Badge label="Aisle"    active={selectedSeat.isAisle} />
        <Badge label="Middle"   active={selectedSeat.isMiddle} />
        <Badge label="Exit Row" active={selectedSeat.isExit} highlight />
      </div>
    </div>
  )
}

function Badge({ label, active, highlight }) {
  return (
    <div className={`rounded-lg p-3 text-center text-sm font-medium border ${
      active
        ? highlight
          ? "bg-amber-900/50 border-amber-600 text-amber-300"
          : "bg-sky-900/50 border-sky-600 text-sky-300"
        : "bg-[#0c1a2e] border-[#1e3a5f] text-slate-600"
    }`}>
      {label}
    </div>
  )
}