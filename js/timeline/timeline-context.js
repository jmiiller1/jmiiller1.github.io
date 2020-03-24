/*
  Timeline Chart of the current state of the Democratic Primary.
 */

import { TimelineBrush } from './timeline-brush.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimeAxis } from './time-axis.js';

export class TimelineContext {

    constructor(data, _config) {
        this.data = data;
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            dispatcher: _config.dispatcher,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            radius: 5
        };

        this.config.innerWidth = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        this.timeScale = TimeAxis.createTimeScale(this, [new Date(2019, 6, 1), new Date(2020, 3, 30)]);

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.svg = TimelineUtilities.initializeSVG(vis, 'timeline-context');

        vis.chart = TimelineUtilities.appendChart(vis, vis.svg);

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis);

        vis.brush = TimelineBrush.appendBrushX(vis, vis.chart, vis.timeScale)
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
            .attr('cy', vis.config.innerHeight / 2)

        exitSelection.remove();
    }
}

