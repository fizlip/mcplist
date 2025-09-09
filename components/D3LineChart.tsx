"use client";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3LineChartProps {
  data: number[];
  height?: number;
}

export default function D3LineChart({ data, height = 60 }: D3LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 15, bottom: 20, left: 15 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data) as [number, number])
      .range([innerHeight, 0]);

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveLinear);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add circles
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d))
      .attr("r", 3)
      .attr("fill", "#3b82f6");

    // Add labels
    g.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d) - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", "#666")
      .text(d => d);

  }, [data, width, height]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ display: 'block' }}
      />
    </div>
  );
}
