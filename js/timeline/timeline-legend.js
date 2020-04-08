import {TimelineUtilities} from "./timeline-utilities.js";

export class TimelineLegend {

    static appendLegend(container, height, width, ySeparation, glyphSize) {

        const legendGroup = container.append('g')
            .attr('class', 'timeline-legend')
            .attr('transform', `translate(${width - 75}, ${height + 20})`);

        const demDebateGroup = legendGroup.append('g');
        demDebateGroup.append('circle')
            .attr('class', 'legend-event')
            .attr('r', glyphSize)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('fill', 'lightgrey');
        demDebateGroup.append('text')
            .attr('class', 'legend-text')
            .attr('x', glyphSize * 2)
            .attr('y', glyphSize)
            .text("Democratic Debate");

        const keyEventGroup = legendGroup.append('g');
        keyEventGroup.append('rect')
            .attr('class', 'legend-event')
            .attr('x', -glyphSize)
            .attr('y', ySeparation)
            .attr('width', glyphSize * 2)
            .attr('height', glyphSize * 2)
            .attr('fill', 'lightgrey');
        keyEventGroup.append('text')
            .attr('class', 'legend-text')
            .attr('x', glyphSize * 2)
            .attr('y', ySeparation + glyphSize * 2)
            .text("Key Event");

        return legendGroup;
    }


}