import {TimeAxis} from "./time-axis.js";

export class TimelineTooltip {

    static appendTooltip(body) {

        const tooltip = body.append('div');
        tooltip.attr('class', 'timeline-tooltip');
        tooltip.style('opacity', 0);

        return tooltip;

    }

    static mouseMove(tooltip) {
        return function(d) {

            const html = tooltip.html(TimeAxis.formatTime(d['Date']));
            html.style('left', (d3.event.pageX - 35) + "px");
            html.style('top', (d3.event.pageY - 60) + "px");

            tooltip.transition().duration(200).style('opacity', 0.9);
        }
    }

    static mouseOut(tooltip) {
        return function(d) {
            tooltip.transition().duration(500).style('opacity', 0);
        }
    }
}