// place_nodes.js
export function placeNodes(nodes, yScale, graphWidth) {
    nodes.forEach(node => {
        node.y = yScale(node.birth_year); // Scale according to birth year
        node.x = graphWidth / 2; // Center the nodes horizontally
    });
}

export function updateLinkPositions(link) {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
}
