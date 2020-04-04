export class MultiLineTimeAxis {

    static createXScale(vis){
        const xScale = d3.scaleTime()
            .domain([new Date(2019, 5, 1), new Date(2020, 2, 1)])
            .range([0, vis.config.innerWidth]);

        return xScale;
    }

    static createXAxis(vis) {
        const xAxis = d3.axisBottom(vis.xScale)
            .tickPadding(5);

        return xAxis;
    }

    static appendXAxis(vis) {
        const XAxis = MultiLineTimeAxis.createXAxis(vis);
        const XAxisGroup = vis.chart.append('g');
        XAxisGroup.call(XAxis)
            .attr('transform', `translate(0, ${vis.config.innerHeight})`);

        return XAxisGroup;
    }

    static createYScale(vis){
        const yScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([vis.config.innerHeight, 0]);

        return yScale;
    }

    static createYAxis(vis){
        const yAxis = d3.axisLeft(vis.yScale)
            .tickPadding(5);

        return yAxis;
    }

    static appendYAxis(vis){
        const yAxis = MultiLineTimeAxis.createYAxis(vis);
        const yAxisGroup = vis.chart.append('g');

        yAxisGroup.call(yAxis);
        return yAxisGroup;
    }

}