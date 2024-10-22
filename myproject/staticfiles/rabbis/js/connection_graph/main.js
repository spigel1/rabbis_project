document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading page, starting with setting D3...");

    // Setup timeline first
    const { svgTimeline, yScale } = setupTimeline(100, 500);
    
    // Then setup graph and get container
    const { svgGraph, container } = setupGraph(900, 500);

    // Call setupZoom only after container is initialized
    const zoomHandler = setupZoom(container, svgTimeline, yScale);
    
    svgGraph.call(zoomHandler); // Apply zoom to the graph

    const tooltip = setupTooltip();
    loadData(connectionsDataUrl, container, tooltip, yScale, 900);
});
