// timeline.js
function setupTimeline(svgWidth, svgHeight) {
    const timelineMargin = { top: 20, right: 20, bottom: 20, left: 20 };
    const timelineWidth = svgWidth - timelineMargin.left - timelineMargin.right;
    const timelineHeight = svgHeight - timelineMargin.top - timelineMargin.bottom;

    const yScale = d3.scaleLinear()
        .domain([6000, 0]) // Limiting the timeline to years 0 - 6000
        .range([0, timelineHeight]);

    const yAxis = d3.axisRight(yScale).ticks(10).tickFormat(d3.format("d"));

    const svgTimeline = d3.select("#timeline")
        .append("svg")
        .attr("width", timelineWidth + timelineMargin.left + timelineMargin.right)
        .attr("height", timelineHeight + timelineMargin.top + timelineMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + timelineMargin.left + "," + timelineMargin.top + ")");

    svgTimeline.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll(".tick text")
        .attr("x", 8) // Shift numbers away from the timeline line for better aesthetics
        .style("text-anchor", "start");

    return { svgTimeline, yScale };
}
