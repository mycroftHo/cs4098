//Functions for jointjs

var graph, paper;

var hideLink = {
    '.connection': {display:"none"}, //the link
    '.marker-target': {display:"none"}, 
    'text': {display:"none"}, //because I have a label
    'rect': {display:"none"}, //second element of label
    '.connection-wrap': {display:"none"},//a bigger link highliting on hover
    'g.marker-vertices': {display:"none"}, //vertice of the link
    'g.link-tools': {display: 'none'}, // the button to delete the link
    'g.marker-arrowheads': {display:"none"} //the arrow to change link targets
};


function initShapes(){

	joint.shapes.tm = {};

	joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({
		toolMarkup:[
		'<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>',

        '<g class="element-tools">',
        '<g class="element-tool-add"><circle fill="green" r="11" cx="160" cy="40" />',
        '<path transform="scale(.8) translate(183, 33)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Add an element</title>',
        '</g>',
        '</g>',

        //Add new buttons here

        ].join(''),

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


	//Action (Rounded rectangle/oval-ey shape)
	joint.shapes.tm.Action = joint.shapes.tm.toolElement.extend({
		markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text/></g>',
		defaults: joint.util.deepSupplement({
			type: 'tm.Action',
			attrs: {
				rect: { rx: 20, ry: 20, fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            	text: { ref: 'rect'}
			},
			size: { width: 160, height: 80 }

			//,column: 0

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
			size: { width: 160, height: 80 },

			//Custom attribute for "swim lanes"
			//Processes default to 0;
			//Line of thinking - to emulate the "lanes", increment this value for each "column" that we move into
			column: 0

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
				case 'element-tool-add':
					var ns = this.model.clone();
					var nsx = ns.get('position').x;
					var nsy = ns.get('position').y;

					var act = new joint.shapes.tm.Action({
						position: {x: 0, y: 0},
						attrs: {
							text: {text: 'Action'}
						}
					});

					var link = new joint.dia.Link({
						source: { id: this.model.id },
				        target: { id: act.id },
				        attrs: {}
					});

					act.translate(nsx + 230, nsy);
					graph.addCells([act, link]);
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
			width: 1000,
			height: 800,
			gridSize: 1,
			model: graph
		}
	);

	var startProcess = new joint.shapes.tm.Process({
		position: {x: 100, y: 100},
		attrs: {
			text: {text: 'StartProcess'}
		}
	});

	var endProcess = new joint.shapes.tm.Process({
		position: {x: 100, y: 500},
		attrs: {
			text: {text: 'EndProcess'}
		}
	});

	var processLink = new joint.dia.Link({
		source: { id: startProcess.id },
        target: { id: endProcess.id },
        attrs: {}
	});


	//The link between processes is hidden
	processLink.attr(hideLink);

	graph.addCells([startProcess, endProcess, processLink]);


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

function graphToFile(){
	var output = graph.toJSON();
	var type = 3;

	var xhttp = new XMLHttpRequest();

		//xhttp.onreadystatechange = function(){
		//  if(xhttp.readyState == 4 && xhttp.status == 200){}
		//};

		//New HTTP POST request
		xhttp.open("POST", "http://127.0.0.1:6500", true);
		//Set the content type so that the server knows the data is formatted w/ JSON
		xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		xhttp.send(JSON.stringify({index:type, graph: output}));
}