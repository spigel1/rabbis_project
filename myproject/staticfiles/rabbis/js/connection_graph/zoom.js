// zoom.js
function setupZoom(container, svgTimeline, yScale) {
    const zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", function (event) {
            const transform = event.transform;
            container.attr("transform", transform); // Apply zoom and pan transformations
            svgTimeline.select(".y-axis").call(yAxis.scale(transform.rescaleY(yScale))); // Update the timeline y-axis with zoom
        });

    return zoom;
}
