// tooltip.js
function setupTooltip() {
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "lightgrey")
        .style("padding", "5px")
        .style("border-radius", "5px");

    return tooltip;
}
