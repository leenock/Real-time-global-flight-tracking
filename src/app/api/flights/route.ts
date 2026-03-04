import { NextResponse } from 'next/server';
import { AviationStackResponse, AviationStackFlight } from '@/types/aviationStack';
import { Flight, FlightStatus, LocationInfo } from '@/lib/mockFlights';

const API_KEY = process.env.AVIATION_STACK_API_KEY || '';

function mapFlightStatus(status: string): FlightStatus {
  switch (status) {
    case 'scheduled':
    case 'landed':
      return 'On Time';
    case 'active':
      return 'In Air';
    case 'cancelled':
    case 'diverted':
    case 'incident':
      return 'Cancelled';
    default:
      return 'On Time';
  }
}

function calculateDuration(depStr: string | null, arrStr: string | null): string {
  if (!depStr || !arrStr) return 'N/A';
  const dep = new Date(depStr).getTime();
  const arr = new Date(arrStr).getTime();
  if (isNaN(dep) || isNaN(arr)) return 'N/A';
  
  const diff = arr - dep;
  if (diff <= 0) return 'N/A';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flightNumber');

  if (!flightNumber) {
    return NextResponse.json({ error: 'Flight number is required' }, { status: 400 });
  }

  const query = flightNumber.toUpperCase().trim();

  try {
    // Flight iata is typically what users search, e.g., AA123
    const res = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${query}`);
    
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data: AviationStackResponse = await res.json();

    if (!data.data || data.data.length === 0) {
        return NextResponse.json({ data: [] });
    }

    // Map the results to the frontend's expected Flight format
    const results: Flight[] = data.data.map((f: AviationStackFlight, index) => {
        const originName = f.departure.airport || f.departure.iata || 'Unknown';
        const destName = f.arrival.airport || f.arrival.iata || 'Unknown';

        return {
            id: `${query}-${index}-${f.flight_date}`,
            flightNumber: f.flight.iata || f.flight.icao || f.flight.number || query,
            airline: f.airline.name || 'Unknown Airline',
            origin: {
                airport: f.departure.iata || 'N/A',
                city: originName,
                terminal: f.departure.terminal || 'TBD',
                gate: f.departure.gate || 'TBD'
            },
            destination: {
                airport: f.arrival.iata || 'N/A',
                city: destName,
                terminal: f.arrival.terminal || 'TBD',
                gate: f.arrival.gate || 'TBD'
            },
            departureTime: f.departure.estimated || f.departure.scheduled || new Date().toISOString(),
            arrivalTime: f.arrival.estimated || f.arrival.scheduled || new Date().toISOString(),
            departureTimeZone: f.departure.timezone || 'UTC',
            arrivalTimeZone: f.arrival.timezone || 'UTC',
            status: mapFlightStatus(f.flight_status),
            duration: calculateDuration(f.departure.scheduled, f.arrival.scheduled)
        };
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Failed to fetch from AviationStack:', error);
    return NextResponse.json({ error: 'Failed to retrieve flight data. Please try again later.' }, { status: 500 });
  }
}
