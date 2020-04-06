export class SentimentAxis {

    static createSentimentScale(height){
        const sentimentScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([height, 0]);

        return sentimentScale;
    }

    static createYAxis(yScale, width){
        const yAxis = d3.axisLeft(yScale)
            .tickPadding(5)
            .tickSize(-width);

        return yAxis;
    }

    static appendYAxis(chart, yScale, width){
        const yAxis = SentimentAxis.createYAxis(yScale, width);
        const yAxisGroup = chart.append('g');
        yAxisGroup.attr('class', 'sentiment-axis');

        yAxisGroup.call(yAxis);
        return yAxisGroup;
    }

}