
export class MultiLineColorLegend {

    static appendColorLegend(chart, height, width, colorScale) {
        const legendGroup = chart.append('g')
            .attr('class', 'color-legend')
            .attr('transform', `translate(${width - 75}, ${height + 20})`);

        const legend = MultiLineColorLegend.renderColorLegend(legendGroup,{
            colorScale: colorScale,
            circleRadius: 5,
            spacing: 20,
            textOffset: 10
        })

        return legend;

    }

    static renderColorLegend(selection, props) {
        const {
            colorScale,
            circleRadius,
            spacing,
            textOffset
        } = props;

        console.log(colorScale);
        const groups = selection.selectAll('g')
            .data(colorScale.domain());
        const groupsEnter = groups
            .enter().append('g')
            .attr('class', 'tick');
        groupsEnter
            .merge(groups)
            .attr('transform', (d, i) =>
                `translate(0, ${i * spacing})`
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