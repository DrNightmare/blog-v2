export interface Location {
    name: string;
    lat: number;
    lng: number;
    visited?: boolean;
    date?: string;
}

export const TRAVEL_LOCATIONS: Location[] = [
    { name: "Bangalore", lat: 12.9716, lng: 77.5946, visited: true },
    { name: "Copenhagen", lat: 55.6761, lng: 12.5683, visited: true },
    { name: "Gothenburg", lat: 57.7089, lng: 11.9746, visited: true },
    { name: "Oslo", lat: 59.9139, lng: 10.7522, visited: true },
    { name: "Bergen", lat: 60.3913, lng: 5.3221, visited: true },
    { name: "Helsinki", lat: 60.1695, lng: 24.9354, visited: true },
    { name: "Nairobi", lat: -1.2921, lng: 36.8219, visited: true },
    { name: "Maasai Mara", lat: -1.5521, lng: 35.1500, visited: true },
    { name: "Singapore", lat: 1.3521, lng: 103.8198, visited: true },
    { name: "Kuala Lumpur", lat: 3.1319, lng: 101.6841, visited: true },
    { name: "Hanoi", lat: 21.0285, lng: 105.8542, visited: true },
    { name: "Hoi An", lat: 15.8801, lng: 108.3380, visited: true },
    { name: "Danang", lat: 16.0544, lng: 108.2022, visited: true },
    { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, visited: true },
];
