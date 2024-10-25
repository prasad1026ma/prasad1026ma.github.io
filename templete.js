// Load the data
const iris = d3.csv("iris.csv");

// Once the data is loaded, proceed with plotting
iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
    const width = 600,
        height = 400;

    const margin = {
        top: 30,
        bottom: 50,
        left: 50,
        right: 30
    };
    

    // Create the SVG container
    const svg = d3.select("scatterplot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", "lightyellow")

    // Set up scales for X and Y Axis
    const xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.PetalLength) - 1, d3.max(data, d => d.PetalLength) + 1])
                .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.PetalWidth) - 1, d3.max(data, d => d.PetalWidth) + 1])
                .range([height - margin.bottom, margin.top]);

    // d3.min(data, d => d.bill_length_mm)-5

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Species))
        .range(d3.schemeCategory10);

    // Add scales     
    const yAxis = svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${margin.left}, 0)`);

    const xAxis = svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${height - margin.bottom})`);

    
    // Add circles for each data point
    svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.PetalLength))
    .attr("cy", d => yScale(d.PetalWidth))
    .attr("r", 5)
    .attr("fill", d => colorScale(d.Species))
    .attr("opacity", 0.7);

    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 15)
        .text('Petal Length')
        .style('text-anchor', 'middle');
    
    // Add y-axis label
    svg.append('text')
        .attr('x', 0 - height / 2)
        .attr('y', 25)
        .text('Petal Width')
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)');
    

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");
        
    legend.append("rect")
        .attr("x", width - margin.right - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", width - margin.right - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);

});

iris.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
        
    const width = 600,
        height = 400;

    const margin = {
        top: 30,
        bottom: 50,
        left: 50,
        right: 30
    };

    // Create the SVG container
    const svg = d3.select("boxplot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", "lightyellow")   

    // Set up scales for x and y axes
    const xScale = d3.scaleBand().domain([...new Set(data.map(d => d.Species))])
    .range([margin.left, width - margin.right])
    .padding(0.3);

    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.PetalLength) + 1])
    .range([height - margin.bottom, margin.top]);


    // Add scales     
    const xAxis = svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .selectAll("text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

    const yAxis = svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${margin.left}, 0)`); 

    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .text('Species')
    .style('text-anchor', 'middle');

    // Add y-axis label
    svg.append('text')
    .attr('x', 0 - height / 2)
    .attr('y', 25)
    .text('Petal Length')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)');

    // creates a rollup of the quartile data by species
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.PetalLength).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.median(values);
        const q3 = d3.quantile(values, 0.75);
        return {q1, median, q3};
    };

    // applys the rollup function to each individual species
    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);


    // iterates over every species to draw out the IQR values, box values, and species name
    quartilesBySpecies.forEach((quartiles, Species) => {
        const x = xScale(Species);
        const boxWidth = xScale.bandwidth();
        const iqr = quartiles.q3 - quartiles.q1;

        // Calculate the y-values using yScale
        const lowEnd = Math.max(yScale.domain()[0], quartiles.q1 - 1.5 * iqr);
        const upperEnd = Math.min(yScale.domain()[1], quartiles.q3 + 1.5 * iqr);

        // Draw vertical lines
        svg.append("line")
        .attr("x1", x + boxWidth / 2)
        .attr("x2", x + boxWidth / 2)
        .attr("y1", yScale(lowEnd))
        .attr("y2", yScale(upperEnd))
        .attr("stroke", "black");

        // Draw box
        svg.append("rect")
        .attr("x", x)
        .attr("y", yScale(quartiles.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
        .attr("fill", "lightblue")
        .attr("stroke", "black");
        
        // Draw median line
        svg.append("line")
        .attr("x1", x)
        .attr("x2", x + boxWidth)
        .attr("y1", yScale(quartiles.median))
        .attr("y2", yScale(quartiles.median))
        .attr("stroke", "black");
        
    });
});
