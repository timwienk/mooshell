// #TODO:	refactor Accordion to fireEvent onCompleted when animation finishes
//				It probably should use chaining

var Sidebar = new Class({
	Implements: [Options, Class.Occlude, Events],
	parameter: "Sidebar",
	options: {
		DOM: ''
	},
	initialize: function (options) {
		this.setOptions(options);
		if ($(this.options.DOM)) {
			this.element = $(this.options.DOM);
			if (this.occlude()) return this.occluded;
			
			this.resize(); 
			Layout.addEvents({
				'resize': this.resize.bind(this)
			});
			/*
			window.addEvents({
				'scroll': this.resize.bind(this)
			});
			*/
			this.element.getFirst('.toggler').addClass('active');
			this.accordion = new Fx.Accordion('#' + this.options.DOM + ' .toggler', '#' + this.options.DOM + ' .element');
			this.accordion.addEvent('active', function(toggler, element) {
				toggler.addClass('active').getSiblings('.toggler').removeClass('active');				
				this.fireEvent('accordion_activated');
				// 700 ms after launch the animation should be finished...
				this.fireEvent('accordion_resized',[],700);
			}.bind(this));
		}
	},
	resize: function () {
		this.element.setStyle('min-height',window.getSize().y - this.element.getPosition().y - 8);
	},
	toElement: function() { return this.element; }
});
