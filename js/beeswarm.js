
class Beeswarm {

    constructor(_config, data) {//, onClick, onMouseOver) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 500,
        };
        this.config.margin = _config.margin || { top: 25, bottom: 50, right: 25, left: 75 };

        this.data = data;
        //this.onClick = onClick;
        //this.onMouseOver = onMouseOver;
        //this.clickedId = null;
        //this.mouseOverId = null;

        this.radius = 3;
        this.padding = 1.5;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        const xAxisLabel = 'Sentiment';
        //const yAxisLabel = '(TBD)';

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
            .domain(vis.data.map(d => d.Candidates))
            .range(d3.schemeTableau10);

        //vis.yScale = d3.scaleLinear()
        //    .domain([lifeMin, lifeMax])
        //    .range([vis.height, 0]);

        //const yAxis = d3.axisLeft(vis.yScale);

        //const yAxisG = vis.chart.append('g').call(yAxis);

        //yAxisG.append('text')
        //    .attr('class', 'axis-label')
        //    .attr('y', -40)
        //    .attr('x', -vis.height / 2)
        //    .attr('transform', `rotate(-90)`)
        //    .attr('text-anchor', 'middle')
        //    .text(yAxisLabel);

        //vis.sizeScale = d3.scaleSqrt()
        //    .domain([0, popMax])
        //    .range([5, 30]);

        // from https://observablehq.com/@d3/beeswarm
        vis.dodge = (data, radius) => {
            const radius2 = radius ** 2;
            const circles = data.map(d => ({x: vis.xScale(d['SentScore(Avg)']), data: d})).sort((a, b) => a.x - b.x);
            const epsilon = 1e-3;
            let head = null, tail = null;

            // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
            const intersects = (x, y) => {
                let a = head;
                while (a) {
                    if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
                        return true;
                    }
                    a = a.next;
                }
                return false;
            };

            // Place each circle sequentially.
            for (const b of circles) {

                // Remove circles from the queue that can’t intersect the new circle b.
                while (head && head.x < b.x - radius2) head = head.next;

                // Choose the minimum non-intersecting tangent.
                if (intersects(b.x, b.y = 0)) {
                    let a = head;
                    b.y = Infinity;
                    do {
                        let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
                        if (y < b.y && !intersects(b.x, y)) b.y = y;
                        a = a.next;
                    } while (a);
                }

                // Add b to the queue.
                b.next = null;
                if (head === null) head = tail = b;
                else tail = tail.next = b;
            }

            return circles;
        };
    }

    update() {
        let vis = this;
        vis.render();
    }

    render() {
        let vis = this;

        vis.chart.append('g')
            .selectAll('circle')
            .data(vis.dodge(vis.data, vis.radius*2 + vis.padding))
            .join('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => vis.height - vis.radius - vis.padding - d.y)
                //.attr('cy', d => d.y)
                .attr('r', vis.radius)
                .attr('fill', d => vis.colorScale(d.data.Candidates))
            .append('title')
                .text(d => d.data.Candidates);

        /*
        const yearText = vis.chart.selectAll('.yearText').data([null]);
        const yearTextEnter = yearText.enter().append('text').attr('class', 'yearText');

        yearText
            .merge(yearTextEnter)
            .transition().duration(1000)
            .attr('font-size', '200')
            .style('fill', 'silver')
            .attr('text-anchor', 'middle')
            .attr('x', vis.width/2)
            .attr('y', vis.height - 2)
            .text(vis.year);

        yearText.exit().remove();

        const circles = vis.chart.selectAll('circle').data(vis.data, d => d.id);
        const circlesEnter = circles.enter().append('circle').attr('opacity', 0.75)
            .on('click', d => vis.onClick(d.id === vis.clickedId ? null : d.id))
            .on('mouseover', d => vis.onMouseOver(d.id))
            .on('mouseout', d => vis.onMouseOver(null));

        circlesEnter.append('title').text(d => d.country);

        circlesEnter
            .merge(circles)
            .attr('fill', d => (!vis.clickedId || d.id !== vis.clickedId) ? '#4682b4' : '#b35227')
            .attr('fill', d => {
                if (d.id === vis.mouseOverId) {
                    return '#71361c';
                } else {
                    if (!vis.clickedId || d.id !== vis.clickedId) {
                        return '#4682b4';
                    } else {
                        return '#b35227';
                    }
                }
            })
            .transition().duration(1000)
            .attr('cy', d => vis.yScale(d['lifeExp_' + vis.year]))
            .attr('cx', d => vis.xScale(d['gdpPerCap_' + vis.year]))
            .attr('r', d => vis.sizeScale(d['pop_' + vis.year]));

        circles.exit().remove();
         */
    }
}

