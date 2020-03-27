export class MultiLineTimeAxis {

    static appendTimeAxis(vis) {
        const timeAxis = MultiLineTimeAxis.createTimeAxis(vis);
        const timeAxisGroup = vis.chart.append('g');
        timeAxisGroup
            .attr('class', 'time-axis')
            .attr('transform', `translate(0, ${vis.config.innerHeight})`);
        timeAxisGroup.call(timeAxis);
        console.log(timeAxisGroup);

        return timeAxisGroup;
    }
    
    static appendXAxis(vis) {
        const XAxis = MultiLineTimeAxis.createXAxis(vis);
        const XAxisGroup = vis.chart.append('g');
        XAxisGroup.call(XAxis)
            .attr('transform', `translate(0, ${vis.config.innerHeight})`);
            //.attr('class', 'x-axis')
            
        XAxisGroup.call(XAxis);
        return XAxisGroup; 
        
          
    }

    static appendYAxis(vis){
        const yAxis = MultiLineTimeAxis.createYAxis(vis);
        const yAxisGroup = vis.chart.append('g');
        // yAxisGroup
        //     .attr('class', 'time-axis');
        yAxisGroup.call(yAxis);
        return yAxisGroup;
    }

    static createTimeScale(vis, domain) {
        const timeScale = d3.scaleTime();
        timeScale.domain(domain);
        timeScale.range([0, vis.config.innerWidth]);
        console.log(timeScale);
        return timeScale;
    }

    static createTimeAxis(vis) {
        const timeAxis = d3.axisBottom(vis.timeScale)
            .tickSizeOuter(0)
            .ticks(vis.config.innerWidth / 80);
        return timeAxis;
    }

    // Above = TIMELINE timeAxis template
    static createXScale(vis){
        vis.xValue = d => d[`Date`];
        vis.dateRange = d3.extent(vis.data,vis.xValue);
        
        const xScale = d3.scaleTime()
            .domain(vis.dateRange)
            .range([0, vis.config.innerWidth]);
            // .nice();
        return xScale;
    }

    static createXAxis(vis) {
        const xAxis = d3.axisBottom(vis.xScale)
            .tickSize(-vis.config.innerHeight)
            .tickPadding(10);
          return xAxis;
    }

    static createYScale(vis){
        vis.yValue = d => d[`SentScore(Avg)`];
        vis.yAxisLabel = 'Sentiment Score';

        const yScale = d3.scaleLinear()
            .domain(d3.extent(vis.data, vis.yValue))
            .range([vis.config.innerHeight, 0])
            .nice();
        return yScale;
    }
    static createYAxis(vis){
        const yAxis = d3.axisLeft(vis.yScale)
            .tickSize(-vis.config.innerWidth)
            .tickPadding(10);
        return yAxis;
    }


}