export class TimeAxis {

    static appendTimeAxis(self, chart) {
        const vis = self;

        const timeAxis = TimeAxis.createTimeAxis(vis.timeScale);

        const timeAxisGroup = chart.append('g');
        timeAxisGroup
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${vis.config.innerHeight / 2})`);
        timeAxisGroup.call(timeAxis);

        return timeAxisGroup;
    }

    static createTimeScale(self) {
        const vis = self;

        const timeScale = d3.scaleTime();
        timeScale.domain([new Date(2019, 6, 1), new Date(2020, 3, 30)]);
        timeScale.range([0, vis.config.innerWidth]);
        timeScale.nice();

        return timeScale;
    }

    static createTimeAxis(timeScale) {
        const timeAxis = d3.axisBottom(timeScale)
            .tickSize(10);

        return timeAxis;
    }
}