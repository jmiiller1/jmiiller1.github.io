import {TimelineContext} from "./timeline-context.js";
import {TimelineFocus} from "./timeline-focus.js";
import { TimelineData } from "./timeline-data.js";

d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv', d3.autotype).then(data => {
    data.forEach((row) => {
        row['Date'] = TimelineData.convertStringToDate(row['Date']);
    });

    const timelineContext = new TimelineContext(data, {
        parentElement: '#timeline',
        containerHeight: 700,
        containerWidth: 1000
    });

    const timelineFocus = new TimelineFocus(data, {
        parentElement: '#timeline',
        containerHeight: 700,
        containerWidth: 1000
    });

    timelineContext.update();
    timelineFocus.update();
});

