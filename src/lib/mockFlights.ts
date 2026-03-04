export type FlightStatus = 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'In Air';

export interface LocationInfo {
  airport: string;
  city: string;
  terminal: string;
  gate: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: LocationInfo;
  destination: LocationInfo;
  departureTime: string; // ISO
  arrivalTime: string; // ISO
  departureTimeZone: string;
  arrivalTimeZone: string;
  status: FlightStatus;
  duration: string;
}

export const mockFlights: Flight[] = [
  {
    id: "f1",
    flightNumber: "AA123",
    airline: "American Airlines",
    origin: { airport: "LAX", city: "Los Angeles", terminal: "4", gate: "44A" },
    destination: { airport: "JFK", city: "New York", terminal: "8", gate: "12" },
    departureTime: "2026-03-05T08:00:00Z",
    arrivalTime: "2026-03-05T16:30:00Z",
    departureTimeZone: "PST",
    arrivalTimeZone: "EST",
    status: "On Time",
    duration: "5h 30m"
  },
  {
    id: "f2",
    flightNumber: "DL456",
    airline: "Delta Air Lines",
    origin: { airport: "ATL", city: "Atlanta", terminal: "S", gate: "E14" },
    destination: { airport: "LHR", city: "London", terminal: "3", gate: "22" },
    departureTime: "2026-03-05T18:30:00Z",
    arrivalTime: "2026-03-06T08:15:00Z",
    departureTimeZone: "EST",
    arrivalTimeZone: "GMT",
    status: "In Air",
    duration: "8h 45m"
  },
  {
    id: "f3",
    flightNumber: "UA789",
    airline: "United Airlines",
    origin: { airport: "SFO", city: "San Francisco", terminal: "3", gate: "F12" },
    destination: { airport: "ORD", city: "Chicago", terminal: "1", gate: "B18" },
    departureTime: "2026-03-05T09:15:00Z",
    arrivalTime: "2026-03-05T15:20:00Z",
    departureTimeZone: "PST",
    arrivalTimeZone: "CST",
    status: "Delayed",
    duration: "4h 05m"
  },
  {
    id: "f4",
    flightNumber: "BA12",
    airline: "British Airways",
    origin: { airport: "SIN", city: "Singapore", terminal: "1", gate: "C22" },
    destination: { airport: "LHR", city: "London", terminal: "5", gate: "A10" },
    departureTime: "2026-03-05T23:15:00Z",
    arrivalTime: "2026-03-06T05:55:00Z",
    departureTimeZone: "SGT",
    arrivalTimeZone: "GMT",
    status: "On Time",
    duration: "14h 40m"
  },
  {
    id: "f5",
    flightNumber: "JBU505",
    airline: "JetBlue Airways",
    origin: { airport: "BOS", city: "Boston", terminal: "C", gate: "C14" },
    destination: { airport: "MIA", city: "Miami", terminal: "N", gate: "D4" },
    departureTime: "2026-03-05T10:00:00Z",
    arrivalTime: "2026-03-05T13:45:00Z",
    departureTimeZone: "EST",
    arrivalTimeZone: "EST",
    status: "On Time",
    duration: "3h 45m"
  }
];
