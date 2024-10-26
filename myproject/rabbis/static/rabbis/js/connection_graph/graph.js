// 1. Initial Setup & Event Listener
document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading page, starting with setting D3...");

    // This starts by adding an event listener to wait for the page to fully load (DOMContentLoaded event).
    // Once the page is ready, a message is logged to the console.


    // 2. Timeline Configuration
    var timelineMargin = { top: 12, right: 60, bottom: 12, left: 60 };
    var timelineWidth = 100 - timelineMargin.left - timelineMargin.right;
    var timelineHeight = 500 - timelineMargin.top - timelineMargin.bottom;

    var yScale = d3.scaleLinear()
        .domain([6000, 0]) // Limiting the timeline to years 0 - 6000
        .range([0, timelineHeight]);

    var yAxis = d3.axisRight(yScale)
        .ticks(7)
        .tickFormat(d3.format("d"));

    // Timeline margins are set, which define padding around the content.
    // timelineWidth and timelineHeight define the inner size of the timeline SVG element, excluding margins.
    // A linear scale (yScale) is defined to map the range of years (6000 to 0) to pixel positions on the Y-axis.
    // The Y-axis (yAxis) is created using d3.axisRight to place ticks on the right, showing year labels, with 7 ticks evenly spaced.


    // 3. Rendering the Timeline SVG
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
        .attr("x", -2) // Shift numbers away from the timeline line for better aesthetics
        .style("text-anchor", "start");

    // An SVG element is created inside the #timeline container, adjusted for margin.
    // The Y-axis (yAxis) is rendered within the SVG, with labels shifted right (x, 8px) for aesthetics.


    // 4. Zoom and Pan Setup for Graph
    var graphWidth = 900;
    var graphHeight = 500;

    var zoom = d3.zoom()
        .scaleExtent([1, 14]) // Set zoom limits
        .translateExtent([[-graphWidth * 0.5, 0], [graphWidth * 1.5, graphHeight]]) // Limit panning
        .on("zoom", zoomed);

    var svgGraph = d3.select("#graph")
        .append("svg")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .call(zoom);

    var container = svgGraph.append("g");

    // The graph area (another SVG) is set with dimensions of 900px width and 500px height.
    // A zoom behavior is created, allowing scaling between 0.5 and 10x and calling the zoomed function to apply transformations.
    // A g container group is added inside the graph SVG, which will hold the graph elements (nodes, links).
    
    // 5. Setting Up Force Simulation
    
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(60).strength(1))
        .force("charge", d3.forceManyBody().strength(-60))
        .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2));
    // Define the force simulation at a higher (global) level

    // A force simulation is created to simulate the movement and interaction of nodes and links.
    // Nodes repel each other using d3.forceManyBody, and links connect them using d3.forceLink.

    // 6. Zoom Function
    function zoomed(event) {
        var transform = event.transform;
        container.attr("transform", transform); // Apply zoom and pan transformations

        // Rescale the y-axis and update its position
        var new_yScale = transform.rescaleY(yScale);
        svgTimeline.select(".y-axis").call(
            d3.axisRight(new_yScale)
                .ticks(7)
                .tickFormat(d3.format("d"))
                .tickSize(-graphWidth) // Extend tick marks across the graph
        );

        // Ensure uniform tick size after zoom or pan
        svgTimeline.selectAll(".tick line").attr("x2", -graphWidth);
        svgTimeline.selectAll(".tick text").attr("x", -2).style("text-anchor", "start");

        // Inverse scaling: zoom in (larger transform.k) makes the circles smaller
        const inverseScaleFactor = 1 / transform.k; // Inverse zoom scale for circles and text

        // Scale node circles (make smaller when zooming in, bigger when zooming out)
        container.selectAll("circle")
            .attr("r", 5 * inverseScaleFactor) // Adjust the radius as needed
            .style("stroke-width", `${0.5 * inverseScaleFactor}px`); // Scale stroke-width inversely


        // Scale node text size only, without adjusting `dy`
        container.selectAll("text")
            .style("font-size", `${10 * inverseScaleFactor}px`)  // Scale text size inversely

        // Adjust the link thickness and opacity
        container.selectAll("line")
            .style("stroke-width", `${2 * inverseScaleFactor}px`) // Scale link thickness inversely
            .attr("stroke-dasharray", d => {
                // Keep same dashed pattern regardless of zoom
                return d.relation === "spouse" ? `${5 * inverseScaleFactor},${5 * inverseScaleFactor}` : "none";
            });
            // .style("stroke-opacity", Math.min(1, 0.6 * inverseScaleFactor)); // Adjust opacity

        // Scale node text size and position
        container.selectAll("text")
            .style("font-size", `${15 * inverseScaleFactor}px`) // Scale text size inversely
            .attr("dy", -10 * inverseScaleFactor); // Adjust the vertical offset inversely
            // console.log(20 ** inverseScaleFactor, "חידוש", "       ", 15 * inverseScaleFactor, "ישן");


        // Dynamically adjust the link distance based on zoom level
        const linkDistance = 60 * inverseScaleFactor; // Adjust link distance relative to zoom

        // Update force simulation with the new link distance
        simulation.force("link").distance(linkDistance); // Dynamically adjust link distance
        simulation.alpha(1).restart(); 


    }


    // The zoomed function is called during zoom/pan events.
    // The transformation (event.transform) is applied to the container, moving all the graph contents accordingly.
    // The Y-axis is rescaled dynamically to match the zoom level.

    
    // 7. Fetching and Handling Data
    fetch(connectionsDataUrl)
        .then(response => response.json())
        .then(data => {
            const nodes = data.nodes;
            const links = data.links;

    // Data for nodes and links is fetched from an external URL (connectionsDataUrl).
    // Once received, it's parsed as JSON and stored as nodes and links.


    // 8. Clearing Previous Nodes/Links
    container.selectAll(".links").remove();
    container.selectAll(".nodes").remove();

    // Before rendering new data, any existing nodes or links are cleared from the container.


    // 9. Setting Node Positions
    nodes.forEach(node => {
        node.y = yScale(node.birth_year); // Scale according to birth year
        node.x = graphWidth / 2; // Center the nodes horizontally
    });

    // The initial positions of the nodes are determined by scaling the birth year (yScale).
    // All nodes are horizontally centered at the midpoint of the graph (graphWidth / 2).


    // 10 Creating Links with Different Styles Based on Relationship
    const link = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", d => {
            // Thicker lines for parent-child, thinner for spouse
            return d.relation === "parent" ? 3 : d.relation === "spouse" ? 2 : 1;
        })
        .attr("stroke", d => {
            // Different colors for different relationships
            return d.relation === "parent" ? "green" : d.relation === "spouse" ? "blue" : "#999";
        })
        .attr("stroke-dasharray", d => {
            // Solid line for parent-child, dashed line for spouses
            return d.relation === "spouse" ? "5,5" : "none"; 
        });


    // Links between nodes are drawn using line elements.
    // Each link connects two nodes, and all links are styled similarly.

    // 11. Creating Nodes
    const node = container.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Each node is represented as a g element, which holds both the circle and text label.
    // The position of each node is set according to its initial x and y values.

    // 12. Rendering Node Circles (Larger for Text)
    // Rendering Node Circles (as smaller dots)
    node.append("circle")
        .attr("r", 5)  // Small radius to make it look like a dot
        .attr("fill", d => d.type === "rabbi" ? "blue" : d.type === "father" ? "green" : d.type === "wife" ? "red" : "orange")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Circles are added for each node.
        // The fill color depends on the type of node (e.g., "rabbi," "father").
        // Nodes are draggable with D3's drag behaviors.

    // 13. Rendering Node Labels Inside the Circle
    // Text label positioned above the circle
    node.append("text")
        .attr("dy", -10)  // Position above the circle
        .attr("text-anchor", "middle")  // Center-align the text
        .text(d => d.name.length > 8 ? d.name.slice(0, 6) + '...' : d.name)
        .attr("fill", "#000")  // Dark text color for visibility
        .style("font-size", "15px");

    // Each node has a label (text) showing the name of the individual.
    // The text is positioned above the node circle (dy: -10).

   // 14. Ticking the Simulation
    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        // Update both the circle and the text position together in each `g` element (node group)
        node.attr("transform", d => {
            // Keep `y` position based on birth year or any updated `y` value
            d.y = yScale(d.birth_year); // Set y position based on birth year
            return `translate(${d.x}, ${d.y})`;
        });
    
        // Update link positions dynamically
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
    
    
    // The `ticked` function updates node and link positions as the simulation runs.
    // Nodes maintain their `x` and `y` positions, while links are drawn between the source and target nodes.


    // 15. Drag Handlers
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = d.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; // Allow free movement after dragging
        d.fy = null; // Allow free movement after dragging
    }
    // These handlers manage the dragging of nodes, temporarily fixing their positions (fx, fy) during the drag, and releasing them afterward
    })
    .catch(error => console.error('Error loading the connections data:', error));
});
