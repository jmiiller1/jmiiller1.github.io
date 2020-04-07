export class TimelineUtilities {

    static initializeSVG(height, width, parentid, className) {

        const parentElem = d3.select(parentid);
        const svg = parentElem.append('svg');
        svg
            .attr('class', className)
            .attr('height', height)
            .attr('width', width);

        return svg;
    }

    static appendChart(height, width, margin, svg, className) {

        const chart = svg.append('g');
        chart
            .attr('class', className)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        return chart;
    }

    static appendText(group, text, height, width, className) {

        const textElem = group.append('text')
            .attr('class', className)
            .attr('font-family', 'sans-serif')
            .attr('x', width)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .text(text);

        return group;
    }

    static appendTextXAxis(group, titleName, height, width, className){
        const text = group.append('text')
            .attr('class', className)
            .attr('x', width)
            .attr('y', height)
            //.attr('fill', 'black')
            .text(titleName);
    }

    static appendTextYAxis(group, titleName, height, width, className){
        const text = group.append('text')
            .attr('class', className)
            .attr('text-anchor', 'middle')
            .attr('x', width)
            .attr('y', height)
            //.attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .text(titleName);
    }

    static retrieveBody() {
        return d3.select('body');
    }
}