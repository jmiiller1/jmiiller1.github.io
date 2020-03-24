export class TimelineUtilities {

    static initializeSVG(self) {
        const vis = self;

        const body = d3.select('#timeline');
        const svg = body.append('svg');
        svg.attr('height', vis.config.containerHeight)
            .attr('width', vis.config.containerWidth);

        return svg;
    }

    static appendChart(self, svg) {
        const vis = self;

        const chart = svg.append('g');
        chart.attr('class', 'timeline-chart')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
            .attr('height', vis.config.innerHeight)
            .attr('width', vis.config.innerWidth);

        return chart;
    }

    static appendText(group, titleName, height, width, className) {
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.text(titleName);

        return group;
    }
}