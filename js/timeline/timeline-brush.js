export class TimelineBrush {

    static appendBrushX(chart, height, width, timeScale, dispatcher) {
        const brushX = TimelineBrush.createBrushX(height, width, timeScale, dispatcher, [new Date(2018, 10, 31), new Date(2020, 3, 1)]);
        const brushGroup = chart.append('g');
        brushGroup.attr('class', 'timeline-brush');
        brushGroup.call(brushX);
    }

    static createBrushX(height, width, timeScale, dispatcher, completeDomain) {

        const brushX = d3.brushX();
        brushX.extent([[0, height - 20], [width, height + 20]]);
        brushX.on('brush', TimelineBrush.moveBrush(timeScale, dispatcher, completeDomain));
        brushX.on('end', TimelineBrush.moveBrush(timeScale, dispatcher, completeDomain));

        return brushX
    }

    static moveBrush(timeScale, dispatcher, completeDomain) {
        return function() {
            if (d3.event.selection) {
                const highlightedArea = d3.event.selection.map(timeScale.invert);
                dispatcher.call('focus', this, highlightedArea);
            } else {
                dispatcher.call('focus', this, completeDomain);
            }
        }
    }
}