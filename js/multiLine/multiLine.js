
import { MultiLineUtilities } from './multiLineUtilities.js';
import { MultiLineTimeAxis } from './multiLineTimeAxis.js';
import { multiLineColorLegend } from './multiLineColorLegend.js';

export class MultiLine {

    constructor(data, _config) {
        this.data = data;

        this.config = {
        parentElement: _config.parentElement,
        containerHeight: _config.containerHeight || 600,
        containerWidth: _config.containerWidth || 500,
        margin: { top: 100, bottom: 75, right: 200, left: 80}
        };

        this.config.innerWidth = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        this.xScale = MultiLineTimeAxis.createXScale(this);
        this.yScale = MultiLineTimeAxis.createYScale(this);
   
        this.initVis();
        }
       
        initVis() {
            const vis = this;
            vis.svg = MultiLineUtilities.initializeSVG(vis, 'multiLine');
            //TODO: ask team re: necessity of retrieve body ???
            vis.chart = MultiLineUtilities.appendChart(vis, vis.svg);
            vis.chartTitle = MultiLineUtilities.appendText(vis.chart, "Sentiment Analysis of NYT Articles", -20, vis.config.innerWidth / 2, "chart-title");
            vis.XAxisGroup = MultiLineTimeAxis.appendXAxis(vis);
            vis.XAxisTitle = MultiLineUtilities.appendTextXAxis(vis.XAxisGroup, "Date", 60, vis.config.innerWidth / 2, "axis-title");
            vis.yAxisGroup = MultiLineTimeAxis.appendYAxis(vis);
            vis.yAxisTitle = MultiLineUtilities.appendTextYAxis(vis.yAxisGroup, "Sentiment", -50, -150, "axis-title");
        }

        update(){
            const vis = this;
            vis.render();
        }

        render(){
          const vis = this;
          const dataGroup = vis.chart.append('g');
          vis.colorValue = d => d.Candidates;
          vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

          const colorScale = vis.colorScale;

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
          colorScale.domain(vis.nested.map(d => d.key));
          
          // MultiLine Color Legend
          // TODO: ask TEAM re: why can't vis.colorScale be placed in call below ??
          vis.svg.append('g')
              .attr('transform', `translate(850,180)`)
              .call(multiLineColorLegend, {
                colorScale,
                circleRadius: 10,
                spacing: 40,
                textOffset: 20
              });

          const updateSelection = dataGroup.selectAll('line-path').data(vis.nested);
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