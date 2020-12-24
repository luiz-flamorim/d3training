const width = 1000;
const height = 500;

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

d3.csv('boston-housing.csv')
    .then(function(data){
        console.log(data)
    })