export class TimeAxis {

    static appendTimeAxis(chart, timeScale, height, width, outerTickSize) {

        const timeAxis = TimeAxis.createTimeAxis(timeScale, width, outerTickSize);

        const timeAxisGroup = chart.append('g');
        timeAxisGroup
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${height})`);
        timeAxisGroup.call(timeAxis);

        const axisPath = timeAxisGroup.select('path');
        axisPath.style('pointer-events', 'none');

        return timeAxisGroup;
    }

    static createTimeScale(domain, width) {

        const timeScale = d3.scaleTime();

        timeScale.domain(domain);
        timeScale.range([0, width]);

        return timeScale;
    }

    static createTimeAxis(timeScale, width, outerTickSize) {
        const timeAxis = d3.axisBottom(timeScale)
            .tickSizeOuter(outerTickSize)
            .ticks(width / 80);

        return timeAxis;
    }

    static formatTime(date) {
        const formatter = d3.timeFormat('%B %e, %Y');
        return formatter(date);
    }
}