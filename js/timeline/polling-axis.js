export class PollingAxis {

    static createPollingScale(height){
        const pollingScale = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);

        return pollingScale;
    }

    static createYAxis(yScale, width){
        const yAxis = d3.axisLeft(yScale)
            .tickPadding(5)
            .tickSize(-width);

        return yAxis;
    }

    static appendYAxis(chart, yScale, width, yOffset){
        const yAxis = PollingAxis.createYAxis(yScale, width);
        const yAxisGroup = chart.append('g').attr('transform', `translate(0, ${yOffset})`);
        yAxisGroup.attr('class', 'polling-axis');

        yAxisGroup.call(yAxis)
            .selectAll('.domain').remove();

        const axisPath = yAxisGroup.select('path');
        axisPath.style('pointer-events', 'none');

        return yAxisGroup;
    }

}