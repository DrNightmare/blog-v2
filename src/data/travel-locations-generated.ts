export interface Location {
    name: string;
    lat: number;
    lng: number;
    visited?: boolean;
    date?: string;
}

export const TRAVEL_LOCATIONS: Location[] = [];
