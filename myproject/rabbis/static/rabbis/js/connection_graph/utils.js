// utils.js
export async function fetchGraphData(url, container, graphWidth, yScale) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const nodes = data.nodes || [];
        const links = data.links || [];

        // Clear previous nodes and links
        container.selectAll(".links").remove();
        container.selectAll(".nodes").remove();

        // Set node positions using a utility function
        placeNodes(nodes, yScale, graphWidth);

        return { nodes, links };
    } catch (error) {
        console.error('Error loading the graph data:', error);
        return { nodes: [], links: [] }; // Return empty arrays on error to avoid destructuring issues
    }
}
