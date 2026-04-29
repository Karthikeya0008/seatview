export const A320 = {
  aircraftType: "A320",
  totalRows: 30,
  columns: ["A", "B", "C", "D", "E", "F"],
  exitRows: [12, 13],
  seatPitch: 1.2,
  seatWidth: 0.45,
  aisleWidth: 0.9,
}

export const AIRCRAFT_MAP = {
  "A320": A320,
  "B737": A320, // reuse for now
}