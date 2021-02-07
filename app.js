var width = 800;
var height = 500;
var padding = 30;
var charPadding = 5;
var newRegionData = regionData.filter(d=>d.medianAge !== null);

var minAge = d3.min(regionData, d=>d.medianAge);
var maxAge = d3.max(regionData, d=>d.medianAge);

var xScale = d3.scaleLinear()
                 .domain(d3.extent(newRegionData, d => d.medianAge))
                 .rangeRound([padding, width - padding]);

var histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(10)
                    .value(d=>d.medianAge);

var bins = histogram(newRegionData);


var yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, d=>d.length)])
                .range([height-padding, padding]);

d3.select(".numOfBins")
    .text("Number of bins:")

var xAxis = d3.axisBottom(xScale)
    .tickSize(-height + 2*padding)
    .tickSizeOuter(0);



var svg= d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .selectAll("g")
    .data(bins)
    .enter()
    .append("g");

svg
    .append("rect")
    .attr("x",d=>xScale(d.x0) + charPadding)
    .attr("y", d=> yScale(d.length))
    .attr("height", d=> height - yScale(d.length))
    .attr("width", d=>{
        var width = xScale(d.x1)-xScale(d.x0)- charPadding;
        return width<0? 0: width;
    })
    .attr("fill", "blue")



d3.select("input")
    .property("min", 0)
    .property("max", maxAge)
    .property("value", maxAge)
    .on("input", ()=>{
        var val = +d3.event.target.value;
        d3.select(".numOfBins")
            .text(`Number of bins: ${val}`)
        histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(val)
                    .value(d=>d.medianAge);
        bins = histogram(newRegionData);
        yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, d=>d.length)])
                .range([height-padding, padding]);


        svg= d3.selectAll("g")
               .selectAll("rect")
               .data(bins)
        
        svg
            .exit()
            .remove()
        
        svg
            .enter()
            .append("rect")
            .merge(svg)
            .attr("x",d=>xScale(d.x0) + charPadding)
            .attr("y", d=> yScale(d.length))
            .attr("height", d=> height - yScale(d.length))
            .attr("width", d=>{
                var width = xScale(d.x1)-xScale(d.x0)- charPadding;
                return width<0? 0: width;
            })
            .attr("fill", "blue")
    })
