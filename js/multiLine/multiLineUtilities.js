export class MultiLineUtilities {

    static initializeSVG(vis, id){

        const body = d3.select('#multiLine');
        const svg = body.append('svg');
        svg.attr('class', id)
            .attr('height', vis.config.containerHeight)
            .attr('width', vis.config.containerWidth);
            
        return svg;
    }

    static appendChart(vis, svg) {
        const chart = svg.append('g');
        chart.attr('class', 'multiLine-chart')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)
            .attr('height', vis.config.innerHeight)
            .attr('width', vis.config.innerWidth);

        return chart;
    }

    static appendText(group, titleName, height, width, className) {
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.text(titleName);

        return group;
    }

    static appendTextXAxis(group, titleName, height, width, className){
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.attr('fill', 'black');
        text.text(titleName);
        console.log(text);
        console.log(group);
        return group;
    }

    static appendTextYAxis(group, titleName, height, width, className){
        const text = group.append('text');
        text.attr('class', className);
        text.attr('x', width);
        text.attr('y', height);
        text.attr('fill', 'black');
        text.attr('transform', `rotate(-90)`);
        text.attr('text-anchor', 'middle');
        text.text(titleName);

        return group;
    }

    static createColorScale(vis){
        const colorValue = d => d.Candidates;
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        return colorScale;
    }

    static createLastYValue(vis){
        const lastYValue = d => 
            vis.yValue(d.values[d.values.length-1]);
        return lastYValue;
    }

    static createCandidateNest(vis){
        this.createLastYValue(vis);
        const nested = d3.nest()
                        .key(vis.colorValue)
                        .entries(vis.data)
                        .sort((a, b) =>
                        d3.descending(vis.lastYValue(a), vis.lastYValue(b))
                        );
        this.createColorScale(vis).domain(vis.nested.map(d => d.key));

        return nested;
    }

    static createLineGenerator(vis){
        const lineGenerator = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)))
            .curve(d3.curveBasis);
        return lineGenerator;
    }


}
