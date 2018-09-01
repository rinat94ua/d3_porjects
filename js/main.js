/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const margin = { top: 50, right: 80, bottom: 50, left: 80 };

const width = 600 - margin.right - margin.left;
const height = 400 - margin.top - margin.bottom;

let flag = true;

const t = d3.transition().duration(750);

const g = d3.select('#chart-area')
            .append('svg')
              .attr('width', width + margin.right + margin.left)
              .attr('height', height + margin.top + margin.bottom)
              .attr('style', 'border: 1px solid black')
            .append('g')
              .attr('transform', 'translate(' + margin.left + ', ' +  margin.top + ')');

const x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

const y = d3.scaleLinear()
  .range([height, 0]);

const xAxisGroup = g.append('g')
                    .attr('transform', 'translate(0,' + height + ')');

const yAxisGroup = g.append('g');

  
// Update function
const update = (data) => {
  const value = flag ? 'revenue' : 'profit';

  x.domain(data.map(d => d.month));
  y.domain([0, d3.max(data, d => d[value])]);


  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);
  
  const yAxisCall = d3.axisLeft(y)
                      .tickFormat(d => '$ ' + d);
  yAxisGroup.transition(t).call(yAxisCall);


  const rects = g.selectAll('rect')
                  .data(data, d => d.month);

  rects
    .exit()
      .attr('fill', 'red')
    .transition(t)
        .attr('y', y(0))
        .attr('height', 0)
    .remove();

  rects.enter()
        .append('rect')
          .attr('x', d => x(d.month))
          .attr('y', d => y(0))
          .attr('width', x.bandwidth)
          .attr('height', 0)
          .attr('fill', 'grey')
        .merge(rects)
          .transition(t)
            .attr('x', d => x(d.month))
            .attr('y', d => y(d[value]))
            .attr('width', x.bandwidth)
            .attr('height', d => height - y(d[value]));
};



d3.json('data/revenues.json').then(data => {
  data.forEach(el => {
    el.revenue = +el.revenue;
    el.profit = +el.profit;
  });

  d3.interval(() => {
    const newData = flag ? data : data.slice(1);

    update(newData);
    flag = !flag;
  }, 1000);
  
  update(data);
});