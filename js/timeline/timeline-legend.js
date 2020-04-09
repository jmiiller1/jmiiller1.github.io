import {TimelineUtilities} from "./timeline-utilities.js";

export class TimelineLegend {

    static appendLegend(container, xPos, yPos, spacing, glyphSize) {

        const legendGroup = container.append('g')
            .attr('class', 'timeline-legend')
            .attr('transform', `translate(${xPos}, ${yPos})`);

        const demDebateGroup = legendGroup.append('g')
            .attr('transform', `translate(0, 0)`);

        demDebateGroup.append('circle')
            .attr('class', 'legend-event')
            .attr('r', glyphSize)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('fill', 'lightgrey');
        demDebateGroup.append('text')
            .attr('class', 'legend-text')
            .attr('x', glyphSize * 2)
            .attr('dy', '0.38em')
            .text("Democratic Debate");

        const keyEventGroup = legendGroup.append('g')
            .attr('transform', `translate(${spacing}, 0)`);

        keyEventGroup.append('rect')
            .attr('class', 'legend-event')
            .attr('x', 0)
            .attr('y', -glyphSize)
            .attr('width', glyphSize * 2)
            .attr('height', glyphSize * 2)
            .attr('fill', 'lightgrey');
        keyEventGroup.append('text')
            .attr('class', 'legend-text')
            .attr('x', glyphSize * 3)
            .attr('dy', '0.38em')
            .text("Key Event");

        return legendGroup;
    }


}