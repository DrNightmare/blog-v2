export interface Location {
    name: string;
    lat: number;
    lng: number;
    visited?: boolean;
    date?: string;
}

export interface TravelRoute {
    from: string;
    to: string;
    type: 'flight' | 'train' | 'road' | 'ferry';
    description?: string;
}

export interface TravelActivity {
    name: string;
    lat: number;
    lng: number;
    type: 'surfing' | 'hiking' | 'food' | 'nature' | 'culture';
    description?: string;
}

export const TRAVEL_ROUTES: TravelRoute[] = [
    { from: "Oslo", to: "Bergen", type: "train", description: "Scenic train ride" },
];

export const TRAVEL_ACTIVITIES: TravelActivity[] = [
    { name: "Surfing in Weligama", lat: 5.9728, lng: 80.4288, type: "surfing", description: "Great beginner waves" },
    { name: "Ha Long Bay Cruise", lat: 20.9101, lng: 107.1839, type: "nature", description: "Limestone karsts" },
];

export const TRAVEL_LOCATIONS: Location[] = [
    {
        "name": "Bangalore",
        "lat": 12.9767936,
        "lng": 77.590082,
        "visited": true
    },
    {
        "name": "Copenhagen",
        "lat": 55.6867243,
        "lng": 12.5700724,
        "visited": true
    },
    {
        "name": "Gothenburg",
        "lat": 57.7072326,
        "lng": 11.9670171,
        "visited": true
    },
    {
        "name": "Oslo",
        "lat": 59.9133301,
        "lng": 10.7389701,
        "visited": true
    },
    {
        "name": "Bergen",
        "lat": 60.3943055,
        "lng": 5.3259192,
        "visited": true
    },
    {
        "name": "Helsinki",
        "lat": 60.1666204,
        "lng": 24.9435408,
        "visited": true
    },
    {
        "name": "Nairobi",
        "lat": -1.2890006,
        "lng": 36.8172812,
        "visited": true
    },
    {
        "name": "Maasai Mara",
        "lat": -2.5031822,
        "lng": 34.8817732,
        "visited": true
    },
    {
        "name": "Singapore",
        "lat": 1.357107,
        "lng": 103.8194992,
        "visited": true
    },
    {
        "name": "Kuala Lumpur",
        "lat": 3.1526589,
        "lng": 101.7022205,
        "visited": true
    },
    {
        "name": "Hanoi",
        "lat": 21.0283334,
        "lng": 105.854041,
        "visited": true
    },
    {
        "name": "Hoi An",
        "lat": 15.8795863,
        "lng": 108.3319406,
        "visited": true
    },
    {
        "name": "Danang",
        "lat": 16.068,
        "lng": 108.212,
        "visited": true
    },
    {
        "name": "Ho Chi Minh City",
        "lat": 10.7755254,
        "lng": 106.7021047,
        "visited": true
    },
    {
        "name": "Colombo",
        "lat": 6.9388614,
        "lng": 79.8542005,
        "visited": true
    },
    {
        "name": "Langkawi",
        "lat": 6.3700386,
        "lng": 99.7928634,
        "visited": true
    }
];
