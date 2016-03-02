//Functions for jointjs

var graph, paper;

function initShapes(){

	joint.shapes.tm = {};

	joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({
		toolMarkup:['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

        defaults: joint.util.deepSupplement({
        	attrs: {
    			text: {
	    			'font-weight': 400, 
	    			'font-size': 'small', 
	        		fill: 'black', 
	        		'text-anchor': 'middle', 
	        		'ref-x': .5, 
	        		'ref-y': .5, 
	        		'y-alignment': 'middle' 
    			},
        	},
        }, joint.shapes.basic.Generic.prototype.defaults)
	});


	//Action (Rounded rectangle)
	joint.shapes.tm.Action = joint.shapes.tm.toolElement.extend({
		markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text/></g>',
		defaults: joint.util.deepSupplement({
			type: 'tm.Action',
			attrs: {
				rect: { rx: 5, ry: 5, fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            	text: { ref: 'rect'}
			},
			size: { width: 160, height: 80 }
		}, joint.shapes.tm.toolElement.prototype.defaults)
	});

	//Process (is that what it's called?) - (Standard rectangle)
	joint.shapes.tm.Process = joint.shapes.tm.toolElement.extend({
		markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text/></g>',
		defaults: joint.util.deepSupplement({
			type: 'tm.Process',
			attrs: {
				rect: { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
	        	text: { ref: 'rect'}
			},
			size: { width: 160, height: 80 }
		}, joint.shapes.tm.toolElement.prototype.defaults)
	});

	//Custom View (Creates the red X on the shape)
	joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({
		initialize: function(){
			joint.dia.ElementView.prototype.initialize.apply(this, arguments);
		},

		render: function(){
			joint.dia.ElementView.prototype.render.apply(this, arguments);
			this.renderTools();
			this.update();
			return this;
		},

		renderTools: function(){
			var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
			if(toolMarkup){
				var nodes = V(toolMarkup);
				V(this.el).append(nodes);
			}

			return this;
		},

		pointerclick: function(evt, x, y){
			this._dx = x;
			this._dy = y;
			this._action = '';

			var className = evt.target.parentNode.getAttribute('class');
			switch(className){
				case 'element-tool-remove':
					this.model.remove();
					return;
					break;

				default:
			}

			joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
		}
	});

	joint.shapes.tm.ActionView = joint.shapes.tm.ToolElementView;
	joint.shapes.tm.ProcessView = joint.shapes.tm.ToolElementView;
}

//Handle the movement of cells around the canvas
//Taken from this tutorial: http://jointjs.com/tutorial/multiple-links-between-elements
function adjustVeritices(graph, cell){
	//If the cell has a view, find its model
	cell = cell.model || cell;

	if (cell instanceof joint.dia.Element) {

        _.chain(graph.getConnectedLinks(cell)).groupBy(function(link) {
            // the key of the group is the model id of the link's source or target, but not our cell id.
            return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
        }).each(function(group, key) {
            // If the member of the group has both source and target model adjust vertices.
            if (key !== 'undefined') adjustVertices(graph, _.first(group));
        });

        return;
	}

	// The cell is a link. Let's find its source and target models.
    var srcId = cell.get('source').id || cell.previous('source').id;
    var trgId = cell.get('target').id || cell.previous('target').id;

    // If one of the ends is not a model, the link has no siblings.
    if (!srcId || !trgId) return;

    var siblings = _.filter(graph.getLinks(), function(sibling) {

        var _srcId = sibling.get('source').id;
        var _trgId = sibling.get('target').id;

        return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
    });

    switch (siblings.length) {

    case 0:
        // The link was removed and had no siblings.
        break;

    case 1:
        // There is only one link between the source and target. No vertices needed.
        cell.unset('vertices');
        break;

    default:

        // There is more than one siblings. We need to create vertices.

        // First of all we'll find the middle point of the link.
        var srcCenter = graph.getCell(srcId).getBBox().center();
        var trgCenter = graph.getCell(trgId).getBBox().center();
        var midPoint = g.line(srcCenter, trgCenter).midpoint();

        // Then find the angle it forms.
        var theta = srcCenter.theta(trgCenter);

        // This is the maximum distance between links
        var gap = 20;

        _.each(siblings, function(sibling, index) {

            // We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
            var offset = gap * Math.ceil(index / 2);

            // Now we need the vertices to be placed at points which are 'offset' pixels distant
            // from the first link and forms a perpendicular angle to it. And as index goes up
            // alternate left and right.
            //
            //  ^  odd indexes 
            //  |
            //  |---->  index 0 line (straight line between a source center and a target center.
            //  |
            //  v  even indexes
            var sign = index % 2 ? 1 : -1;
            var angle = g.toRad(theta + sign * 90);

            // We found the vertex.
            var vertex = g.point.fromPolar(offset, angle, midPoint);

            sibling.set('vertices', [{ x: vertex.x, y: vertex.y }]);
        });
    }
}

//Actual initialization function
function jointInit(){

	initShapes();

	graph = new joint.dia.Graph;
	paper = new joint.dia.Paper({
			el: $('#paper'),
			width: 500,
			height: 500,
			gridSize: 1,
			model: graph
		}
	);

	
	/*
	//Create some shapes to display
	var rect1 = new joint.shapes.basic.Rect({
		position:{ x: 50, y: 50}, size: {width: 75, height: 75},
		attrs: {
			rect: {'stroke-width': '3', 'stroke-opacity': .7, stroke: 'black', rx: 3, ry: 3, fill: 'lightgray', 'fill-opacity': .5 },
			text: { text: 'Square', 'font-size': 10, style: { 'text-shadow': '1px 1px 1px lightgray' } }
		}
	});

	var rect2 = rect1.clone();
	rect2.translate(200);
	var rect3 = rect1.clone();
	rect3.translate(100,200);
	graph.addCells([rect1, rect2, rect3]);

	var link1 = new joint.dia.Link({
		source: {id: rect1.id},
		target: {id: rect2.id}
	});

	var link2 = link1.clone();
	var link3 = link1.clone();

	graph.addCells([link1, link2, link3]);
	*/

	var action = new joint.shapes.tm.Action({
		position: {x: 100, y: 100},
		attrs: {
			text: {text: 'Action'}
		}
	});

	graph.addCell(action);

	var myAdjustVerticies = _.partial(adjustVeritices, graph);
	//adjust vertices when a cell is removed or its source/target was changed
	graph.on('add remove change: source change:target', myAdjustVerticies);
	//also when an user stops interacting with an element.
	paper.on('cell:pointerup', myAdjustVerticies);

	//console.log(JSON.stringify(graph.toJSON(), null, '\t'));
}

function addAction(){
	var action = new joint.shapes.tm.Action({
		position: {x: 100, y: 100},
		attrs: {
			text: {text: 'Action'}
		}
	});

	graph.addCell(action);
}

function addProcess(){
	var process = new joint.shapes.tm.Process({
		position: {x: 100, y: 100},
		attrs: {
			text: {text: 'Process'}
		}
	});

	graph.addCell(process);
}

function addIterationLink(){
	var link = new joint.dia.Link({
		source: { x: 10, y: 20 },
        target: { x: 250, y: 20 },
        attrs: {}
	});

	link.attr({
        '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
    });

    graph.addCell(link)
}

function addRequireLink(){
	var link = new joint.dia.Link({
		source: { x: 10, y: 20 },
        target: { x: 250, y: 20 },
        attrs: {}
	});

	link.attr({
        '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' },
        '.connection': { 'stroke-dasharray': '5 2' }
    });

    graph.addCell(link)
}