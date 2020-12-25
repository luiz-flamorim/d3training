const width = 1000;
const height = 500;
const margin = 50;
let circles;
let xScale;
let yScale;
let rValues = [2, 15];

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

circles = d3.csv('data/boston-housing.csv')
    .then(function (data) {

        data = data.sort(function (a, b) {
            return a.charles - b.charles
        })

        xMinMax = d3.extent(data, function (d) {
            return parseFloat(d.poor);
        })
        yMinMax = d3.extent(data, function (d) {
            return parseFloat(d.rooms);
        })
        rMinMax = d3.extent(data, function (d) {
            return parseFloat(d.value);
        })

        xScale = d3.scaleLinear()
            .domain([xMinMax[1], xMinMax[0]])
            .range([(margin + rValues[1]), (width - margin - rValues[1])])
        yScale = d3.scaleLinear()
            .domain([yMinMax[1], yMinMax[0]])
            .range([(margin + rValues[1]), (height - margin - rValues[1])])
        rScale = d3.scaleLinear()
            .domain([rMinMax[0], rMinMax[1]])
            .range([rValues[0], rValues[1]])
        cScale = d3.scaleOrdinal()
            .domain([0, 1])
            .range(['#333', 'turquoise'])

        circles = svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', function (d) {
                return xScale(d.poor);
            })
            .attr('cy', function (d) {
                return yScale(d.rooms);
            })
            .attr('r', 0)
            .attr('fill', function (d) {
                return cScale(d.charles)
            })
            .style('opacity', function (d) {
                return d.charles == 1 ? 0.5 : 0.3;
            })
            .on('mouseover', function (event, d) {
                console.log(svg.select('circle'))
                info = 'X = Poor families ' + d.poor + '<br />'
                info += 'Y = Number of rooms ' + d.rooms + '<br />'
                info += 'Radius = Property value ' + d.value + '<br />'
                d3.select('#tooltip')
                    .html(info)
                    .style('left', (event.pageX - 80) + 'px')
                    .style('top', (event.pageY - 150) + 'px')
                    .style('opacity', 0.8)

            })
            .on('mouseout', function (event, d) {
                d3.select('#tooltip')
                    .style('opacity', 0)
            })

        xAxis = d3.axisBottom(xScale)
            .ticks(0)
        xAxisG = svg.append('g')
            .attr('id', 'xAxis')
            .attr('class', 'axis')
        xAxisG.call(xAxis)
            .attr('transform', 'translate(0,' + (height - margin) + ')')

        yAxis = d3.axisLeft(yScale)
            .tickValues([yMinMax[0], yMinMax[1]])
        yAxisG = svg.append('g')
            .attr('id', 'yAxis')
            .attr('class', 'axis')
        yAxisG.call(yAxis)
            .attr('transform', 'translate(' + (margin) + ',0)')

        svg.append('text')
            .attr('x', xScale(xMinMax[0]))
            .attr('y', yScale(yMinMax[0]) + margin)
            .attr('class','axisLabel')
            .attr('text-anchor','middle')
            .text('more wealthy')
        svg.append('text')
            .attr('x', xScale(xMinMax[1]))
            .attr('y', yScale(yMinMax[0]) + margin)
            .attr('class','axisLabel')
            .attr('text-anchor','middle')
            .text('less wealthy')

        update();
    });

function update() {
    circles.transition()
        .delay(function (d, i) {
            return i * 3
        })
        .attr('r', function (d) {
            return rScale(d.value)
        })


}