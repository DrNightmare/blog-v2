'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Location } from '@/data/travel-locations';

interface TravelMapProps {
    locations: Location[];
}

export default function TravelMap({ locations }: TravelMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const [mapData, setMapData] = useState<any>(null);

    // Fetch Map Data
    useEffect(() => {
        fetch('/data/world-110m.json')
            .then(res => res.json())
            .then(data => {
                const countries = topojson.feature(data, data.objects.countries);
                setMapData(countries);
            })
            .catch(err => console.error("Failed to load map data", err));
    }, []);

    // Draw Map
    useEffect(() => {
        if (!mapData || !containerRef.current || !svgRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = Math.min(width * 0.6, 600); // Aspect ratio

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Projection
        const projection = d3.geoNaturalEarth1()
            .fitSize([width, height], mapData)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Zoom setup
        const g = svg.append("g");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Draw Countries
        g.selectAll("path")
            .data(mapData.features)
            .enter().append("path")
            .attr("d", path as any)
            .attr("fill", "currentColor")
            .attr("class", "text-slate-200 dark:text-slate-800 stroke-white dark:stroke-slate-900 stroke-[0.5]")
            .style("transition", "fill 0.3s ease");

        // Draw Pins
        locations.forEach(loc => {
            const coords = projection([loc.lng, loc.lat]);
            if (coords) {
                const [x, y] = coords;

                // Pulse effect group
                const pinGroup = g.append("g")
                    .attr("transform", `translate(${x}, ${y})`)
                    .style("cursor", "pointer");



                // Main dot
                pinGroup.append("circle")
                    .attr("r", 3)
                    .attr("class", "fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-1")
                    .on("mouseenter", (event) => {
                        const [tx, ty] = d3.pointer(event, svgRef.current); // Tooltip relative to SVG
                        setTooltip({
                            x: event.pageX, // Global page coordinates for fixed tooltip
                            y: event.pageY,
                            content: loc.name
                        });
                        d3.select(event.currentTarget).attr("r", 5);
                    })
                    .on("mouseleave", (event) => {
                        setTooltip(null);
                        d3.select(event.currentTarget).attr("r", 3);
                    });
            }
        });

    }, [mapData, locations]);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            // Force re-render logic if needed, or rely on key 
            // Ideally we just re-run the draw effect.
            // Simplest is to just toggle a state or let the effect dependency on dimensions trigger.
            // But layout changes happen outside react.
            // let's reload the page or debounce... 
            // For now, simpler: reload on resize isn't great. 
            // We can assume the effect runs if we add window width to dependency, 
            // but that causes full redraws. D3 is fast enough for this simple map.
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={containerRef} className="w-full relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <svg ref={svgRef} className="w-full block touch-pan-x touch-pan-y"></svg>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-8px]"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.content}
                </div>
            )}

            <div className="absolute bottom-4 right-4 text-[10px] text-slate-400">
                Zoom & Pan Enabled
            </div>
        </div>
    );
}
