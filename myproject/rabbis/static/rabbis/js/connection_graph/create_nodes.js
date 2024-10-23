// CreateNodes.js
export function createNodes(container, nodes, yScale, graphWidth, dragHandlers) {
    nodes.forEach(node => {
        node.y = yScale(node.birth_year);
        node.x = graphWidth / 2;
    });

    const node = container.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    node.append("circle")
        .attr("r", 3)
        .attr("fill", d => d.type === "rabbi" ? "blue" : d.type === "father" ? "green" : d.type === "wife" ? "red" : "orange")
        .call(d3.drag()
            .on("start", dragHandlers.start)
            .on("drag", dragHandlers.drag)
            .on("end", dragHandlers.end));

    node.append("text")
        .attr("dy", -6)
        .attr("text-anchor", "middle")
        .text(d => d.name);

    return node;
}
