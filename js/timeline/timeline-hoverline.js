export class TimelineHoverline {

    static appendHoverline(vis) {

        const hoverLineGroup = vis.chart.append('g');
        hoverLineGroup.attr('class', 'timeline-hoverline');

        const hoverLine = hoverLineGroup.append('line');
        hoverLine.attr('x1', 0).attr('x2', 0);
        hoverLine.attr('y1', vis.config.innerHeight / 2 - 30).attr('y2', vis.config.innerHeight / 2 + 30);
        hoverLine.attr('opacity', 0);

        return hoverLine;

    }

    static mouseOver(vis, parentSelector) {
        return function(d) {
            let x = d3.mouse(this)[0];
            const parentx = d3.select(parentSelector).node().getBoundingClientRect().x;

            vis.hoverLine.attr('x1', x - parentx + 50).attr('x2', x - parentx + 50);
            vis.hoverLine.attr('opacity', 0.7);
        }
    }
}