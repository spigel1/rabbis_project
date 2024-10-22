// dataLoader.js
function loadData(url, container, tooltip, yScale, graphWidth) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const nodes = data.nodes;
            const links = data.links;

            // Remove any existing links and nodes before rendering new ones
            container.selectAll(".links").remove();
            container.selectAll(".nodes").remove();

            createNodes(nodes, container, tooltip, yScale, graphWidth);
            createLinks(links, container);
        })
        .catch(error => console.error('Error loading the connections data:', error));
}

function createNodes(nodes, container, tooltip, yScale, graphWidth) {
    // Set initial positions for nodes based on year of birth
    nodes.forEach(node => {
        node.y = yScale(node.birth_year); // Scale according to birth year
        node.x = graphWidth / 2; // Center the nodes horizontally
    });

    const node = container.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`); // Set initial position based on yScale

    // Append circles for each node
    node.append("circle")
        .attr("r", 6)
        .attr("fill", d => NODE_COLOR[d.type] || NODE_COLOR.default)
        .on("mouseover", function (event, d) {
            tooltip.html(`Name: ${d.name}<br>Year of Birth: ${d.birth_year}`)
                .style("visibility", "visible")
                .style("top", (event.pageY + 5) + "px") // Adjust tooltip position
                .style("left", (event.pageX + 5) + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY + 5) + "px")
                .style("left", (event.pageX + 5) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Append labels for each node
    node.append("text")
        .attr("dy", -10) // Adjust vertical position
        .attr("text-anchor", "middle")
        .text(d => d.name);
}

function createLinks(links, container) {
    const link = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");
}
