export class TimeAxis {

    static appendTimeAxis(chart, timeScale, height, width) {

        const timeAxis = TimeAxis.createTimeAxis(timeScale, width);

        const timeAxisGroup = chart.append('g');
        timeAxisGroup
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${height})`);

        timeAxisGroup.call(timeAxis);

        return timeAxisGroup;
    }

    static createTimeScale(domain, width) {

        const timeScale = d3.scaleTime();

        timeScale.domain(domain);
        timeScale.range([0, width]);

        return timeScale;
    }

    static createTimeAxis(timeScale, width) {
        const timeAxis = d3.axisBottom(timeScale)
            .ticks(width / 80);

        return timeAxis;
    }

    static formatTime(date) {
        const formatter = d3.timeFormat('%B %e, %Y');
        return formatter(date);
    }
}