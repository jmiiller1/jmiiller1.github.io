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
            .text(titleName);
    }

    static appendTextYAxis(group, titleName, height, width, className){
        const text = group.append('text')
            .attr('class', className)
            .attr('text-anchor', 'middle')
            .attr('x', width)
            .attr('y', height)
            .attr('transform', `rotate(-90)`)
            .text(titleName);
    }

    static retrieveBody() {
        return d3.select('body');
    }

    static computeYOffsetIndex(dateMap) {
        return function(d) {
            const date = d['Date'];
            //const dateKey = date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString();
            const dateKey = date.toString();

            if (dateMap.has(dateKey)) {
                const count = dateMap.get(dateKey);
                dateMap.set(dateKey, count + 1);
                return count;

            } else {
                dateMap.set(dateKey, 1);
                return 0;

            }
        }
    }
}