export class TimelineUtilities {

    static initializeSVG(height, width, parentid, className) {

        const parentElem = d3.select(parentid);
        const svg = parentElem.append('svg');
        svg.attr('class', className)
            .attr('height', height)
            .attr('width', width);

        return svg;
    }

    static appendChart(height, width, margin, svg) {

        const chart = svg.append('g');
        chart.attr('class', 'timeline-chart')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('height', height)
            .attr('width', width);

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