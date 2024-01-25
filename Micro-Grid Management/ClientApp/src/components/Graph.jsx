import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, width, height }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3
            .scaleBand()
            .domain(data.map(d => d.label))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([innerHeight, 0]);

        const line = d3
            .line()
            .x(d => xScale(d.label) + xScale.bandwidth() / 2 + margin.left)
            .y(d => yScale(d.value) + margin.top);

        svg.selectAll('*').remove();

        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg
            .append('g')
            .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
            .call(xAxis);

        svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(yAxis);

    }, [data, width, height]);

    return <svg ref={svgRef} width={width} height={height} />;
};

export default LineGraph;
