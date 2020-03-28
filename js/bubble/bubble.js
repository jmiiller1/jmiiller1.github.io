
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

        this.radius = 3;

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
            .attr('y', 40)
            .attr('x', vis.width / 2)
            .text(xAxisLabel);

        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.Category))
            .range(d3.schemeTableau10);

        vis.candidateScale = d3.scaleBand()
            .domain(vis.data.map(d => d.Candidates))
            .range([0, vis.height]);

        vis.yAxis = d3.axisLeft(vis.candidateScale).tickSize(0);
        vis.yAxisG = vis.chart.append('g').attr('class', 'candidate_name')

        const colorLegend = (selection, props) => {
            const {
                colorScale,
                circleRadius,
                spacing,
                textOffset
            } = props;

            const groups = selection.selectAll('g')
                .data(colorScale.domain());

            const groupsEnter = groups.enter().append('g')
                .attr('class', 'tick');

            groupsEnter
                .merge(groups)
                .attr('transform', (d, i) =>
                    `translate(0, ${i*spacing})`);

            groups.exit().remove();

            groupsEnter.append('circle')
                //.attr('class', 'legend')
                .merge(groups.select('circle'))
                .attr('r', circleRadius)
                .attr('fill', colorScale);

            groupsEnter.append('text')
                .merge(groups.select('text'))
                .text(d => d)
                .attr('dy', '0.32em')
                .attr('x', textOffset);
        };

        vis.chart.append('g')
            .attr('transform', `translate(${vis.width - 75}, ${vis.height - 75})`)
            .call(colorLegend, {
                colorScale: vis.colorScale,
                circleRadius: 5,
                spacing: 20,
                textOffset: 10
            });

    }

    update() {
        let vis = this;

        vis.filtered = vis.data.filter(d => vis.categories.has(d.Category));
        console.log(vis.filtered)

        const manyBody = d3.forceManyBody().strength(1);

        function changeNetwork() {
            d3.selectAll('.marker')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }

        vis.force = d3.forceSimulation(vis.filtered)
            //.force('charge', manyBody)
            .force('x', d3.forceX(d => vis.xScale(d['SentScore(Avg)'])).strength(1))
            .force('collision', d3.forceCollide(vis.radius))
            .velocityDecay(0.5)
            .on('tick', changeNetwork)
            .stop();

        //force.stop()

        if (vis.group == 'separate') {
            vis.yAxisG.call(vis.yAxis);
            vis.yAxisG.select('.domain').remove();

            vis.force
                .force('y', d3.forceY(d => vis.candidateScale(d.Candidates) + vis.candidateScale.bandwidth()/2).strength(5))

            //force.alpha(1).restart();

        } else if (vis.group == 'all') {

            vis.yAxisG.selectAll('.tick').remove();

            vis.force
                .force('y', d3.forceY(vis.height/2).strength(5));

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
            //.transition().duration(1000)
            .style('fill', d => vis.colorScale(d.Category))
            .attr('r', vis.radius)
            .attr('stroke', 'black')
            .attr('stroke-width', .1);

        vis.force.alpha(1).restart();
    }
}

