/*
  Timeline Chart of the current state of the Democratic Primary.
 */

class Timeline {

    constructor(data, _config) {
        // Instance Variables:
        this.data = data;
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight,
            containerWidth: _config.containerWidth,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            radius: 5
        };

        this.config.innerWidth =this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.innerHeight = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        this.timeScale = this.createTimeScale();

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.svg = vis.initializeSVG();

        vis.chart = vis.appendChart(vis.svg);
        vis.chartTitle = vis.appendText(vis.chart, "Timeline", 0, vis.config.innerWidth / 2, "chart-title");

        vis.timeAxisGroup = vis.appendTimeAxis(vis.chart);
        vis.timeAxisTitle = vis.appendText(vis.timeAxisGroup, "Time", 40, vis.config.innerWidth / 2, "axis-title");
    }

    update() {
        const vis = this;
        vis.render();
    }

    render() {
        const vis = this;

        const dataGroup = vis.chart.append('g');

        const updateSelection = dataGroup.selectAll('circle').data(vis.data);

        const enterSelection = updateSelection.enter();
        enterSelection.append('circle')
            .attr('class', 'dem-debate')
            .attr('cx', d => vis.timeScale(d['Date']))
            .attr('cy', vis.config.innerHeight / 2)
            .attr('r', vis.config.radius);
    }

    initializeSVG() {
        const vis = this;

        const svg = d3.select('svg');

        svg.attr('height', vis.config.containerHeight)
           .attr('width', vis.config.containerWidth);

        return svg;
    }

    appendChart(svg) {
        const vis = this;

        const chart = svg.append('g');
        chart.attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        chart.attr('height', vis.config.innerHeight)
             .attr('width', vis.config.innerWidth);

        return chart;
    }

    appendTimeAxis(chart) {
        const vis = this;

        const timeAxis = Timeline.createTimeAxis(vis.timeScale);

        const timeAxisGroup = chart.append('g');
        timeAxisGroup.attr('transform', `translate(0, ${vis.config.innerHeight})`);
        timeAxisGroup.call(timeAxis);

        return timeAxisGroup;
    }

    appendText(group, titleName, height, width, className) {
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.text(titleName);

        return group;
    }

    createTimeScale() {
        const vis = this;
        const timeScale = d3.scaleTime();
        timeScale.domain([new Date(2019, 6, 1), new Date(2020, 3, 30)]);
        timeScale.range([0, vis.config.innerWidth]);
        timeScale.nice();

        return timeScale;
    }

    static createTimeAxis(timeScale) {
        return d3.axisBottom(timeScale);
    }
}

