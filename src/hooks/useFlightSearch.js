import { useSeatViewStore } from "../store/useSeatViewStore"

const MOCK_FLIGHTS = {
  "AI171": { airline: "Air India",  flightNumber: "AI171", from: "DEL", to: "BOM", aircraft: "A320" },
  "6E201": { airline: "IndiGo",     flightNumber: "6E201", from: "BLR", to: "DEL", aircraft: "A320" },
  "SG101": { airline: "SpiceJet",   flightNumber: "SG101", from: "HYD", to: "BOM", aircraft: "B737" },
}

export function useFlightSearch() {
  const { setFlightData, setLoading, setError, reset } = useSeatViewStore()

  const searchFlight = async (flightNumber) => {
    reset()
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800)) // simulate API delay

    const key = flightNumber.toUpperCase().trim()
    const flight = MOCK_FLIGHTS[key]

    if (!flight) {
      setError(`Flight "${flightNumber}" not found. Try: AI171, 6E201, SG101`)
    } else {
      setFlightData(flight)
    }

    setLoading(false)
  }

  return { searchFlight }
}