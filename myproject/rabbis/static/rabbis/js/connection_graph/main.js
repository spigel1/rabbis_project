// Main.js
import { setupTimeline, updateTimelineZoom } from './time_line.js';
import { setupGraph } from './graph.js';
import { createNodes } from './create_nodes.js';
import { placeNodes, updateLinkPositions } from './place_nodes.js';
import { setupSimulation, dragHandlers } from './node_behavior.js';
import { fetchGraphData } from './utils.js';

document.addEventListener("DOMContentLoaded", async function () {
    const { svgTimeline, yScale, timelineWidth, timelineHeight } = setupTimeline();
    const { svgGraph, container, graphWidth, graphHeight } = setupGraph();

    // Ensure fetchGraphData is awaited since it returns a promise
    const { nodes, links } = await fetchGraphData(connectionsDataUrl, container, graphWidth, yScale);

    const nodeElements = createNodes(container, nodes, yScale, graphWidth, dragHandlers);

    const simulation = setupSimulation(nodes, links, graphWidth, graphHeight);
    simulation.on("tick", function () {
        nodeElements.attr("transform", d => `translate(${d.x}, ${d.y})`);
        updateLinkPositions(container.selectAll(".links line"));
    });

    svgGraph.call(d3.zoom().on("zoom", updateTimelineZoom(svgTimeline, yScale, svgTimeline, graphWidth)));
});
