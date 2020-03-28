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

        vis.title = TimelineUtilities.appendText(vis.svg, 'Legend', 60, 100, '');
        vis.legend = TimelineLegend.appendLegend(vis, 0, 0);
    }

    static appendLegend(vis, height, width) {

        const legendGroup = vis.svg.append('g');
        legendGroup.attr('class', 'timeline-legend');

        const updateSelection = legendGroup.selectAll('g').data(vis.config.colorScale.domain());
        const enterSelection = updateSelection.enter().append('g');
        const exitSelection = updateSelection.exit();

        const separation = 50;

        enterSelection
            .append('circle')
                .attr('class', 'legend-event')
                .attr('r', vis.config.radius)
                .attr('cx', (d, i) => { return i * separation + width })
                .attr('cy', height + 20)
                .attr('fill', vis.config.colorScale);

        enterSelection
            .append('text')
                .attr('class', 'legend-text')
                .attr('x', (d, i) => { return i * separation + width  - 20})
                .attr('y', height)
                .text(d => d);

        exitSelection.remove();

        return legendGroup;
    }


}