//Timeline Chart of the current state of the Democratic Primary.

import { TimelineBrush } from './timeline-brush.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimeAxis } from './time-axis.js';
import { TimelineTooltip } from "./timeline-tooltip.js";

export class TimelineContext {

    constructor(data, _config) {
        const vis = this;

        vis.data = data;
        vis.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            dispatcher: _config.dispatcher,
            margin: { top: 20, right: 25, bottom: 50, left: 75 },
            radius: _config.radius
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.config.timelineEventColor = 'lightgrey';

        vis.timeScale = TimeAxis.createTimeScale([new Date(2019, 5, 1), new Date(2020, 2, 1)], vis.config.innerWidth);

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();
        vis.svg = TimelineUtilities.initializeSVG(vis.config.containerHeight, vis.config.containerWidth, vis.config.parentElement, 'timeline-svg');

        vis.chart = TimelineUtilities.appendChart(vis.config.innerHeight, vis.config.innerWidth, vis.config.margin, vis.svg, 'timeline-chart');

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight, vis.config.innerWidth);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.timeAxisGroup, 'Time', 40, vis.config.innerWidth/2, 'axis-title');

        vis.brush = TimelineBrush.appendBrushX(vis.chart, vis.config.innerHeight, vis.config.innerWidth, vis.timeScale, vis.config.dispatcher);

        vis.tooltip = TimelineTooltip.appendTooltip(vis.body);
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
            .attr('class', 'event')
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight)
            .attr('r', vis.config.radius)
            .attr('fill', vis.config.timelineEventColor)
            .on('mousemove.tooltip', TimelineTooltip.mouseMove(vis.tooltip))
            .on('mouseout.tooltip', TimelineTooltip.mouseOut(vis.tooltip));

        exitSelection.remove();
    }
}
