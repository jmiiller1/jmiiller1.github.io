export class TimelineUtilities {

    static initializeSVG(vis, parentid, className) {

        const body = d3.select(parentid);
        const svg = body.append('svg');
        svg.attr('class', className)
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

    static appendText(group, text, height, width, className) {

        const textElem = group.append('text');
        textElem.attr('class', className);
        textElem.attr('x', width);
        textElem.attr('y', height);
        textElem.text(text);

        return group;
    }

    static retrieveBody() {
        return d3.select('body');
    }
}