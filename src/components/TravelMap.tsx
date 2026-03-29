'use client';

import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { zoom, zoomTransform } from 'd3-zoom';
import { symbol, symbolDiamond } from 'd3-shape';
import * as topojson from 'topojson-client';
import { Location, TravelRoute, TravelActivity } from '@/data/travel-locations';

interface TravelMapProps {
    locations: Location[];
    routes?: TravelRoute[];
    activities?: TravelActivity[];
}

export default function TravelMap({ locations, routes = [], activities = [] }: TravelMapProps) {
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

        const svg = select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Projection
        const projection = geoNaturalEarth1()
            .fitSize([width, height], mapData)
            .translate([width / 2, height / 2]);

        const path = geoPath().projection(projection);

        // Zoom setup
        const g = svg.append("g");

        const mapZoom = zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                const { transform } = event;
                g.attr("transform", transform);

                // Semantic Zoom: Adjust sizes inversely to scale
                g.selectAll(".country").attr("stroke-width", 0.5 / transform.k);
                g.selectAll(".travel-route").attr("stroke-width", (d: any) => (d.hovered ? 4 : 2.5) / transform.k);

                // Standardized Semantic Zoom: Use transform scale for consistent sizing
                g.selectAll(".travel-city-marker")
                    .attr("transform", (d: any) => `scale(${d.hovered ? 1.5 / transform.k : 1 / transform.k})`)
                    .attr("stroke-width", transform.k);

                g.selectAll(".travel-activity-marker")
                    .attr("transform", (d: any) => `scale(${d.hovered ? 1.5 / transform.k : 1 / transform.k})`)
                    .attr("stroke-width", transform.k);
            });

        svg.call(mapZoom);

        // Draw Countries
        g.selectAll("path.country")
            .data(mapData.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path as any)
            .attr("fill", "currentColor")
            .attr("class", "text-slate-200 dark:text-slate-800 stroke-white dark:stroke-slate-900 stroke-[0.5]")
            .style("transition", "fill 0.3s ease");

        // --- Draw Routes ---
        const locationMap = new Map(locations.map(l => [l.name, l]));

        routes.forEach(route => {
            const start = locationMap.get(route.from);
            const end = locationMap.get(route.to);

            if (start && end) {
                const s = projection([start.lng, start.lat]);
                const e = projection([end.lng, end.lat]);

                if (!s || !e) return;

                // Calculate curved path (Quadratic Bezier)
                const dx = e[0] - s[0];
                const dy = e[1] - s[1];

                // Control point offset: perpendicular to the midpoint
                const midX = (s[0] + e[0]) / 2;
                const midY = (s[1] + e[1]) / 2;

                // Curvature factor (higher = more curved)
                const curvature = 0.2;

                // Normal vector (-dy, dx)
                const cpX = midX - dy * curvature;
                const cpY = midY + dx * curvature;

                const pathString = `M${s[0]},${s[1]} Q${cpX},${cpY} ${e[0]},${e[1]}`;

                const isFlight = route.type === 'flight';

                // Route Path
                g.append("path")
                    .datum({ hovered: false })
                    .attr("d", pathString)
                    .attr("fill", "none")
                    .attr("stroke", isFlight ? "#6366f1" : "#f59e0b")
                    .attr("stroke-width", 2.5) // Thicker base line
                    .attr("stroke-dasharray", isFlight ? "4,4" : "none")
                    .attr("class", "travel-route opacity-60 transition-opacity duration-300")
                    .style("cursor", "pointer")
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = zoomTransform(svgRef.current!).k;
                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: route.description || `${route.from} → ${route.to}`
                        });
                        select(event.currentTarget)
                            .attr("stroke-width", 4 / k) // Thicker hover
                            .attr("class", "travel-route opacity-100");
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        select(event.currentTarget)
                            .attr("stroke-width", 2.5 / k) // Return to thicker base
                            .attr("class", "travel-route opacity-60 transition-opacity duration-300");
                    });
            }
        });


        // --- Draw Activities ---
        activities.forEach(activity => {
            const coords = projection([activity.lng, activity.lat]);
            if (coords) {
                const [x, y] = coords;
                const activityGroup = g.append("g")
                    .attr("transform", `translate(${x}, ${y})`)
                    .style("cursor", "pointer");

                // Activity Marker (Diamond shape)
                activityGroup.append("path")
                    .datum({ hovered: false }) // Add local state
                    .attr("class", "travel-activity-marker")
                    .attr("d", symbol().type(symbolDiamond).size(113)) // Match circle r=6 area
                    .attr("fill", "#10b981")
                    .attr("transform", "scale(1)") // Set initial transform
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = zoomTransform(svgRef.current!).k;

                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: activity.name
                        });
                        select(event.currentTarget)
                            .attr("transform", `scale(${1.5 / k})`);
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        select(event.currentTarget)
                            .attr("transform", `scale(${1 / k})`);
                    });
            }
        });


        // --- Draw City Pins ---
        locations.forEach(loc => {
            const coords = projection([loc.lng, loc.lat]);
            if (coords) {
                const [x, y] = coords;

                const pinGroup = g.append("g")
                    .attr("transform", `translate(${x}, ${y})`)
                    .style("cursor", "pointer");


                // Main dot
                pinGroup.append("circle")
                    .datum({ hovered: false })
                    .attr("r", 6) // Increased base radius to match activity marker visual size
                    .attr("class", "travel-city-marker fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-1")
                    .attr("stroke-width", 1)
                    .attr("transform", "scale(1)") // Set initial transform
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = zoomTransform(svgRef.current!).k;
                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: loc.name
                        });
                        select(event.currentTarget)
                            .attr("transform", `scale(${1.5 / k})`)
                            .attr("stroke-width", k);
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        select(event.currentTarget)
                            .attr("transform", `scale(${1 / k})`)
                            .attr("stroke-width", k);
                    });
            }
        });

    }, [mapData, locations, routes, activities]);

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

            {/* Simple Legend */}
            <div className="absolute top-4 left-4 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg text-[10px] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>Visited Cities</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-0.5 bg-amber-500"></div>
                    <span>Routes</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 transform rotate-45 bg-emerald-500"></span>
                    <span>Highlights</span>
                </div>
            </div>

        </div>
    );
}
