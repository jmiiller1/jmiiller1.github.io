
class Bubble {

    constructor(_config, data) {//, onClick, onMouseOver) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 500,
        };
        this.config.margin = _config.margin || { top: 25, bottom: 50, right: 25, left: 75 };

        this.data = data;

        // it's useful to give pull out the sets for categories and candidates
        this.categories = new Set(this.data.map(d => d.Category));
        this.candidates = new Set(this.data.map(d => d.Candidates));

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        const xAxisLabel = 'Sentiment';

        // canvas-related stuff
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // the following part deals with scales
        // scale for sentiment
        vis.xScale = d3.scaleLinear()
            .domain([-1, 1])  // sentiment scores range from -1 to 1
            .range([0, vis.width]);

        const xAxis = d3.axisBottom(vis.xScale);

        const xAxisG = vis.chart.append('g').call(xAxis)
            .attr('transform', `translate(0, ${vis.height})`);

        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 30)
            .attr('x', vis.width / 2)
            .attr('fill', 'black')
            .text(xAxisLabel);

        // scale for category color
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.Category))
            .range(d3.schemeTableau10);

        // scale for vertical position for candidate
        vis.candidateScale = d3.scaleBand()
            .domain(vis.data.map(d => d.Candidates))
            .range([0, vis.height]);

        vis.yAxis = d3.axisLeft(vis.candidateScale).tickSize(0);
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'candidate_name');

        // scale for word count
        vis.radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(vis.data, d => d.Count)])
            .range([0, 10]);

        //tooltips
        //reference: http://jsfiddle.net/VTJ5G/
        d3.select('body').append('div')
            .attr('id', 'tooltip')
            .attr('class', 'hidden');

        d3.select('#tooltip').append('div')
            .style('font-weight', 'bold')
            .text('Headline:');

        d3.select('#tooltip').append('div')
            .attr('class', 'headline')
            .style('font-weight', 'normal')
            .text('#headline');

        d3.select('#tooltip').append('div')
            .style('font-weight', 'bold')
            .text('Publication date:');

        d3.select('#tooltip').append('div')
            .attr('class', 'date')
            .style('font-weight', 'normal')
            .text('#date');

        d3.select('#tooltip').append('div')
            .style('font-weight', 'bold')
            .text('Sentiment score:');

        d3.select('#tooltip').append('div')
            .attr('class', 'sentiment')
            .style('font-weight', 'normal')
            .text('#sentiment');

        // helper function for color legend
        const colorLegend = (selection, props) => {
            const {
                colorScale,
                circleRadius,
                spacing,
                textOffset
            } = props;

            const groups = selection.selectAll('g')
                .data(colorScale.domain());

            const groupsEnter = groups.enter().append('g');

            groupsEnter
                .merge(groups)
                .attr('transform', (d, i) => `translate(0, ${i*spacing})`);

            groups.exit().remove();

            groupsEnter.append('circle')
                .attr('class', 'color-legend')
                .merge(groups.select('.color-legend'))
                .attr('r', circleRadius)
                .attr('fill', colorScale);

            groupsEnter.append('text')
                .merge(groups.select('text'))
                .text(d => d)
                .attr('dy', '0.32em')
                .attr('x', textOffset);
        };

        // helper function for size legend
        const sizeLegend = (selection, props) => {
            const {
                sizeScale,
                spacing,
                textOffset,
                numTicks,
                circleFill
            } = props;

            const ticks = sizeScale.ticks(numTicks)
                .filter(d => d !== 0)
                .reverse();

            const groups = selection.selectAll('g').data(ticks);

            const groupsEnter = groups.enter().append('g');

            groupsEnter
                .merge(groups)
                .attr('transform', (d, i) => `translate(0, ${i*spacing})`);

            groups.exit().remove();

            groupsEnter.append('circle')
                .attr('class', 'size-legend')
                .merge(groups.select('.size-legend'))
                .attr('r', sizeScale)
                .attr('fill', circleFill);

            groupsEnter.append('text')
                .merge(groups.select('text'))
                .text(d => d)
                .attr('dy', '0.32em')
                .attr('x', d => sizeScale(d) + textOffset);
        };

        // create mean score legend
        vis.chart.append('g')
            .attr('class', 'mean-legend')
            .attr('transform', `translate(${vis.width - 50}, ${vis.height - 275})`)
            .append('rect')
            .attr('width', 5)
            .attr('height', 50);

        d3.select('.mean-legend')
            .append('text')
            .attr('dy', '1.75em')
            .attr('x', 10)
            .text('mean');
        d3.select('.mean-legend')
            .append('text')
            .attr('dy', '2.5em')
            .attr('x', 10)
            .text('sentiment');
        d3.select('.mean-legend')
            .append('text')
            .attr('dy', '3.25em')
            .attr('x', 10)
            .text('score');

        // create size legend
        const countLegend = vis.chart.append('g')
            .attr('transform', `translate(${vis.width - 50}, ${vis.height - 175})`);

        countLegend
            .append('text')
            .attr('class', 'legend-title')
            .attr('x', -5)
            .attr('y', -20)
            .text('Word count');

        countLegend
            .call(sizeLegend, {
                sizeScale: vis.radiusScale,
                spacing: 20,
                textOffset: 10,
                numTicks: 5,
                circleFill: 'rgba(0, 0, 0, 0.5)'
            });

        // create color legend
        const categoryLegend = vis.chart.append('g')
            .attr('transform', `translate(${vis.width - 50}, ${vis.height - 75})`);

        categoryLegend
            .append('text')
            .attr('class', 'legend-title')
            .attr('x', -5)
            .attr('y', -15)
            .text('Category');

        categoryLegend
            .call(colorLegend, {
                colorScale: vis.colorScale,
                circleRadius: 5,
                spacing: 20,
                textOffset: 10
            });

        const manyBody = d3.forceManyBody().strength(1);

        function changePosition() {
            d3.selectAll('.marker')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }

        vis.force = d3.forceSimulation()
            .force('charge', manyBody)
            //.velocityDecay(0.5)
            .on('tick', changePosition)
            .stop();
    }

    update() {
        let vis = this;

        // only keep articles from selected categories
        vis.filtered = vis.data.filter(d => vis.categories.has(d.Category));

        vis.force.stop();  // stop the force simulation

        // update data in vis.force
        vis.force
            .nodes(vis.filtered)
            .force('x', d3.forceX(d => vis.xScale(d['SentScore(avg)'])).strength(1))
            .force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.Count) + 0.5))

        if (vis.group === 'separate') {
            vis.yAxisG.call(vis.yAxis);
            vis.yAxisG.select('.domain').remove();

            vis.averages = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.filtered);

            vis.averages.forEach((d, i) => {
                d.mean = d3.mean(d.values.map(d => d['SentScore(avg)']));
                d.id = d.key;
            });

            vis.force
                .force('y', d3.forceY(d => vis.candidateScale(d.Candidates) + vis.candidateScale.bandwidth()/2).strength(1))

        } else if (vis.group === 'all') {
            vis.yAxisG.selectAll('.tick').remove();

            vis.averages = [{
                mean: d3.mean(vis.filtered.map(d => d['SentScore(avg)'])),
                id: 9999
            }];

            vis.force
                .force('y', d3.forceY(vis.height/2).strength(1));
        }

        vis.render();
    }

    render() {
        let vis = this;

        // the following part deals with bubbles
        const bubble = vis.chart.selectAll('.marker').data(vis.filtered, d => d.id);
        const bubbleEnter = bubble.enter().append('circle').attr('class', 'marker');
        bubble.exit().remove();

        bubble.merge(bubbleEnter)
            .transition().duration(1000)
            .attr('fill', d => vis.colorScale(d.Category))
            .attr('r', d => vis.radiusScale(d.Count))
            .attr('stroke', 'black')
            .attr('stroke-width', .1);

        bubble.merge(bubbleEnter)
            .on('mouseover', d => {
                //update tooltip info
                d3.select('#tooltip')
                    .style('left', d3.event.pageX - 20 + 'px')
                    .style('top', d3.event.pageY + 20 + 'px');
                d3.select('#tooltip').classed('hidden', false);
                d3.select('.headline').text(d.Headline);
                d3.select('.date').text(d.Pub_date);
                d3.select('.sentiment').text(d['SentScore(avg)']);
            })
            .on('mouseout', d => {
                d3.select('#tooltip').classed('hidden', true);
            });

        // the following part deals with the mean bar
        const average = vis.chart.selectAll('.mean').data(vis.averages, d => d.id);
        const averageEnter = average.enter().append('rect').attr('class', 'mean');
        average.exit().remove();

        averageEnter
            .attr('width', 0)
            .attr('height', 0)
            .attr('transform', `translate(${-5/2}, ${-50/2})`)
            .attr('x', vis.width/2)
            .attr('y', vis.height/2)
            .merge(average)
            .transition().duration(1000)
            .attr('width', 5)
            .attr('height', 50)
            .attr('x', d => vis.xScale(d.mean))
            .attr('y', d => {
                if (vis.group === 'all') {
                    return vis.height/2
                } else if (vis.group === 'separate')
                    return vis.candidateScale(d.key) + vis.candidateScale.bandwidth()/2
            });

        vis.force.alpha(1).restart();  //restart force algorithm
    }
}
