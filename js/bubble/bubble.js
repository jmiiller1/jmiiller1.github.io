
class Bubble {

    constructor(_config, data) {//, onClick, onMouseOver) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 500,
        };
        this.config.margin = _config.margin || { top: 25, bottom: 50, right: 25, left: 75 };

        this.data = data;
        this.categories = new Set(this.data.map(d => d.Category));
        this.candidates = new Set(this.data.map(d => d.Candidates));

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        const xAxisLabel = 'Sentiment';

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        vis.xScale = d3.scaleLinear()
            .domain([-1, 1])
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

        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.Category))
            .range(d3.schemeTableau10);

        vis.candidateScale = d3.scaleBand()
            .domain(vis.data.map(d => d.Candidates))
            .range([0, vis.height]);

        vis.yAxis = d3.axisLeft(vis.candidateScale).tickSize(0);
        vis.yAxisG = vis.chart.append('g').attr('class', 'candidate_name');

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
            .text('Sentiment:');

        d3.select('#tooltip').append('div')
            .attr('class', 'sentiment')
            .style('font-weight', 'normal')
            .text('#sentiment');

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
                .attr('transform', (d, i) =>
                    `translate(0, ${i*spacing})`);

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
                .attr('transform', (d, i) =>
                    `translate(0, ${i*spacing})`);

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

        vis.chart.append('g')
            .attr('transform', `translate(${vis.width - 75}, ${vis.height - 75})`)
            .call(colorLegend, {
                colorScale: vis.colorScale,
                circleRadius: 5,
                spacing: 20,
                textOffset: 10
            });

        vis.chart.append('g')
            .attr('transform', `translate(${vis.width - 75}, ${vis.height - 175})`)
            .call(sizeLegend, {
                sizeScale: vis.radiusScale,
                spacing: 20,
                textOffset: 10,
                numTicks: 5,
                circleFill: 'rgba(0, 0, 0, 0.5)'
            });

        vis.chart.append('g')
            .attr('class', 'mean-legend')
            .attr('transform', `translate(${vis.width - 75}, ${vis.height - 275})`)
            .append('rect')
            .attr('width', 5)
            .attr('height', 50);
            //.attr('x', vis.width/2)
            //.attr('y', vis.height/2)

        d3.select('.mean-legend')
            .append('text')
            .attr('dy', '1.75em')
            .attr('x', 10)
            .text('mean');
    }

    update() {
        let vis = this;

        vis.filtered = vis.data.filter(d => vis.categories.has(d.Category));

        const manyBody = d3.forceManyBody().strength(1);

        function changeNetwork() {
            d3.selectAll('.marker')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }

        vis.force = d3.forceSimulation(vis.filtered)
            //.force('charge', manyBody)
            .force('x', d3.forceX(d => vis.xScale(d['SentScore(Avg)'])).strength(1))
            .force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.Count) + 0.5))
            //.velocityDecay(0.5)
            .on('tick', changeNetwork)
            .stop();


        if (vis.group === 'separate') {
            vis.yAxisG.call(vis.yAxis);
            vis.yAxisG.select('.domain').remove();

            vis.averages = d3.nest()
                .key(d => d.Candidates)
                .entries(vis.filtered);

            vis.averages.forEach((d, i) => {
                d.mean = d3.mean(d.values.map(d => d['SentScore(Avg)']));
                d.id = d.key;
            });

            vis.force
                .force('y', d3.forceY(d => vis.candidateScale(d.Candidates) + vis.candidateScale.bandwidth()/2).strength(1))

            //force.alpha(1).restart();

        } else if (vis.group === 'all') {
            vis.yAxisG.selectAll('.tick').remove();

            vis.averages = [{
                mean: d3.mean(vis.filtered.map(d => d['SentScore(Avg)'])),
                id: 9999
            }];

            vis.force
                .force('y', d3.forceY(vis.height/2).strength(1));

            //force.alpha(1).restart();
        }
        vis.render();
    }

    render() {
        let vis = this;

        const bubble = vis.chart.selectAll('.marker').data(vis.filtered, d => d.id);
        const bubbleEnter = bubble.enter().append('circle').attr('class', 'marker');
        bubble.exit().remove();
        bubble.merge(bubbleEnter)
            .transition().duration(1000)
            .style('fill', d => vis.colorScale(d.Category))
            .attr('r', d => vis.radiusScale(d.Count))
            .attr('stroke', 'black')
            .attr('stroke-width', .1)

        bubble.merge(bubbleEnter)
            .on('mouseover', d => {
                //update tooltip info
                d3.select('#tooltip')
                    .style('left', d3.event.pageX - 20 + 'px')
                    .style('top', d3.event.pageY + 20 + 'px');
                d3.select('#tooltip').classed('hidden', false);
                d3.select('.headline').text(d.Headline);
                d3.select('.date').text(d.Pub_date);
                d3.select('.sentiment').text(d['SentScore(Avg)']);
            })
            .on('mouseout', d => {
                d3.select('#tooltip').classed('hidden', true);
            });


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

        vis.force.alpha(1).restart();
    }
}

