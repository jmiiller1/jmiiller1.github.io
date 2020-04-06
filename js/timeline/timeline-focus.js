/*
  Timeline Chart of the current state of the Democratic Primary.
 */

import { TimeAxis } from './time-axis.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimelineData } from "./timeline-data.js";
import { TimelineTooltip } from "./timeline-tooltip.js";
import {TimelineLegend} from "./timeline-legend.js";
import {TimelineHoverline} from "./timeline-hoverline.js";
import {SentimentAxis} from "./sentiment-axis.js";
import {MultiLineColorLegend} from "./multiLineColorLegend.js";

export class TimelineFocus {

    constructor(demDebateData, sentimentAnalysisData, _config) {
        const vis = this;

        vis.demDebateData = demDebateData;
        vis.demDebateCopy = demDebateData;

        vis.sentimentAnalysisDataCopy = sentimentAnalysisData;
        vis.groupedSentimentAnalysisData = d3.nest()
            .key(d => d.Candidates)
            .entries(sentimentAnalysisData);

        vis.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 50, right: 50, bottom: 50, left: 100 },
            dispatcher: _config.dispatcher,
            radius: _config.radius,
            colorScale: d3.scaleOrdinal(d3.schemeDark2)
                .domain(vis.sentimentAnalysisDataCopy.map(d => d.Candidates))
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.config.outerTickSize = -vis.config.innerHeight;

        vis.timeScale = TimeAxis.createTimeScale([new Date(2019, 5, 1), new Date(2020, 2, 1)], vis.config.innerWidth);
        vis.sentimentScale = SentimentAxis.createSentimentScale(vis.config.innerHeight);

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.performBasicSetup();
        vis.performTimeAxisSetup();
        vis.performTimelineSetup();
        vis.performHoverLineSetup();
        vis.performMultilineSetup();
        vis.performFocusListenerSetup();

        //vis.legend = TimelineLegend.appendLegend(vis, vis.config.innerHeight / 4, (9 * vis.config.innerWidth) / 10);
        //vis.legendTitle = TimelineUtilities.appendText(vis.legend, 'Legend', vis.config.innerHeight / 4 - 20, (9 * vis.config.innerWidth) / 10 + 60, '');

    }

    performBasicSetup() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();
        vis.svg = TimelineUtilities.initializeSVG(vis.config.containerHeight, vis.config.containerWidth, vis.config.parentElement, 'timeline-svg');
        vis.chart = TimelineUtilities.appendChart(vis.config.innerHeight, vis.config.innerWidth, vis.config.margin, vis.svg, 'timeline-chart');
    }

    performTimeAxisSetup() {
        const vis = this;

        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight, vis.config.innerWidth, vis.config.outerTickSize);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.chart, "Time", vis.config.innerHeight + 50, vis.config.innerWidth / 2, "axis-title");
    }

    performTimelineSetup() {
        const vis = this;

        vis.config.timelineEventColor = 'lightgrey';
        vis.timelineTooltip = TimelineTooltip.appendTooltip(vis.body);
        vis.timelineDataGroup = vis.chart.append('g').attr('class', 'timeline-data');
    }

    performMultilineSetup() {
        const vis = this;

        vis.yAxisGroup = SentimentAxis.appendYAxis(vis.chart, vis.sentimentScale, vis.config.innerWidth);
        vis.yAxisTitle = TimelineUtilities.appendTextYAxis(vis.yAxisGroup, 'Sentiment', -40, -vis.config.innerHeight/2, 'axis-title');

        vis.multilineDataGroup = vis.chart.append('g').attr('class', 'multiline-data');
        vis.colorScaleLegend = MultiLineColorLegend.appendColorLegend(vis.chart, 0, vis.config.innerWidth, vis.config.colorScale);
    }

    performHoverLineSetup() {
        const vis = this;

        vis.hoverlineContainer = TimelineHoverline.appendHoverlineContainer(vis.chart, vis.config.innerHeight, vis.config.innerWidth);
        vis.hoverLine = TimelineHoverline.appendHoverline(vis.chart, vis.config.innerHeight);

        vis.hoverlineContainer.on('mousemove', TimelineHoverline.mouseMove(vis.hoverLine, vis.config.parentElement, vis.config.margin.left, vis.config.innerWidth));
        vis.hoverlineContainer.on('mouseout', TimelineHoverline.mouseOut(vis.hoverLine));
    }

    performFocusListenerSetup() {
        const vis = this;

        vis.config.dispatcher.on('focus.timeline', function(extent) {
            vis.timeScale = TimeAxis.createTimeScale(extent, vis.config.innerWidth);

            vis.demDebateData = vis.demDebateCopy.filter(TimelineData.dateInRange(extent));
            vis.groupedSentimentAnalysisData = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.sentimentAnalysisDataCopy.filter(TimelineData.dateInRange(extent)));

            vis.update();
        });
    }

    update() {
        const vis = this;

        vis.timeAxisGroup.remove();
        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight, vis.config.innerWidth, vis.config.outerTickSize);

        vis.updateTimeline();
        vis.updateMultiline()
    }

    updateTimeline() {
        const vis = this;

        vis.renderTimeline();
    }

    updateMultiline() {
        const vis = this;

        vis.renderMultiline()
    }

    render() {
        const vis = this;

        vis.renderTimeline();
        vis.renderMultiline();
    }

    renderTimeline() {
        const vis = this;

        const updateSelection = vis.timelineDataGroup.selectAll('circle').data(vis.demDebateData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'event')
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight)
            .attr('r', vis.config.radius)
            .attr('fill', vis.config.timelineEventColor)
            .attr('z-index', 20)
            .on('mousemove.tooltip', TimelineTooltip.mouseMove(vis.timelineTooltip))
            .on('mouseout.tooltip', TimelineTooltip.mouseOut(vis.timelineTooltip));

        updateSelection
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight);

        exitSelection.remove();
    }

    renderMultiline() {
        const vis = this;

        const lineGenerator = d3.line()
            .x(d => vis.timeScale(d['Date']))
            .y(d => vis.sentimentScale(d['SentScore(Avg)']))
            .curve(d3.curveBasis);

        const updateSelection = vis.multilineDataGroup.selectAll('path').data(vis.groupedSentimentAnalysisData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('path')
            .attr('class', 'line-path')
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => vis.config.colorScale(d.key))
            .attr('fill', 'none') // remove later
            .append('title')
            .text(d => d.key);

        updateSelection
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => vis.config.colorScale(d.key))
            .attr('fill', 'none') // remove later
            .append('title')
            .text(d => d.key);

        exitSelection.remove();
    }
}

