
export class MultiLineColorLegend {

    static appendColorLegend(chart, xPos, yPos, colorScale) {
        const legendGroup = chart.append('g')
            .attr('class', 'color-legend')
            .attr('transform', `translate(${xPos}, ${yPos})`);

        const legend = MultiLineColorLegend.renderColorLegend(legendGroup,{
            colorScale: colorScale,
            circleRadius: 5,
            spacing: 80,
            textOffset: 10
        });

        return legend;

    }

    static renderColorLegend(selection, props) {
        const {
            colorScale,
            circleRadius,
            spacing,
            textOffset
        } = props;

        const groups = selection.selectAll('g')
            .data(colorScale.domain());
        const groupsEnter = groups
            .enter().append('g')
            .attr('class', 'tick');
        groupsEnter
            .merge(groups)
            .attr('transform', (d, i) =>
                `translate(${i * spacing}, 0)`
            );
        groups.exit().remove();

        groupsEnter.append('circle')
            .merge(groups.select('circle'))
            .attr('r', circleRadius)
            .attr('fill', colorScale);

        groupsEnter.append('text')
            .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset);
    }
}