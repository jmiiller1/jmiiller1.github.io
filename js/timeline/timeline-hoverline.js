export class TimelineHoverline {

    static appendHoverline(hoverlineContainer, height) {

        const hoverLineGroup = hoverlineContainer.append('g');
        hoverLineGroup.attr('class', 'timeline-hoverline');

        const hoverLine = hoverLineGroup.append('line');
        hoverLine.attr('x1', 0).attr('x2', 0);
        hoverLine.attr('y1', 0).attr('y2', height);
        hoverLine.attr('opacity', 0);

        return hoverLine;

    }

    static appendHoverlineContainer(chart, height, width) {
        const hoverLineContainer = chart.append('svg:rect')
            .attr('class', 'hoverline-container')
            .attr('height', height - 5)
            .attr('width', width)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        return hoverLineContainer;
    }

    static mouseMove(hoverLine) {
        return function(d) {
            const x = d3.mouse(this)[0];

            hoverLine.attr('x1', x).attr('x2', x);
            hoverLine.transition().duration(100).attr('opacity', 0.3);

        }
    }

    static mouseOut(hoverLine) {
        return function(d) {
            hoverLine.transition().duration(300).attr('opacity', 0);
        }
    }
}