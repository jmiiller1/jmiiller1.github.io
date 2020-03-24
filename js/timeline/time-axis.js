export class TimeAxis {

    static appendTimeAxis(vis) {

        const timeAxis = TimeAxis.createTimeAxis(vis);

        const timeAxisGroup = vis.chart.append('g');
        timeAxisGroup
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${vis.config.innerHeight / 2})`);
        timeAxisGroup.call(timeAxis);

        return timeAxisGroup;
    }

    static createTimeScale(vis, domain) {

        const timeScale = d3.scaleTime();

        timeScale.domain(domain);
        timeScale.range([0, vis.config.innerWidth]);

        return timeScale;
    }

    static createTimeAxis(vis) {
        const timeAxis = d3.axisBottom(vis.timeScale)
            .tickSizeOuter(0)
            .ticks(vis.config.innerWidth / 80);

        return timeAxis;
    }
}