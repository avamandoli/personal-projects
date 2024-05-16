// Define dimensions for the map
const width = 960;
const height = 820;

// Create an SVG element to hold the map
const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "white");

  // Add a title to the map
svg.append("text")
.attr("x", 50)  // Position the title to the left
.attr("y", 40)         // Position the title at the top, with some padding
.attr("text-anchor", "start")  // Left align the text
.style("font-size", "24px")     // Set font size
// .style("font-weight", "bold")   // Set font weight
.style("font-family", "Trebuchet MS")
.text("As abortion laws are kicked back to states, the average U.S. state legislature")
  // title, continued
  svg.append("text")
  .attr("x", 50)  // Position the title to the left
  .attr("y", 65)         // Position the title at the top, with some padding
  .attr("text-anchor", "start")  // Left align the text
  .style("font-size", "24px")     // Set font size
  // .style("font-weight", "bold")   // Set font weight
  .style("font-family", "Trebuchet MS")
  .text("remains less than 1/3 women")  // Set the title text


// add subtitle
svg.append("text")
.attr("x", 50)  // Position the title to the left
.attr("y", 95)         // Position the title at the top, with some padding
.attr("text-anchor", "start")  // Left align the text
.style("font-size", "18px")     // Set font size
// .style("font-weight", "bold")   // Set font weight
.style("font-family", "Trebuchet MS")
.text("Just one state, Nevada, has a state legislature that is over 50% women. Seven states, all in the South,")
 
  //  subtitle, continued
  svg.append("text")
  .attr("x", 50)  // Position the title to the left
  .attr("y", 115)         // Position the title at the top, with some padding
  .attr("text-anchor", "start")  // Left align the text
  .style("font-size", "18px")     // Set font size
  // .style("font-weight", "bold")   // Set font weight
  .style("font-family", "Trebuchet MS")
  .text("have legislatures that are less than 20% women.")



// Define a projection and path generator
const projection = d3.geoAlbersUsa()
  .scale(1200)
  .translate([width / 2, height / 2]);

const path = d3.geoPath()
  .projection(projection);

// Define a color scale
const color = d3.scaleLinear()
  .domain([0, 100])  // Assumes prop_women ranges from 0 to 100
  .range(["#FFFFFF", "#4b0082"]);  // White to dark purple

// Create a tooltip
const tooltip = d3.select("#tooltip");


// Load the GeoJSON data
d3.json("us-states-2.json").then(us => {
  console.log("GeoJSON data loaded:", us);

   // Log the properties of the first GeoJSON feature to understand the structure
   console.log("Sample GeoJSON feature properties:", us.features[0].properties);

  // Load the CSV data
  d3.csv("prop_women_state_names.csv").then(data => {
    console.log("CSV data loaded:", data);

    // Create a map from state names to prop_women values
    const dataMap = new Map(data.map(d => [d.state_name, +d.prop_women])); // Parse prop_women as a number
    
    // Merge the data and geoJSON
    us.features.forEach(d => {
      d.properties.prop_women = dataMap.get(d.properties.NAME);
    });

    console.log("Merged data:", us.features);


    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(us.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", d => {
        const value = d.properties.prop_women;
        return value !== undefined? color(value) : "#ccc";
      })
      .attr("stroke", "black") // Add black border to states
      .attr("stroke-width", 1) // Adjust border width as needed
      .on("mouseover", function(event, d) {
        const value = d.properties.prop_women;
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.properties.NAME}<br>${(value).toFixed(2)}%`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
      });
    }).catch(error => {
      console.error("Error loading CSV data:", error);
    });
  }).catch(error => {
    console.error("Error loading GeoJSON data:", error);
  
  });

