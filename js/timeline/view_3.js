import {TimelineContext} from "./timeline-context.js";
import {TimelineFocus} from "./timeline-focus.js";
import { TimelineData } from "./data-processing/timeline-data.js";
import {TimelineLegend} from "./timeline-legend.js";

const dispatcher = d3.dispatch('focus');

Promise.all(
    [
        d3.csv('data/NYT_data_average.csv', d3.autotype),
        d3.csv('data/polling_data.csv'),
        d3.csv('data/timeline/DemocraticPrimaryDebateSchedule.csv'),
        d3.csv('data/timeline/WikiDemPrimaryTimeline-processed.csv'),
        d3.csv('data/timeline/NarrativeText.csv')
    ]).then((files) => {

        const sentimentAnalysisData = files[0];
        const pollingData = files[1];
        const demDebateData = files[2];
        const keyEventData = files[3];
        const narrativeData = files[4];

        demDebateData.forEach((row) => {
            row['Date'] = TimelineData.convertStringToDate(row['Date']);
            row.type = 'debate';
        });

        sentimentAnalysisData.forEach((row) => {
            row['Date'] = new Date (row['Date']);
            row['SentScore(headline)'] = +row['SentScore(headline)'];
            row['SentScore(snippet)'] = +row['SentScore(snippet)'];
            row['SentScore(lead)'] = +row['SentScore(lead)'];
            row['SentScore(avg)'] = +row['SentScore(avg)'];
        });

        pollingData.forEach((row) => {
            row['Date'] = new Date (row['Date']);
            row['Percentage'] = +row['Percentage'];
        });

        keyEventData.forEach((row) => {
            row['Date'] = TimelineData.convertStringToDate(row['Date']);
            row.type = 'key-event';
        });

        narrativeData.forEach((row) => {
            row['Date'] = TimelineData.convertStringToDate(row['Date']);
        });

        const timelineContext = new TimelineContext(demDebateData, keyEventData, {
            parentElement: '#timeline-context',
            containerHeight: 60,
            containerWidth: 840,
            dispatcher: dispatcher,
            radius: 5
        });

        const timelineFocus = new TimelineFocus(sentimentAnalysisData, pollingData, demDebateData, keyEventData, narrativeData,
            {
            parentElement: '#mergedMultilineTimeline',
            containerHeight: 450,
            containerWidth: 880,
            dispatcher: dispatcher,
            radius: 5
        });

        timelineContext.update();
        timelineFocus.update();
});

