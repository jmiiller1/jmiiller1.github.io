export class TimelineUtilities {

    static initializeSVG(vis, id) {

        const body = d3.select('#timeline');
        const svg = body.append('svg');
        svg.attr('class', id)
            .attr('height', vis.config.containerHeight)
            .attr('width', vis.config.containerWidth);

        return svg;
    }

    static appendChart(vis, svg) {

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

    static retrieveBody() {
        return d3.select('body');
    }
}