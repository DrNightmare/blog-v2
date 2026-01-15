const https = require('https');
const fs = require('fs');

// The list of cities to geocode
const CITIES = [
    "Colombo",
    "Langkawi"
];

const DELAY_MS = 1500; // Nominatim requires 1 second delay between requests

// console.log(`Starting geocoding for ${CITIES.length} cities...\n`); // Removed to keep stdout clean

const geocodeCity = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

        const options = {
            headers: {
                'User-Agent': 'TravelBlog-Script/1.0' // Required by Nominatim
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                process.stderr.write(`❌ HTTP Error ${res.statusCode} for ${city}\n`);
                res.resume(); // Consume response data to free up memory
                resolve(null);
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        resolve({
                            name: city,
                            lat: parseFloat(json[0].lat),
                            lng: parseFloat(json[0].lon),
                            visited: true
                        });
                    } else {
                        process.stderr.write(`❌ Could not find coordinates for: ${city}\n`);
                        resolve(null);
                    }
                } catch (e) {
                    process.stderr.write(`❌ JSON Parse Error for ${city}: ${e.message}\n`);
                    process.stderr.write(`Response snippet: ${data.substring(0, 100)}...\n`);
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const processCities = async () => {
    const results = [];

    // Use stderr for progress so stdout remains clean for piping/copying
    process.stderr.write(`Starting geocoding for ${CITIES.length} cities...\n`);

    for (const city of CITIES) {
        process.stderr.write(`Fetching ${city}... `);
        try {
            const loc = await geocodeCity(city);
            if (loc) {
                process.stderr.write(`✅ (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})\n`);
                results.push(loc);
            }
        } catch (error) {
            process.stderr.write(`\nError fetching ${city}: ${error.message}\n`);
        }

        // Wait before next request
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }

    // Output ONLY the final array to stdout for easy copy-pasting
    console.log(JSON.stringify(results, null, 4));
};

processCities();
