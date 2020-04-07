import {TimelineContext} from './timeline-context.js';
import {TimelineFocus} from './timeline-focus.js';
import { TimelineData } from './timeline-data.js';
import {TimelineLegend} from "./timeline-legend.js";

const dispatcher = d3.dispatch('focus');
const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(['debate', 'enter', 'exit', 'key-event']);

Promise.all(
    [d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv'),
            d3.csv('data/NYT_data_average.csv', d3.autotype)]).then((files) => {

        const demDebateData = files[0];
        const sentimentAnalysisData = files[1];

        demDebateData.forEach((row) => {
            row['Date'] = TimelineData.convertStringToDate(row['Date']);
            row.type = 'debate';
        });

        sentimentAnalysisData.forEach((row) => {
            row['Date'] = new Date (row['Date']);
            row['SentScore(headline)'] = +row['SentScore(headline)'];
            row['SentScore(abstract)'] = +row['SentScore(abstract)'];
            row['SentScore(lead)'] = +row['SentScore(lead)'];
            row['SentScore(Avg)'] = +row['SentScore(Avg)'];
        });

        const timelineContext = new TimelineContext(demDebateData, {
            parentElement: '#timeline-context',
            containerHeight: 100,
            containerWidth: 840,
            dispatcher: dispatcher,
            radius: 5
        });

        const timelineFocus = new TimelineFocus(demDebateData, sentimentAnalysisData,
            {
            parentElement: '#mergedMultilineTimeline',
            containerHeight: 500,
            containerWidth: 840,
            dispatcher: dispatcher,
            colorScale: colorScale,
            radius: 5
        });

        /*
        const timelineLegend = new TimelineLegend({
            parentElement: '#timeline',
            containerHeight: 600,
            containerWidth: 1200,
            colorScale: colorScale,
            radius: 10
        });
        */

        timelineContext.update();
        timelineFocus.update();
});

