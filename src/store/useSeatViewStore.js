import { create } from "zustand"

export const useSeatViewStore = create((set) => ({
  flightData: null,
  isLoading: false,
  error: null,
  selectedSeat: null,   // ← add this

  setFlightData: (data) => set({ flightData: data, error: null }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg, isLoading: false }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),  // ← add this
  reset: () => set({ flightData: null, error: null, selectedSeat: null }),
}))