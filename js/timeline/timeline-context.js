// Timeline Chart of the current state of the Democratic Primary.

import { TimelineBrush } from './timeline-brush.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimeAxis } from './time-axis.js';

export class TimelineContext {

    constructor(demDebateData, keyEventData, _config) {
        const vis = this;

        vis.data = demDebateData;
        vis.keyEventData = keyEventData;

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
        vis.config.outerTickSize = 0;

        vis.completeDomain = [new Date(2018, 10, 31), new Date(2020, 3, 1)];
        vis.timeScale = TimeAxis.createTimeScale(vis.completeDomain, vis.config.innerWidth, 0);

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();
        vis.svg = TimelineUtilities.initializeSVG(vis.config.containerHeight, vis.config.containerWidth, vis.config.parentElement, 'timeline-svg');

        vis.chart = TimelineUtilities.appendChart(vis.config.innerHeight, vis.config.innerWidth, vis.config.margin, vis.svg, 'timeline-chart');

        vis.timelineDataGroup = vis.chart.append('g').attr('transform', `translate(0, ${vis.config.innerHeight})`);

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight, vis.config.innerWidth, vis.config.outerTickSize);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.timeAxisGroup, 'Time', 40, vis.config.innerWidth/2, 'axis-title');

        vis.brush = TimelineBrush.appendBrushX(vis.chart, vis.config.innerHeight, vis.config.innerWidth, vis.timeScale, vis.config.dispatcher);
    }

    update() {
        const vis = this;
        vis.render();
    }

    render() {
        const vis = this;

        const dateMap = new Map();

        vis.renderDemDebateData(dateMap);
        vis.renderKeyEventData(dateMap);
    }

    renderDemDebateData(dateMap) {
        const vis = this;

        const updateSelection = vis.timelineDataGroup.selectAll('circle').data(vis.data);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'event')
            .attr('r', vis.config.radius)
            .merge(updateSelection)
                .attr('cx', d => vis.timeScale(d['Date']))
                .attr('cy', d => 2 * vis.config.radius * TimelineUtilities.computeYOffsetIndex(dateMap)(d))
                .attr('fill', vis.config.timelineEventColor);

        exitSelection.remove();
    }

    renderKeyEventData(dateMap) {
        const vis = this;

        const updateSelection = vis.timelineDataGroup.selectAll('rect').data(vis.keyEventData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('rect')
            .attr('class', 'event')
            .attr('x', d => vis.timeScale(d['Date']) - vis.config.radius)
            .attr('y', d => -vis.config.radius + (2 * vis.config.radius * TimelineUtilities.computeYOffsetIndex(dateMap)(d)))
            .attr('width', vis.config.radius * 2)
            .attr('height', vis.config.radius * 2)
            .attr('fill', vis.config.timelineEventColor);

        exitSelection.remove();
    }
}
