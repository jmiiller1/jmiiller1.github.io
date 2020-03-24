/*
  Timeline Chart of the current state of the Democratic Primary.
 */

import { TimeAxis } from './time-axis.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimelineData } from "./timeline-data.js";

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
            radius: 8
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.timeScale = TimeAxis.createTimeScale(vis, [new Date(2019, 6, 1), new Date(2020, 3, 30)]);

        vis.initializeListener();

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.svg = TimelineUtilities.initializeSVG(vis, 'timeline-focus');

        vis.chart = TimelineUtilities.appendChart(vis, vis.svg);
        vis.chartTitle = TimelineUtilities.appendText(vis.chart, "Timeline", 0, vis.config.innerWidth / 2, "chart-title");

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.timeAxisGroup, "Time", 40, vis.config.innerWidth / 2, "axis-title");

        vis.dataGroup = vis.chart.append('g');
    }

    update() {
        const vis = this;

        vis.timeAxisGroup.remove();
        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis, vis.chart);

        vis.render();
    }

    render() {
        const vis = this;

        let updateSelection = vis.dataGroup.selectAll('circle').data(vis.data);
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

    initializeListener() {
        const vis = this;

        vis.config.dispatcher.on('focus.timeline', function(extent) {
            vis.timeScale = TimeAxis.createTimeScale(vis, extent);
            vis.data = vis.copy.filter(TimelineData.dateInRange);
            console.log(vis.data);

            vis.update();
        });
    }
}

