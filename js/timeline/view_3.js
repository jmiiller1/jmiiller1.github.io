import {TimelineContext} from "./timeline-context.js";
import {TimelineFocus} from "./timeline-focus.js";
import { TimelineData } from "./timeline-data.js";
import {TimelineLegend} from "./timeline-legend.js";

const dispatcher = d3.dispatch("focus");
const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(['debate', 'enter', 'exit', 'poll-change']);

d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv', d3.autotype).then(data => {
    data.forEach((row) => {
        row['Date'] = TimelineData.convertStringToDate(row['Date']);
        row.type = 'debate';
    });

    const timelineContext = new TimelineContext(data, {
        parentElement: '#timeline',
        containerHeight: 100,
        containerWidth: 800,
        dispatcher: dispatcher,
        colorScale: colorScale,
    });

    const timelineFocus = new TimelineFocus(data, {
        parentElement: '#timeline',
        containerHeight: 300,
        containerWidth: 1200,
        dispatcher: dispatcher,
        colorScale: colorScale,
    });

    timelineContext.update();
    timelineFocus.update();
});
