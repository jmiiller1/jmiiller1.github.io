import {TimelineUtilities} from "./timeline-utilities.js";

export class TimelineLegend {

    constructor(_config) {
        const vis = this;

        vis.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            radius: _config.radius,
            colorScale: _config.colorScale
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();

        vis.svg = TimelineUtilities.initializeSVG(vis, '#timeline-legend', 'timeline');

        vis.legend = TimelineLegend.appendLegend(vis);
    }

    static appendLegend(vis) {

        const legendGroup = vis.svg.append('g');
        legendGroup.attr('class', 'timeline-legend');

        const updateSelection = legendGroup.selectAll('circle').data(vis.config.colorScale.domain());
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'event')
            .attr('r', vis.config.radius)
            .attr('cx', 100)
            .attr('cy', (d, i) => { return i * 50 + 20 })
            .attr('fill', vis.config.colorScale);

        exitSelection.remove();

    }
}