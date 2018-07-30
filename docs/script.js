const padding = 2;

const margin = { top: 10, right: 5, bottom: 10, left: 5 };
const width = d3.select('.chart').node().getBoundingClientRect().width;
const height = d3.select('.chart').node().getBoundingClientRect().width;

// From colorbrewer Dark2 + 2
var colour = d3.scaleOrdinal()
    .range(["#1b9e77","#d95f02","#6a3d9a","#e7298a","#66a61e","#e6ab02","#a6761d","#666666","#4682b4", "#ef2f32"]);

const tooltip = d3.select("body").append("div")
    .style("opacity", 0);

document.addEventListener("DOMContentLoaded", function(e) {

  //Chart 1: all user-led grants
  var chartsimple = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {

      grid = d3.select("#chart-simple")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "block")
        .style("width", 8 + "px")
        .style("height", 8 + "px")
        .style("background-color", "steelblue")
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(300)
            .style("opacity", 0);
          })
        .style('opacity', 0)
        .transition()
        .delay(function(d, i) { return i*5; })
        .style('opacity', 1)
        .transition()
        .delay(6000)
        .style("background-color", function(d){
          return colour(d.Theme);
        });
    });
  }(d3);

  //Chart 2: grants sorted by theme
  var chartcolours = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {

      data.sort(function(a, b) {return d3.descending(a.ThemeFreq, b.ThemeFreq);});

      grid = d3.select("#chart-colours")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "block")
        .style("width", 8 + "px")
        .style("height", 8 + "px")
        .style("background-color", function(d){
          return colour(d.Theme);
        })
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });


      legendValues = d3.set(data.map( function(d) { return d.Theme } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

    });
  }(d3);

  //Chart 3: grants sorted by amount of funding
  var chartsize = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {

      var datasmall = data.filter(function(d) { return d.AmountAwarded < 214340846; })

      datasmall.sort(function(a, b) {return d3.descending(a.AmountAwarded, b.AmountAwarded);});

      var sqrtScale = d3.scaleLinear()
        .domain([ d3.min(datasmall, function(d) { return d.AmountAwarded;}),
                  d3.max(datasmall, function(d) { return d.AmountAwarded;})
                ])
        .range([3, 850]);

      var width = function(d) { return sqrtScale(d.AmountAwarded) + "px"};
      var height = 8 + "px";

      grid = d3.select("#chart-size")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .selectAll("rect")
        .data(datasmall)
        .enter()
        .append("div")
        .attr("class", "block")
        .style("background-color", function(d){
          return colour(d.Theme);
        })
        .style('width', width)
        .style('height', height)
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });

      legendValues = d3.set(data.map( function(d) { return d.Theme } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

    });
  }(d3);

  //Chart 4: grants sorted by the type of the recipient organisation
  var chartorgtype = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {
       
      data.sort(function(a, b) {return d3.descending(a.ThemeFreq, b.ThemeFreq);});
      data.sort(function(a, b) {return d3.descending(a.OrgTypeFreq, b.OrgTypeFreq);});

      const nest = d3
        .nest()
        .key(d => d.OrgType)
        .entries(data);

      grid = d3.select("#chart-orgtype")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("class", "column-chart")

      const group = grid.selectAll('#group')
      	.data(nest)
      	.enter()
      	.append('div')
        .attr("id", function(d) { if (d.key == "Charity") {
          return d.key;
        } else {
          return "group";}
        });
      console.log(nest);

      group.selectAll('.block')
      	.data(d => d.values)
      	.enter()
      	.append('div')
        .style("width", 8 + "px")
        .style("height", 8 + "px")
        .style('background-color', function(d){
          return colour(d.Theme);
        })
        .attr("class", "block")
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });

      group.append('div')
          .style("width", "500px")

      group.append('text')
          .attr("class", "labels")
          .text(d => d.key);

      legendValues = d3.set(data.map( function(d) { return d.Theme } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

    });
  }(d3);


  //Chart 5: grants sorted by the funding organisation
  var chartfundingorg = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {
      
      data.sort(function(a, b) {return d3.descending(a.ThemeFreq, b.ThemeFreq);});
      data.sort(function(a, b) {return d3.descending(a.OrgFreq, b.OrgFreq);});

      const nest = d3
        .nest()
        .key(d => d.FundingOrgName)
        .entries(data);

      grid = d3.select("#chart-fundingorg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

      const group = grid.selectAll('.group-rows')
        .data(nest)
        .enter()
        .append('div')
        .attr('class', 'group-rows');

      group.selectAll('.block')
        .data(d => d.values)
        .enter()
        .append('div')
        .attr('class', 'block')
        .style("width", 7 + "px")
        .style("height", 7 + "px")
        .style('background-color', function(d){
          return colour(d.Theme);
        })
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });

      group
        .append('div')
        .style("width", "5px")

      group
        .append('text')
        .attr("class", "labels")
        .text(d => d.key);

      legendValues = d3.set(data.map( function(d) { return d.Theme } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

    });
  }(d3);

  //Chart 6: grants sorted by the funding organisation and the amount awarded
  var chartfundingorgtype = function(d3) {
    //Load in grants data
    d3.json("userledfinal.json", function(data) {
        
      data.sort(function(a, b) {return d3.descending(a.AmountAwarded, b.AmountAwarded);});
      var datasmall = data.filter(function(d) { return d.AmountAwarded < 214340846; })
      datasmall.sort(function(a, b) {return d3.descending(a.TotalAmountFounder, b.TotalAmountFounder);});

      var sqrtScale = d3.scaleLinear()
        .domain([ d3.min(datasmall, function(d) { return d.AmountAwarded;}),
                  d3.max(datasmall, function(d) { return d.AmountAwarded;})
                ])
        .range([1.5, 850]);

      var width = function(d) { return sqrtScale(d.AmountAwarded) + "px"};

      const nest = d3
        .nest()
        .key(d => d.FundingOrgName)
        .entries(datasmall);

      grid = d3.select("#chart-fundingorgsize")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

      const group = grid.selectAll('.group-rows')
        .data(nest)
        .enter()
        .append('div')
        .attr('class', 'group-rows');

      group.selectAll('.block')
        .data(d => d.values)
        .enter()
        .append('div')
        .attr('class', 'block-row')
        .style("width", width)
        .style("height", 7 + "px")
        .style('background-color', function(d){
          return colour(d.Theme);
        })
        .on("mousemove", function(d) {
          d3.select(this)
            .style('opacity', 0.5);
          tooltip.transition()
            .duration(100)
            .style("opacity", .9)
            .attr("class", "tooltip")
            .style("left", (d3.event.pageX - 5) + "px")
            .style("top", (d3.event.pageY + 5) + "px");
          tooltip.html("<b>" + d.RecipientOrgName + "</b> (" + d.OrgType + ") received <b>" + d.AmountAwarded + "</b> pounds from <b>" + d.FundingOrgName +
                "</b> in " + d.Year + " to fund a <b>" + d.Theme + "</b> programme. </br></br>" +
                "Description of the '<b>" + d.Title + "' grant</b>: " + d.Description.substring(0,380) + "...");
          })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          });

      group
        .append('div')
        .style("width", "5px")

      group
        .append('text')
        .attr("class", "labels")
        .text(d => d.key);

      legendValues = d3.set(data.map( function(d) { return d.Theme } ) ).values()

      var legend = d3.select(".legend")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class", "legend-flex")
          .selectAll(".legends")
          .data(legendValues)
          .enter()
          .append("rect")
          .attr("class", "legends")
          .style("background-color", function (d) { return colour(d) })
          .append('text')
          .text(function (d, i) { return d })
          .attr("class", "legend-text")

    });
  }(d3);

});
