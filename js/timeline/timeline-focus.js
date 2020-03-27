/*
  Timeline Chart of the current state of the Democratic Primary.
 */

import { TimeAxis } from './time-axis.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimelineData } from "./timeline-data.js";
import { TimelineTooltip } from "./timeline-tooltip.js";
import {TimelineLegend} from "./timeline-legend.js";
import {TimelineHoverline} from "./timeline-hoverline.js";

export class TimelineFocus {

    constructor(data, _config) {
        const vis = this;

        vis.data = data;
        vis.copy = data;
        vis.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            dispatcher: _config.dispatcher,
            radius: _config.radius,
            colorScale: _config.colorScale
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.timeScale = TimeAxis.createTimeScale(vis, [new Date(2019, 6, 1), new Date(2020, 3, 30)]);

        vis.initializeFocusListener();

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();
        vis.svg = TimelineUtilities.initializeSVG(vis, '#timeline-focus', 'timeline');
        vis.svg.on('mousemove', TimelineHoverline.mouseOver(vis, '#timeline-focus .timeline'));

        vis.chart = TimelineUtilities.appendChart(vis, vis.svg);

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.timeAxisGroup, "Time", 40, vis.config.innerWidth / 2, "axis-title");

        vis.tooltip = TimelineTooltip.appendTooltip(vis.body);

        vis.dataGroup = vis.chart.append('g');

        vis.legend = TimelineLegend.appendLegend(vis, vis.config.colorScale);

        vis.hoverLine = TimelineHoverline.appendHoverline(vis);
    }

    update() {
        const vis = this;

        vis.timeAxisGroup.remove();
        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis, vis.chart);

        vis.render();
    }

    render() {
        const vis = this;

        const updateSelection = vis.dataGroup.selectAll('circle').data(vis.data);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'event')
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight / 2)
            .attr('r', vis.config.radius)
            .attr('fill', d => vis.config.colorScale(d['type']))
            .attr('z-index', 20)
            .on('mousemove.tooltip', TimelineTooltip.mouseMove(vis, '#timeline-focus .timeline'))
            .on('mouseout.tooltip', TimelineTooltip.mouseOut(vis));

        updateSelection
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight / 2);

        exitSelection.remove();
    }

    initializeFocusListener() {
        const vis = this;

        vis.config.dispatcher.on('focus.timeline', function(extent) {
            vis.timeScale = TimeAxis.createTimeScale(vis, extent);
            vis.data = vis.copy.filter(TimelineData.dateInRange(extent));

            vis.update();
        });
    }
}

