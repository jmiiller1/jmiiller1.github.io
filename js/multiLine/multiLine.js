
import { MultiLineUtilities } from './multiLineUtilities.js';
import { MultiLineTimeAxis } from './multiLineTimeAxis.js';

export class MultiLine {

    constructor(data, _config) {
        this.data = data;

        this.config = {
        parentElement: _config.parentElement,
        containerHeight: _config.containerHeight || 600,
        containerWidth: _config.containerWidth || 500,
        margin: { top: 100, bottom: 75, right: 50, left: 80 }
        };

        this.config.innerWidth = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        this.xScale = MultiLineTimeAxis.createXScale(this);
        this.yScale = MultiLineTimeAxis.createYScale(this);
   
        this.initVis();
        }
       
        initVis() {
            const vis = this;
            console.log(vis);
            vis.svg = MultiLineUtilities.initializeSVG(vis, 'multiLine');
            //TODO: retrieve body ???
            vis.chart = MultiLineUtilities.appendChart(vis, vis.svg);
            vis.chartTitle = MultiLineUtilities.appendText(vis.chart, "NYT & The Dem Primaries", 0, vis.config.innerWidth / 2, "chart-title");

            // vis.timeAxisGroup = MultiLineTimeAxis.appendTimeAxis(vis);
            // vis.timeAxisTitle = MultiLineUtilities.appendText(vis.timeAxisGroup, "Date", 100, 100, "axis-title");
            
            //REFACTOR
            vis.XAxisGroup = MultiLineTimeAxis.appendXAxis(vis);
            vis.XAxisTitle = MultiLineUtilities.appendTextXAxis(vis.XAxisGroup, "Date", vis.config.innerHeight, 50, "axis-title");
            //TODO:
            vis.yAxisGroup = MultiLineTimeAxis.appendYAxis(vis);
            vis.yAxisTitle = MultiLineUtilities.appendTextYAxis(vis.yAxisGroup, "Sentiment", -vis.config.innerHeight / 2, -80, "axis-title");
            
            /* vis.yValue = d => d[`SentScore(Avg)`];
        vis.yAxisLabel = 'Sentiment Score'; */

        // vis.xValue = d => d[`Date`];


        // vis.colorValue = d => d.Candidates;
        
  
        // vis.dateRange = d3.extent(vis.data,vis.xValue);
        /* vis.xScale = d3.scaleTime()
          // TODO: fix time scale
          .domain(vis.dateRange)
          // .domain(d3.extent(data, xValue))
          .range([0, vis.config.containerWidth]); */
        
        /* vis.yScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.yValue))
          .range([vis.config.containerHeight, 0])
           .nice(); */
        
        // vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        /* vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`); */
        
        /* vis.xAxis = d3.axisBottom(vis.xScale)
          .tickSize(-vis.config.containerHeight)
          .tickPadding(10); */

        /* vis.yAxis = d3.axisLeft(vis.yScale)
          .tickSize(-vis.config.containerWidth)
          .tickPadding(10); */
        
        // vis.yAxisG = vis.svg.append('g').call(vis.yAxis);
        
        // TODO: place in exit / update
        // vis.yAxisG.selectAll('.domain').remove();
        
        /* vis.yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', -60)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(vis.yAxisLabel); */
        
        /* vis.xAxisG = vis.svg.append('g').call(vis.xAxis)
          .attr('transform', `translate(0,${vis.config.containerHeight})`);
         */
          //TODO: place in exit in Render.
        
        

        /* vis.xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 60)
            .attr('x', vis.config.containerWidth / 2)
            .attr('fill', 'black')
            .text(vis.xAxisLabel); */

        // const lineGenerator = d3.line()
        //           .x(d => vis.xScale(vis.xValue(d)))
        //           .y(d => vis.yScale(vis.yValue(d)))
        //           .curve(d3.curveBasis);
          
          // vis.lastYValue = d =>
          //   vis.yValue(d.values[d.values.length - 1]);
          
          // vis.nested = d3.nest()
          //   .key(vis.colorValue)
          //   .entries(vis.data)
          //   .sort((a, b) =>
          //     d3.descending(vis.lastYValue(a), vis.lastYValue(b))
          //   );
  
          // vis.colorScale.domain(vis.nested.map(d => d.key));

          // vis.svg.selectAll('.line-path').data(vis.nested)
          //   .enter().append('path')
          //     .attr('class', 'line-path')
          //     .attr('d', d => lineGenerator(d.values))
          //     .attr('stroke', d => vis.colorScale(d.key));
          
          // TODO: sort out y-axis
              // vis.svg.append('text')
              // .attr('class', 'title')
              // .attr('y', -10)
              // .text(vis.title);


        }

        update(){
            const vis = this;
            vis.render();
        }

        render(){
            const vis = this;
            const dataGroup = vis.chart.append('g');
            console.log(dataGroup);
            vis.colorValue = d => d.Candidates;
            vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            
          const lineGenerator = d3.line()
                  .x(d => vis.xScale(vis.xValue(d)))
                  .y(d => vis.yScale(vis.yValue(d)))
                  .curve(d3.curveBasis);
          
          vis.lastYValue = d =>
            vis.yValue(d.values[d.values.length - 1]);
          
            vis.nested = d3.nest()
              .key(vis.colorValue)
              .entries(vis.data)
              .sort((a, b) =>
                d3.descending(vis.lastYValue(a), vis.lastYValue(b))
              );
  
            vis.colorScale.domain(vis.nested.map(d => d.key));

            const updateSelection = dataGroup.selectAll('line-path').data(vis.nested);
            console.log(updateSelection);
            const enterSelection = updateSelection.enter();
            const exitSelection = updateSelection.exit();
            // const lineGenerator = MultiLineUtilities.createLineGenerator(vis);
            enterSelection.append('path')
                .attr('class', 'line-path')
                // .attr('cx', d => vis.xScale(d[`Date`]))
                // .attr('cy', vis.config.innerHeight / 2)
                .attr('d', d => lineGenerator(d.values))
                .attr('stroke', d => vis.colorScale(d.key));        
            
            updateSelection
                // .attr('cx', d => vis.xScale(d[`Date`]))
                // .attr('cy', vis.config.innerHeight /2)
                .attr('d', d => lineGenerator(d.values))
                .attr('stroke', d => vis.colorScale(d.key));

            exitSelection.remove();
            //TODO: Find the place for the following:
            // vis.xAxisG.select('.domain').remove();
            // vis.yAxisG.selectAll('.domain').remove();

        }

}