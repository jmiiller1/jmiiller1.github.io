export class TimelineBrush {

    static appendBrushX(vis, chart) {
        const brushX = TimelineBrush.createBrushX(vis);
        const brushGroup = chart.append('g');
        brushGroup.attr('class', 'timeline-brush');
        brushGroup.call(brushX);
    }

    static createBrushX(vis) {

        const moveBrush = TimelineBrush.moveBrush(vis);

        const brushX = d3.brushX();
        brushX.extent([[0, vis.config.innerHeight / 2 - 20], [vis.config.innerWidth, vis.config.innerHeight / 2 + 20]]);
        brushX.on('brush', moveBrush);

        return brushX
    }

    static moveBrush(vis) {

        return function() {
            if (d3.event.selection) {
                const highlightedArea = d3.event.selection.map(vis.timeScale.invert);
                vis.config.dispatcher.call('focus', this, highlightedArea);
            }
        }
    }
}