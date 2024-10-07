// D3 setup to create a timeline and hierarchical tree
const svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height)
              .call(d3.zoom().on("zoom", (event) => {
                  svg.attr("transform", event.transform); // Enable zooming and panning
              }));

// Create timeline background
const timeScale = d3.scaleTime()
                    .domain([startYear, endYear]) // Example: 1000 BCE to 1000 CE
                    .range([0, width]);

svg.append("g")
   .attr("class", "timeline")
   .call(d3.axisBottom(timeScale).tickFormat(d3.timeFormat("%Y"))); // Axis with time labels

// Create hierarchical tree layout
const tree = d3.tree().size([height, width]);

// Position nodes based on hierarchical data
const root = d3.hierarchy(treeData);
const treeLayout = tree(root);

// Draw connections between nodes
svg.selectAll(".link")
   .data(treeLayout.links())
   .enter()
   .append("line")
   .attr("x1", d => d.source.x)
   .attr("y1", d => d.source.y)
   .attr("x2", d => d.target.x)
   .attr("y2", d => d.target.y)
   .attr("stroke", "black");

// Draw the nodes (people)
svg.selectAll(".node")
   .data(treeLayout.descendants())
   .enter()
   .append("circle")
   .attr("cx", d => d.x)
   .attr("cy", d => timeScale(d.data.birthYear)) // Position based on birth year
   .attr("r", 5)
   .attr("fill", "blue");
