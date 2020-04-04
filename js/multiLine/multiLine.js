
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
            margin: { top: 75, bottom: 50, right: 25, left: 75 }
        };

        this.config.innerWidth = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;
   
        this.initVis();
        }
       
        initVis() {
            const vis = this;

            vis.nested = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.data);

            vis.svg = d3.select(vis.config.parentElement)
                .attr('width', vis.config.containerWidth)
                .attr('height', vis.config.containerHeight);

            vis.chart = vis.svg.append('g')
                .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

            vis.xScale = MultiLineTimeAxis.createXScale(vis);
            vis.yScale = MultiLineTimeAxis.createYScale(vis);

            vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(vis.data.map(d => d.Candidates));

            vis.chartTitle = MultiLineUtilities.appendText(vis.chart, 'Sentiment Analysis of NYT Articles', -20, vis.config.innerWidth/2, 'chart-title');
            vis.XAxisGroup = MultiLineTimeAxis.appendXAxis(vis);
            vis.XAxisTitle = MultiLineUtilities.appendTextXAxis(vis.XAxisGroup, 'Date', 40, vis.config.innerWidth/2, 'axis-title');
            vis.yAxisGroup = MultiLineTimeAxis.appendYAxis(vis);
            vis.yAxisTitle = MultiLineUtilities.appendTextYAxis(vis.yAxisGroup, 'Sentiment', -40, -vis.config.innerHeight/2, 'axis-title');

            // MultiLine Color Legend
            vis.chart.append('g')
                .attr('transform', `translate(${vis.config.innerWidth - 75}, ${vis.config.innerHeight - 100})`)
                .call(multiLineColorLegend, {
                    colorScale: vis.colorScale,
                    circleRadius: 5,
                    spacing: 20,
                    textOffset: 10
                });
    }

        update(){
            const vis = this;
            vis.render();
        }

        render(){
            const vis = this;
            const dataGroup = vis.chart.append('g');

            const lineGenerator = d3.line()
                .x(d => vis.xScale(d['Date']))
                .y(d => vis.yScale(d['SentScore(Avg)']))
                .curve(d3.curveBasis);

            const updateSelection = dataGroup.selectAll('line-path').data(vis.nested);
            const enterSelection = updateSelection.enter();
            const exitSelection = updateSelection.exit();

            enterSelection.append('path')
                .attr('class', 'line-path')
                .merge(updateSelection)
                    .attr('d', d => lineGenerator(d.values))
                    .attr('stroke', d => vis.colorScale(d.key))
                .append('title')
                    .text(d => d.key);

            exitSelection.remove();
        }
}