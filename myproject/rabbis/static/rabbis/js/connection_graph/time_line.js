// Timeline.js
export function setupTimeline() {
    var timelineMargin = { top: 12, right: 60, bottom: 12, left: 60 };
    var timelineWidth = 100 - timelineMargin.left - timelineMargin.right;
    var timelineHeight = 500 - timelineMargin.top - timelineMargin.bottom;

    var yScale = d3.scaleLinear()
        .domain([6000, 0])
        .range([0, timelineHeight]);

    var yAxis = d3.axisRight(yScale)
        .ticks(7)
        .tickFormat(d3.format("d"));

    var svgTimeline = d3.select("#timeline")
        .append("svg")
        .attr("width", timelineWidth + timelineMargin.left + timelineMargin.right)
        .attr("height", timelineHeight + timelineMargin.top + timelineMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + timelineMargin.left + "," + timelineMargin.top + ")");

    svgTimeline.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll(".tick text")
        .attr("x", -2)
        .style("text-anchor", "start");

    return { svgTimeline, yScale, yAxis, timelineWidth, timelineHeight };
}

export function updateTimelineZoom(svgTimeline, yScale, yAxis, graphWidth) {
    return function zoomed(event) {
        var transform = event.transform;
        svgTimeline.select(".y-axis").call(
            d3.axisRight(transform.rescaleY(yScale))
                .ticks(7)
                .tickFormat(d3.format("d"))
                .tickSize(-graphWidth)
        );
        svgTimeline.selectAll(".tick line").attr("x2", -graphWidth);
        svgTimeline.selectAll(".tick text").attr("x", -2).style("text-anchor", "start");
    };
}
