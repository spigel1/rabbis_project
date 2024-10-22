// graph.js
function setupGraph(svgWidth, svgHeight, zoomHandler) {
    const svgGraph = d3.select("#graph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .call(zoomHandler);

    const container = svgGraph.append("g");

    return { svgGraph, container };
}
