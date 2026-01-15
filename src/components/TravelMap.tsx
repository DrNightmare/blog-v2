'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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
                const { transform } = event;
                g.attr("transform", transform);

                // Semantic Zoom: Adjust sizes inversely to scale
                g.selectAll(".country").attr("stroke-width", 0.5 / transform.k);
                g.selectAll(".travel-route").attr("stroke-width", (d: any) => (d.hovered ? 3 : 1.5) / transform.k);

                // Standardized Semantic Zoom: Use transform scale for consistent sizing
                g.selectAll(".travel-city-marker")
                    .attr("transform", (d: any) => `scale(${d.hovered ? 1.5 / transform.k : 1 / transform.k})`)
                    .attr("stroke-width", transform.k);

                g.selectAll(".travel-activity-marker")
                    .attr("transform", (d: any) => `scale(${d.hovered ? 1.5 / transform.k : 1 / transform.k})`)
                    .attr("stroke-width", transform.k);
            });

        svg.call(zoom);

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
                const routePath = {
                    type: "LineString",
                    coordinates: [
                        [start.lng, start.lat],
                        [end.lng, end.lat]
                    ]
                };

                const isFlight = route.type === 'flight';

                // Route Path
                g.append("path")
                    .datum({ ...routePath, hovered: false })
                    .attr("d", path as any)
                    .attr("fill", "none")
                    .attr("stroke", isFlight ? "#6366f1" : "#f59e0b")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-dasharray", isFlight ? "4,4" : "none")
                    .attr("class", "travel-route opacity-60 transition-opacity duration-300")
                    .style("cursor", "pointer")
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        const [tx, ty] = d3.pointer(event, svgRef.current);
                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: route.description || `${route.from} → ${route.to}`
                        });
                        d3.select(event.currentTarget)
                            .attr("stroke-width", 3 / k)
                            .attr("class", "travel-route opacity-100");
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        d3.select(event.currentTarget)
                            .attr("stroke-width", 1.5 / k)
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
                    .attr("d", d3.symbol().type(d3.symbolDiamond).size(80)) // Slightly larger base size
                    .attr("fill", "#10b981")
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        const [tx, ty] = d3.pointer(event, svgRef.current);

                        // Smart tooltip
                        const content = activity.name.toLowerCase().includes(activity.type.toLowerCase())
                            ? activity.name
                            : `${activity.name} (${activity.type})`;

                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: content
                        });
                        d3.select(event.currentTarget)
                            .attr("transform", `scale(${1.5 / k})`)
                            .attr("stroke-width", k);
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        d3.select(event.currentTarget)
                            .attr("transform", `scale(${1 / k})`)
                            .attr("stroke-width", k);
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
                    .attr("r", 4) // Fixed base radius
                    .attr("class", "travel-city-marker fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-1")
                    .attr("stroke-width", 1)
                    .on("mouseenter", (event, d: any) => {
                        d.hovered = true;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        const [tx, ty] = d3.pointer(event, svgRef.current);
                        setTooltip({
                            x: event.pageX,
                            y: event.pageY,
                            content: loc.name
                        });
                        d3.select(event.currentTarget)
                            .attr("transform", `scale(${1.5 / k})`)
                            .attr("stroke-width", k);
                    })
                    .on("mouseleave", (event, d: any) => {
                        d.hovered = false;
                        const k = d3.zoomTransform(svgRef.current!).k;
                        setTooltip(null);
                        d3.select(event.currentTarget)
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
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                    <span>City</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-0.5 bg-indigo-500 border-t border-dashed border-indigo-500 w-3"></span>
                    <span>Flight</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 transform rotate-45 bg-emerald-500"></span>
                    <span>Activity</span>
                </div>
            </div>

        </div>
    );
}
