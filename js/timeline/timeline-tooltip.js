import {TimeAxis} from "./time-axis.js";

export class TimelineTooltip {

    static appendTooltip(body) {

        const tooltip = body.append('div');
        tooltip.attr('class', 'timeline-tooltip');
        tooltip.style('opacity', 0);

        return tooltip;

    }

    static mouseOver(vis) {
        return function(d) {

            const html = vis.tooltip.html(TimeAxis.formatTime(d['Date']));
            html.style('left', (d3.event.pageX - 30) + "px");
            html.style('top', (d3.event.pageY - 50) + "px");

            vis.tooltip.transition().duration(200).style('opacity', 0.9);
        }
    }

    static mouseOut(vis) {
        return function(d) {
            vis.tooltip.transition().duration(500).style('opacity', 0);
        }
    }
}