
var chartjs = require('chart.js')
var canvas2svg = require('canvas2svg')

//adding missing functions, see https://stackoverflow.com/questions/45563420/exporting-chart-js-charts-to-svg-using-canvas2svg-js
C2S.prototype.getContext = function (contextId) {
    if (contextId == "2d" || contextId == "2D") {
        return this;
    }
    return null;
}

C2S.prototype.style = function () {
    return this.__canvas.style
}

C2S.prototype.getAttribute = function (name) {
    return this[name];
}

C2S.prototype.addEventListener = function (type, listener, eventListenerOptions) { }

//bugfix, see https://github.com/gliffy/canvas2svg/issues/68
C2S.prototype.__parseFont = function () {
    function parsedStyleForCSS(cssString) {
        var el = document.createElement("span");
        el.setAttribute("style", cssString);
        return el.style; // CSSStyleDeclaration object
    }
    var parsed = parsedStyleForCSS('font:' + this.font);

    var data = {
        style: parsed['font-style'],
        size: parsed['font-size'],
        family: parsed['font-family'].replace(/"/g, ''),
        weight: parsed['font-weight'],
        decoration: parsed['text-decoration'],
        href: null
    };

    //canvas doesn't support underline natively, but we can pass this attribute
    if (this.__fontUnderline === "underline") {
        data.decoration = "underline";
    }

    //canvas also doesn't support linking, but we can pass this as well
    if (this.__fontHref) {
        data.href = this.__fontHref;
    }

    return data;
};

//clipped groups are not rendered, so skip clipping
C2S.prototype.clip = function () { }

function mxShapeChartJsChart(bounds, fill, stroke, strokewidth) {
    mxShape.call(this);
    this.bounds = bounds;
    this.fill = fill;
    this.stroke = stroke;
    this.strokewidth = (strokewidth != null) ? strokewidth : 1;
    this.shadow = false;
};
/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeChartJsChart, mxImageShape);

mxShapeChartJsChart.prototype.cst = {
    SHAPE_CHARTJS: 'mxgraph.chartjs.abstract.chart'
};

mxShapeChartJsChart.prototype.customProperties = [
];

/**
* Function: paintVertexShape
* Untitled Diagram.drawio
* Paints the vertex shape.
*/
mxShapeChartJsChart.prototype.paintVertexShape = function (c, x, y, w, h) {
    try {
        var graphData = JSON.parse(this.state.cell.value);
        graphData.options.devicePixelRatio = 1.0;
        graphData.options.animation = false;
        graphData.options.responsive = false;
        var ctx = C2S(w, h)
        var svg = new chartjs.Chart(ctx, graphData);
        var image = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(ctx.getSerializedSvg(true))));
        c.image(x, y, w, h, image, this.preserveImageAspect, false, false);
    } catch (err) {
        c.setFontFamily('monospace');
        c.text(x, y+h/2, 0, 0, '<pre>' + err.msg + '</pre>', mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, false, 'html', 0, 0, 0);
        c.stroke();
    }
    this.state.cell.valueChanged = (value) => { var lastValue = mxCell.prototype.valueChanged.call(this.state.cell, value); this.redraw(); return lastValue; }
}

mxCellRenderer.registerShape(mxShapeChartJsChart.prototype.cst.SHAPE_CHARTJS, mxShapeChartJsChart);

mxShapeChartJsChart.prototype.getConstraints = function (style, w, h) {
    var constr = [];
    return constr;
}


// export ui for debugging
Draw.loadPlugin(function (ui) { window.ui = ui; });

Sidebar.prototype.addChartJsPalette = function () {
    var example = `
{
    "type": "bar",
    "data": {
        "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        "datasets": [
            {
                "label": "# of Votes",
                "data": [12, 19, 3, 5, 2, 3],
                "backgroundColor": [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)"
                ],
                "borderColor": [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                ],
                "borderWidth": 1
            }]
    }, "options": {
        "scales": {
            "yAxes": [
                {
                    "ticks": {
                        "beginAtZero": true
                    }
                }]
        }
    }
}`;
    this.addPaletteFunctions('chartjs', 'chart.js', true, [
        this.createVertexTemplateEntry('shadow=0;dashed=0;align=left;strokeWidth=1;shape=mxgraph.chartjs.abstract.chart;labelBackgroundColor=#ffffff;noLabel=1;', 200, 200, example, 'Chart', null, null, this.getTagsForStencil('mxgraph.chartjs.abstract', 'chart', 'chartjs ').join(' ')),
    ]);
}

Draw.loadPlugin(function (ui) {
    // Adds custom sidebar entry
    ui.sidebar.addChartJsPalette();
});

