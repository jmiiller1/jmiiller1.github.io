/*
  Timeline Chart of the current state of the Democratic Primary.
 */

import { TimelineBrush } from './timeline-brush.js';
import { TimeAxis } from './time-axis.js';

export class TimelineContext {

    constructor(data, _config) {
        this.data = data;
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            radius: 5
        };

        this.config.innerWidth =this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        this.timeScale = TimeAxis.createTimeScale(this);

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.svg = vis.initializeSVG();

        vis.chart = vis.appendChart(vis.svg);
        vis.chartTitle = vis.appendText(vis.chart, "Timeline", 0, vis.config.innerWidth / 2, "chart-title");

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis, vis.chart);
        vis.timeAxisTitle = vis.appendText(vis.timeAxisGroup, "Time", 40, vis.config.innerWidth / 2, "axis-title");

        vis.brush = TimelineBrush.appendBrushX(vis, vis.chart)
    }

    update() {
        const vis = this;
        vis.render();
    }

    render() {
        const vis = this;

        const dataGroup = vis.chart.append('g');

        const updateSelection = dataGroup.selectAll('circle').data(vis.data);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'dem-debate')
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight / 2)
            .attr('r', vis.config.radius);

        updateSelection
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight / 2);

        exitSelection.remove();
    }

    initializeSVG() {
        const vis = this;

        const body = d3.select('#timeline');
        const svg = body.append('svg');
        svg.attr('height', vis.config.containerHeight)
           .attr('width', vis.config.containerWidth);

        return svg;
    }

    appendChart(svg) {
        const vis = this;

        const chart = svg.append('g');
        chart.attr('class', 'timeline-chart')
             .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
             .attr('height', vis.config.innerHeight)
             .attr('width', vis.config.innerWidth);

        return chart;
    }

    appendText(group, titleName, height, width, className) {
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.text(titleName);

        return group;
    }
}

