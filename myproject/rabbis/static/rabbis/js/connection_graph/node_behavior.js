// NodeBehavior.js
export function setupSimulation(nodes, links, graphWidth, graphHeight) {
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(30).strength(1))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2));

    simulation.nodes(nodes).on("tick", () => {
        // Update positions of nodes and links during simulation ticks
    });

    simulation.force("link").links(links);

    return simulation;
}

export function dragHandlers(simulation) {
    return {
        start(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        },
        drag(event, d) {
            d.fx = event.x;
            d.fy = d.y;
        },
        end(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };
}
