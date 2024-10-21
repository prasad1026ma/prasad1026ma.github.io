import pandas as pd

let data = pd.read_csv('iris.csv').to_dict()
// Define the canvas size and margin
let 
  width = 600,
  height = 400;

let margin = {
  top:30,
  bottom:50,
  left:50,
  right:30
}

let svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'lightyellow')

let yScale = d3.scaleLinear()
              .domain([0,10])
              .range([height - margin.bottom, margin.top]) // starting and ending point of the coordinate change

let xScale = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.5)
let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale)) // Directly use yScale
            .attr('transform', `translate(${margin.left}, 0)`); // Correct position of Y-axis
        
let xAxis = svg.append('g')
            .call(d3.axisBottom(xScale)) // Directly use xScale
            .attr('transform', `translate(0, ${height - margin.bottom})`); // Correct position of X-axis

// Draw the Label

svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 15)
        .text('Name')
        .style('text-anchor', 'middle')
svg.append('text')
        .attr('x', 0- height/2)
        .attr('y', 25)
        .text('Rating')
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')

let circle = svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d=>xScale(d.name) + xScale.bandwidth()/2)
                .attr('cy', d=>yScale(d.rating))
                .attr('r', 6)
