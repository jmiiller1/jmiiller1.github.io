const svg = d3.select('svg');
const height = +svg.attr('height');
const width = +svg.attr('width');

d3.csv('data/NYT_data_single_cand.csv')
    .then(data => {
        console.log(data);
        data.forEach(d => {
          d.timestamp = new Date(d.Date);
          d[`SentScore(headline)`] = +d[`SentScore(headline)`];
          d[`SentScore(abstract)`] = +d[`SentScore(abstract)`];
          d[`SentScore(lead)`] = +d[`SentScore(lead)`];
          d[`SentScore(Avg)`] = +d[`SentScore(Avg)`];
        });
        console.log(data);
        render(data); 
    });

    const render = data => {
        const title = 'NYT & The Dem Primaries';
        
        const xValue = d => d.timestamp;
        const xAxisLabel = 'Date';
        
        const yValue = d => d[`SentScore(Avg)`];
        const circleRadius = 6;
        const yAxisLabel = 'Sentiment Score';
        
        const colorValue = d => d.Candidates;
        
        const margin = { top: 60, right: 60, bottom: 88, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        const xScale = d3.scaleTime()
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();
        
        const yScale = d3.scaleLinear()
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();
        
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickPadding(15);
        
        const yAxis = d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickPadding(10);
        
        const yAxisG = g.append('g').call(yAxis);
        yAxisG.selectAll('.domain').remove();
        
        yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', -60)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);
        
        const xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
        
        xAxisG.select('.domain').remove();
        
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 80)
            .attr('x', innerWidth / 2)
            .attr('fill', 'black')
            .text(xAxisLabel);
        
        const lineGenerator = d3.line()
          .x(d => xScale(xValue(d)))
          .y(d => yScale(yValue(d)))
          .curve(d3.curveBasis);
        
        const lastYValue = d =>
          yValue(d.values[d.values.length - 1]);
        
        const nested = d3.nest()
          .key(colorValue)
          .entries(data)
          .sort((a, b) =>
            d3.descending(lastYValue(a), lastYValue(b))
          );
        
        console.log(nested);
        
        colorScale.domain(nested.map(d => d.key));
        
        g.selectAll('.line-path').data(nested)
          .enter().append('path')
            .attr('class', 'line-path')
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
        
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(title);
      };