import {TimeAxis} from "./time-axis.js";

export class TimelineTooltip {

    static appendTooltip(body) {

        const tooltip = body.append('div');
        tooltip.attr('class', 'timeline-tooltip');
        tooltip.style('display', 'inline-block');
        tooltip.style('opacity', 0);
        tooltip.style('position', 'absolute');
        tooltip.style('text-align', 'center');
        tooltip.style('padding', '10px');
        tooltip.style('font-size', '11px');
        tooltip.style('background-color', 'white');
        tooltip.style('border', '1px solid black');
        tooltip.style('border-radius', '15px');
        tooltip.style('pointer-events', 'none');
        tooltip.style('max-width', '300px');

        return tooltip;

    }

    static mouseMove(tooltip) {
        return function(d) {

            const html = tooltip.html(TimelineTooltip.buildHtmlString(d));
            html.style('left', (d3.event.pageX - 150) + "px");
            html.style('top', (d3.event.pageY - 150) + "px");

            tooltip.transition().duration(200).style('opacity', 0.9);
        }
    }

    static mouseOut(tooltip) {
        return function(d) {
            tooltip.transition().duration(500).style('opacity', 0);
        }
    }

    static buildHtmlString(d) {
        let htmlString = '';

        if (d.type === 'debate') {
            htmlString = htmlString.concat('<p> <b>Debate #: </b>' + d['Debate'] + '</p>');
            htmlString = htmlString.concat('<p> <b>Date: </b>' + TimeAxis.formatTime(d['Date']) + '</p>');
            htmlString = htmlString.concat('<p> <b>Time(ET): </b>' + d['Time(ET)'] + '</p>');
            htmlString = htmlString.concat('<p> <b>Viewers: </b>' + d['Viewers'] + '</p>');
            htmlString = htmlString.concat('<p> <b>Location: </b>' + d['Location'] + '</p>');
            htmlString = htmlString.concat('<p> <b>Sponsor: </b>' + d['Sponsor(s)'] + '</p>');
            htmlString = htmlString.concat('<p> <b> Moderator(s): </b>' + d['Moderator(s)'] + '</p>');
        } else if (d.type === 'key-event') {
            htmlString = htmlString.concat('<p> <b>Description: </b>' + d['Description'] + '</p>');
            htmlString = htmlString.concat('<p> <b>Date: </b>' + TimeAxis.formatTime(d['Date']) + '</p>');

            if (d['Url'] !== '') {
                htmlString = htmlString.concat('<a> <b>Url: </b>' + d['Url'] + '</a>');
            }
        }

        return htmlString;
    }
}