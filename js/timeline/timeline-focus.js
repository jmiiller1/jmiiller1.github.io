//Timeline Chart of the current state of the Democratic Primary.

import { TimeAxis } from './time-axis.js';
import { TimelineUtilities } from './timeline-utilities.js';
import { TimelineData } from './data-processing/timeline-data.js';
import { TimelineTooltip } from './timeline-tooltip.js';
import { TimelineLegend } from './timeline-legend.js';
import { TimelineHoverline } from './timeline-hoverline.js';
import { SentimentAxis } from './sentiment-axis.js';
import { PollingAxis } from './polling-axis.js';
import { MultiLineColorLegend } from './multiLineColorLegend.js';

export class TimelineFocus {

    constructor(sentimentAnalysisData, pollingData, demDebateData, keyEventData, narrativeData, _config) {
        const vis = this;

        vis.demDebateData = demDebateData;
        vis.demDebateCopy = demDebateData;

        vis.keyEventData = keyEventData;
        vis.keyEventCopy = keyEventData;

        vis.sentimentAnalysisDataCopy = sentimentAnalysisData;
        vis.groupedSentimentAnalysisData = d3.nest()
            .key(d => d.Candidates)
            .entries(sentimentAnalysisData);

        vis.pollingData = pollingData;
        vis.filteredPollingData = d3.nest()
            .key(d => d.Candidates)
            .entries(pollingData);

        vis.narrativeData = [];
        vis.narrativeCopy = narrativeData;

        vis.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 30, right: 25, bottom: 50, left: 75 },
            dispatcher: _config.dispatcher,
            radius: _config.radius,
            colorScale: d3.scaleOrdinal(d3.schemeDark2)
                .domain(vis.sentimentAnalysisDataCopy.map(d => d.Candidates))
        };

        vis.config.innerWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.config.outerTickSize = -vis.config.innerHeight;

        vis.completeDomain = [new Date(2018, 10, 31), new Date(2020, 3, 1)];
        vis.timeScale = TimeAxis.createTimeScale(vis.completeDomain, vis.config.innerWidth);
        vis.sentimentScale = SentimentAxis.createSentimentScale(vis.config.innerHeight/2 - 25);
        vis.pollingScale = PollingAxis.createPollingScale(vis.config.innerHeight/2 - 25);

        vis.initVis();
    }

    initVis() {
        const vis = this;

        vis.performBasicSetup();
        vis.performTimeAxisSetup();
        vis.performTimelineSetup();
        vis.performHoverLineSetup();
        vis.performMultilineSetup();
        vis.performListenerSetup();

    }

    performBasicSetup() {
        const vis = this;

        vis.body = TimelineUtilities.retrieveBody();
        vis.svgContainer = d3.select('#mergedMultilineTimeline');
        vis.svg = TimelineUtilities.initializeSVG(vis.config.containerHeight, vis.config.containerWidth, vis.config.parentElement, 'timeline-svg');
        vis.chart = TimelineUtilities.appendChart(vis.config.innerHeight, vis.config.innerWidth, vis.config.margin, vis.svg, 'timeline-chart');
    }

    performTimeAxisSetup() {
        const vis = this;

        vis.timelineYOffset = 10;
        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight + vis.timelineYOffset, vis.config.innerWidth);
        vis.timeAxisTitle = TimelineUtilities.appendText(vis.chart, 'Time', vis.config.innerHeight + 40, vis.config.innerWidth / 2, 'axis-title');
    }

    performTimelineSetup() {
        const vis = this;

        vis.config.timelineEventColor = 'lightgrey';
        vis.timelineTooltip = TimelineTooltip.appendTooltip(vis.body);
        vis.timelineDataGroup = vis.chart.append('g').attr('class', 'timeline-data').attr('transform', `translate(0, ${vis.config.innerHeight})`);
        vis.narrativeGroup = vis.svgContainer.append('div').attr('class', 'narrative-container');
        vis.timelineLegend = TimelineLegend.appendLegend(vis.chart, 20, -20, 120, vis.config.radius);
    }

    performMultilineSetup() {
        const vis = this;

        vis.yAxisGroup = SentimentAxis.appendYAxis(vis.chart, vis.sentimentScale, vis.config.innerWidth);
        vis.yAxisTitle = TimelineUtilities.appendTextYAxis(vis.yAxisGroup, 'Sentiment', -40, -vis.config.innerHeight/4, 'axis-title');

        vis.pollingAxisGroup = PollingAxis.appendYAxis(vis.chart, vis.pollingScale, vis.config.innerWidth, vis.config.innerHeight/2 + 25);
        vis.pollingAxisTitle = TimelineUtilities.appendTextYAxis(vis.pollingAxisGroup, 'National Polling Percentage', -40, -vis.config.innerHeight/4, 'axis-title');

        vis.multilineDataGroup = vis.chart.append('g').attr('class', 'multiline-data');
        vis.pollingMultilineGroup = vis.chart.append('g').attr('class', 'polling-data').attr('transform', `translate(0, ${vis.config.innerHeight/2 + 25})`);
        vis.colorScaleLegend = MultiLineColorLegend.appendColorLegend(vis.chart, vis.config.innerWidth / 2, -20, vis.config.colorScale);
    }

    performHoverLineSetup() {
        const vis = this;

        vis.hoverlineContainer = TimelineHoverline.appendHoverlineContainer(vis.chart, vis.config.innerHeight, vis.config.innerWidth);
        vis.hoverLine = TimelineHoverline.appendHoverline(vis.chart, vis.config.innerHeight, vis.timelineYOffset);

        vis.hoverlineContainer.on('mousemove', TimelineHoverline.mouseMove(vis.hoverLine));
        vis.hoverlineContainer.on('mouseout', TimelineHoverline.mouseOut(vis.hoverLine));
    }

    performListenerSetup() {
        const vis = this;

        vis.config.dispatcher.on('focus.timeline', function(extent) {
            vis.timeScale = TimeAxis.createTimeScale(extent, vis.config.innerWidth);

            vis.demDebateData = vis.demDebateCopy.filter(TimelineData.dateInRange(extent));
            vis.keyEventData = vis.keyEventCopy.filter(TimelineData.dateInRange(extent));

            vis.groupedSentimentAnalysisData = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.sentimentAnalysisDataCopy.filter(TimelineData.dateInRange(extent)));

            vis.filteredPollingData = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.pollingData.filter(TimelineData.dateInRange(extent)));

            vis.narrativeData = vis.getNarrativeTextData(extent);

            vis.update();
        });
    }

    getNarrativeTextData(extent) {
        const vis = this;

        if (vis.shouldShowNarrativeText()) {
            return vis.narrativeCopy.filter(TimelineData.dateInRange(extent)).slice(0, 5);
        } else {
            return [];
        }
    }

    update() {
        const vis = this;

        vis.timeAxisGroup.remove();
        vis.timeAxisGroup = TimeAxis.appendTimeAxis(vis.chart, vis.timeScale, vis.config.innerHeight + 10, vis.config.innerWidth);

        vis.updateTimeline();
        vis.updateMultiline();
    }

    updateTimeline() {
        const vis = this;

        vis.renderTimeline();
    }

    updateMultiline() {
        const vis = this;

        vis.renderSentimentMultiline();
        vis.renderPollingMultiline();
    }

    renderTimeline() {
        const vis = this;

        const dateMap = new Map();

        vis.renderDemDebateData(dateMap);
        vis.renderKeyEventData(dateMap);
        vis.renderNarrativeText();
    }

    renderDemDebateData(dateMap) {
        const vis = this;

        const updateSelection = vis.timelineDataGroup.selectAll('circle').data(vis.demDebateData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('circle')
            .attr('class', 'event')
            .attr('r', vis.config.radius)
            .attr('fill', vis.config.timelineEventColor)
            .attr('z-index', 20)
            .merge(updateSelection)
                .attr('cx', d => vis.timeScale(d['Date']))
                .attr('cy', d => 2 * vis.config.radius + (2 * vis.config.radius * TimelineUtilities.computeYOffsetIndex(dateMap)(d)))
                .on('mousemove.tooltip', TimelineTooltip.mouseMove(vis.timelineTooltip))
                .on('mouseout.tooltip', TimelineTooltip.mouseOut(vis.timelineTooltip));

        exitSelection.remove();
    }

    renderKeyEventData(dateMap) {
        const vis = this;
        
        const updateSelection = vis.timelineDataGroup.selectAll('g').data(vis.keyEventData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        const keyEventGroups = enterSelection.append('g').attr('class', 'event');

        keyEventGroups.append('rect')
            .attr('width', vis.config.radius * 2)
            .attr('height', vis.config.radius * 2)
            .attr('fill', vis.config.timelineEventColor)
            .attr('z-index', 20)
            .merge(updateSelection.select('rect'))
                .attr('x', d => vis.timeScale(d['Date']) - vis.config.radius)
                .attr('y', d => vis.config.radius + (2 * vis.config.radius * TimelineUtilities.computeYOffsetIndex(dateMap)(d)))
                .on('mousemove.tooltip', TimelineTooltip.mouseMove(vis.timelineTooltip))
                .on('mouseout.tooltip', TimelineTooltip.mouseOut(vis.timelineTooltip));

        exitSelection.remove();
    }

    renderNarrativeText() {
        const vis = this;

        const updateSelection = vis.narrativeGroup.selectAll('div.narrative-element.info-element').data(vis.narrativeData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection
            .append('div')
            .attr('class', 'narrative-element info-element')
            .merge(updateSelection)
                .html(d => '<p><b>' + TimeAxis.formatTime(d['Date']) + ':</b></p>' + '<p>' + d['Description'] + '</p>');

        exitSelection.remove();
    }

    shouldShowNarrativeText() {
        const vis = this;

        const extent = vis.timeScale.domain();
        const earlyDate = extent[0];
        const laterDate = extent[1];
        const msInADay = 60*60*24*1000;
        const differenceInDays = (laterDate - earlyDate) / msInADay;

        return differenceInDays <= 31;
    }

    renderSentimentMultiline() {
        const vis = this;

        const lineGenerator = d3.line()
            .x(d => vis.timeScale(d['Date']))
            .y(d => vis.sentimentScale(d['SentScore(avg)']))
            .curve(d3.curveBasis);

        const updateSelection = vis.multilineDataGroup.selectAll('path').data(vis.groupedSentimentAnalysisData);
        const enterSelection = updateSelection.enter();
        const exitSelection = updateSelection.exit();

        enterSelection.append('path')
            .attr('class', 'line-path')
            .merge(updateSelection)
                .attr('d', d => lineGenerator(d.values))
                .attr('stroke', d => vis.config.colorScale(d.key))
                .append('title')
                .text(d => d.key);

        exitSelection.remove();
    }

    renderPollingMultiline() {
        const vis = this;

        const pollingLineGenerator = d3.line()
            .x(d => vis.timeScale(d['Date']))
            .y(d => vis.pollingScale(d['Percentage']))
            .curve(d3.curveBasis);

        const pollingUpdateSelection = vis.pollingMultilineGroup.selectAll('path').data(vis.filteredPollingData);
        const pollingEnterSelection = pollingUpdateSelection.enter();
        const pollingExitSelection = pollingUpdateSelection.exit();

        pollingEnterSelection.append('path')
            .attr('class', 'line-path')
            .merge(pollingUpdateSelection)
            .attr('d', d => pollingLineGenerator(d.values))
            .attr('stroke', d => vis.config.colorScale(d.key))
            .append('title')
            .text(d => d.key);

        pollingExitSelection.remove();
    }
}

