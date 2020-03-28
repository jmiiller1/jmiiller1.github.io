export class TimelineHoverline {

    static appendHoverline(chart, height) {

        const hoverLineGroup = chart.append('g');
        hoverLineGroup.attr('class', 'timeline-hoverline');

        const hoverLine = hoverLineGroup.append('line');
        hoverLine.attr('x1', 0).attr('x2', 0);
        hoverLine.attr('y1', height / 2 - 20).attr('y2', height / 2 + 20);
        hoverLine.attr('opacity', 0);

        return hoverLine;

    }

    static mouseMove(hoverLine, parentSelector, marginLeft) {
        return function(d) {
            let x = d3.mouse(this)[0];
            const parentx = d3.select(parentSelector).node().getBoundingClientRect().x;

            hoverLine.attr('x1', x - parentx - marginLeft).attr('x2', x - parentx - marginLeft);
            hoverLine.transition().duration(100).attr('opacity', 0.7);
        }
    }

    static mouseOut(hoverLine) {
        return function(d) {
            hoverLine.transition().duration(500).attr('opacity', 0);
        }
    }
}