/* Clientcide Copyright (c) 2006-2009, http://www.clientcide.com/wiki/cnet-libraries#license*/

//Contents: Clientcide, dbug, Class.ToElement, FixPNG, Popup, Fx.Marquee, IconMenu, ObjectBrowser, PopupDetails, StyleWriter, StickyWin, StickyWin.Fx, StickyWin.Drag, StickyWin.Modal, StickyWin.Ajax, StickyWin.Alert, StickyWin.Confirm, StickyWin.Prompt, StickyWin.UI, StickyWin.UI.Pointy, StickyWin.PointyTip, Tips.Pointy, Collapsible, HoverGroup, MenuSlider, MooScroller, MultipleOpenAccordion, SimpleCarousel, SimpleSlideShow, TabSwapper, Confirmer, DatePicker, DatePicker.Extras, Form.Validator.Tips, Form.Request.Prompt, InputFocus, ProductPicker, SimpleEditor, TagMaker, Autocompleter, Autocompleter.Local, Autocompleter.Remote, Autocompleter.JSONP, Autocompleter.Observer, Autocompleter.Clientcide, Lightbox, SimpleEditor.English.US, SimpleEditor.Dutch, SimpleEditor.French, SimpleEditor.Italian, SimpleEditor.Portuguese, SimpleEditor.Spanish, PostEditor, PostEditor.Forum, Browser.Extras.Compat, Class.Refactor.Compat, Date.Compat, DollarE.Compat, DollarG.Compat, Element.Forms.Compat, Element.MouseOvers.Compat, Element.Position.Compat, Element.Shortcuts.Compat, IframeShim.Compat, JsonP.Compat, Modalizer.Compat, OverText.Compat, Request.Queue.Compat, String.Extras.Compat, Waiter.Compat

//This lib: http://www.clientcide.com/js/build.php?excludeLibs[]=mootools-core&excludeLibs[]=mootools-more&requireLibs[]=clientcide&compression=none

/*
Script: Clientcide.js
	The Clientcide namespace.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clientcide = {
	version: '%build%',
	assetLocation: "http://github.com/anutron/clientcide/raw/master/Assets",
	setAssetLocation: function(baseHref) {
		Clientcide.assetLocation = baseHref;
		if (Clientcide.preloaded) Clientcide.preLoadCss();
	},
	preLoadCss: function(){
		if (window.StickyWin && StickyWin.ui) StickyWin.ui();
		if (window.StickyWin && StickyWin.pointy) StickyWin.pointy();
		Clientcide.preloaded = true;
		return true;
	},
	preloaded: false
};
(function(){
	if (!window.addEvent) return;
	var preload = function(){
		if (window.dbug) dbug.log('preloading clientcide css');
		if (!Clientcide.preloaded) Clientcide.preLoadCss();
	};
	window.addEvent('domready', preload);
	window.addEvent('load', preload);
})();
setCNETAssetBaseHref = Clientcide.setAssetLocation;/*
Script: dbug.js
	A wrapper for Firebug console.* statements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var dbug = {
	logged: [],	
	timers: {},
	firebug: false, 
	enabled: false, 
	log: function() {
		dbug.logged.push(arguments);
	},
	nolog: function(msg) {
		dbug.logged.push(arguments);
	},
	time: function(name){
		dbug.timers[name] = new Date().getTime();
	},
	timeEnd: function(name){
		if (dbug.timers[name]) {
			var end = new Date().getTime() - dbug.timers[name];
			dbug.timers[name] = false;
			dbug.log('%s: %s', name, end);
		} else dbug.log('no such timer: %s', name);
	},
	enable: function(silent) { 
		var con = window.firebug ? firebug.d.console.cmd : window.console;

		if((!!window.console && !!window.console.warn) || window.firebug) {
			try {
				dbug.enabled = true;
				dbug.log = function(){
						try {
							(con.debug || con.log).apply(con, arguments);
						} catch(e) {
							console.log(Array.slice(arguments));
						}
				};
				dbug.time = function(){
					con.time.apply(con, arguments);
				};
				dbug.timeEnd = function(){
					con.timeEnd.apply(con, arguments);
				};
				if(!silent) dbug.log('enabling dbug');
				for(var i=0;i<dbug.logged.length;i++){ dbug.log.apply(con, dbug.logged[i]); }
				dbug.logged=[];
			} catch(e) {
				dbug.enable.delay(400);
			}
		}
	},
	disable: function(){ 
		if(dbug.firebug) dbug.enabled = false;
		dbug.log = dbug.nolog;
		dbug.time = function(){};
		dbug.timeEnd = function(){};
	},
	cookie: function(set){
		var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
		var debugCookie = value ? unescape(value[1]) : false;
		if((!$defined(set) && debugCookie != 'true') || ($defined(set) && set)) {
			dbug.enable();
			dbug.log('setting debugging cookie');
			var date = new Date();
			date.setTime(date.getTime()+(24*60*60*1000));
			document.cookie = 'jsdebug=true;expires='+date.toGMTString()+';path=/;';
		} else dbug.disableCookie();
	},
	disableCookie: function(){
		dbug.log('disabling debugging cookie');
		document.cookie = 'jsdebug=false;path=/;';
	}
};

(function(){
	var fb = !!window.console || !!window.firebug;
	var con = window.firebug ? window.firebug.d.console.cmd : window.console;
	var debugMethods = ['debug','info','warn','error','assert','dir','dirxml'];
	var otherMethods = ['trace','group','groupEnd','profile','profileEnd','count'];
	function set(methodList, defaultFunction) {
		for(var i = 0; i < methodList.length; i++){
			dbug[methodList[i]] = (fb && con[methodList[i]])?con[methodList[i]]:defaultFunction;
		}
	};
	set(debugMethods, dbug.log);
	set(otherMethods, function(){});
})();
if ((!!window.console && !!window.console.warn) || window.firebug){
	dbug.firebug = true;
	var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
	var debugCookie = value ? unescape(value[1]) : false;
	if(window.location.href.indexOf("jsdebug=true")>0 || debugCookie=='true') dbug.enable();
	if(debugCookie=='true')dbug.log('debugging cookie enabled');
	if(window.location.href.indexOf("jsdebugCookie=true")>0){
		dbug.cookie();
		if(!dbug.enabled)dbug.enable();
	}
	if(window.location.href.indexOf("jsdebugCookie=false")>0)dbug.disableCookie();
}/*
Script: ToElement.js
	Defines the toElement method for a class.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Class.ToElement = new Class({
	toElement: function(){
		return this.element;
	}
});
var ToElement = Class.ToElement;/*
Script: FixPNG.js
	Extends the Browser hash object to include methods useful in managing the window location and urls.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
$extend(Browser, {
	fixPNG: function(el) {
		try {
			if (Browser.Engine.trident4){
				el = document.id(el);
				if (!el) return el;
				if (el.get('tag') == "img" && el.get('src').test(".png")) {
					var vis = el.isDisplayed();
					try { //safari sometimes crashes here, so catch it
						dim = el.getSize();
					}catch(e){}
					if (!vis){
						var before = {};
						//use this method instead of getStyles 
						['visibility', 'display', 'position'].each(function(style){
							before[style] = this.style[style]||'';
						}, this);
						//this.getStyles('visibility', 'display', 'position');
						this.setStyles({
							visibility: 'hidden',
							display: 'block',
							position:'absolute'
						});
						dim = el.getSize(); //works now, because the display isn't none
						this.setStyles(before); //put it back where it was
						el.hide();
					}
					var replacement = new Element('span', {
						id:(el.id)?el.id:'',
						'class':(el.className)?el.className:'',
						title:(el.title)?el.title:(el.alt)?el.alt:'',
						styles: {
							display: vis?'inline-block':'none',
							width: dim.x,
							height: dim.y,
							filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='" 
								+ el.src + "', sizingMethod='scale');"
						},
						src: el.src
					});
					if (el.style.cssText) {
						try {
							var styles = {};
							var s = el.style.cssText.split(';');
							s.each(function(style){
								var n = style.split(':');
								styles[n[0]] = n[1];
							});
							replacement.setStyle(styles);
						} catch(e){ dbug.log('fixPNG1: ', e)}
					}
					if (replacement.cloneEvents) replacement.cloneEvents(el);
					replacement.replaces(el);
				} else if (el.get('tag') != "img") {
				 	var imgURL = el.getStyle('background-image');
				 	if (imgURL.test(/\((.+)\)/)){
				 		el.setStyles({
				 			background: '',
				 			filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='crop', src=" + imgURL.match(/\((.+)\)/)[1] + ")"
				 		});
				 	};
				}
			}
		} catch(e) {dbug.log('fixPNG2: ', e)}
	},
  pngTest: /\.png$/, // saves recreating the regex repeatedly
  scanForPngs: function(el, className) {
    className = className||'fixPNG';
    //TODO: should this also be testing the css background-image property for pngs?
    //Q: should it return an array of all those it has tweaked?
    if (document.getElements){ // more efficient but requires 'selectors'
      el = document.id(el||document.body);
      el.getElements('img[src$=.png]').addClass(className);
    } else { // scan the whole page
      var els = $$('img').each(function(img) {
        if (Browser.pngTest(img.src)){
          img.addClass(className);
        }
      });
    }
  }
});
if (Browser.Engine.trident4) window.addEvent('domready', function(){$$('img.fixPNG').each(Browser.fixPNG)});
/*
Script: Popup.js
	Defines the Popup class useful for making popup windows.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Browser.Popup = new Class({
	Implements:[Options, Events],
	options: {
		// onBlock: $empty,
		width: 500,
		height: 300,
		x: 50,
		y: 50,
		toolbar: 0,
		location: 0,
		directories: 0,
		status: 0,
		scrollbars: 'yes',
		resizable: 1,
		name: 'popup'
	},
	initialize: function(url, options){
		this.url = url || false;
		this.setOptions(options);
		if (this.options.x == 'center') this.options.x = Math.floor((screen.availWidth - this.options.width)/2);
		if (this.options.y == 'center') this.options.y = Math.floor((screen.availHeight - this.options.height)/2);
		if (this.url) this.openWin();
	},
	openWin: function(url){
		url = url || this.url;
		var options = 'toolbar='+this.options.toolbar+
			',location='+this.options.location+
			',directories='+this.options.directories+
			',status='+this.options.status+
			',scrollbars='+this.options.scrollbars+
			',resizable='+this.options.resizable+
			',width='+this.options.width+
			',height='+this.options.height+
			',top='+this.options.y+
			',left='+this.options.x;
		this.window = window.open(url, this.options.name, options);
		if (!this.window) {
			this.window = window.open('', this.options.name, options);
			this.window.location.href = url;
		}
		this.focus.delay(100, this);
		return this;
	},
	focus: function(){
		if (this.window) this.window.focus();
		else if (this.focusTries<10) this.focus.delay(100, this); //try again
		else {
			this.blocked = true;
			this.fireEvent('onBlock');
		}
		return this;
	},
	focusTries: 0,
	blocked: null,
	close: function(){
		this.window.close();
		return this;
	}
});/*
Script: Fx.Marquee.js
	Defines Fx.Marquee, a marquee class for animated notifications.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Fx.Marquee = new Class({
	Extends: Fx.Morph,
	options: {
		mode: 'horizontal', //or vertical
		message: '', //the message to display
		revert: true, //revert back to the previous message after a specified time
		delay: 5000, //how long to wait before reverting
		cssClass: 'msg', //the css class to apply to that message
		showEffect: { opacity: 1 },
		hideEffect: {opacity: 0},
		revertEffect: { opacity: [0,1] },
		currentMessage: null
/*	onRevert: $empty,
		onMessage: $empty */
	},
	initialize: function(container, options){
		container = document.id(container); 
		var msg = this.options.currentMessage || (container.getChildren().length == 1)?container.getFirst():''; 
		var wrapper = new Element('div', {	
				styles: { position: 'relative' },
				'class':'fxMarqueeWrapper'
			}).inject(container); 
		this.parent(wrapper, options);
		this.current = this.wrapMessage(msg);
	},
	wrapMessage: function(msg){
		if (document.id(msg) && document.id(msg).hasClass('fxMarquee')) { //already set up
			var wrapper = document.id(msg);
		} else {
			//create the wrapper
			var wrapper = new Element('span', {
				'class':'fxMarquee',
				styles: {
					position: 'relative'
				}
			});
			if (document.id(msg)) wrapper.grab(document.id(msg)); //if the message is a dom element, inject it inside the wrapper
			else if ($type(msg) == "string") wrapper.set('html', msg); //else set it's value as the inner html
		}
		return wrapper.inject(this.element); //insert it into the container
	},
	announce: function(options) {
		this.setOptions(options).showMessage();
		return this;
	},
	showMessage: function(reverting){
		//delay the fuction if we're reverting
		(function(){
			//store a copy of the current chained functions
			var chain = this.$chain?$A(this.$chain):[];
			//clear teh chain
			this.clearChain();
			this.element = document.id(this.element);
			this.current = document.id(this.current);
			this.message = document.id(this.message);
			//execute the hide effect
			this.start(this.options.hideEffect).chain(function(){
				//if we're reverting, hide the message and show the original
				if (reverting) {
					this.message.hide();
					if (this.current) this.current.show();
				} else {
					//else we're showing; remove the current message
					if (this.message) this.message.dispose();
					//create a new one with the message supplied
					this.message = this.wrapMessage(this.options.message);
					//hide the current message
					if (this.current) this.current.hide();
				}
				//if we're reverting, execute the revert effect, else the show effect
				this.start((reverting)?this.options.revertEffect:this.options.showEffect).chain(function(){
					//merge the chains we set aside back into this.$chain
					if (this.$chain) this.$chain.combine(chain);
					else this.$chain = chain;
					this.fireEvent((reverting)?'onRevert':'onMessage');
					//then, if we're reverting, show the original message
					if (!reverting && this.options.revert) this.showMessage(true);
					//if we're done, call the chain stack
					else this.callChain.delay(this.options.delay, this);
				}.bind(this));
			}.bind(this));
		}).delay((reverting)?this.options.delay:10, this);
		return this;
	}
});/*
Script: IconMenu.js
	Defines IconMenu, a simple icon (img) based menu.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var IconMenu = new Class({
	Implements: [Options, Events],
	options: {
		container: document,
		images: ".iconImgs",
		captions: ".iconCaptions",
		removeLinks: false,
		clearLinks: false,
		useAxis: 'x',
		onFocusDelay: 0,
		initialFocusDelay: 250,
		onBlurDelay: 0,
		length: 'auto',
		iconPadding: 1,
		scrollFxOptions: {
			duration: 1800,
			transition: 'cubic:in:out'
		},
		backScrollButtons: '#scrollLeft',
		forwardScrollButtons: '#scrollRight',
		onSelect: function(index, img){
			img.morph({
					'border-top-color': '#00A0C6',
					'border-left-color': '#00A0C6',
					'border-right-color': '#00A0C6',
					'border-bottom-color': '#00A0C6'
			});
		},
		onDeSelect: function(index, img){
			img.morph({
					'border-top-color': '#555',
					'border-left-color': '#555',
					'border-right-color': '#555',
					'border-bottom-color': '#555'
			});
//		onFocus: $empty, //mouseover of target area
//		onBlur: $empty, //mouseout of target area
//		onEmpty: $empty,
//		onRemoveItem: $empty,
//		onRemoveItems: $empty,
//		onScroll: $empty,
//		onPageForward: $empty,
//		onPageBack: $empty,
		}
	},
	imgs: [],
	selected: [],
	initialize: function(options) {
		//set the options
		this.setOptions(options);
		//save a reference to the container
		this.container = document.id(this.options.container);
		//get the captions from the options
		var captions = ($type(this.options.captions) == "string")
			?this.container.getElements(this.options.captions)
			:this.options.captions;
		//get the images from the options
		var imgs = ($type(this.options.images) == "string")
			?this.container.getElements(this.options.images)
			:this.options.images;
		//loop through each one
		imgs.each(function(img, index) {
			//add it to the menu
			this.addItem(img, captions[index], null);
		}, this);
		
		this.fireEvent('onItemsAdded', this.imgs, 50);
		this.side = (this.options.useAxis == 'x')?'left':'top';
		this.container.setStyle(this.side, this.container.getStyle(this.side).toInt()||0);
		this.onFocusDelay = this.options.initialFocusDelay;
		//set up the events
		this.setupEvents();
	},
	toElement: function(){
		return this.container;
	},
	bound: {
			mouseover: {},
			mouseout: {}
	},
	scrollTo: function(index, useFx){
		//set useFx default to true
		useFx = $pick(useFx, true);
		//get the current range in view
		var currentRange = this.calculateRange();
		//if we're there, exit
		if (index == currentRange.start) return this;
		//get the range for the new position
		var newRange = this.calculateRange(index);
		//if this returns no items, exit
		if (!newRange.elements.length) return this; //no next page! >> Ajax here
		//make sure the container has a position set
		if (this.container.getStyle('position') == 'static') this.container.setStyle('position', 'relative');
		//create the scroll effects if not present already
		if (!this.scrollerFx) 
			this.scrollerFx = new Fx.Tween(this.container, $merge(this.options.scrollFxOptions, {property: this.side, wait: false}));
		//scroll to the new location
		if (useFx) {
			this.scrollerFx.start(-newRange.elements[0].offset).chain(function(){
			//set the index to be this new location
				this.fireEvent('onScroll', [index, newRange]);
			}.bind(this));
		} else {
			//we're not using effects, so just jump to the location
			this.scrollerFx.set(-newRange.elements[0].offset);
			this.fireEvent('onScroll', [index, newRange]);
		}
		this.currentOffset = index;
		return this;
	},
	pageForward: function(howMany){
		var range = this.calculateRange();
		return this.scrollTo(($type(howMany) == "number")?range.start+howMany:range.end);
	},
	pageBack: function(howMany) {
		return this.scrollTo(($type(howMany) == "number")?this.currentOffset-howMany:this.calculateRange(this.currentOffset, true).start);
	},
	addItem: function(img, caption, where) {
		if (caption) {
			img.store('caption', caption);
			caption.store('image', img);
		}
		//figure out where to put it
		where = ($defined(where))?where:this.imgs.length;
		//if we've already got this image in there, remove it before putting it in the right place
		if (this.imgs.contains(img)) this.removeItems([img], true);
		//insert the image and caption into the array of these things
		this.imgs.splice(where, 0, document.id(img));

		//set up the events for the element
		this.setupIconEvents(img, caption);
		this.fireEvent('onAdd', [img, caption]);
		return this;
	},
	removeItems: function(imgs, useFx){
		var range = this.calculateRange();
		if (!imgs.length) return this;;
		//create a copy; this is because
		//IconMenu.empty passes *this.selected*
		//which we modify in the process of removing things
		//so we must work on a copy of that so we don't change
		//the list as we iterate over it
		imgs = $A(imgs);
		//set the fx default
		useFx = $pick(useFx, true);
		//placeholder for the items we're removing; the effect will
		//only be applied to the dom element that contains the image and the caption
		var fadeItems = [];
		var fadeItemImgs = [];
		//the effect we'll use
		var effect = {
				width: 0,
				'border-width':0
		};
		//an object to store all the copies of the effect; one for each item to be passed
		//to Fx.Elements
		var fadeEffects = {};
		//for items that aren't in the current view, we're not going to use a transition
		var itemsToQuietlyRemove = {
			before: [],
			beforeImgs: [],
			after: [],
			afterImgs: []
		};
				
		//a list of all the icons by index
		var indexes = [];
		//for each image in the set to be removed
		imgs.each(function(image){
			var index = this.imgs.indexOf(image);
			//if the image is visible
			if (index >= range.end) {
				itemsToQuietlyRemove.after.push(image.getParent());
				itemsToQuietlyRemove.afterImgs.push(image);
			} else if (index < range.start) {
				itemsToQuietlyRemove.before.push(image.getParent());
				itemsToQuietlyRemove.beforeImgs.push(image);
			} else {
				//store the parent of the image
				fadeItems.push(image.getParent());
				fadeItemImgs.push(image);
				//copy the effect value for this item
				fadeEffects[fadeItems.length-1] = $unlink(effect);
			}
			//remove the reference in the selected array
			//because when it's gone, it won't be selected anymore
			this.selected.erase(image);
			//store the index of where this image was in the menu
			indexes.push(index);
		}, this);
		//for the list of images in the menu that were selected, remove them
		//we didn't do this earlier so we could avoid changing
		//the array while we were working on it
		this.imgs = this.imgs.filter(function(img, index){
			return !indexes.contains(index);
		});
		var removed = [];
		//items page left, remove them, but then we have to update the scroll offset to account
		//for their departure
		if (itemsToQuietlyRemove.before.length) {
			var scrollTo = this.imgs.indexOf(range.elements[0].image);
			itemsToQuietlyRemove.before.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				var img = itemsToQuietlyRemove.beforeImgs[index];
				removed.push(img);
				try {
					el.dispose();
					//scroll to the current offset again quickly
				}catch(e){ dbug.log('before: error removing element %o, %o', el, e); }
			}, this);
			this.scrollTo(scrollTo, false);
		}
		//for items page right, just remove them quickly and quietly
		itemsToQuietlyRemove.after.each(function(el, index){
			this.fireEvent('onRemoveItem', [el]);
			removed.push(itemsToQuietlyRemove.afterImgs[index]);
			try {
				el.dispose(); 
			}catch(e){ dbug.log('after: error removing element %o, %o', el, e); }
		});

		//define a function that removes all the items from the dom
		function clean(range, additionalItems){
			var items = [];
			//then fade out the items that are currently visible
			fadeItems.each(function(el, index){
				this.fireEvent('onRemoveItem', [el]);
				items.push(fadeItemImgs[index]);
				try {
					el.dispose(); 
				}catch(e){ dbug.log('fade: error removing element %o, %o', el, e); }
			}, this);
			items.combine(additionalItems);
			this.fireEvent('onRemoveItems', [items]);
			range = this.calculateRange();
			if (range.elements == 0 && range.start > 0) this.pageBack();
			//if there aren't any items left, fire the onEmpty event
			if (!this.imgs.length) this.fireEvent('onEmpty');
		}
		//if we're using effects, do the transition then call clean()
		if (useFx) new Fx.Elements(fadeItems).start(fadeEffects).chain(clean.bind(this, [range, removed]));
		//else just clean
		else clean.apply(this, [range, removed]);
		return this;
	},
	removeSelected: function(useFx){
		this.removeItems(this.selected, useFx);
		return this;
	},
	empty: function(suppressEvent){
		//placeholder for the effects and items
		var effect = {};
		var items = [];
		//loop through all the images in the icon menu
		this.imgs.each(function(img, index){
			//add the icon container to the list of items to remove
			items.push(img.getParent());
			//create a reference for each one to pass to Fx.Elements
			effect[index] = {opacity: 0};
		});
		//create an instance of Fx.Elements and fade them all out
		new Fx.Elements(items).start(effect).chain(function(){
			//then remove them all instantly
			this.removeItems(this.imgs, false);
			//and fire the onEmpty event
			if (!suppressEvent) this.fireEvent('onEmpty');
		}.bind(this));
		return this;
	},
	selectItem: function(index, select){
		//get the image to select
		var img = this.imgs[index];
		//add or remove the "selected" class
		if ($defined(select)) {
			if (select) img.addClass('selected');
			else img.removeClass('selected');
		} else {
			img.toggleClass('selected');
		}
		//if it has the class, then fade the border blue
		if (img.hasClass('selected')){
			//store this image in the index of selected images
			this.selected.push(img);
			this.fireEvent('select', [index, img]);
		} else {
			//else we're deselecting; remove the image from the index of selected images
			this.selected.erase(img);
			this.fireEvent('onDeSelect', [index, img]);
		}
		return this;
	},
	getDefaultWidth: function(){
		//if the user specified a width, just return it
		if ($type(this.options.length) == "number") return this.options.length;
		//if, on the other hand, they specified another element than the container
		//to calculate the width, use it
		var container = document.id(this.options.length);
		//otherwise, use the container
		if (!container) container = this.container.getParent();
		//return the width or height of that element, depending on the axis chosen in the options
		return container.getSize()[this.options.useAxis];
	},
	getIconPositions: function(){
		var offsets = [];
		var cumulative = 0;
		var prev;
		//loop through all the items
		this.imgs.each(function(img, index){
			//we're measuring the element that contains the image
			var parent = img.getParent();
			//get the width or height of that parent using the appropriate axis
			cumulative += (prev)?img['offset'+this.side.capitalize()] - prev['offset'+this.side.capitalize()]:0;
			prev = img;
			//var size = parent.getSize().size[this.options.useAxis]
			//store the data
			offsets.push({
				image: img,
				size: parent.getSize()[this.options.useAxis],
				offset: cumulative,
				container: parent
			});
		}, this);
		return offsets;
	},
	calculateRange: function(index, fromEnd){
		if (!this.imgs.length) return {start: 0, end: 0, elements: []};
		index = $pick(index, this.currentOffset||0);
		if (index < 0) index = 0;
		//dbug.trace();
		//get the width of space that icons are visible
		var length = this.getDefaultWidth();
		//get the positions of all the icons
		var positions = this.getIconPositions();
		var referencePoint;
		//if we're paginating forward the reference point is the left edge 
		//of the range is the left edge of the first icon
		//but if we're going backwards, the referencePoint is the left edge of the first icon currently in range
		//the problem is if the user removes the entire last page of icons, then this
		//item no longer exists, so...
		if (positions[index]) {
			//if the item exists, use it
			referencePoint = positions[index].offset;
		} else {
			//else the right edge of the last icon is the reference point
			//the last icon is the container of the last image
			var lastIcon = this.imgs.getLast().getParent();
			var coords = lastIcon.getCoordinates();
			//and the reference point is that icon's width plus it's left offset minus the offset 
			//of the parent (which gets offset negatively and positively for scrolling
			referencePoint = coords.width + coords.left - lastIcon.getParent().getPosition().x;
		}
		//figure out which ones are in range
		var range = positions.filter(function(position, i){
			//if the index supplied is the endpoint
			//then it's in range if the index of the icon is less than the index,
			//and the left side is less than that of the one at the end point
			//and if the left side is greater than or equal to the end point's position minus the length
			if (fromEnd) return i < index && 
				position.offset < referencePoint &&
				position.offset >= referencePoint-length;
			
			//else we go forward...
			//if the item is after the index start and the posision is 
			//less than or equal to the max width defined, include it
			else return i >= index && position.offset+position.size <= length+positions[index].offset;
		});
		//return the data
		return (fromEnd)?{start: index-range.length, end: index, elements: range}
					 :{start: index, end: range.length+index, elements: range};
	},
	inRange: function(index) {
		//calculate the range
		var range = this.calculateRange();
		//return the result
		return index < range.end && index >= range.start;
	},
	setupEvents: function(){
		document.id(this.options.container).addEvents({
			"mouseleave": function() {
				if (this.inFocus) this.inFocus = null;
				this.imgOut(null, true);
			}.bind(this)
		});
		
		$$(this.options.backScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageBack.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);
		$$(this.options.forwardScrollButtons).each(function(el){
			el.addEvents({
				click: this.pageForward.bind(this),
				mouseover: function(){ this.addClass('hover'); },
				mouseout: function(){ this.removeClass('hover'); }
			});
		}, this);

		$$(this.options.clearLinks).each(function(el){
			el.addEvent('click', this.empty.bind(this));
		}, this);
		$$(this.options.removeLinks).each(function(el){
			el.addEvent('click', this.removeSelected.bind(this));
		}, this);
	},
	imgOver: function(img){
		//set the value of what's in focus to be this image
		this.inFocus = img;
		//clear the overTimeout
		$clear(this.overTimeout);
		//delay for the duration of the onFocusDelay option
		this.overTimeout = (function(){
			this.onFocusDelay = this.options.onFocusDelay;
			//if the user is still focused on the image, fire the onFocus event
			if (this.inFocus == img) this.fireEvent("onFocus", [img, this.imgs.indexOf(img)]);
		}).delay(this.onFocusDelay, this);
	},
	imgOut: function(img, force){
		if (!$defined(img) && force) img = this.prevFocus||this.imgs[0];
		//if the focused image is this one
		if (this.inFocus == img && img) {
			//set it to null
			this.inFocus = null;
			//clear the delay timeout
			$clear(this.outTimeout);
			//wait the duration of the onBlurDelay
			this.outTimeout = (function(){
				this.prevFocus = img;
				//if we're not still focused on this image, fire onBlur
				if (this.inFocus != img || (img == null && force)) this.fireEvent("onBlur", [img, this.imgs.indexOf(img)]);
				if (!this.inFocus) this.onFocusDelay = this.options.initialFocusDelay;
			}).delay(this.options.onBlurDelay, this);
		}
	},
	setupIconEvents: function(img, caption){
		//add the click event
		img.addEvents({
			click: function(e){
				//if the user is holding down control, select the image
				if (e.control||e.meta) {
					this.selectItem(this.imgs.indexOf(img));
					e.stop();
				}
			}.bind(this)
		});
		img.getParent().addEvents({
			mouseover: this.imgOver.bind(this, img),
			mouseout: this.imgOver.bind(this, img)
		});
	}
});/*
Script: ObjectBrowser.js
	Creates a tree view of any javascript object.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var ObjectBrowser = new Class({
	Implements: [Options, Events],
	options: {
//	onLeafClick: $empty,
		onBranchClick: function(data){
			this.showLevel(data.path?data.path+'.'+data.key:data.key, data.nodePath);
		},
		initPath: '',
		buildOnInit: true,
		data: {},
		excludeKeys: [],
		includeKeys: []
	},
	initialize: function(container, options){
		this.container = document.id(container);
		this.setOptions(options);
		this.data = $H(this.options.data);
		this.levels = {};
		this.elements = {};
		if (this.options.buildOnInit) this.showLevel(this.options.initPath, this.container);
	},
	toElement: function(){
		return this.container;
	},
	//gets a member of the object by path; eg "fruits.apples.green" will return the value at that path.
	//path - the string path
	//parent - (boolean) if true, will return the parent of the item found ( in the example above, fruits.apples)
	getMemberByPath: function(path, parent){
		if (path === "" || path == "top") return this.data.getClean();
		var h = parent?$H(parent):this.data;
		return h.getFromPath(path);
	},
	//replaceMemberByPath will set the location at the path to the value passed in
	replaceMemberByPath: function(path, value){
		if (path === "" || path == "top") return this.data = $H(value);
		var parentObj = this.getMemberByPath( path, true );
		parentObj[path.split(".").pop()] = value;
		return this.data;
	},
	//gets the path for a given dom node.
	getPathByNode: function(el) {
		return $H(this.elements).keyOf(el);
	},
	//validates that a key is a valid node value
	//against options.includeKeys and options.excludeKeys
	validLevel: function(key){
		return (!this.options.excludeKeys.contains(key) && 
			 (!this.options.includeKeys.length || this.options.includeKeys.contains(key)));
	},
	//builds a level into the interface given a path
	buildLevel:function(path) {
		//if the path ends in a dot, remove it
		if (path.test(".$")) path = path.substring(0, path.length);
		//get the corresponding level for the path
		var level = this.getMemberByPath(path);
		//if the path already has been built, return
		if (this.levels[path]) return this.levels[path];
		//create the section
		var section = new Element('ul');
		switch($type(level)) {
			case "function":
					this.buildNode(level, "function()", section, path, true);
				break;
			case "string": case "number":
					this.buildNode(level, null, section, path, true);
				break;
			case "array":
				level.each(function(node, index){
					this.buildNode(node, index, section, path, ["string", "function"].contains($type(node)));
				}.bind(this));
				break;
			default:
				$H(level).each(function(value, key){
					var db = false;
					if (key == "element_dimensions") db = true;
					if (db) dbug.log(key);
					if (this.validLevel(key)) {
						if (db) dbug.log('is valid level');
						var isLeaf;
						if ($type(value) == "object") {
							isLeaf = false;
							$each(value, function(v, k){
								if (this.validLevel(k)) {
									if (db) dbug.log('not a leaf!');
									isLeaf = false;
								} else {
									isLeaf = true;
								}
							}, this);
							if (isLeaf) value = false;
						}
						if (db) dbug.log(value, key, section, path, $chk(isLeaf)?isLeaf:null);
						this.buildNode(value, key, section, path, $chk(isLeaf)?isLeaf:null);
					}
				}, this);
		}
		//set the resulting DOM element to the levels map
		this.levels[path] = section;
		//return the section
		return section;
	},
	//gets the parent node for an element
	getParentFromPath: function(path){
		return this.elements[(path || "top")+'NODE'];
	},
	//displays a level given a path
	//if the level hasn't been built yet,
	//the level is built and then injected
	//into the target using the given method
	//example:
	//showLevel("fruit.apples", "fruit", "injectInside");
	//note that target and method are set to the parent path and injectInside by default
	showLevel: function(path, target, method){
		target = target || path;
		if (! this.elements[path]) 
			this.elements[path] = this.buildLevel(path)[method||"inject"](this.elements[target]||this.container);
		else this.elements[path].toggle();
		dbug.log('toggle class');
		this.elements[path].getParent().toggleClass('collapsed');
		return this;
	},
	//builds a node given the arguments:
	//value - the value of the node
	//key - the key of the node
	//section - the container where this node goes; typically a section generated by buildLevel
	//path - the path to this node
	//leaf - boolean; true if this is a leaf node
	//note: if the key or the value is an empty string, leaf will be set to true.
	buildNode: function(value, key, section, path, leaf){
		if (key==="" || value==="") leaf = true;
		if (!this.validLevel(key)) return null;
		var nodePath = (path?path+'.'+key:key)+'NODE';
		var lnk = this.buildLink((leaf)?value||key:$chk(key)?key:value, leaf);
		var li = new Element('li').addClass((leaf)?'leaf':'branch collapsed').adopt(lnk).inject(section);
		lnk.addEvent('click', function(e){
			e.stopPropagation();
			if (leaf) {
				this.fireEvent('onLeafClick', {
					li: li, 
					key: key, 
					value: value, 
					path: path,
					nodePath: nodePath,
					event: e
				});
			} else {
				this.fireEvent('onBranchClick', {
					li: li, 
					key: key, 
					value: value, 
					path: path,
					nodePath: nodePath,
					event: e
				});
			}							
		}.bind(this));
		this.elements[nodePath] = li;
		return li;
	},
	//builds a link for a given key
	buildLink: function(key) {
		if ($type(key) == "function") {
			key = key.toString();
			key = key.substring(0, key.indexOf("{")+1)+"...";
		}
		return new Element('a', {
			href: "javascript: void(0);"
		}).set('html', key);
	}
});/*
Script: PopupDetails.js
	Creates hover detail popups for a collection of elements and data.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var PopupDetail = new Class({
	Implements: [Options, Events],
	visible: false,
	observed: false,
	hasData: false,
	options: {
		observerAction: 'mouseenter', //or click
		closeOnMouseOut: true,
		linkPopup: false, //or true to use observer href, or url
		data: {}, //key/value parse to parse in to html
		templateOptions: {}, //see simple template parser
		useAjax: false,
		ajaxOptions:{
			method: 'get'
		},
		ajaxLink: false, //defaults to use observer.src
		ajaxCache: {},
		delayOn: 100,
		delayOff: 100,
		stickyWinOptions:{},
		showNow: false,
		htmlResponse: false,
		regExp: /\\?%([^%]+)%/g
/*	onPopupShow: $empty,
		onPopupHide: $empty */
	},
	initialize: function(html, observer, options){
		this.setOptions({
			stickyWinToUse: StickyWin
		}, options);
		this.observer = document.id(observer);
		this.html = (document.id(html))?document.id(html).get('html'):html||'';
		if (this.options.showNow) this.show.delay(this.options.delayOn, this);
		this.setUpObservers();
	},
	setUpObservers: function(){
		var opt = this.options; //saving bytes here
		this.observer.addEvent(opt.observerAction, function(){
			this.observed = true;
			this.show.delay(opt.delayOn, this);
		}.bind(this));
		if ((opt.observerAction == "mouseenter" || opt.observerAction == "mouseover") && this.options.closeOnMouseOut){
			this.observer.addEvent("mouseleave", function(){
				this.observed = false;
				this.hide.delay(opt.delayOff, this);
			}.bind(this));
		}
		return this;
	},
	parseTemplate: function(string, values){
		return string.substitute(values, this.options.regExp);
	},
	makePopup: function(){
		if (!this.stickyWin){
			var opt = this.options;//saving bytes
			if (opt.htmlResponse) this.content = this.data;
			else this.content = this.parseTemplate(this.html, opt.data);
			this.stickyWin = new opt.stickyWinToUse($merge(opt.stickyWinOptions, {
				relativeTo: this.observer,
				showNow: false,
				content: this.content,
				allowMultipleByClass: true
			}));
			if (document.id(opt.linkPopup) || $type(opt.linkPopup)=='string') {
				this.stickyWin.win.setStyle('cursor','pointer').addEvent('click', function(){
					window.location.href = ($type(url)=='string')?url:url.src;
				});
			}
			this.stickyWin.win.addEvent('mouseenter', function(){
				this.observed = true;
			}.bind(this));
			this.stickyWin.win.addEvent('mouseleave', function(){
				this.observed = false;
				if (opt.closeOnMouseOut) this.hide.delay(opt.delayOff, this);
			}.bind(this));
		}
		return this;
	},
	getContent: function(){
		try {
			new Request($merge(this.options.ajaxOptions, {
					url: this.options.ajaxLink || this.observer.href,
					onSuccess: this.show.bind(this)
				})
			).send();
		} catch(e) {
			dbug.log('ajax error on PopupDetail: %s', e);
		}
	},
	show: function(data){
		var opt = this.options;
		if (data) this.data = data;
		if (this.observed && !this.visible) {
			if (opt.useAjax && !this.data) {
				var cachedVal = opt.ajaxCache[this.options.ajaxLink] || opt.ajaxCache[this.observer.href];
				if (cachedVal) {
					this.fireEvent('onPopupShow', this);
					return this.show(cachedVal);
				}
				this.cursorStyle = this.observer.getStyle('cursor');
				this.observer.setStyle('cursor', 'wait');
				this.getContent();
				return false;
			} else {
				if (this.cursorStyle) this.observer.setStyle('cursor', this.cursorStyle);
				if (opt.useAjax && !opt.htmlResponse) opt.data = JSON.decode(this.data);
				this.makePopup();
				this.fireEvent('onPopupShow', this);
				this.stickyWin.show();
				this.visible = true;
				return this;
			}
		}
		return this;
	},
	hide: function(){
		if (!this.observed){
			this.fireEvent('onPopupHide');
			if (this.stickyWin)this.stickyWin.hide();
			this.visible = false;
		}
		return this;
	}
});

var PopupDetailCollection = new Class({
	Implements: [Options],
	options: {
		details: {},
		links: [],
		ajaxLinks: [],
		useCache: true,
		template: '',
		popupDetailOptions: {}
	},
	cache: {},
	initialize: function(observers, options) {
		this.observers = $$(observers);
		this.setOptions(options);
		var ln = this.options.ajaxLinks.length;
		if (ln <= 0) ln = this.options.details.length;
		if (this.observers.length != ln) dbug.log("warning: observers and details are out of sync.");
		this.makePopupDetails();
	},
	makePopupDetails: function(){
		this.popupDetailObjs = this.observers.map(function(observer, index){
			var opt = this.options.popupDetailOptions;//saving bytes
			var pd = new PopupDetail(this.options.template, observer, $merge(opt, {
				data: $pick(this.options.details[index], {}),
				linkItem: $pick(this.options.links[index], $pick(opt.linkItem, false)),
				ajaxLink: $pick(this.options.ajaxLinks[index], false),
				ajaxCache: (this.options.useCache)?this.cache:{},
				useAjax: this.options.ajaxLinks.length>0
			}));
			return pd;
		}, this);
	}
});
/*
Script: StyleWriter.js

Provides a simple method for injecting a css style element into the DOM if it's not already present.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StyleWriter = new Class({
	createStyle: function(css, id) {
		window.addEvent('domready', function(){
			try {
				if (document.id(id) && id) return;
				var style = new Element('style', {id: id||''}).inject($$('head')[0]);
				if (Browser.Engine.trident) style.styleSheet.cssText = css;
				else style.set('text', css);
			}catch(e){dbug.log('error: %s',e);}
		}.bind(this));
	}
});/*
Script: StickyWin.js

Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/


var StickyWin = new Class({
	Binds: ['destroy', 'hide', 'togglepin', 'esc'],
	Implements: [Options, Events, StyleWriter, Class.ToElement],
	options: {
//		onDisplay: $empty,
//		onClose: $empty,
//		onDestroy: $empty,
		closeClassName: 'closeSticky',
		pinClassName: 'pinSticky',
		content: '',
		zIndex: 10000,
		className: '',
//		id: ... set above in initialize function
/*  	these are the defaults for Element.position anyway
		************************************************
		edge: false, //see Element.position
		position: 'center', //center, corner == upperLeft, upperRight, bottomLeft, bottomRight
		offset: {x:0,y:0},
		relativeTo: document.body, */
		width: false,
		height: false,
		timeout: -1,
		allowMultipleByClass: true,
		allowMultiple: true,
		showNow: true,
		useIframeShim: true,
		iframeShimSelector: '',
		destroyOnClose: false,
		closeOnClickOut: false,
		closeOnEsc: false,
		getWindowManager: function(){ return StickyWin.WM; }
	},

	css: '.SWclearfix:after {content: "."; display: block; height: 0; clear: both; visibility: hidden;}'+
		 '.SWclearfix {display: inline-table;} * html .SWclearfix {height: 1%;} .SWclearfix {display: block;}',
	
	initialize: function(options){
		this.options.inject = this.options.inject || {
			target: document.body,
			where: 'bottom'
		};
		this.setOptions(options);
		this.windowManager = this.options.getWindowManager();
		this.id = this.options.id || 'StickyWin_'+new Date().getTime();
		this.makeWindow();
		if (this.windowManager) this.windowManager.add(this);

		if (this.options.content) this.setContent(this.options.content);
		if (this.options.timeout > 0) {
			this.addEvent('onDisplay', function(){
				this.hide.delay(this.options.timeout, this);
			}.bind(this));
		}
		//add css for clearfix
		this.createStyle(this.css, 'StickyWinClearFix');
		if (this.options.closeOnClickOut || this.options.closeOnEsc) this.attach();
		if (this.options.destroyOnClose) this.addEvent('close', this.destroy);
		if (this.options.showNow) this.show();
	},
	attach: function(attach){
		var method = $pick(attach, true) ? 'addEvents' : 'removeEvents';
		var events = {};
		if (this.options.closeOnClickOut) events.click = this.esc;
		if (this.options.closeOnEsc) events.keyup = this.esc;
		document[method](events);
	},
	esc: function(e) {
		if (e.key == "esc") this.hide();
		if (e.type == "click" && this.element != e.target && !this.element.hasChild(e.target)) this.hide();
	},
	makeWindow: function(){
		this.destroyOthers();
		if (!document.id(this.id)) {
			this.win = new Element('div', {
				id:		this.id
			}).addClass(this.options.className).addClass('StickyWinInstance').addClass('SWclearfix').setStyles({
			 	display:'none',
				position:'absolute',
				zIndex:this.options.zIndex
			}).inject(this.options.inject.target, this.options.inject.where).store('StickyWin', this);			
		} else this.win = document.id(this.id);
		this.element = this.win;
		if (this.options.width && $type(this.options.width.toInt())=="number") this.win.setStyle('width', this.options.width.toInt());
		if (this.options.height && $type(this.options.height.toInt())=="number") this.win.setStyle('height', this.options.height.toInt());
		return this;
	},
	show: function(suppressEvent){
		this.showWin();
		if (!suppressEvent) this.fireEvent('display');
		if (this.options.useIframeShim) this.showIframeShim();
		this.visible = true;
		return this;
	},
	showWin: function(){
		if (this.windowManager) this.windowManager.focus(this);
		if (!this.positioned) this.position();
		this.win.show();
	},
	hide: function(suppressEvent){
		if ($type(suppressEvent) == "event" || !suppressEvent) this.fireEvent('close');
		this.hideWin();
		if (this.options.useIframeShim) this.hideIframeShim();
		this.visible = false;
		return this;
	},
	hideWin: function(){
		this.win.setStyle('display','none');
	},
	destroyOthers: function() {
		if (!this.options.allowMultipleByClass || !this.options.allowMultiple) {
			$$('div.StickyWinInstance').each(function(sw) {
				if (!this.options.allowMultiple || (!this.options.allowMultipleByClass && sw.hasClass(this.options.className))) 
					sw.retrieve('StickyWin').destroy();
			}, this);
		}
	},
	setContent: function(html) {
		if (this.win.getChildren().length>0) this.win.empty();
		if ($type(html) == "string") this.win.set('html', html);
		else if (document.id(html)) this.win.adopt(html);
		this.win.getElements('.'+this.options.closeClassName).each(function(el){
			el.addEvent('click', this.hide);
		}, this);
		this.win.getElements('.'+this.options.pinClassName).each(function(el){
			el.addEvent('click', this.togglepin);
		}, this);
		return this;
	},
	position: function(options){
		this.positioned = true;
		this.setOptions(options);
		this.win.position({
			allowNegative: $pick(this.options.allowNegative, this.options.relativeTo != document.body),
			relativeTo: this.options.relativeTo,
			position: this.options.position,
			offset: this.options.offset,
			edge: this.options.edge
		});
		if (this.shim) this.shim.position();
		return this;
	},
	pin: function(pin) {
		if (!this.win.pin) {
			dbug.log('you must include element.pin.js!');
			return this;
		}
		this.pinned = $pick(pin, true);
		this.win.pin(pin);
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		return this.pin(!this.pinned);
	},
	makeIframeShim: function(){
		if (!this.shim){
			var el = (this.options.iframeShimSelector)?this.win.getElement(this.options.iframeShimSelector):this.win;
			this.shim = new IframeShim(el, {
				display: false,
				name: 'StickyWinShim'
			});
		}
	},
	showIframeShim: function(){
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			this.shim.show();
		}
	},
	hideIframeShim: function(){
		if (this.shim) this.shim.hide();
	},
	destroy: function(){
		if (this.windowManager) this.windowManager.remove(this);
		if (this.win) this.win.destroy();
		if (this.options.useIframeShim && this.shim) this.shim.destroy();
		if (document.id('modalOverlay')) document.id('modalOverlay').destroy();
		this.fireEvent('destroy');
	}
});

StickyWin.Stacker = new Class({
	Implements: [Options, Events],
	Binds: ['click'],
	instances: [],
	options: {
		zIndexBase: 9000
	},
	initialize: function(options) {
		this.setOptions(options);
		this.zIndex = this.options.zIndex;
	},
	add: function(sw) {
		this.instances.include(sw);
		$(sw).addEvent('mousedown', this.click);
	},
	click: function(e) {
		this.instances.each(function(sw){
			var el = $(sw);
			if (el == e.target || el.hasChild($(e.target))) this.focus(sw);
		}, this);
	},
	focus: function(instance){
		if (this.focused == instance) return;
		this.focused = instance;
		if (instance) this.instances.erase(instance).push(instance);
		this.instances.each(function(current, i){
			$(current).setStyle('z-index', this.options.zIndexBase + i);
		}, this);
		this.focused = instance;
	},
	remove: function(sw) {
		this.instances.erase(sw);
		$(sw).removeEvent('click', this.click);
	}
});
StickyWin.WM = new StickyWin.Stacker();/*
Script: StickyWin.Fx.js

	Extends StickyWin to create popups that fade in and out.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

/*
Script: StickyWin.Fx.js

Extends StickyWin to create popups that fade in and out and can be dragged and resized (requires StickyWin.Fx.Drag.js).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin = Class.refactor(StickyWin, {
	options: {
		//fadeTransition: 'sine:in:out',
		fade: true,
		fadeDuration: 150
	},
	hideWin: function(){
		if (this.options.fade) this.fade(0);
		else this.previous();
	},
	showWin: function(){
		if (this.options.fade) this.fade(1);
		else this.previous();
	},
	hide: function(){
		this.previous(this.options.fade);
	},
	show: function(){
		this.previous(this.options.fade);
	},
	fade: function(to){
		if (!this.fadeFx) {
			this.win.setStyles({
				opacity: 0,
				display: 'block'
			});
			var opts = {
				property: 'opacity',
				duration: this.options.fadeDuration
			};
			if (this.options.fadeTransition) opts.transition = this.options.fadeTransition;
			this.fadeFx = new Fx.Tween(this.win, opts);
		}
		if (to > 0) {
			this.win.setStyle('display','block');
			this.position();
		}
		this.fadeFx.clearChain();
		this.fadeFx.start(to).chain(function (){
			if (to == 0) {
				this.win.setStyle('display', 'none');
				this.fireEvent('onClose');
			} else {
				this.fireEvent('onDisplay');
			}
		}.bind(this));
		return this;
	}
});
StickyWin.Fx = StickyWin;/*
Script: StickyWin.Drag.js

Implements drag and resize functionaity into StickyWin.Fx. See StickyWin.Fx for the options.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin = Class.refactor(StickyWin, {
	options: {
		draggable: false,
		dragOptions: {},
		dragHandleSelector: '.dragHandle',
		resizable: false,
		resizeOptions: {},
		resizeHandleSelector: ''
	},
	setContent: function(){
		this.previous.apply(this, arguments);
		if (this.options.draggable) this.makeDraggable();
		if (this.options.resizable) this.makeResizable();
		return this;
	},
	makeDraggable: function(){
		var toggled = this.toggleVisible(true);
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			var onComplete = (this.options.dragOptions.onComplete || $empty);
			this.options.dragOptions.onComplete = function(){
				onComplete();
				this.shim.position();
			}.bind(this);
		}
		if (this.options.dragHandleSelector) {
			var handle = this.win.getElement(this.options.dragHandleSelector);
			if (handle) {
				handle.setStyle('cursor','move');
				this.options.dragOptions.handle = handle;
			}
		}
		this.win.makeDraggable(this.options.dragOptions);
		if (toggled) this.toggleVisible(false);
	}, 
	makeResizable: function(){
		var toggled = this.toggleVisible(true);
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			var onComplete = (this.options.resizeOptions.onComplete || $empty);
			this.options.resizeOptions.onComplete = function(){
				onComplete();
				this.shim.position();
			}.bind(this);
		}
		if (this.options.resizeHandleSelector) {
			var handle = this.win.getElement(this.options.resizeHandleSelector);
			if (handle) this.options.resizeOptions.handle = this.win.getElement(this.options.resizeHandleSelector);
		}
		this.win.makeResizable(this.options.resizeOptions);
		if (toggled) this.toggleVisible(false);
	},
	toggleVisible: function(show){
		if (!this.visible && Browser.Engine.webkit && $pick(show, true)) {
			this.win.setStyles({
				display: 'block',
				opacity: 0
			});
			return true;
		} else if (!$pick(show, false)){
			this.win.setStyles({
				display: 'none',
				opacity: 1
			});
			return false;
		}
		return false;
	}
});
StickyWin.Fx = StickyWin;/*
Script: StickyWin.Modal.js

This script extends StickyWin and StickyWin.Fx classes to add Mask functionality.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Modal = new Class({

	Extends: StickyWin,

	options: {
		modalize: true,
		maskOptions: {
			style: {
				'background-color':'#333',
				opacity:0.8
			}
		},
		hideOnClick: true,
		getWindowManager: function(){ return StickyWin.ModalWM; }
	},

	initialize: function(options) {
		this.options.maskTarget = this.options.maskTarget || document.body;
		this.setOptions(options);
		this.mask = new Mask(this.options.maskTarget, this.options.maskOptions).addEvent('click', function() {
			if (this.options.hideOnClick) this.hide();
		}.bind(this));
		this.parent(options);
	},

	show: function(showModal){
		if ($pick(showModal, this.options.modalize)) this.mask.show();
		this.parent();
	},

	hide: function(hideModal){
		if ($pick(hideModal, true)) this.mask.hide();
		this.parent();
	}

});

StickyWin.ModalWM = new StickyWin.Stacker({
	zIndexBase: 11000
});
if (StickyWin.Fx) StickyWin.Fx.Modal = StickyWin.Modal;/*
Script: StickyWin.Ajaxjs

Adds ajax functionality to all the StickyWin classes.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	var SWA = function(extend){
		return {
			Extends: extend,
			options: {
				//onUpdate: $empty,
				url: '',
				showNow: false,
				requestOptions: {
					method: 'get',
					evalScripts: true
				},
				wrapWithUi: false, 
				caption: '',
				uiOptions:{},
				handleResponse: function(response){
					var responseScript = "";
					this.Request.response.text.stripScripts(function(script){	responseScript += script; });
					if (this.options.wrapWithUi) response = StickyWin.ui(this.options.caption, response, this.options.uiOptions);
					this.setContent(response);
					this.show();
					if (this.evalScripts) $exec(responseScript);
					this.fireEvent('update');
				}
			},
			initialize: function(options){
				var showNow;
				if (options && options.showNow) {
					showNow = true;
					options.showNow = false;
				}
				this.parent(options);
				this.evalScripts = this.options.requestOptions.evalScripts;
				this.options.requestOptions.evalScripts = false;
				this.createRequest();
				if (showNow) this.update();
			},
			createRequest: function(){
				this.Request = new Request(this.options.requestOptions).addEvent('onSuccess',
					this.options.handleResponse.bind(this));
			},
			update: function(url, options){
				this.Request.setOptions(options).send({url: url||this.options.url});
				return this;
			}
		};
	};
	try {	StickyWin.Ajax = new Class(SWA(StickyWin)); } catch(e){}
	try {	StickyWin.Modal.Ajax = new Class(SWA(StickyWin.Modal)); } catch(e){}
})();/*
Script: StickyWin.Alert.js
	Defines StickyWin.Alert, a simple little alert box with a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Alert = new Class({
	Implements: Options,
	Extends: StickyWin.Modal,
	options: {
		destroyOnClose: true,
		modalOptions: {
			modalStyle: {
				zIndex: 11000
			}
		},
		zIndex: 110001,
		uiOptions: {
			width: 250,
			buttons: [
				{text: 'Ok'}
			]
		},
		getWindowManager: $empty
	},
	initialize: function(caption, message, options) {
		this.message = message;
		this.caption = caption;
		this.setOptions(options);
		this.setOptions({
			content: this.build()
		});
		this.parent(options);
	},
	makeMessage: function() {
		return new Element('p', {
			'class': 'errorMsg SWclearfix',
			styles: {
				margin: 0,
				minHeight: 10
			},
			html: this.message
		});
	},
	build: function(){
		return StickyWin.ui(this.caption, this.makeMessage(), this.options.uiOptions);
	}
});

StickyWin.Error = new Class({
	Extends: StickyWin.Alert, 
	makeMessage: function(){
		var message = this.parent();
		new Element('img', {
			src: (this.options.baseHref || Clientcide.assetLocation + '/simple.error.popup') + '/icon_problems_sm.gif',
			'class': 'bang clearfix',
			styles: {
				'float': 'left',
				width: 30,
				height: 30,
				margin: '3px 5px 5px 0px'
			}
		}).inject(message, 'top');
		return message;
	}
});

StickyWin.alert = function(caption, message, options) {
	if ($type(options) == "string") options = {baseHref: options};
	return new StickyWin.Alert(caption, message, options);
};

StickyWin.error = function(caption, message, options) {
	return new StickyWin.Error(caption, message, options);
};/*
Script: StickyWin.Confirm.js
	Defines StickyWin.Conferm, a simple confirmation box with an ok and a close button.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Confirm = new Class({
	Extends: StickyWin.Alert,
	options: {
		uiOptions: {
			width: 250
		}
	},
	build: function(callback){
		this.setOptions({
			uiOptions: {
				buttons: [
					{text: 'Cancel'},
					{
						text: 'Ok', 
						onClick: callback || function(){
							this.fireEvent('confirm');
						}.bind(this)
					}
				]
			}
		});
		return this.parent();
	}
});

StickyWin.confirm = function(caption, message, callback, options) {
	return new StickyWin.Confirm(caption, message, options).addEvent('confirm', callback);
};/*
Script: StickyWin.Prompt.js
	Defines StickyWin.Prompt, a little prompt box with an input as well as ok close buttons.	
License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

StickyWin.Prompt = new Class({
	Extends: StickyWin.Confirm,
	options: {
		defaultValue: ''
	},
	initialize: function(message, header, options){
		this.addEvent('display', function(){
			this.input.select();
		}.bind(this));
		this.parent.apply(this, arguments);
	},
	makeMessage: function(){
		this.input = new Element('input', {
			value: this.options.defaultValue,
			type: 'text',
			id: 'foo',
			styles: {
				width: '100%'
			},
			events: {
				keyup: function(e) {
					if (e.key == 'enter') {
						this.fireEvent('confirm', this.input.get('value'));
						this.hide();
					}
				}.bind(this)
			}
		});
		return new Element('div').adopt(this.parent()).adopt(this.input);
	},
	build: function(){
		return this.parent(function(){
			this.fireEvent('confirm', this.input.get('value'));
		}.bind(this));
	}
});

StickyWin.prompt = function(caption, message, callback, options) {
	return new StickyWin.Prompt(caption, message, options).addEvent('confirm', callback);
}; /*
Script: StickyWin.ui.js

Creates an html holder for in-page popups using a default style.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI = new Class({
	Implements: [Options, Class.ToElement, StyleWriter],
	options: {
		width: 300,
		css: "div.DefaultStickyWin {font-family:verdana; font-size:11px; line-height: 13px;position: relative;}"+
			"div.DefaultStickyWin div.top{-moz-user-select: none;-khtml-user-select: none;}"+
			"div.DefaultStickyWin div.top_ul{background:url({%baseHref%}full.png) top left no-repeat; height:30px; width:15px; float:left}"+
			"div.DefaultStickyWin div.top_ur{position:relative; left:0px !important; left:-4px; background:url({%baseHref%}full.png) top right !important; height:30px; margin:0px 0px 0px 15px !important; margin-right:-4px; padding:0px}"+
			"div.DefaultStickyWin h1.caption{clear: none !important; margin:0px !important; overflow: hidden; padding:0 !important; font-weight:bold; color:#555; font-size:14px !important; position:relative; top:8px !important; left:5px !important; float: left; height: 22px !important;}"+
			"div.DefaultStickyWin div.middle, div.DefaultStickyWin div.closeBody {background:url({%baseHref%}body.png) top left repeat-y; margin:0px 20px 0px 0px !important;	margin-bottom: -3px; position: relative;	top: 0px !important; top: -3px;}"+
			"div.DefaultStickyWin div.body{background:url({%baseHref%}body.png) top right repeat-y; padding:8px 23px 8px 0px !important; margin-left:5px !important; position:relative; right:-20px !important; z-index: 1;}"+
			"div.DefaultStickyWin div.bottom{clear:both;}"+
			"div.DefaultStickyWin div.bottom_ll{background:url({%baseHref%}full.png) bottom left no-repeat; width:15px; height:15px; float:left}"+
			"div.DefaultStickyWin div.bottom_lr{background:url({%baseHref%}full.png) bottom right; position:relative; left:0px !important; left:-4px; margin:0px 0px 0px 15px !important; margin-right:-4px; height:15px}"+
			"div.DefaultStickyWin div.closeButtons{text-align: center; background:url({%baseHref%}body.png) top right repeat-y; padding: 4px 30px 8px 0px; margin-left:5px; position:relative; right:-20px}"+
			"div.DefaultStickyWin a.button:hover{background:url({%baseHref%}big_button_over.gif) repeat-x}"+
			"div.DefaultStickyWin a.button {background:url({%baseHref%}big_button.gif) repeat-x; margin: 2px 8px 2px 8px; padding: 2px 12px; cursor:pointer; border: 1px solid #999 !important; text-decoration:none; color: #000 !important;}"+
			"div.DefaultStickyWin div.closeButton{width:13px; height:13px; background:url({%baseHref%}closebtn.gif) no-repeat; position: absolute; right: 0px; margin:10px 15px 0px 0px !important; cursor:pointer;top:0px}"+
			"div.DefaultStickyWin div.dragHandle {	width: 11px;	height: 25px;	position: relative;	top: 5px;	left: -3px;	cursor: move;	background: url({%baseHref%}drag_corner.gif); float: left;}",
		cornerHandle: false,
		cssClass: '',
		buttons: [],
		cssId: 'defaultStickyWinStyle',
		cssClassName: 'DefaultStickyWin',
		closeButton: true
/*	These options are deprecated:
		closeTxt: false,
		onClose: $empty,
		confirmTxt: false,
		onConfirm: $empty	*/
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		this.legacy();
		var css = this.options.css.substitute({baseHref: this.options.baseHref || Clientcide.assetLocation + '/stickyWinHTML/'}, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) css = css.replace(/png/g, 'gif');
		this.createStyle(css, this.options.cssId);
		this.build();
		if (args.caption || args.body) this.setContent(args.caption, args.body);
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	legacy: function(){
		var opt = this.options; //saving bytes
		//legacy support
		if (opt.confirmTxt) opt.buttons.push({text: opt.confirmTxt, onClick: opt.onConfirm || $empty});
		if (opt.closeTxt) opt.buttons.push({text: opt.closeTxt, onClick: opt.onClose || $empty});
	},
	build: function(){
		var opt = this.options;

		var container = new Element('div', {
			'class': opt.cssClassName
		});
		if (opt.width) container.setStyle('width', opt.width);
		this.element = container;
		this.element.store('StickyWinUI', this);
		if (opt.cssClass) container.addClass(opt.cssClass);
		

		var bodyDiv = new Element('div').addClass('body');
		this.body = bodyDiv;
		
		var top_ur = new Element('div').addClass('top_ur');
		this.top_ur = top_ur;
		this.top = new Element('div').addClass('top').adopt(
				new Element('div').addClass('top_ul')
			).adopt(top_ur);
		container.adopt(this.top);
		
		if (opt.cornerHandle) new Element('div').addClass('dragHandle').inject(top_ur, 'top');
		
		//body
		container.adopt(new Element('div').addClass('middle').adopt(bodyDiv));
		//close buttons
		if (opt.buttons.length > 0){
			var closeButtons = new Element('div').addClass('closeButtons');
			opt.buttons.each(function(button){
				if (button.properties && button.properties.className){
					button.properties['class'] = button.properties.className;
					delete button.properties.className;
				}
				var properties = $merge({'class': 'closeSticky'}, button.properties);
				new Element('a').addEvent('click', button.onClick || $empty)
					.appendText(button.text).inject(closeButtons).set(properties).addClass('button');
			});
			container.adopt(new Element('div').addClass('closeBody').adopt(closeButtons));
		}
		//footer
		container.adopt(
			new Element('div').addClass('bottom').adopt(
					new Element('div').addClass('bottom_ll')
				).adopt(
					new Element('div').addClass('bottom_lr')
			)
		);
		if (this.options.closeButton) container.adopt(new Element('div').addClass('closeButton').addClass('closeSticky'));
		return this;
	},
	setCaption: function(caption) {
		this.caption = caption;
		if (!this.h1) {
			this.makeCaption(caption);
		} else {
			if (document.id(caption)) this.h1.adopt(caption);
			else this.h1.set('html', caption);
		}
		return this;
	},
	makeCaption: function(caption) {
		if (!caption) return this.destroyCaption();
		var opt = this.options;
		this.h1 = new Element('h1').addClass('caption');
		if (opt.width) this.h1.setStyle('width', (opt.width-(opt.cornerHandle?55:40)-(opt.closeButton?10:0)));
		this.setCaption(caption);
		this.top_ur.adopt(this.h1);
		if (!this.options.cornerHandle) this.h1.addClass('dragHandle');
		return this;
	},
	destroyCaption: function(){
		if (this.h1) {
			this.h1.destroy();
			this.h1 = null;
		}
		return this;
	},
	setContent: function(){
		var args = this.getArgs.apply(this, arguments);
		var caption = args.caption;
		var body = args.body;
		this.setCaption(caption);
		if (document.id(body)) this.body.empty().adopt(body);
		else this.body.set('html', body);
		return this;
	}
});
StickyWin.UI.getArgs = function(){
	var input = $type(arguments[0]) == "arguments"?arguments[0]:arguments;
	if (Browser.Engine.presto && 1 === input.length) input = input[0];

	var cap = input[0], bod = input[1];
	var args = Array.link(input, {options: Object.type});
	if (input.length == 3 || (!args.options && input.length == 2)) {
		args.caption = cap;
		args.body = bod;
	} else if (($type(bod) == 'object' || !bod) && cap && $type(cap) != 'object'){
		args.body = cap;
	}
	return args;
};

StickyWin.ui = function(caption, body, options){
	return document.id(new StickyWin.UI(caption, body, options));
};
/*
Script: StickyWin.UI.Pointy.js

Creates an html holder for in-page popups using a default style - this one including a pointer in the specified direction.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI.Pointy = new Class({
	Extends: StickyWin.UI,
	options: {
		theme: 'dark',
		themes: {
			dark: {
				bgColor: '#333',
				fgColor: '#ddd',
				imgset: 'dark'
			},
			light: {
				bgColor: '#ccc',
				fgColor: '#333',
				imgset: 'light'
			}
		},
		css: "div.DefaultPointyTip {vertical-align: auto; position: relative;}"+
		"div.DefaultPointyTip * {text-align:left !important}"+
		"div.DefaultPointyTip .pointyWrapper div.body{background: {%bgColor%}; color: {%fgColor%}; left: 0px; right: 0px !important;padding:  0px 10px !important;margin-left: 0px !important;font-family: verdana;font-size: 11px;line-height: 13px;position: relative;}"+
		"div.DefaultPointyTip .pointyWrapper div.top {position: relative;height: 25px; overflow: visible;}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ul{background: url({%baseHref%}{%imgset%}_back.png) top left no-repeat;width: 8px;height: 25px; position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ur{background: url({%baseHref%}{%imgset%}_back.png) top right !important;margin: 0 0 0 8px !important;height: 25px;position: relative;left: 0px !important;padding: 0;}"+
		"div.DefaultPointyTip .pointyWrapper h1.caption{color: {%fgColor%};left: 0px !important;top: 4px !important;clear: none !important;overflow: hidden;font-weight: 700;font-size: 12px !important;position: relative;float: left;height: 22px !important;margin: 0 !important;padding: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.middle, div.DefaultPointyTip .pointyWrapper div.closeBody{background:  {%bgColor%};margin: 0 0px 0 0 !important;position: relative;top: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom {clear: both; width: 100% !important; background: none; height: 6px} "+
		"div.DefaultPointyTip .pointyWrapper div.bottom_ll{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom left no-repeat;width: 6px;height: 6px;position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom_lr{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom right;height: 6px;margin: 0 0 0 6px !important;position: relative;left: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.noCaption{ height: 6px; overflow: hidden}"+
		"div.DefaultPointyTip .pointyWrapper div.closeButton{width:13px; height:13px; background:url({%baseHref%}{%imgset%}_x.png) no-repeat; position: absolute; right: 0px; margin:0px !important; cursor:pointer; z-index: 1; top: 4px;}"+
		"div.DefaultPointyTip .pointyWrapper div.pointyDivot {background: url({%divot%}) no-repeat;}",
		divot: '{%baseHref%}{%imgset%}_divot.png',
		divotSize: 22,
		direction: 12,
		cssId: 'defaultPointyTipStyle',
		cssClassName: 'DefaultPointyTip'
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		$extend(this.options, this.options.themes[this.options.theme]);
		this.options.baseHref = this.options.baseHref || Clientcide.assetLocation + '/PointyTip/';
		this.options.divot = this.options.divot.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) this.options.divot = this.options.divot.replace(/png/g, 'gif');
		this.options.css = this.options.css.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (args.options && args.options.theme) {
			while (!this.id) {
				var id = $random(0, 999999999);
				if (!StickyWin.UI.Pointy[id]) {
					StickyWin.UI.Pointy[id] = this;
					this.id = id;
				}
			}
			this.options.css = this.options.css.replace(/div\.DefaultPointyTip/g, "div#pointy_"+this.id);
			this.options.cssId = "pointyTipStyle_" + this.id;
		}
		if ($type(this.options.direction) == 'string') {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			this.options.direction = map[this.options.direction];
		}
		
		this.parent(args.caption, args.body, this.options);
		if (this.id) document.id(this).set('id', "pointy_"+this.id);
	},
	build: function(){
		this.parent();
		var opt = this.options;
		this.pointyWrapper = new Element('div', {
			'class': 'pointyWrapper'
		}).inject(document.id(this));
		document.id(this).getChildren().each(function(el){
			if (el != this.pointyWrapper) this.pointyWrapper.grab(el);
		}, this);

		var w = opt.divotSize;
		var h = w;
		var left = (opt.width - opt.divotSize)/2;
		var orient = function(){
			switch(opt.direction) {
				case 12: case 1: case 11:
					return {
						height: h/2
					};
				case 5: case 6: case 7:
					return {
						height: h/2,
						backgroundPosition: '0 -'+h/2+'px'
					};
				case 8: case 9: case 10:
					return {
						width: w/2
					};
				case 2: case 3: case 4:
					return {
						width: w/2,
						backgroundPosition: '100%'
					};
			};
		};
		this.pointer = new Element('div', {
			styles: $extend({
				width: w,
				height: h,
				overflow: 'hidden'
			}, orient()),
			'class': 'pointyDivot pointy_'+opt.direction
		}).inject(this.pointyWrapper);
	},
	expose: function(){
		if (document.id(this).getStyle('display') != 'none' && document.id(document.body).hasChild(document.id(this))) return $empty;
		document.id(this).setStyles({
			visibility: 'hidden',
			position: 'absolute'
		});
		var dispose;
		if (!document.body.hasChild(document.id(this))) {
			document.id(this).inject(document.body);
			dispose = true;
		}
		return (function(){
			if (dispose) document.id(this).dispose();
			document.id(this).setStyles({
				visibility: 'visible',
				position: 'relative'
			});
		}).bind(this);
	},
	positionPointer: function(options){
		if (!this.pointer) return;
		var opt = options || this.options;
		var pos;
		var d = opt.direction;
		switch (d){
			case 12: case 1: case 11:
				pos = {
					edge: {x: 'center', y: 'bottom'},
					position: {
						x: d==12?'center':d==1?'right':'left', 
						y: 'top'
					},
					offset: {
						x: (d==12?0:d==1?-1:1)*opt.divotSize,
						y: 1
					}
				};
				break;
			case 2: case 3: case 4:
				pos = {
					edge: {x: 'left', y: 'center'},
					position: {
						x: 'right', 
						y: d==3?'center':d==2?'top':'bottom'
					},
					offset: {
						x: -1,
						y: (d==3?0:d==4?-1:1)*opt.divotSize
					}
				};
				break;
			case 5: case 6: case 7:
				pos = {
					edge: {x: 'center', y: 'top'},
					position: {
						x: d==6?'center':d==5?'right':'left', 
						y: 'bottom'
					},
					offset: {
						x: (d==6?0:d==5?-1:1)*opt.divotSize,
						y: -1
					}
				};
				break;
			case 8: case 9: case 10:
				pos = {
					edge: {x: 'right', y: 'center'},
					position: {
						x: 'left', 
						y: d==9?'center':d==10?'top':'bottom'
					},
					offset: {
						x: 1,
						y: (d==9?0:d==8?-1:1)*opt.divotSize
					}
				};
				break;
		};
		var putItBack = this.expose();
		this.pointer.position($extend({
			relativeTo: this.pointyWrapper
		}, pos, options));
		putItBack();
	},
	setContent: function(a1, a2){
		this.parent(a1, a2);
		this.top[this.h1?'removeClass':'addClass']('noCaption');
		if (Browser.Engine.trident4) document.id(this).getElements('.bottom_ll, .bottom_lr').setStyle('font-size', 1); //IE6 bullshit
		if (this.options.closeButton) this.body.setStyle('margin-right', 6);
		this.positionPointer();
		return this;
	},
	makeCaption: function(caption){
		this.parent(caption);
		if (this.options.width && this.h1) this.h1.setStyle('width', (this.options.width-(this.options.closeButton?25:15)));
	}
});

StickyWin.UI.pointy = function(caption, body, options){
	return document.id(new StickyWin.UI.Pointy(caption, body, options));
};
StickyWin.ui.pointy = StickyWin.UI.pointy;/*
Script: StickyWin.PointyTip.js
	Positions a pointy tip relative to the element you specify.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.PointyTip = new Class({
	Extends: StickyWin,
	options: {
		point: "left",
		pointyOptions: {}
	},
	initialize: function(){
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		var popts = this.options.pointyOptions;
		var d = popts.direction;
		if (!d) {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			d = map[this.options.point];
			if (!d) d = this.options.point;
			popts.direction = d;
		}
		if (!popts.width) popts.width = this.options.width;
		this.pointy = new StickyWin.UI.Pointy(args.caption, args.body, popts);
		this.options.content = null;
		this.setOptions(args.options, this.getPositionSettings());
		this.parent(this.options);
		this.win.empty().adopt(document.id(this.pointy));
		this.attachHandlers(this.win);
		if (this.options.showNow) this.position();
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	getPositionSettings: function(){
		var s = this.pointy.options.divotSize;
		var d = this.options.point;
		var offset = this.options.offset || {};
		switch(d) {
			case "left": case 8: case 9: case 10:
				return {
					edge: {
						x: 'left', 
						y: d==10?'top':d==8?'bottom':'center'
					},
					position: {x: 'right', y: 'center'},
					offset: {
						x: s + (offset.x || 0),
						y: offset.y || 0
					}
				};
			case "right": case 2:  case 3: case 4:
				return {
					edge: {
						x: 'right', 
						y: (d==2?'top':d==4?'bottom':'center') + (offset.y || 0)
					},
					position: {x: 'left', y: 'center'},
					offset: {
						x: -s + (offset.x || 0),
						y: offset.y || 0
					}
				};
			case "up": case 11: case 12: case 1:
				return {
					edge: { 
						x: d==11?'left':d==1?'right':'center', 
						y: 'top' 
					},
					position: {	x: 'center', y: 'bottom' },
					offset: {
						y: s + (offset.y || 0),
						x: (d==11?-s:d==1?s:0) + (offset.x || 0)
					}
				};
			case "down": case 5: case 6: case 7:
				return {
					edge: {
						x: (d==7?'left':d==5?'right':'center') + (offset.x || 0), 
						y: 'bottom'
					},
					position: {x: 'center', y: 'top'},
					offset: {
						y: -s + (offset.y || 0),
						x: (d==7?-s:d==5?s:0) + (offset.x || 0)
					}
				};
		};
	},
	setContent: function() {
		var args = this.getArgs(arguments);
		this.pointy.setContent(args.caption, args.body);
		[this.pointy.h1, this.pointy.body].each(this.attachHandlers, this);
		if (this.visible) this.position();
		return this;
	},
	showWin: function(){
		this.parent();
		this.pointy.positionPointer();
	},
	position: function(options){
		this.parent(options);
		this.pointy.positionPointer();
	},
	attachHandlers: function(content) {
		if (!content) return;
		content.getElements('.'+this.options.closeClassName).addEvent('click', function(){ this.hide(); }.bind(this));
		content.getElements('.'+this.options.pinClassName).addEvent('click', function(){ this.togglepin(); }.bind(this));
	}
});/*
Script: Tips.Pointy.js
	Defines Tips.Pointy, An extension to Tips that adds a pointy style to the tip.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Tips.Pointy = new Class({
	Extends: Tips,
	options: {
		onShow: function(tip, stickyWin){
			stickyWin.show();
		},
		onHide: function(tip, stickyWin){
			stickyWin.hide();
		},
		pointyTipOptions: {
			point: 11,
			width: 150,
			pointyOptions: {
				closeButton: false
			}
		}
	},
	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		this.tip = new StickyWin.PointyTip($extend(this.options.pointyTipOptions, {
			showNow: false
		}));
		if (this.options.className) document.id(this.tip).addClass(this.options.className);
		if (params.elements) this.attach(params.elements);
	},
	elementEnter: function(event, element){

		var title = element.retrieve('tip:title');
		var text = element.retrieve('tip:text');
		this.tip.setContent(title, text);

		this.timer = $clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);

		this.position(element);
	},

	elementLeave: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
	},

	elementMove: function(event){
		return; //always fixed
	},

	position: function(element){
		this.tip.setOptions({
			relativeTo: element
		});
		this.tip.position();
	},

	show: function(){
		this.fireEvent('show', [document.id(this.tip), this.tip]);
	},

	hide: function(){
		this.fireEvent('hide', [document.id(this.tip), this.tip]);
	}

});/*
Script: Collapsible.js
	Enables a dom element to, when clicked, hide or show (it toggles) another dom element. Kind of an Accordion for one item.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Collapsible = new Class({
	Extends: Fx.Reveal,
	initialize: function(clicker, section, options) {
		this.clicker = document.id(clicker);
		this.section = document.id(section);
		this.parent(this.section, options);
		this.boundtoggle = this.toggle.bind(this);
		this.attach();
	},
	attach: function(){
		this.clicker.addEvent('click', this.boundtoggle);
	},
	detach: function(){
		this.clicker.removeEvent('click', this.boundtoggle);
	}
});
//legacy, this class originated w/ a typo. nice!
var Collapsable = Collapsible;var HoverGroup = new Class({
	Implements: [Options, Events],
	Binds: ['enter', 'leave', 'remain'],
	options: {
		//onEnter: $empty,
		//onLeave: $empty,
		elements: [],
		delay: 300,
		start: ['mouseenter'],
		remain: [],
		end: ['mouseleave']
	},
	initialize: function(options) {
		this.setOptions(options);
		this.attachTo(this.options.elements);
		this.addEvents({
			leave: function(){
				this.active = false;
			},
			enter: function(){
				this.active = true;
			}
		});
	},
	elements: [],
	attachTo: function(elements, detach){
		var starters = {}, remainers = {}, enders = {};
		elements = $splat(document.id(elements)||$$(elements));
		this.options.start.each(function(start) {
			starters[start] = this.enter;
		}, this);
		this.options.end.each(function(end) {
			enders[end] = this.leave;
		}, this);
		this.options.remain.each(function(remain){
			remainers[remain] = this.remain;
		}, this);
		if (detach) {
			elements.each(function(el) {
				el.removeEvents(starters).removeEvents(enders).removeEvents(remainers);
				this.elements.erase(el);
			}, this);
		} else {
			elements.each(function(el){
				el.addEvents(starters).addEvents(enders).addEvents(remainers);
			});
			this.elements.combine(elements);
		}
		return this;
	},
	detachFrom: function(elements){
		this.attachTo(elements, true);
	},
	enter: function(e){
		this.isMoused = true;
		this.assert(e);
	},
	leave: function(e){
		this.isMoused = false;
		this.assert(e);
	},
	remain: function(e){
		if (this.active) this.enter(e);
	},
	assert: function(e){
		$clear(this.assertion);
		this.assertion = (function(){
			if (!this.isMoused && this.active) this.fireEvent('leave', e);
			else if (this.isMoused && !this.active) this.fireEvent('enter', e);
		}).delay(this.options.delay, this);
	}
});/*
Script: MenuSlider.js
	Slides open a menu when the user mouses over a dom element. leaves it open while the mouse is over that element or the menu.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MenuSlider = new Class({
	Implements: [Options, Events],
	Binds: ['slideIn', 'hide', 'slideOut'],
	options: {
	/*	onIn: $empty,
		onInStart: $empty,
		onOut: $empty,
		hoverGroupOptions: {}, */
		fxOptions: {
			duration: 400,
			transition: 'expo:out',
			link: 'cancel'
		},
		outFx: false,
		useIframeShim: true
	},
	initialize: function(menu, subMenu, options) {
		this.menu = document.id(menu);
		this.subMenu = document.id(subMenu);
		this.setOptions(options);
		this.makeSlider();
		this.hoverGroup = new HoverGroup($merge(this.options.hoverGroupOptions, {
			elements: [this.menu, this.subMenu],
			onEnter: this.slideIn,
			onLeave: this.options.outFx ? this.slideOut : this.hide
		}));
	},
	makeSlider: function(){
		this.slider = new Fx.Slide(this.subMenu, this.options.fxOptions).hide();
		if (this.options.useIframeShim && window.IframeShim) this.shim = new IframeShim(this.subMenu);
	},
	slideIn: function(){
		this.fireEvent('inStart');
		this.slider.slideIn().chain(function(){
			if (this.shim) this.shim.show();
			this.fireEvent('in');
		}.bind(this));
		this.visible = true;
		return this;
	},
	slideOut: function(useFx){
		this.hoverGroup.active = true;
		this.slider.slideOut().chain(this.hide);
		return this;
	},
	hide: function(){
		$clear(this.hoverGroup.assertion);
		this.hoverGroup.active = false;
		this.slider.cancel();
		this.slider.hide();
		this.fireEvent('out');
		if (this.shim) this.shim.hide();
		this.visible = false;
		return this;
	},
	isVisible: function(){
		return this.visible;
	}
});/*
Script: MooScroller.js

Recreates the standard scrollbar behavior for elements with overflow but using DOM elements so that the scroll bar elements are completely styleable by css.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MooScroller = new Class({
	Implements: [Options, Events],
	options: {
		maxThumbSize: 10,
		mode: 'vertical',
		width: 0, //required only for mode: horizontal
		scrollSteps: 10,
		wheel: true,
		scrollLinks: {
			forward: 'scrollForward',
			back: 'scrollBack'
		},
		hideWhenNoOverflow: true
//		onScroll: $empty,
//		onPage: $empty
	},

	initialize: function(content, knob, options){
		this.setOptions(options);
		this.horz = (this.options.mode == "horizontal");

		this.content = document.id(content).setStyle('overflow', 'hidden');
		this.knob = document.id(knob);
		this.track = this.knob.getParent();
		this.setPositions();
		
		if (this.horz && this.options.width) {
			this.wrapper = new Element('div');
			this.content.getChildren().each(function(child){
				this.wrapper.adopt(child);
			}, this);
			this.wrapper.inject(this.content).setStyle('width', this.options.width);
		}
		

		this.bound = {
			'start': this.start.bind(this),
			'end': this.end.bind(this),
			'drag': this.drag.bind(this),
			'wheel': this.wheel.bind(this),
			'page': this.page.bind(this)
		};

		this.position = {};
		this.mouse = {};
		this.update();
		this.attach();
		
		this.clearScroll = function (){
			$clear(this.scrolling);
		}.bind(this);
		['forward','back'].each(function(direction) {
			var lnk = document.id(this.options.scrollLinks[direction]);
			if (lnk) {
				lnk.addEvents({
					mousedown: function() {
						this.scrolling = this[direction].periodical(50, this);
					}.bind(this),
					mouseup: this.clearScroll.bind(this),
					click: this.clearScroll.bind(this)
				});
			}
		}, this);
		this.knob.addEvent('click', this.clearScroll.bind(this));
		window.addEvent('domready', function(){
			try {
				document.id(document.body).addEvent('mouseup', this.clearScroll);
			}catch(e){}
		}.bind(this));
	},
	setPositions: function(){
		[this.track, this.knob].each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position','relative');
		});

	},
	toElement: function(){
		return this.content;
	},
	update: function(){
		var plain = this.horz?'Width':'Height';
		this.contentSize = this.content['offset'+plain];
		this.contentScrollSize = this.content['scroll'+plain];
		this.trackSize = this.track['offset'+plain];

		this.contentRatio = this.contentSize / this.contentScrollSize;

		this.knobSize = (this.trackSize * this.contentRatio).limit(this.options.maxThumbSize, this.trackSize);

		if (this.options.hideWhenNoOverflow) {
			this.hidden = this.knobSize == this.trackSize;
			this.track.setStyle('opacity', this.hidden?0:1);
		}
		
		this.scrollRatio = this.contentScrollSize / this.trackSize;
		this.knob.setStyle(plain.toLowerCase(), this.knobSize);

		this.updateThumbFromContentScroll();
		this.updateContentFromThumbPosition();
	},

	updateContentFromThumbPosition: function(){
		this.content[this.horz?'scrollLeft':'scrollTop'] = this.position.now * this.scrollRatio;
	},

	updateThumbFromContentScroll: function(){
		this.position.now = (this.content[this.horz?'scrollLeft':'scrollTop'] / this.scrollRatio).limit(0, (this.trackSize - this.knobSize));
		this.knob.setStyle(this.horz?'left':'top', this.position.now);
	},

	attach: function(){
		this.knob.addEvent('mousedown', this.bound.start);
		if (this.options.scrollSteps) this.content.addEvent('mousewheel', this.bound.wheel);
		this.track.addEvent('mouseup', this.bound.page);
	},

	detach: function(){
		this.knob.removeEvent('mousedown', this.bound.start);
		if (this.options.scrollSteps) this.content.removeEvent('mousewheel', this.bound.wheel);
		this.track.removeEvent('mouseup', this.bound.page);
		document.id(document.body).removeEvent('mouseup', this.clearScroll);
	},

	wheel: function(event){
		if (this.hidden) return;
		this.scroll(-(event.wheel * this.options.scrollSteps));
		this.updateThumbFromContentScroll();
		event.stop();
	},

	scroll: function(steps){
		steps = steps||this.options.scrollSteps;
		this.content[this.horz?'scrollLeft':'scrollTop'] += steps;
		this.updateThumbFromContentScroll();
		this.fireEvent('onScroll', steps);
	},
	forward: function(steps){
		this.scroll(steps);
	},
	back: function(steps){
		steps = steps||this.options.scrollSteps;
		this.scroll(-steps);
	},

	page: function(event){
		var axis = this.horz?'x':'y';
		var forward = (event.page[axis] > this.knob.getPosition()[axis]);
		this.scroll((forward?1:-1)*this.content['offset'+(this.horz?'Width':'Height')]);
		this.updateThumbFromContentScroll();
		this.fireEvent('onPage', forward);
		event.stop();
	},

	
	start: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.start = event.page[axis];
		this.position.start = this.knob.getStyle(this.horz?'left':'top').toInt();
		document.addEvent('mousemove', this.bound.drag);
		document.addEvent('mouseup', this.bound.end);
		this.knob.addEvent('mouseup', this.bound.end);
		event.stop();
	},

	end: function(event){
		document.removeEvent('mousemove', this.bound.drag);
		document.removeEvent('mouseup', this.bound.end);
		this.knob.removeEvent('mouseup', this.bound.end);
		event.stop();
	},

	drag: function(event){
		var axis = this.horz?'x':'y';
		this.mouse.now = event.page[axis];
		this.position.now = (this.position.start + (this.mouse.now - this.mouse.start)).limit(0, (this.trackSize - this.knobSize));
		this.updateContentFromThumbPosition();
		this.updateThumbFromContentScroll();
		event.stop();
	}

});
/*
Script: MultipleOpenAccordion.js

Creates a Mootools Fx.Accordion that allows the user to open more than one element.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var MultipleOpenAccordion = new Class({
	Implements: [Options, Events, Chain],
	options: {
		togglers: [],
		elements: [],
		openAll: false,
		firstElementsOpen: [0],
		fixedHeight: false,
		fixedWidth: false,
		height: true,
		opacity: true,
		width: false
//	onActive: $empty,
//	onBackground: $empty
	},
	togglers: [],
	elements: [],
	initialize: function(options){
		var args = Array.link(arguments, {options: Object.type, elements: Array.type});
		this.setOptions(args.options);
		elements = $$(this.options.elements);
		$$(this.options.togglers).each(function(toggler, idx){
			this.addSection(toggler, elements[idx], idx);
		}, this);
		if (this.togglers.length) {
			if (this.options.openAll) this.showAll();
			else this.toggleSections(this.options.firstElementsOpen, false, true);
		}
		this.openSections = this.showSections.bind(this);
		this.closeSections = this.hideSections.bind(this);
	},
	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		this.togglers.include(toggler);
		this.elements.include(element);
		var idx = this.togglers.indexOf(toggler);
		toggler.addEvent('click', this.toggleSection.bind(this, idx));
		var mode;
		if (this.options.height && this.options.width) mode = "both";
		else mode = (this.options.height)?"vertical":"horizontal";
		element.store('reveal', new Fx.Reveal(element, {
			transitionOpacity: this.options.opacity,
			mode: mode,
			heightOverride: this.options.fixedHeight,
			widthOverride: this.options.fixedWidth
		}));
		return this;
	},
	onComplete: function(idx, callChain){
		this.fireEvent(this.elements[idx].isDisplayed()?'onActive':'onBackground', [this.togglers[idx], this.elements[idx]]);
		this.callChain();
		return this;
	},
	showSection: function(idx, useFx){
		this.toggleSection(idx, useFx, true);
	},
	hideSection: function(idx, useFx){
		this.toggleSection(idx, useFx, false);
	},
	toggleSection: function(idx, useFx, show, callChain){
		var method = show?'reveal':$defined(show)?'dissolve':'toggle';
		callChain = $pick(callChain, true);
		var el = this.elements[idx];
		if ($pick(useFx, true)) {
			el.retrieve('reveal')[method]().chain(
				this.onComplete.bind(this, [idx, callChain])
			);
		} else {
				if (method == "toggle") el.togglek();
				else el[method == "reveal"?'show':'hide']();
				this.onComplete(idx, callChain);
		}
		return this;
	},
	toggleAll: function(useFx, show){
		var method = show?'reveal':$chk(show)?'disolve':'toggle';
		var last = this.elements.getLast();
		this.elements.each(function(el, idx){
			this.toggleSection(idx, useFx, show, el == last);
		}, this);
		return this;
	},
	toggleSections: function(sections, useFx, show) {
		last = sections.getLast();
		this.elements.each(function(el,idx){
			this.toggleSection(idx, useFx, sections.contains(idx)?show:!show, idx == last);
		}, this);
		return this;
	},
	showSections: function(sections, useFx){
		sections.each(function(i){
			this.showSection(i, useFx);
		}, this);
	},
	hideSections: function(sections, useFx){
		sections.each(function(i){
			this.hideSection(i, useFx);
		}, this);
	},
	showAll: function(useFx){
		return this.toggleAll(useFx, true);
	},
	hideAll: function(useFx){
		return this.toggleAll(useFx, false);
	}
});
/*
Script: SimpleCarousel.js

Builds a carousel object that manages the basic functions of a generic carousel (a carousel	here being a collection of "slides" that play from one to the next, with a collection of "buttons" that reference each slide).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleCarousel = new Class({
	Implements: [Options, Events],
	options: {
//		onRotate: $empty,
//		onStop: $empty,
//		onAutoPlay: $empty,
//		onShowSlide: $empty,
		slideInterval: 4000,
		transitionDuration: 700,
		startIndex: 0,
		buttonOnClass: "selected",
		buttonOffClass: "off",
		rotateAction: "none",
		rotateActionDuration: 100,
		autoplay: true
	},
	initialize: function(container, slides, buttons, options){
		this.container = document.id(container);
		var instance = this.container.retrieve('SimpleCarouselInstance');
		if (instance) return instance;
		this.container.store('SimpleCarouselInstance', this);
		this.setOptions(options);
		this.container.addClass('hasCarousel');
		this.slides = $$(slides);
		this.buttons = $$(buttons);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if (this.options.autoplay) this.autoplay();
		if (this.options.rotateAction != 'none') this.setupAction(this.options.rotateAction);
		return this;
	},
	toElement: function(){
		return this.container;
	},
	setupAction: function(action) {
		this.buttons.each(function(el, idx){
			document.id(el).addEvent(action, function() {
				this.slideFx.setOptions(this.slideFx.options, {duration: this.options.rotateActionDuration});
				if (this.currentSlide != idx) this.showSlide(idx);
				this.stop();
			}.bind(this));
		}, this);
	},
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration});
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
		});
	},
	showSlide: function(slideIndex){
		var action = {};
		this.slides.each(function(slide, index){
			if (index == slideIndex && index != this.currentSlide){ //show
				if (document.id(this.buttons[index])) document.id(this.buttons[index]).swapClass(this.options.buttonOffClass, this.options.buttonOnClass);
				action[index.toString()] = {
					opacity: 1
				};
			} else {
				if (document.id(this.buttons[index])) document.id(this.buttons[index]).swapClass(this.options.buttonOnClass, this.options.buttonOffClass);
				action[index.toString()] = {
					opacity:0
				};
			}
		}, this);
		this.fireEvent('onShowSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	autoplay: function(){
		this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
		this.fireEvent('onAutoPlay');
		return this;
	},
	stop: function(){
		$clear(this.slideshowInt);
		this.fireEvent('onStop');
		return this;
	},
	rotate: function(){
		var current = this.currentSlide;
		var next = (current+1 >= this.slides.length) ? 0 : current+1;
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	}
});/*
Script: SimpleSlideShow.js

Makes a very, very simple slideshow gallery with a collection of dom elements and previous and next buttons.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleSlideShow = new Class({
	Implements: [Events, Options, Chain],
	options: {
		startIndex: 0,
		slides: [],
		currentSlideClass: 'currentSlide',
		currentIndexContainer: false,
		maxContainer: false,
		nextLink: false,
		prevLink: false,
		wrap: true,
		disabledLinkClass: 'disabled',
//		onNext: $empty,
//		onPrev: $empty,
//		onSlideClick: $empty,
//		onSlideDisplay: $empty,
		crossFadeOptions: {}
	},
	initialize: function(options){
		this.setOptions(options);
		var slides = this.options.slides;
		this.makeSlides(slides);
		this.setCounters();
		this.setUpNav();
		this.now = this.options.startIndex;
		if (this.slides.length > 0) this.show(this.now);
	},
	slides:[],
	setCounters: function(){
		if (document.id(this.options.currentIndexContainer))document.id(this.options.currentIndexContainer).set('html', this.now+1);
		if (document.id(this.options.maxContainer))document.id(this.options.maxContainer).set('html', this.slides.length);
	},
	makeSlides: function(slides){
		//hide them all
		slides.each(function(slide, index){
			if (index != this.now) slide.setStyle('display', 'none');
			else slide.setStyle('display', 'block');
			this.makeSlide(slide);
		}, this);
	},
	makeSlide: function(slide){
		slide.addEvent('click', function(){ this.fireEvent('onSlideClick'); }.bind(this));
		this.slides.include(slide);
	},
	setUpNav: function(){	
		if (document.id(this.options.nextLink)) {
			document.id(this.options.nextLink).addEvent('click', function(){
				this.forward();
			}.bind(this));
		}
		if (document.id(this.options.prevLink)) {
			document.id(this.options.prevLink).addEvent('click', function(){
				this.back();
			}.bind(this));
		}
	},
	disableLinks: function(now){
		if (this.options.wrap) return;
		now = $pick(now, this.now);
		var prev = document.id(this.options.prevLink);
		var next = document.id(this.options.nextLink);
		var dlc = this.options.disabledLinkClass;
		if (now > 0) {
			if (prev) prev.removeClass(dlc);
			if (now === this.slides.length-1 && next) next.addClass(dlc);
			else if (next) next.removeClass(dlc);
		}	else { //now is zero
			if (this.slides.length > 0 && next) next.removeClass(dlc);
			if (prev) prev.addClass(dlc);
		}
	},
	forward: function(){
		if ($type(this.now) && this.now < this.slides.length-1) this.show(this.now+1);
		else if ($type(this.now) && this.options.wrap) this.show(0);
		else if (!$type(this.now)) this.show(this.options.startIndex);
		this.fireEvent('next');
		return this;
	},
	back: function(){
		if (this.now > 0) {
			this.show(this.now-1);
			this.fireEvent('onPrev');
		} else if (this.options.wrap && this.slides.length > 1) {
			this.show(this.slides.length-1);
			this.fireEvent('prev');
		}
		return this;
	},
	show: function(index){
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		function fadeIn(s, resetOpacity){
			s.setStyle('display','block');
			if (!Browser.Engine.trident4) {
				if (resetOpacity) s.setStyle('opacity', 0);
				s.set('tween', this.options.crossFadeOptions).get('tween').start('opacity', 1).chain(function(){
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
		};
		if (s) {
			if ($type(this.now) && this.now != index){
				if (!Browser.Engine.trident4) {
					var fx = this.slides[this.now].get('tween');
					fx.setOptions(this.options.crossFadeOptions);
					this.showing = true;
					fx.start('opacity', 0).chain(function(){
						this.slides[now].setStyle('display','none');
						s.addClass(this.options.currentSlideClass);
						fadeIn.run([s, true], this);
						this.fireEvent('onSlideDisplay', index);
					}.bind(this));
				} else {
					this.slides[this.now].setStyle('display','none');
					fadeIn.run(s, this);
				}
			} else fadeIn.run(s, this);
			this.now = index;
			this.setCounters();
		}
	},
	slideClick: function(){
		this.fireEvent('onSlideClick', [this.slides[this.now], this.now]);
	}
});

SimpleSlideShow.Carousel = new Class({
	Extends: SimpleSlideShow,
	Implements: [Class.ToElement],
	Binds: ['makeSlide'],
	options: {
		sliderWidth: 999999
	},
	initialize: function(container, options){
		this.setOptions(options);
		this.container = document.id(container);
		this.element = new Element('div').wraps(this.container).setStyles({
			width: this.container.getSize().x,
			overflow: 'hidden',
			position: 'relative'
		});
		this.container.setStyles({
			width: this.options.sliderWidth,
			position: 'relative'
		});
		this.parent(options);
	},
	makeSlides: function(slides) {
		this.slides = [];
		slides.each(this.makeSlide);
	},
	makeSlide: function(slide) {
		if (slide.retrieve('slideSetup')) return;
		slide.store('slideSetup', true);
		slide.show();
		var s = new Element('div', {
			styles: {
				'float': 'left',
				width: document.id(this).getSize().x
			}
		}).wraps(slide);
		this.parent(s);
		this.slides.erase(slide);
		this.setCounters();
		s.show();
		s.inject(this.container);
	},
	show: function(index) {
		if (!this.container) return;
		this.fx = this.fx || new Fx.Tween(this.container.setStyle('left', 0), $merge({
			property: 'left'
		}, this.options.crossFadeOptions));
		if (this.showing) return this.chain(this.show.bind(this, index));
		var now = this.now;
		var s = this.slides[index]; //saving bytes
		if (s) {
			if (this.now != index) {
				this.fx.start(-s.getPosition(this.container).x).chain(function(){
					s.addClass(this.options.currentSlideClass);
					this.showing = false;
					this.disableLinks();
					this.callChain();
					this.fireEvent('onSlideDisplay', index);
				}.bind(this));
			}
			this.now = index;
			this.setCounters();
		}
	}
});

var SimpleImageSlideShow;
(function(){
	var extender = function(extend, passContainer) {
		return {
			Extends: extend,
			Implements: Class.ToElement,
			options: {
				imgUrls: [],
				imgClass: 'screenshot',
				container: false
			},
			initialize: function(){
				var args = Array.link(arguments, {options: Object.type, container: $defined});
				this.container = document.id(args.container) || (args.options?document.id(args.options.container):false); //legacy
				if (passContainer) this.parent(this.container, args.options);
				else this.parent(args.options);
				this.options.imgUrls.each(function(url){
					this.addImg(url);
				}, this);
				this.show(this.options.startIndex);
			},
			addImg: function(url){
				if (this.container) {
					var img = new Element('img', {
						'src': url,
						'id': this.options.imgClass+this.slides.length
					}).addClass(this.options.imgClass).setStyle(
						'display', 'none').inject(this.container).addEvent(
						'click', this.slideClick.bind(this));
					this.slides.push(img);
					this.makeSlide(img);
					this.setCounters();
				}
				return this;
			}
		};
	};
	SimpleImageSlideShow = new Class(extender(SimpleSlideShow));
	SimpleImageSlideShow.Carousel = new Class(extender(SimpleSlideShow.Carousel, true));
})();
/*
name: TabSwapper.js
description: Handles the scripting for a common UI layout; the tabbed box.
License: http://www.clientcide.com/wiki/cnet-libraries#license

requires:
 - core: Element.Event, Fx.Tween, Fx.Morph
 - more: Element.Shortcuts, Element.Dimensions, Element.Measure

*/
var TabSwapper = new Class({
	Implements: [Options, Events],
	options: {
		selectedClass: 'tabSelected',
		mouseoverClass: 'tabOver',
		deselectedClass: '',
		rearrangeDOM: true,
		initPanel: 0, 
		smooth: false, 
		smoothSize: false,
		maxSize: null,
		effectOptions: {
			duration: 500
		},
		cookieName: null, 
		cookieDays: 999
//	onActive: $empty,
//	onActiveAfterFx: $empty,
//	onBackground: $empty
	},
	tabs: [],
	sections: [],
	clickers: [],
	sectionFx: [],
	initialize: function(options){
		this.setOptions(options);
		var prev = this.setup();
		if (prev) return prev;
		if (this.options.cookieName && this.recall()) this.show(this.recall().toInt());
		else this.show(this.options.initPanel);
	},
	setup: function(){
		var opt = this.options;
		sections = $$(opt.sections);
		tabs = $$(opt.tabs);
		if (tabs[0] && tabs[0].retrieve('tabSwapper')) return tabs[0].retrieve('tabSwapper');
		clickers = $$(opt.clickers);
		tabs.each(function(tab, index){
			this.addTab(tab, sections[index], clickers[index], index);
		}, this);
	},
	addTab: function(tab, section, clicker, index){
		tab = document.id(tab); clicker = document.id(clicker); section = document.id(section);
		//if the tab is already in the interface, just move it
		if (this.tabs.indexOf(tab) >= 0 && tab.retrieve('tabbered') 
			 && this.tabs.indexOf(tab) != index && this.options.rearrangeDOM) {
			this.moveTab(this.tabs.indexOf(tab), index);
			return this;
		}
		//if the index isn't specified, put the tab at the end
		if (!$defined(index)) index = this.tabs.length;
		//if this isn't the first item, and there's a tab
		//already in the interface at the index 1 less than this
		//insert this after that one
		if (index > 0 && this.tabs[index-1] && this.options.rearrangeDOM) {
			tab.inject(this.tabs[index-1], 'after');
			section.inject(this.tabs[index-1].retrieve('section'), 'after');
		}
		this.tabs.splice(index, 0, tab);
		clicker = clicker || tab;

		tab.addEvents({
			mouseout: function(){
				tab.removeClass(this.options.mouseoverClass);
			}.bind(this),
			mouseover: function(){
				tab.addClass(this.options.mouseoverClass);
			}.bind(this)
		});

		clicker.addEvent('click', function(e){
			e.preventDefault();
			this.show(index);
		}.bind(this));

		tab.store('tabbered', true);
		tab.store('section', section);
		tab.store('clicker', clicker);
		this.hideSection(index);
		return this;
	},
	removeTab: function(index){
		var now = this.tabs[this.now];
		if (this.now == index){
			if (index > 0) this.show(index - 1);
			else if (index < this.tabs.length) this.show(index + 1);
		}
		this.now = this.tabs.indexOf(now);
		return this;
	},
	moveTab: function(from, to){
		var tab = this.tabs[from];
		var clicker = tab.retrieve('clicker');
		var section = tab.retrieve('section');
		
		var toTab = this.tabs[to];
		var toClicker = toTab.retrieve('clicker');
		var toSection = toTab.retrieve('section');
		
		this.tabs.erase(tab).splice(to, 0, tab);

		tab.inject(toTab, 'before');
		clicker.inject(toClicker, 'before');
		section.inject(toSection, 'before');
		return this;
	},
	show: function(i){
		if (!$chk(this.now)) {
			this.tabs.each(function(tab, idx){
				if (i != idx) 
					this.hideSection(idx);
			}, this);
		}
		this.showSection(i).save(i);
		return this;
	},
	save: function(index){
		if (this.options.cookieName) 
			Cookie.write(this.options.cookieName, index, {duration:this.options.cookieDays});
		return this;
	},
	recall: function(){
		return (this.options.cookieName)?$pick(Cookie.read(this.options.cookieName), false): false;
	},
	hideSection: function(idx) {
		var tab = this.tabs[idx];
		if (!tab) return this;
		var sect = tab.retrieve('section');
		if (!sect) return this;
		if (sect.getStyle('display') != 'none') {
			this.lastHeight = sect.getSize().y;
			sect.setStyle('display', 'none');
			tab.swapClass(this.options.selectedClass, this.options.deselectedClass);
			this.fireEvent('onBackground', [idx, sect, tab]);
		}
		return this;
	},
	showSection: function(idx) {
		var tab = this.tabs[idx];
		if (!tab) return this;
		var sect = tab.retrieve('section');
		if (!sect) return this;
		var smoothOk = this.options.smooth && !Browser.Engine.trident4;
		if (this.now != idx) {
			if (!tab.retrieve('tabFx')) 
				tab.store('tabFx', new Fx.Morph(sect, this.options.effectOptions));
			var overflow = sect.getStyle('overflow');
			var start = {
				display:'block',
				overflow: 'hidden'
			};
			if (smoothOk) start.opacity = 0;
			var effect = false;
			if (smoothOk) {
				effect = {opacity: 1};
			} else if (sect.getStyle('opacity').toInt() < 1) {
				sect.setStyle('opacity', 1);
				if (!this.options.smoothSize) this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
			}
			if (this.options.smoothSize) {
				var size = sect.getDimensions().height;
				if ($chk(this.options.maxSize) && this.options.maxSize < size) 
					size = this.options.maxSize;
				if (!effect) effect = {};
				effect.height = size;
			}
			if ($chk(this.now)) this.hideSection(this.now);
			if (this.options.smoothSize && this.lastHeight) start.height = this.lastHeight;
			sect.setStyles(start);
			if (effect) {
				tab.retrieve('tabFx').start(effect).chain(function(){
					this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
					sect.setStyles({
						height: this.options.maxSize == effect.height ? this.options.maxSize : "auto",
						overflow: overflow
					});
					sect.getElements('input, textarea').setStyle('opacity', 1);
				}.bind(this));
			}
			this.now = idx;
			this.fireEvent('onActive', [idx, sect, tab]);
		}
		tab.swapClass(this.options.deselectedClass, this.options.selectedClass);
		return this;
	}
});
/*
Script: Confirmer.js
	Fades a message in and out for the user to tell them that some event (like an ajax save) has occurred.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Confirmer = new Class({
	Implements: [Options, Events],
	options: {
		reposition: true, //for elements already in the DOM
		//if position = false, just fade
		positionOptions: {
			relativeTo: false,
			position: 'upperRight', //see <Element.Position>
			offset: {x:-225,y:0},
			zIndex: 9999
		},
		msg: 'your changes have been saved', //string or dom element
		msgContainerSelector: '.body',
		delay: 250,
		pause: 1000,
		effectOptions:{
			duration: 500
		},
		prompterStyle:{
			padding: '2px 6px',
			border: '1px solid #9f0000',
			backgroundColor: '#f9d0d0',
			fontWeight: 'bold',
			color: '#000',
			width: 210
		}
//	onComplete: $empty
	},
	initialize: function(options){
			this.setOptions(options);
			this.options.positionOptions.relativeTo = document.id(this.options.positionOptions.relativeTo) || document.body;
			this.prompter = (document.id(this.options.msg))?document.id(this.options.msg):this.makePrompter(this.options.msg);
			if (this.options.reposition){
				this.prompter.setStyles({
					position: 'absolute',
					display: 'none',
					zIndex: this.options.positionOptions.zIndex
				});
				if (!Browser.Engine.trident4) this.prompter.setStyle('opacity',0);
			} else if (!Browser.Engine.trident4) this.prompter.setStyle('opacity',0);
			else this.prompter.setStyle('visibility','hidden');
			if (!this.prompter.getParent()){
				window.addEvent('domready', function(){
					this.prompter.inject(document.body);
				}.bind(this));
			}
		try {
			this.msgHolder = this.prompter.getElement(this.options.msgContainerSelector);
			if (!this.msgHolder) this.msgHolder = this.prompter;
		} catch(e){dbug.log(e)}
	},
	makePrompter: function(msg){
		return new Element('div').setStyles(this.options.prompterStyle).appendText(msg);
	},
	prompt: function(options){
		if (!this.paused)this.stop();
		var msg = (options)?options.msg:false;
		options = $merge(this.options, {saveAsDefault: false}, options||{});
		if (document.id(options.msg) && msg) this.msgHolder.empty().adopt(options.msg);
		else if (!document.id(options.msg) && options.msg) this.msgHolder.empty().appendText(options.msg);
		if (!this.paused) {
			if (options.reposition) this.position(options.positionOptions);
			(function(){
				this.timer = this.fade(options.pause);
			}).delay(options.delay, this);
		}
		if (options.saveAsDefault) this.setOptions(options);
		return this;
	},
	fade: function(pause){
		this.paused = true;
		pause = $pick(pause, this.options.pause);
		if (!this.fx && !Browser.Engine.trident4)
			this.fx = new Fx.Tween(this.prompter, $merge({property: 'opacity'}, this.options.effectOptions));
		if (this.options.reposition) this.prompter.setStyle('display','block');
		if (!Browser.Engine.trident4){
			this.prompter.setStyle('visibility','visible');
			this.fx.start(0,1).chain(function(){
				this.timer = (function(){
					this.fx.start(0).chain(function(){
						if (this.options.reposition) this.prompter.hide();
						this.paused = false;
					}.bind(this));
				}).delay(pause, this);
			}.bind(this));
		} else {
			this.prompter.setStyle('visibility','visible');
			this.timer = (function(){
				this.prompter.setStyle('visibility','hidden');
				this.fireEvent('onComplete');
				this.paused = false;
			}).delay(pause+this.options.effectOptions.duration, this);
		}
		return this;
	},
	stop: function(){	
		this.paused = false;
		$clear(this.timer);
		if (this.fx) this.fx.set(0);
		if (this.options.reposition) this.prompter.hide();
		return this;
	},
	position: function(positionOptions){
		this.prompter.position($merge(this.options.positionOptions, positionOptions));
		return this;
	}
});
/*
Script: DatePicker.js
	Allows the user to enter a date in many popuplar date formats or choose from a calendar.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var DatePicker;
(function(){
	var DPglobal = function() {
		if (DatePicker.pickers) return;
		DatePicker.pickers = [];
		DatePicker.hideAll = function(){
			DatePicker.pickers.each(function(picker){
				picker.hide();
			});
		};
	};
 	DatePicker = new Class({
		Implements: [Options, Events, StyleWriter],
		options: {
			format: "%x",
			defaultCss: 'div.calendarHolder {height:177px;position: absolute;top: -21px !important;top: -27px;left: -3px;width: 100%;}'+
				'div.calendarHolder table.cal {margin-right: 15px !important;margin-right: 8px;width: 205px;}'+
				'div.calendarHolder td {text-align:center;}'+
				'div.calendarHolder tr.dayRow td {padding: 2px;width: 22px;cursor: pointer;}'+
				'div.calendarHolder table.datePicker * {font-size:11px;line-height:16px;}'+
				'div.calendarHolder table.datePicker {margin: 0;padding:0 5px;float: left;}'+
				'div.calendarHolder table.datePicker table.cal td {cursor:pointer;}'+
				'div.calendarHolder tr.dateNav {font-weight: bold;height:22px;margin-top:8px;}'+
				'div.calendarHolder tr.dayNames {height: 23px;}'+
				'div.calendarHolder tr.dayNames td {color:#666;font-weight:700;border-bottom:1px solid #ddd;}'+
				'div.calendarHolder table.datePicker tr.dayRow td:hover {background:#ccc;}'+
				'div.calendarHolder table.datePicker tr.dayRow td {margin: 1px;}'+
				'div.calendarHolder td.today {color:#bb0904;}'+
				'div.calendarHolder td.otherMonthDate {border:1px solid #fff;color:#ccc;background:#f3f3f3 !important;margin: 0px !important;}'+
				'div.calendarHolder td.selectedDate {border: 1px solid #20397b;background:#dcddef;margin: 0px !important;}'+
				'div.calendarHolder a.leftScroll, div.calendarHolder a.rightScroll {cursor: pointer; color: #000}'+
				'div.datePickerSW div.body {height: 160px !important;height: 149px;}'+
				'div.datePickerSW .clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}'+
				'div.datePickerSW .clearfix {display: inline-table;}'+
				'* html div.datePickerSW .clearfix {height: 1%;}'+
				'div.datePickerSW .clearfix {display: block;}',
			calendarId: false,
			stickyWinOptions: {
				draggable: true,
				dragOptions: {},
				position: "bottomLeft",
				offset: {x:10, y:10},
				fadeDuration: 400
			},
			stickyWinUiOptions: {},
			updateOnBlur: true,
			additionalShowLinks: [],
			showOnInputFocus: true,
			useDefaultCss: true,
			hideCalendarOnPick: true,
			weekStartOffset: 0,
			showMoreThanOne: true,
			stickyWinToUse: StickyWin
/*		onPick: $empty,
			onShow: $empty,
			onHide: $empty */
		},
	
		initialize: function(input, options){
			DPglobal(); //make sure controller is setup
			if (document.id(input)) this.inputs = $H({start: document.id(input)});
	    	this.today = new Date();
			this.setOptions(options);
			if (this.options.useDefaultCss) this.createStyle(this.options.defaultCss, 'datePickerStyle');
			if (!this.inputs) return;
			this.whens = this.whens || ['start'];
			if (!this.calendarId) this.calendarId = "popupCalendar" + new Date().getTime();
			this.setUpObservers();
			this.getCalendar();
			this.formValidatorInterface();
			DatePicker.pickers.push(this);
		},
		formValidatorInterface: function(){
			this.inputs.each(function(input){
				var props;
				if (input.get('validatorProps')) props = input.get('validatorProps');
				if (props && props.dateFormat) {
					dbug.log('using date format specified in validatorProps property of element to play nice with Form.Validator');
					this.setOptions({ format: props.dateFormat });
				} else {
					if (!props) props = {};
					props.dateFormat = this.options.format;
					input.set('validatorProps', props);
				}
			}, this);
		},
		calWidth: 280,
		inputDates: {},
		selectedDates: {},
		setUpObservers: function(){
			this.inputs.each(function(input) {
				if (this.options.showOnInputFocus) input.addEvent('focus', this.show.bind(this));
				input.addEvent('blur', function(e){
					if (e) {
						this.selectedDates = this.getDates(null, true);
						this.fillCalendar(this.selectedDates.start);
						if (this.options.updateOnBlur) this.updateInput();
					}
				}.bind(this));
			}, this);
			this.options.additionalShowLinks.each(function(lnk){
				document.id(lnk).addEvent('click', this.show.bind(this));
			}, this);
		},
		getDates: function(dates, getFromInputs){
			var d = {};
			if (!getFromInputs) dates = dates||this.selectedDates;
			var getFromInput = function(when){
				var input = this.inputs.get(when);
				if (input) d[when] = this.validDate(input.get('value'));
			}.bind(this);
			this.whens.each(function(when) {
				switch($type(dates)){
					case "object":
						if (dates) d[when] = dates[when]?dates[when]:dates;
						if (!d[when] && !d[when].format) getFromInput(when);
						break;
					default:
						getFromInput(when);
						break;
				}
				if (!d[when]) d[when] = this.selectedDates[when]||new Date();
			}, this);
			return d;
		},
		updateInput: function(){
			var d = {};
			$each(this.getDates(), function(value, key){
				var input = this.inputs.get(key);
				if (!input) return;
				input.set('value', (value)?this.formatDate(value)||"":"");
			}, this);
			return this;
		},
		validDate: function(val) {
			if (!$chk(val)) return null;
			var date = Date.parse(val.trim());
			return isNaN(date)?null:date;
		},
		formatDate: function (date) {
			return date.format(this.options.format);
		},
		getCalendar: function() {
			if (!this.calendar) {
				var cal = new Element("table", {
					'id': this.options.calendarId || '',
					'border':'0',
					'cellpadding':'0',
					'cellspacing':'0',
					'class':'datePicker'
				});
				var tbody = new Element('tbody').inject(cal);
				var rows = [];
				(8).times(function(i){
					var row = new Element('tr').inject(tbody);
					(7).times(function(i){
						var td = new Element('td').inject(row).set('html', '&nbsp;');
					});
				});
				rows = tbody.getElements('tr');
				rows[0].addClass('dateNav');
				rows[1].addClass('dayNames');
				(6).times(function(i){
					rows[i+2].addClass('dayRow');
				});
				this.rows = rows;
				var dayCells = rows[1].getElements('td');
				dayCells.each(function(cell, i){
					cell.firstChild.data = Date.getMsg('days')[(i + this.options.weekStartOffset) % 7].substring(0,3);
				}, this);
				[6,5,4,3].each(function(i){ rows[0].getElements('td')[i].dispose(); });
				this.prevLnk = rows[0].getElement('td').setStyle('text-align', 'right');
				this.prevLnk.adopt(new Element('a').set('html', "&lt;").addClass('rightScroll'));
				this.month = rows[0].getElements('td')[1];
				this.month.set('colspan', 5);
				this.nextLnk = rows[0].getElements('td')[2].setStyle('text-align', 'left');
				this.nextLnk.adopt(new Element('a').set('html', '&gt;').addClass('leftScroll'));
				cal.addEvent('click', this.clickCalendar.bind(this));
				this.calendar = cal;
				this.container = new Element('div').adopt(cal).addClass('calendarHolder');
				this.content = StickyWin.ui('', this.container, $merge(this.options.stickyWinUiOptions, {
					cornerHandle: this.options.stickyWinOptions.draggable,
					width: this.calWidth
				}));
				var opts = $merge(this.options.stickyWinOptions, {
					content: this.content,
					className: 'datePickerSW',
					allowMultipleByClass: true,
					showNow: false,
					relativeTo: this.inputs.get('start')
				});
				this.stickyWin = new this.options.stickyWinToUse(opts);
				this.stickyWin.addEvent('onDisplay', this.positionClose.bind(this));
				
			}
			return this.calendar;
		},
		positionClose: function(){
			if (this.closePositioned) return;
			var closer = this.content.getElement('div.closeButton');
			if (closer) {
				closer.inject(this.container, 'after').setStyle('z-index', this.stickyWin.win.getStyle('z-index').toInt()+2);
				(function(){
					this.content.setStyle('width', this.calendar.getSize().x + (this.options.time ? 240 : 40));
					closer.position({relativeTo: this.stickyWin.win.getElement('.top'), position: 'upperRight', edge: 'upperRight'});
				}).delay(3, this);
			}
			this.closePositioned = true;
		},
		hide: function(){
			this.stickyWin.hide();
			this.fireEvent('onHide');
			return this;
		},
		hideOthers: function(){
			DatePicker.pickers.each(function(picker){
				if (picker != this) picker.hide();
			});
			return this;
		},
		show: function(){
			this.selectedDates = {};
			var dates = this.getDates(null, true);
			this.whens.each(function(when){
				this.inputDates[when] = dates[when]?dates[when].clone():dates.start?dates.start.clone():this.today;
		    this.selectedDates[when] = !this.inputDates[when] || isNaN(this.inputDates[when]) 
						? this.today 
						: this.inputDates[when].clone();
				this.getCalendar(when);
			}, this);
			this.fillCalendar(this.selectedDates.start);
			if (!this.options.showMoreThanOne) this.hideOthers();
			this.stickyWin.show();
			this.fireEvent('onShow');		
			return this;
		},
		handleScroll: function(e){
			if (e.target.hasClass('rightScroll')||e.target.hasClass('leftScroll')) {
				var newRef = e.target.hasClass('rightScroll')
					?this.rows[2].getElement('td').refDate - Date.units.day()
					:this.rows[7].getElements('td')[6].refDate + Date.units.day();
				this.fillCalendar(new Date(newRef));
				return true;
			}
			return false;
		},
		setSelectedDates: function(e, newDate){
			this.selectedDates.start = newDate;
		},
		onPick: function(){
			this.updateSelectors();
			this.inputs.each(function(input) {
				input.fireEvent("change");
				input.fireEvent("blur");
			});
			this.fireEvent('onPick');
			if (this.options.hideCalendarOnPick) this.hide();
		},
		clickCalendar: function(e) {
			if (this.handleScroll(e)) return;
			if (!e.target.firstChild || !e.target.firstChild.data) return;
			var val = e.target.firstChild.data;
			if (e.target.refDate) {
				var newDate = new Date(e.target.refDate);
				this.setSelectedDates(e, newDate);
				this.updateInput();
				this.onPick();
			}
		},
		fillCalendar: function (date) {
			if ($type(date) == "string") date = new Date(date);
			var startDate = (date)?new Date(date.getTime()):new Date();
			var hours = startDate.get('hours');
			startDate.setDate(1);
			var startDay = startDate.getDay( );						//line added
			if ( startDay < this.options.weekStartOffset ) startDay += 7;			//line added
			startDate.setTime((startDate.getTime() - (Date.units.day() * (startDay))) + 
				(Date.units.day() * this.options.weekStartOffset));
			var monthyr = new Element('span', {
				html: Date.getMsg('months')[date.getMonth()] + " " + date.getFullYear()
			});
			document.id(this.rows[0].getElements('td')[1]).empty().adopt(monthyr);
			var atDate = startDate.clone();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					atDate.set('hours', hours);
					td.firstChild.data = atDate.getDate();
					td.refDate = atDate.getTime();
					atDate.setTime(atDate.getTime() + Date.units.day());
				}, this);
			}, this);
			this.updateSelectors();
		},
		updateSelectors: function(){
			var atDate;
			var month = new Date(this.rows[5].getElement('td').refDate).getMonth();
			this.rows.each(function(row, i){
				if (i < 2) return;
				row.getElements('td').each(function(td){
					td.className = '';
					atDate = new Date(td.refDate);
					if (atDate.format("%x") == this.today.format("%x")) td.addClass('today');
					this.whens.each(function(when){
						var date = this.selectedDates[when];
						if (date && atDate.format("%x") == date.format("%x")) {
							td.addClass('selectedDate');
							this.fireEvent('selectedDateMatch', [td, when]);
						}
					}, this);
					this.fireEvent('rowDateEvaluated', [atDate, td]);
					if (atDate.getMonth() != month) td.addClass('otherMonthDate');
					atDate.setTime(atDate.getTime() + Date.units.day());
				}, this);
			}, this);
		}
	});
})();/*
Script: DatePicker.Extras.js
	Extends DatePicker to allow for range selection and time entry.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
DatePicker = Class.refactor(DatePicker, {
	options:{
		extraCSS: 'a.finish {position: relative;height: 13px !important;top: -31px !important;left: 85px !important;top: -34px;left: 77px;height: 16px;display:block;float: left;padding: 1px 12px 3px !important;}'+
			'div.calendarHolder div.time {border: #999 1px solid;width: 55px;position: relative;left: 3px;height: 17px;}'+
			'div.calendarHolder td.timeTD {width: 140px;} div.calendarHolder td.label{width:35px; text-align:right}'+
			'div.calendarHolder div.time select {font-size: 10px !important; font-size: 15px;padding: 0px;left:60px;position:absolute;top:-1px !important; width: auto !important;}'+
			'div.calendarHolder div.time input {width: 16px !important;width: 12px;padding: 2px;height: 13px;border: none !important;border: 1px solid #fff;}'+
			'div.calendarHolder div.timeSub {clear:both;position: relative;width: 65px;}'+
			'div.calendarHolder div.timeSub span {text-align: center;color: #999;margin: 5px;}'+
			'div.calendarHolder span.seperator {position:relative;top:-3px;}'+
			'div.calendarHolder table.stamp {position:relative;top: 35px !important;top: 50px;left: 0px;}'+
			'div.calendarHolder table.stamp a {left:123px;position:relative;top:9px;}'+
			'div.calendarHolder table.stamp td {border: none !important;}'+
			'div.calendarHolder td.selected_end {border-width: 1px 1px 1px 0px !important;margin: 0px 0px 0px 1px !important;}'+
			'div.calendarHolder td.selected_start {border-width: 1px 0px 1px 1px !important;margin: 0px 1px 0px 0px !important;}'+
			'div.calendarHolder table.datePicker td.range {background: #dcddef;border: solid #20397b;border-width: 1px 0px;margin: 0px 1px !important;}',
		range: false,
		time: false
	},
	initialize: function(inputs, options){
		if (options && (options.range || options.time)) {
			options = $merge({
				hideCalendarOnPick: false
			}, options);
		}
		if (options && options.time && !options.format) {
			options.format = "%x %X";
		}
		this.setOptions(options);
		this.whens = (this.options.range)?['start', 'end']:['start'];
		if ($type(inputs) == 'object') {
			this.inputs = $H(inputs);
		} else if ($type(document.id(inputs)) == "element") {
			this.inputs = $H({'start': document.id(inputs)});
		} else if ($type(inputs) == "array"){
			inputs = $$(inputs);
			this.inputs = $H({});
			this.whens.each(function(when, i){
				this.inputs.set(when, inputs[i]);
			}, this);
		}
		if (this.options.time) this.calWidth = 460;
		this.previous(inputs, this.options);
		this.createStyle(this.options.extraCSS, 'datePickerPlusStyle');
		this.addEvent('rowDateEvaluated', function(atDate, td){
			if (this.options.range && this.selectedDates.start.diff(atDate, 'minute') > 0 
					&& this.selectedDates.end.diff(atDate, 'minute') < 0) td.addClass('range');
		}.bind(this));
		this.addEvent('selectedDateMatch', function(td, when){
			if (this.options.range) td.addClass('selected_'+when);
		}.bind(this));
	},
	updateInput: function(){
		this.previous();
		if (this.options.time) this.updateView();
	},
	updateView: function() {
		this.whens.each(function(when){
			var stamp = this.stamps[when];
			var date = this.getDates()[when];
			stamp.date.set('html', date?date.format("%b. %d, %Y"):"");
			if (stamp.hr) {
				stamp.hr.set('value', date?date.format("%I"):"");
				stamp.min.set('value', date?date.format("%M"):"");
			}
		}, this);
	},
	stamps: {},
	setupWideView: function(){
		var timeStampMap = {
			hr: '%I',
			'min': '%M'
		};
		timeSetMap = {
			hr: 'setHours',
			'min':'setMinutes'
		};
		var dates = this.getDates();
	
		if (!this.options.range && !this.options.time) return;
		this.stamps.table = new Element('table', {
			'class':'stamp'
		}).inject(this.container);
		this.stamps.tbody = new Element('tbody').inject(this.stamps.table);
		this.whens.each(function(when){
			this.stamps[when] = {};
			var s = this.stamps[when]; //saving some bytes
			s.container = new Element('tr').addClass(when+'_stamp').inject(this.stamps.tbody);
			s.label = new Element('td').inject(s.container).addClass('label');
			if (this.whens.length == 1) {
				s.label.set('html', 'date:');
			} else {
				s.label.set('html', when=="start"?"from:":"to:");
			}
			s.date = new Element('td').inject(s.container);
			if (this.options.time) {
				currentWhen = dates[when]||new Date();
				s.time = new Element('tr').inject(this.stamps.tbody);
				new Element('td').inject(s.time);
				s.timeTD = new Element('td').inject(s.time);
				s.timeInputs = new Element('div').addClass('time clearfix').inject(s.timeTD);
				s.timeSub = new Element('div', {'class':'timeSub'}).inject(s.timeTD);
				['hr','min'].each(function(t, i){
					s[t] = new Element('input', {
						type: 'text',
						'class': t,
						name: t,
						events: {
							focus: function(){
								this.select();
							},
							change: function(){
								this.selectedDates[when][timeSetMap[t]](s[t].get('value'));
								this.selectedDates[when].setAMPM(s.ampm.get('value'));
								this.updateInput();
							}.bind(this)
						}
					}).inject(s.timeInputs);
					s[t].set('value', currentWhen.format(timeStampMap[t]));
					if (i < 1) s.timeInputs.adopt(new Element('span', {'class':'seperator'}).set('html', ":"));
					new Element('span', {
						'class': t
					}).set('html', t).inject(s.timeSub);
				}, this);
				s.ampm = new Element('select').inject(s.timeInputs);
				['AM','PM'].each(function(ampm){
					var opt = new Element('option', {
						value: ampm,
						text: ampm.toLowerCase()
					}).set('html', ampm).inject(s.ampm);
					if (ampm == currentWhen.format("%p")) opt.selected = true;
				});
				s.ampm.addEvent('change', function(){
					var date = this.getDates()[when];
					var ampm = s.ampm.get('value');
					if (ampm != date.format("%p")) {
						date.setAMPM(ampm);
						this.updateInput();
					}
				}.bind(this));
			}
		}, this);
		new Element('tr').inject(this.stamps.tbody).adopt(new Element('td', {colspan: 2}).adopt(new Element('a', {
			'class':'closeSticky button',
			events: {
				click: function(){
					this.hide();
				}.bind(this)
			}
		}).set('html', 'Ok')));
	},
	show: function(){
		this.previous();
		if (this.options.time) {
			if (!this.stamps.table) this.setupWideView();
			this.updateView();
		}
	},
	startSet: false,
	onPick: function(){
		if ((this.options.range && this.selectedDates.start && this.selectedDates.end) || !this.options.range) {
			this.previous();
		}
	},
	setSelectedDates: function(e, newDate) {
		if (this.options.range) {
			if (this.selectedDates.start && this.startSet) {
				if (this.selectedDates.start.getTime() > newDate.getTime()){
					this.selectedDates.end = new Date(this.selectedDates.start);
					this.selectedDates.start = newDate;
				} else {
					this.selectedDates.end = newDate;
				}
				this.startSet = false;
			} else {
				this.selectedDates.start = newDate;
				if (this.selectedDates.end && this.selectedDates.start.getTime() > this.selectedDates.end.getTime())
					this.selectedDates.end = new Date(newDate);
				this.startSet = true;
			}
		} else {
			this.previous(e, newDate);
		}
		if (this.options.time) {
			this.whens.each(function(when){
				var hr = this.stamps[when].hr.get('value').toInt();
				if (this.stamps[when].ampm.get('value') == "PM" && hr < 12) hr += 12;
				this.selectedDates[when].setHours(hr);
				this.selectedDates[when].setMinutes(this.stamps[when]['min'].get('value')||"0");
				this.selectedDates[when].setAMPM(this.stamps[when].ampm.get('value')||"AM");
			}, this);
		}
	}
});Form.Validator.Tips = new Class({
	Extends: Form.Validator.Inline,
	options: {
		pointyTipOptions: {
			point: "left",
			width: 250
		}
//		tipCaption: ''
	},
	showAdvice: function(className, field){
		var advice = this.getAdvice(field);
		if (advice && !advice.visible){
			advice.show();
			advice.position();
			advice.pointy.positionPointer();
		}
	},
	hideAdvice: function(className, field){
		var advice = this.getAdvice(field);
		if (advice && advice.visible) advice.show();
	},
	getAdvice: function(className, field) {
		var params = Array.link(arguments, {field: Element.type});
		return params.field.retrieve('PointyTip');
	},
	advices: [],
	makeAdvice: function(className, field, error, warn){
		if (!error && !warn) return;
		var advice = field.retrieve('PointyTip');
		if (!advice){
			var cssClass = warn?'warning-advice':'validation-advice';
			var msg = new Element('ul', {
				styles: {
					margin: 0,
					padding: 0,
					listStyle: 'none'
				}
			});
			var li = this.makeAdviceItem(className, field);
			if (li) msg.adopt(li);
			field.store('validationMsgs', msg);
			advice = new StickyWin.PointyTip(this.options.tipCaption, msg, $merge(this.options.pointyTipOptions, {
				showNow: false,
				relativeTo: field,
				inject: {
					target: this.element
				}
			}));
			this.advices.push(advice);
			advice.msgs = {};
			field.store('PointyTip', advice);
			document.id(advice).addClass(cssClass).set('id', 'advice-'+className+'-'+this.getFieldId(field));			
		}
		field.store('advice-'+className, advice);
		this.appendAdvice(className, field, error, warn);
		advice.pointy.positionPointer();
		return advice;
	},
	validateField: function(field, force){
		var advice = this.getAdvice(field);
		var anyVis = this.advices.some(function(a){ return a.visible; });
		if (anyVis && this.options.serial) {
			if (advice && advice.visible) {
				var passed = this.parent(field, force);
				if (!field.hasClass('validation-failed')) advice.hide();
			}
			return passed;
		}
		var msgs = field.retrieve('validationMsgs');
		if (msgs) msgs.getChildren().hide();
		if ((field.hasClass('validation-failed') || field.hasClass('warning')) && advice) advice.show();
		if (this.options.serial) {
			var fields = this.element.getElements('.validation-failed, .warning');
			if (fields.length) {
				fields.each(function(f, i) {
					var adv = this.getAdvice(f);
					if (adv) adv.hide();
				}, this);
			}
		}
		return this.parent(field, force);
	},
	makeAdviceItem: function(className, field, error, warn){
		if (!error && !warn) return;
		var advice = this.getAdvice(field);
		var errorMsg = this.makeAdviceMsg(field, error, warn);
		if (advice && advice.msgs[className]) return advice.msgs[className].set('html', errorMsg);
		return new Element('li', {
			html: errorMsg,
			style: {
				display: 'none'
			}
		});
	},
	makeAdviceMsg: function(field, error, warn){
		var errorMsg = (warn)?this.warningPrefix:this.errorPrefix;
			errorMsg += (this.options.useTitles) ? field.title || error:error;
		return errorMsg;
	},
	appendAdvice: function(className, field, error, warn) {
		var advice = this.getAdvice(field);
		if (advice.msgs[className]) return advice.msgs[className].set('html', this.makeAdviceMsg(field, error, warn)).show();
		var li = this.makeAdviceItem(className, field, error, warn);
		if (!li) return;
		li.inject(field.retrieve('validationMsgs')).show();
		advice.msgs[className] = li;
	},
	insertAdvice: function(advice, field){
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !document.id(props.msgPos)) {
			switch (field.type.toLowerCase()) {
				case 'radio':
					var p = field.getParent().adopt(advice);
					break;
				default: 
					document.id(advice).inject(document.id(field), 'after');
			};
		} else {
			document.id(props.msgPos).grab(advice);
		}
		advice.position();
	}
});

if (window.FormValidator) FormValidator.Tips = Form.Validator.Tips;/*
Script: Form.Request.Prompt.js
	Prompts the user with the contents of a form (retrieved via ajax) and updates a DOM element with the result of the submission.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	
	var prompter = function(ext){
		return {
			Extends: ext,
			options: {
				//onUpdate: $empty,
				stickyWinToUse: StickyWin.Modal,
				stickyWinOptions: {},
				caption: 'Update Info',
				useUi: true,
				stickyWinUiOptions: {
					width: 500
				},
				useSpinner: true
			},
			initialize: function(form, update, options){
				this.setOptions(options);
				this.update = document.id(update);
				this.makeStickyWin(form);
				this.swin.addEvent('close', function(){
					if (this.request && this.request.spinner) this.request.spinner.hide();
				});
				this.addEvent('success', this.hide.bind(this));
			},
			makeStickyWin: function(form){
				if (document.id(form)) form = document.id(form);
				this.swin = new this.options.stickyWinToUse({
					content: this.options.useUi?StickyWin.ui(this.options.caption, form, this.options.stickyWinUiOptions):form,
					showNow: false
				});
				this.element = this.swin.win.getElement('form');
				this.initAfterUpdate();
			},
			hide: function(){
				this.swin.hide();
				return this;
			},
			prompt: function(){
				this.swin.show();
				return this;
			},
			initAfterUpdate: function(){
				this.setOptions({
					requestOptions: {
						useSpinner: this.options.useWaiter || this.options.useSpinner,
						spinnerTarget: document.id(this),
						spinnerOptions: {
							layer: {
								styles: {
									zIndex: 10001
								}
							}
						}
					}
				});
				this.makeRequest();
				this.attach();
				document.id(this).store('form.request', this);
			}
		};
	};
	
	Form.Request.Prompt = new Class(prompter(Form.Request));
	if (Form.Request.Append) Form.Request.Append.Prompt = new Class(prompter(Form.Request.Append));
	
	
	var ajaxPrompter = function(ext) {
		return {
			Extends: ext,
			options: {
				stickyWinToUse: StickyWin.Modal.Ajax
			},
			makeStickyWin: function(formUrl){
				if (this.swin) return this.swin;
				this.swin = new this.options.stickyWinToUse($merge({
					showNow: false,
					requestOptions: this.options.requestOptions,
					onHide: function(){
						this.win.empty();
					},
					url: formUrl,
					handleResponse: function(response) {
						var responseScript = "";
						this.swin.Request.response.text.stripScripts(function(script){	responseScript += script; });
						var content = this.options.useUi?StickyWin.ui(this.options.caption, response, this.options.stickyWinUiOptions):response;
						this.swin.setContent(content);
						if (this.options.requestOptions.evalScripts) $exec(responseScript);
						this.element = this.swin.win.getElement('form');
						this.initAfterUpdate();
						this.swin.show();
					}.bind(this)
				}, this.options.stickyWinOptions));
				return this.swin;
			},
			prompt: function(){
				this.makeStickyWin().update();
				return this;
			}
		};
	};

	Form.Request.AjaxPrompt = new Class(ajaxPrompter(Form.Request.Prompt));
	if (Form.Request.Append) Form.Request.Append.AjaxPrompt = new Class(ajaxPrompter(Form.Request.Append.Prompt));
})();/*
Script: InputFocus.js
	Adds a focused css class to inputs when they have focus.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var InputFocus = new Class({
	Implements: [Options, Class.Occlude, Class.ToElement],
	Binds: ['focus', 'blur'],
	options: {
		focusedClass: 'focused',
		hideOutline: false
	},
	initialize: function(input, options) {
		this.element = document.id(input);
		if (this.occlude('focuser')) return this.occluded;
		this.setOptions(options);
		this.element.addEvents({
			focus: this.focus,
			blur: this.blur
		});
	},
	focus: function(){
		if (this.options.hideOutline) {
			(function(){
				if (Browser.Engine.trident) document.id(this).set('hideFocus', true);
				else document.id(this).setStyle('outline', '0');
			}).delay(500, this);
		}
		document.id(this).addClass(this.options.focusedClass);
	},
	blur: function(){
		document.id(this).removeClass(this.options.focusedClass);
	}
});/*
Script: ProductPicker.js
	Allows the user to pick a product from a data source.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Picklet = new Class({
	Implements: [Options, Events],
/*	options: {
		onShow: $empty
	}, */
	inputElements : {},
	initialize: function(className, options){
		this.setOptions(options);
		this.className = className;
		this.getQuery = this.options.getQuery;
	}
});
var ProductPicker = new Class({
	Implements: [Options, Events, StyleWriter],
	options: {
//	onShow: $empty,
//	onPick: $empty,
		title: 'Product picker',
		showOnFocus: true,
		additionalShowLinks: [],
		stickyWinToUse: StickyWin,
		stickyWinOptions: {
			fadeDuration: 200,
			draggable: true,
			width: 450
		},
		moveIntoView: true,
		css: "div.productPickerProductDiv div.results { overflow: 'auto'; width: 100%; margin-top: 4px }"+
			"div.productPickerProductDiv select { margin: 4px 0px 4px 0px}"+
			"div.pickerPreview div.sliderContent img {border: 1px solid #000}"+
			"div.pickerPreview div.sliderContent a {color: #0d63a0}" + 
			"div.productPickerProductDiv * {color: #000}" +
			".tool-tip { color: #fff; width: 172px; z-index: 13000; }" +
			".tool-title { font: Verdana, Arial, Helvetica, sans-serif; font-weight: bold; font-size: 11px; margin: 0; padding: 8px 8px 4px; background: url(%tipsArt%/bubble.png) top left !important; background: url(%tipsArt%/bubble.gif) top left; }" +
			".tool-text {font-size: 11px; margin: 0px; padding: 4px 8px 8px; background: url(%tipsArt%/bubble.png) bottom right !important; background: url(%tipsArt%/bubble.gif) bottom right; }"
	},
	initialize: function(input, picklets, options){
		this.setOptions(options);
		this.writeCss();
		this.input = document.id(input);
		if (!this.input) return;
		this.picklets = picklets;
		this.setUpObservers();
	},
	writeCss: function(){
		var art = this.options.baseHref || Clientcide.assetLocation + '/Picker';
		var tipsArt = art.replace("Picker", "tips");
		this.createStyle(this.options.css.replace("%tipsArt%", tipsArt, "g"), 'pickerStyles');
	},
	getPickletList: function(){
		if (this.picklets.length>1) {
			var selector = new Element('select').setStyle('width', 399);
			this.picklets.each(function(picklet, index){
				var opt = new Element('option').set('value',index);
				opt.text = picklet.options.descriptiveName;
				selector.adopt(opt);
			}, this);
			selector.addEvent('change', function(){
				this.showForm(this.picklets[selector.getSelected()[0].get('value')]);
				this.focusInput(true);
			}.bind(this));
			return selector;
		} else return false;
	},
	buildPicker: function(picklet){
		var contents = new Element('div');
		this.formBody = new Element('div');
		this.pickletList = this.getPickletList();
		if (this.pickletList) contents.adopt(this.pickletList);
		contents.adopt(this.formBody);
		var body = StickyWin.ui(this.options.title, contents, {
			width: this.options.stickyWinOptions.width,
			closeTxt: 'close'
		}).addClass('productPickerProductDiv');
		this.showForm();
		return body;
	},
	showForm: function(picklet){
		this.form = this.makeSearchForm(picklet || this.picklets[0]);
		this.formBody.empty().adopt(this.form);
		(picklet || this.picklets[0]).fireEvent('onShow');
		this.results = new Element('div').addClass('results');
		this.formBody.adopt(this.results);
		this.sliderFx = null;
		this.fireEvent("onShow");
	},
	makeSlider: function(){
		var png = (Browser.Engine.trident)?'gif':'png';
		this.slider = new Element('div', {
			styles: {
				background:'url('+this.options.baseHref+'/slider.'+png+') top right no-repeat',
				display: 'none',
				height:250,
				left:this.options.stickyWinOptions.width - 11,
				position:'absolute',
				top:25,
				width:0,
				overflow: 'hidden'
			}
		}).addClass('pickerPreview').inject(this.swin.win).addEvents({
			mouseover: function(){
				this.previewHover = true;
			}.bind(this),
			mouseout: function(){
				this.previewHover = false;
				(function(){if (!this.previewHover) this.hidePreview();}).delay(400, this);
			}.bind(this)
		});
		this.sliderContent = new Element('div', {
			styles: {
				width: 130,
				height: 200,
				padding: 10,
				margin: '10px 10px 0px 0px',
				overflow: 'auto',
				cssFloat: 'right'
			}
		}).inject(this.slider).addClass('sliderContent');
	},
	makeSearchForm: function(picklet){
		this.currentPicklet = picklet;
		var formTable = new Element('table', {
			styles: {
				width: "100%",
				cellpadding: '0',
				cellspacing: '0'
			}
		});
		var tBody = new Element('tbody').inject(formTable);
		var form = new Element('form').addEvent('submit', function(e){
			this.getResults(e.target, picklet);
		}.bind(this)).adopt(formTable).set('action','javascript:void(0);');
		$each(picklet.options.inputs, function(val, name){
			var ins = this.getSearchInputTr(val, name);
			tBody.adopt(ins.holder);
			picklet.inputElements[name] = ins.input;
		}, this);
		return form;
	},
	getSearchInputTr: function(val, name){
		try{
			var style = ($type(val.style))?val.style:{};
			//create the input object
			//this is I.E. hackery, because IE does not let you set the name of a DOM element.
			//thanks MSFT.
			var input = (Browser.Engine.trident)?new Element('<' + val.tagName + ' name="' + name + '" />'):
					new Element(val.tagName, {name: name});
			input.setStyles(style);
			if (val.type)input.set('type', val.type);
			if (val.tip && Tips){
				input.set('title', val.tip);
				new Tips([input], {
					onShow: function(tip){
						this.shown = true;
						(function(){
							if (!this.shown) return;
							document.id(tip).setStyles({ display:'block', opacity: 0 });
							new Fx.Tween(tip, {property: 'opacity', duration: 300 }).start(0,0.9);
						}).delay(500, this);
					},
					onHide: function(tip){
						tip.setStyle('visibility', 'hidden');
						this.shown = false;
					}
				});
			}
			if (val.tagName == "select"){
				val.value.each(function(option, index){
					var opt = new Element('option',{ value: option });
					opt.text = (val.optionNames && val.optionNames[index])?$pick(val.optionNames[index], option):option;
					input.adopt(opt);
				});
			} else {
				input.set('value', $pick(val.value,""));
			}
			var holder = new Element('tr');
			var colspan=0;
			if (val.instructions) holder.adopt(new Element('td').set('html', val.instructions));
			else colspan=2;
			var inputTD = new Element('td').adopt(input);
			if (colspan) inputTD.set('colspan', colspan);
			holder.adopt(inputTD);
			return { holder : holder, input : input};
		}catch(e){dbug.log(e); return false;}
	},
	getResults: function(form, picklet){
		if (form.get('tag') != "form") form = $$('form').filter(function(fm){ return fm.hasChild(form); })[0];
		if (!form) {
			dbug.log('error computing form');
			return null;
		}
		var query = picklet.getQuery(unescape(form.toQueryString()).parseQueryString());
		query.addEvent('onComplete', this.showResults.bind(this));
		query.send();
		return this;
	},
	showResults: function(data){
		var empty = false;
		if (this.results.innerHTML=='') {
			empty = true;
			this.results.setStyles({
				height: 0,
				border: '1px solid #666',
				padding: 0,
				overflow: 'auto',
				opacity: 0
			});
		} else this.results.empty();
		this.items = this.currentPicklet.options.resultsList(data);
		if (this.items && this.items.length > 0) {
			this.items.each(function(item, index){
				var name = this.currentPicklet.options.listItemName(item);
				var value = this.currentPicklet.options.listItemValue(item);
				this.results.adopt(this.makeProductListEntry(name, value, index));
			}, this);
		} else {
			this.results.set('html', "Sorry, there don't seem to be any items for that search");
		}
		this.results.morph({ height: 200, opacity: 1 });
		this.listStyles();
		this.getOnScreen.delay(500, this);
	},
	getOnScreen: function(){
		if (document.compatMode == "BackCompat") return;
		var s = this.swin.win.getCoordinates();
		if (s.top < window.getScroll().y) {
			this.swin.win.tween('top', window.getScroll().y+50);
			return;
		}
		if (s.top+s.height > window.getScroll().y+window.getSize().y && window.getSize().y>s.height) {
			this.swin.win.tween('top', window.getScroll().y+window.getSize().y-s.height-100);
			return;
		}
		try{this.swin.shim.show.delay(500, this.swin.shim);}catch(e){}
		return;
	},
	listStyles: function(){
		var defaultStyle = {
			cursor: 'pointer',
			borderBottom: '1px solid #ddd',
			padding: '2px 8px 2px 8px',
			backgroundColor:'#fff',
			color: '#000',
			fontWeight: 'normal'
		};
		var hoverStyle = {
			backgroundColor:'#fcfbd1',
			color: '#d56a00'
		};
		var selectedStyle = $extend(defaultStyle, {
			color: '#D00000',
			fontWeight: 'bold',
			backgroundColor: '#eee'
		});
		this.results.getElements('div.productPickerProductDiv').each(function(p){
			var useStyle = (this.input.value.toInt() == p.get('val').toInt())?selectedStyle:defaultStyle;
			p.setStyles(useStyle);
			if (!Browser.Engine.trident) {//ie doesn't like these mouseover behaviors...
				p.addEvent('mouseover', function(){ p.setStyles(hoverStyle); }.bind(this));
				p.addEvent('mouseout', function(){ p.setStyles(useStyle); });
			}
		}, this);
	},
	makeProductListEntry: function(name, value, index){
		var pDiv = new Element("div").addClass('productPickerProductDiv').adopt(
				new Element("div").set('html', name)
			).set('val', value);
		pDiv.addEvent('mouseenter', function(e){
			this.preview = true;
			this.sliderContent.empty();
			var content = this.getPreview(index);
			if ($type(content)=="string") this.sliderContent.set('html', content);
			else if (document.id(content)) this.sliderContent.adopt(content);
			this.showPreview.delay(200, this);
		}.bind(this));
		pDiv.addEvent('mouseleave', function(e){
			this.preview = false;
			(function(){if (!this.previewHover) this.hidePreview();}).delay(400, this);
		}.bind(this));
		pDiv.addEvent('click', function(){
			this.currentPicklet.options.updateInput(this.input, this.items[index]);
			this.fireEvent('onPick', [this.input, this.items[index], this]);
			this.hide();
			this.listStyles.delay(200, this);
		}.bind(this));
		return pDiv;
	},
	makeStickyWin: function(){
		if (document.compatMode == "BackCompat") this.options.stickyWinOptions.relativeTo = this.input;
		this.swin = new this.options.stickyWinToUse($merge(this.options.stickyWinOptions, {
			draggable: true,
			content: this.buildPicker()
		}));
	},
	focusInput: function(force){
		if ((!this.focused || $pick(force,false)) && this.form.getElement('input')) {
			this.focused = true;
			try { this.form.getElement('input').focus(); } catch(e){}
		}
	},
	show: function(){
		if (!this.swin) this.makeStickyWin();
		if (!this.slider) this.makeSlider();
		if (!this.swin.visible) this.swin.show();
		this.focusInput();
		return this;
	},
	hide: function(){
		$$('.tool-tip').hide();
		this.swin.hide();
		this.focused = false;
		return this;
	},
	setUpObservers: function(){
		try {
			if (this.options.showOnFocus) this.input.addEvent('focus', this.show.bind(this));
			if (this.options.additionalShowLinks.length>0) {
				this.options.additionalShowLinks.each(function(lnk){
					document.id(lnk).addEvent('click', this.show.bind(this));
				}, this);
			}
		}catch(e){dbug.log(e);}
	},
	showPreview: function(index){
		width = this.currentPicklet.options.previewWidth || 150;
		this.sliderContent.setStyle('width', (width-30));
		if (!this.sliderFx) this.sliderFx = new Fx.Elements([this.slider, this.swin.win]);
		this.sliderFx.clearChain();
		this.sliderFx.setOptions({
			duration: 1000, 
			transition: 'elastic:out'
		});
		if (this.preview && this.slider.getStyle('width').toInt() < width-5) {
			this.slider.show('block');
			this.sliderFx.start({
				'0':{//the slider
					'width':width
				},
				'1':{//the popup window (for ie)
					'width':width+this.options.stickyWinUiOptions.width
				}
			});
		}
	},
	hidePreview: function(){
		if (!this.preview) {
			this.sliderFx.setOptions({
				duration: 250, 
				transition: 'back:in'
			});
			this.sliderFx.clearChain();
			this.sliderFx.start({
				'0':{//the slider
					'width':[this.slider.getStyle('width').toInt(),0]
				},
				'1':{//the popup window (for ie)
					'width':[this.swin.win.getStyle('width').toInt(), this.options.stickyWinUiOptions]
				}
			}).chain(function(){
				this.slider.hide();
			}.bind(this));
		}
	},
	getPreview: function(index){
		return this.currentPicklet.options.previewHtml(this.items[index]);
	}
});


$extend(ProductPicker, {
	picklets: [],
	add: function(picklet){
		if (! picklet.className) {
			dbug.log('error: cannot add Picklet %o; missing className: %s', picklet, picklet.className);
			return;
		}
		this.picklets[picklet.className] = picklet;
	},
	addAllThese: function(picklets){
		picklets.each(function(picklet){
			this.add(picklet);
		}, this);
	},
	getPicklet: function(className){
		return ProductPicker.picklets[className]||false;
	}
});

var FormPickers = new Class({
	Implements: [Options],
	options: {
		inputs: 'input',
		additionalShowLinkClass: 'openPicker',
		pickletOptions: {}
	},
	initialize: function(form, options){
		this.setOptions(options);
		this.form = document.id(form);
		this.inputs = this.form.getElements(this.options.inputs);
		this.setUpInputs();
	},
	setUpInputs: function(inputs){
		inputs = $pick(inputs, this.inputs);
		inputs.each(this.addPickers.bind(this));
	},
	addPickers: function(input){
		var picklets = [];
		input.className.split(" ").each(function(clss){
			if (ProductPicker.getPicklet(clss)) picklets.push(ProductPicker.getPicklet(clss));
		}, this);
		if (input.getNext() && input.getNext().hasClass(this.options.additionalShowLinkClass))
			this.options.pickletOptions.additionalShowLinks = [input.getNext()];
		if (picklets.length>0)	new ProductPicker(input, picklets, this.options.pickletOptions);
	}
});/*
Script: SimpleEditor.js
	A simple html editor for wrapping text with links and whatnot.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var SimpleEditor = new Class({
	Implements: [Class.ToElement, Class.Occlude],
	property: 'SimpleEditor',
	initialize: function(input, buttons, commands){
		this.element = document.id(input);
		if (this.occlude()) return this.occluded;
		this.commands = new Hash($extend(SimpleEditor.commands, commands||{}));
		this.buttons = $$(buttons);
		this.buttons.each(function(button){
			button.addEvent('click', function() {
				this.exec(button.get('rel'));
			}.bind(this));
		}.bind(this));
		document.id(this).addEvent('keydown', function(e){
			if (e.control||e.meta) {
				var key = this.shortCutToKey(e.key, e.shift);
				if (key) {
					e.stop();
					this.exec(key);
				}
			}
		}.bind(this));
	},
	shortCutToKey: function(shortcut, shift){
		var returnKey = false;
		this.commands.each(function(value, key){
			var ch = (value.shortcut ? value.shortcut.toLowerCase() : value.shortcut);
			if (value.shortcut == shortcut || (shift && ch == shortcut)) returnKey = key;
		});
		return returnKey;
	},
	addCommand: function(key, command, shortcut){
		this.commands.set(key, {
			command: command,
			shortcut: shortcut
		});
	},
	addCommands: function(commands){
		this.commands.extend(commands);
	},
	exec: function(key){
		var currentScrollPos; 
		if (document.id(this).scrollTop || document.id(this).scrollLeft) {
			currentScrollPos = {
				scrollTop: document.id(this).getScroll().y,
				scrollLeft: document.id(this).getScroll().x
			};
		}
		if (this.commands.has(key)) this.commands.get(key).command(document.id(this));
		if (currentScrollPos) {
			document.id(this).set('scrollTop', currentScrollPos.getScroll().y);
			document.id(this).set('scrollLeft', currentScrollPos.getScroll().x);
		}
	}
});
$extend(SimpleEditor, {
	commands: {},
	addCommand: function(key, command, shortcut){
		SimpleEditor.commands[key] = {
			command: command,
			shortcut: shortcut
		}
	},
	addCommands: function(commands){
		$extend(SimpleEditor.commands, commands);
	}
});
SimpleEditor.addCommands({
	bold: {
		shortcut: 'b',
		command: function(input){
			input.insertAroundCursor({before:'<strong>',after:'</strong>'});
		}
	},
	underline: {
		shortcut: 'u',
		command: function(input){
			input.insertAroundCursor({before:'<span style="text-decoration:underline">',after:'</span>'});
		}
	},
	anchor: {
		shortcut: 'l',
		command: function(input){
			if (window.TagMaker){
				if (!this.linkBuilder) this.linkBuilder = new TagMaker.anchor();
				this.linkBuilder.prompt(input);
			} else {
				var href = window.prompt(SimpleEditor.getMsg('linkURL'));
				var opts = {before: '<a href="'+href+'">', after:'</a>'};
				if (!input.getSelectedText()) opts.defaultMiddle = window.prompt(SimpleEditor.getMsg('linkText'));
				input.insertAroundCursor(opts);
			}
		}
	},
	hr: {
		shortcut: '-',
		command: function(input){
			input.insertAtCursor('\n<hr/>\n');
		}
	},
	img: {
		shortcut: 'g',
		command: function(input){
			if (window.TagMaker) {
				if (!this.anchorBuilder) this.anchorBuilder = new TagMaker.image();
				this.anchorBuilder.prompt(input);
			} else {
				var href = window.prompt(SimpleEditor.getMsg('imgURL'));
				var alt = window.prompt(SimpleEditor.getMsg('imgAlt'));
				input.insertAtCursor('<img src="'+href+'" alt="'+alt.replace(/"/g,'')+'" />');
			}
		}
	},
	stripTags: {
		shortcut: '\\',
		command: function(input){
			input.insertAtCursor(input.getSelectedText().stripTags());
		}
	},
	sup: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<sup>', after: '</sup>'});
		}
	},
	sub: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<sub>', after: '</sub>'});
		}
	},
	blockquote: {
		shortcut: false,
		command: function(input){
			input.insertAroundCursor({before:'<blockquote>', after: '</blockquote>'});
		}
	},
	paragraph: {
		shortcut: 'enter',
		command: function(input){
			input.insertAroundCursor({before:'\n<p>\n', after: '\n</p>\n'});
		}
	},
	strike: {
		shortcut: 'k',
		command: function(input){
			input.insertAroundCursor({before:'<strike>',after:'</strike>'});
		}
	},
	italics: {
		shortcut: 'i',
		command: function(input){
			input.insertAroundCursor({before:'<em>',after:'</em>'});
		}
	},
	bullets: {
		shortcut: '8',
		command: function(input){
			input.insertAroundCursor({before:'<ul>\n	<li>',after:'</li>\n</ul>'});
		}
	},
	numberList: {
		shortcut: '=',
		command: function(input){
			input.insertAroundCursor({before:'<ol>\n	<li>',after:'</li>\n</ol>'});
		}
	},
	clean: {
		shortcut: false,
		command: function(input){
			input.tidy();
		}
	},
	preview: {
		shortcut: false,
		command: function(input){
			try {
				if (!this.container){
					this.container = new Element('div', {
						styles: {
							border: '1px solid black',
							padding: 8,
							height: 300,
							overflow: 'auto'
						}
					});
					this.preview = new StickyWin.Modal({
						content: StickyWin.ui("preview", this.container, {
							width: 600,
							buttons: [{
								text: 'close',
								onClick: function(){
									this.container.empty();
								}.bind(this)
							}]
						}),
						showNow: false
					});
				}
				this.container.set('html', input.get('value'));
				this.preview.show();
			} catch(e){dbug.log('you need StickyWin.Modal and StickyWin.ui')}
		}
	}
});
SimpleEditor.getMsg = function(key, language){
	return MooTools.lang.get('SimpleEditor', key, args);
};/*
Script: TagMaker.js
	Prompts the user to fill in the gaps to create an html tag output.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var TagMaker = new Class({
	Implements: [Options, Events, StyleWriter],
	options: {
		name: "Tag Builder",
		output: '',
		picklets: {},
		help: {},
		example: {},
		'class': {},
		selectLists: {},
		width: 400,
		maxHeight: 500,
		clearOnPrompt: true,
		css: "table.trinket {	width: 98%;	margin: 0px auto;	font-size: 10px; }"+
					"table.trinket td {	vertical-align: top;	padding: 4px;}"+
					"table.trinket td a.button {	position: relative;	top: -2px;}"+
					"table.trinket td.example {	font-size: 9px;	color: #666;	text-align: right;	border-bottom: 1px solid #ddd;"+
						"padding-bottom: 6px;}"+
					"table.trinket div.validation-advice {	background-color: #a36565;	font-weight: bold;	color: #fff;	padding: 4px;"+
						"margin-top: 3px;}"+
					"table.trinket input.text {width: 100%;}"+
					".tagMakerTipElement { 	cursor: help; }"+
					".tagMaker .tip {	color: #fff;	width: 172px;	z-index: 13000; }"+
					".tagMaker .tip-title {	font-weight: bold;	font-size: 11px;	margin: 0;	padding: 8px 8px 4px;"+
							"background: url(%baseHref%/bubble.png) top left;}"+
					".tagMaker .tip-text { font-size: 11px; 	padding: 4px 8px 8px; "+
							"background: url(%baseHref%/bubble.png) bottom right; }"+
					".tagMaker { z-index:10001 }"
//	onPrompt: $empty,
//	onChoose: $empty
	},
	initialize: function(options){
		this.setOptions(options);
		this.buttons = [
			{
				text: 'Paste',
				onClick: function(){
					if (this.validator.validate()) this.insert();
				}.bind(this),
				properties: {
					'class': 'tip',
					title: 'Paste::Insert the html into the field you are editing'
				}
			},
			{
				text: 'Close',
				properties: {
					'class': 'closeSticky tip',
					title: 'Close::Close this popup'
				}
			}
		];
		this.createStyle(this.options.css.replace("%baseHref%", this.options.baseHref || Clientcide.assetLocation + '/tips', "g"), 'defaultTagBuilderStyle');
	},
	prompt: function(target){
		this.target = document.id(target);
		var content = this.getContent();
		if (this.options.clearOnPrompt) this.clear();
		if (content) {
				var relativeTo = (document.compatMode == "BackCompat" && this.target)?this.target:document.body;
				if (!this.win) {
					this.win = new StickyWin({
						content: content,
						draggable: true,
						relativeTo: relativeTo,
						onClose: function(){
							$$('.tagMaker-tip').hide();
						}
					});
				}
				if (!this.win.visible) this.win.show();
		}
		var innerText = this.getInnerTextInput();
		this.range = target.getSelectedRange();
		if (innerText) innerText.set('value', target.getTextInRange(this.range.start, this.range.end)||"");
		return this.fireEvent('onPrompt');
	},
	clear: function(){
		this.body.getElements('input').each(function(input){
			input.erase('value');
		});
	},
	getKeys: function(text) {
		return text.split('%').filter(function(inputKey, index){
				return index%2;
		});
	},
	getInnerTextInput: function(){
		return this.body.getElement('input[name=Inner-Text]');
	},
	getContent: function(){
		var opt = this.options; //save some bytes
		if (!this.form) { //if the body hasn't been created, create it
			this.form = new Element('form');
			var table = new HtmlTable({properties: {'class':'trinket'}});
			this.getKeys(opt.output).each(function(inputKey) {
				var input;
				if (this.options.selectLists[inputKey]){
					input = new Element('select').setProperties({
						name: inputKey.replace(' ', '-', 'g')
					}).addEvent('change', this.createOutput.bind(this));
					this.options.selectLists[inputKey].each(function(opt){
						var option = new Element('option').inject(input);
						if (opt.selected) option.set('selected', true);
						option.set('value', opt.value);
						option.set('text', opt.key);
					}, this);
					table.push([inputKey, input]);
				} else {
					input = new Element('input', {
						type: 'text',
						name: inputKey.replace(/ /g, '-'),
						title: inputKey+'::'+opt.help[inputKey],
						'class': 'text tip ' + ((opt['class'])?opt['class'][inputKey]||'':''),
						events: {
							keyup: this.createOutput.bind(this),
							focus: function(){this.select();},
							change: this.createOutput.bind(this)
						}
					});
					if (opt.picklets[inputKey]) {
						var a = new Element('a').addClass('button').set('html', 'choose');
						var div = new Element('div').adopt(input.setStyle('width',160)).adopt(a);
						var picklets = ($type(opt.picklets[inputKey]) == "array")?opt.picklets[inputKey]:[opt.picklets[inputKey]];
						new ProductPicker(input, picklets, {
							showOnFocus: false, 
							additionalShowLinks: [a],
							onPick: function(input, data, picker){
								try {
									var ltInput = this.getInnerTextInput();
									if (ltInput && !ltInput.get('value')) {
										try {
											ltInput.set('value', picker.currentPicklet.options.listItemName(data));
										}catch (e){dbug.log('set value error: ', e);}
									}
									var val = input.value;
									if (inputKey == "Full Path" && val.test(/^http:/))
											input.set('value', val.substring(val.indexOf('/', 7), val.length));
									this.createOutput();
								} catch(e){dbug.log(e);}
							}.bind(this)
						});
						table.push([inputKey, div]);
					} else table.push([inputKey, input]);
				}
				//[{content: <content>, properties: {colspan: 2, rowspan: 3, 'class': "cssClass", style: "border: 1px solid blue"}]
				if (this.options.example[inputKey]) 
					table.push([{content: 'eg. '+this.options.example[inputKey], properties: {colspan: 2, 'class': 'example'}}]);
			}, this);
			this.resultInput = new Element('input', {
					type: 'text',
					title: 'HTML::This is the resulting tag html.',
					'class': 'text result tip'
				}).addEvent('focus', function(){this.select();});
			table.push(['HTML', this.resultInput]).tr;
			this.form.adopt($(table));
			this.body = new Element('div', {
				styles: {
					overflow:'auto',
					maxHeight: this.options.maxHeight
				}
			}).adopt(this.form);

			this.validator = new Form.Validator.Inline(this.form);
			this.validator.insertAdvice = function(advice, field){
				var p = document.id(field.parentNode);
				if (p) p.adopt(advice);
			};
		}

		if (!this.content) {
			this.content = StickyWin.ui(this.options.name, this.body, {
				buttons: this.buttons,
				width: this.options.width.toInt()
			});
			new Tips(this.content.getElements('.tip'), {
				showDelay: 700,
				maxTitleChars: 50, 
				maxOpacity: 0.9,
				className: 'tagMaker'
			});
		}
		return this.content;

	},
	createOutput: function(){
		var inputs = this.form.getElements('input, select');
		var html = this.options.output;
		inputs.each(function(input) {
			if (!input.hasClass('result')) {
				html = html.replace(new RegExp('%'+input.get('name').replace('-', ' ', 'g').toLowerCase()+'%', 'ig'),
					(input.get('tag')=='select'?input.getSelected()[0]:input).get('value'));
				html = html.replace(/\s\w+\=""/g, "");
			}
		});
		return this.resultInput.value = html;
	},
	insert: function(){
		if (!this.target) {
			StickyWin.alert('Cannot Paste','This tag builder was not launched with a target input specified; you\'ll have to copy the tag yourself. Sorry!');
			return;
		}
		var value = (this.target)?this.target.value:this.target;
		var output = this.body.getElement("input.result");
		
		var currentScrollPos; 
		if (this.target.scrollTop || this.target.scrollLeft) {
			currentScrollPos = {
				scrollTop: this.target.getScroll().y,
				scrollLeft: this.target.getScroll().x
			};
		}
		this.target.value = value.substring(0, this.range.start) + output.value + value.substring((this.range.end-this.range.start) + this.range.start, value.length);
		if (currentScrollPos) {
			this.target.scrollTop = currentScrollPos.getScroll().y;
			this.target.scrollLeft = currentScrollPos.getScroll().x;
		}

		this.target.selectRange(this.range.start, output.value.length + this.range.start);
		this.fireEvent('onChoose');
		$$('.tagMaker-tip').hide();
		this.win.hide();
		return;
	}
});


TagMaker.image = new Class({
	Extends: TagMaker,
	options: {
		name: "Image Builder",
		output: '<img src="%Full Url%" width="%Width%" height="%Height%" alt="%Alt Text%" style="%Alignment%"/>',
		help: {
			'Full Url':'Enter the external URL (http://...) to the image',
			'Width':'Enter the width in pixels.',
			'Height':'Enter the height in pixels.',
			'Alt Text':'Enter the alternate text for the image.',
			'Alignment':'Choose how to float the image.'
		},
		example: {
			'Full Url':'http://i.i.com.com/cnwk.1d/i/hdft/redball.gif'
		},
		'class': {
			'Full Url':'validate-url required',
			'Width':'validate-digits',
			'Height':'validate-digits',
			'Alt Text':''
		},
		selectLists: {
			Alignment: [
				{
					key: 'left',
					value: 'float: left'
				},
				{
					key: 'right',
					value: 'float: right'
				},
				{
					key: 'none',
					value: 'float: none',
					selected: true
				},
				{
					key: 'center',
					value: 'margin-left: auto; margin-right: auto;'
				}
			]		
		}
	}
});

TagMaker.anchor = new Class({
	Extends: TagMaker,
	options: {
		name: "Anchor Builder",
		output: '<a href="%Full Url%">%Inner Text%</a>',
		help: {
			'Full Url':'Enter the external URL (http://...)',
			'Inner Text':'Enter the text for the link body'
		},
		example: {
			'Full Url':'http://www.microsoft.com',
			'Inner Text':'Microsoft'
		},
		'class': {
			'Full Url':'validate-url'
		}
	}
});/**
 * Autocompleter
 *
 * @version		1.1.1
 *
 * @todo: Caching, no-result handling!
 *
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */
var Autocompleter = {};

var OverlayFix = IframeShim;

Autocompleter.Base = new Class({
	
	Implements: [Options, Events],
	
	options: {
		minLength: 1,
		markQuery: true,
		width: 'inherit',
		maxChoices: 10,
//		injectChoice: null,
//		customChoices: null,
		className: 'autocompleter-choices',
		zIndex: 42,
		delay: 400,
		observerOptions: {},
		fxOptions: {},
//		onSelection: $empty,
//		onShow: $empty,
//		onHide: $empty,
//		onBlur: $empty,
//		onFocus: $empty,

		autoSubmit: false,
		overflow: false,
		overflowMargin: 25,
		selectFirst: false,
		filter: null,
		filterCase: false,
		filterSubset: false,
		forceSelect: false,
		selectMode: true,
		choicesMatch: null,

		multiple: false,
		separator: ', ',
		autoTrim: true,
		allowDupes: false,

		cache: true,
		relative: false
	},

	initialize: function(element, options) {
		this.element = document.id(element);
		this.setOptions(options);
		this.options.separatorSplit = new RegExp("\s*["+this.options.separator.trim()+"]\s*/");
		this.build();
		this.observer = new Observer(this.element, this.prefetch.bind(this), $merge({
			'delay': this.options.delay
		}, this.options.observerOptions));
		this.queryValue = null;
		if (this.options.filter) this.filter = this.options.filter.bind(this);
		var mode = this.options.selectMode;
		this.typeAhead = (mode == 'type-ahead');
		this.selectMode = (mode === true) ? 'selection' : mode;
		this.cached = [];
	},

	/**
	 * build - Initialize DOM
	 *
	 * Builds the html structure for choices and appends the events to the element.
	 * Override this function to modify the html generation.
	 */
	build: function() {
		if (document.id(this.options.customChoices)) {
			this.choices = this.options.customChoices;
		} else {
			this.choices = new Element('ul', {
				'class': this.options.className,
				'styles': {
					'zIndex': this.options.zIndex
				}
			}).inject(document.body);
			this.relative = false;
			if (this.options.relative || this.element.getOffsetParent() != document.body) {
				this.choices.inject(this.element, 'after');
				this.relative = this.element.getOffsetParent();
			}
			this.fix = new OverlayFix(this.choices);
		}
		if (!this.options.separator.test(this.options.separatorSplit)) {
			this.options.separatorSplit = this.options.separator;
		}
		this.fx = (!this.options.fxOptions) ? null : new Fx.Tween(this.choices, $merge({
			'property': 'opacity',
			'link': 'cancel',
			'duration': 200
		}, this.options.fxOptions)).addEvent('onStart', Chain.prototype.clearChain).set(0);
		this.element.setProperty('autocomplete', 'off')
			.addEvent((Browser.Engine.trident || Browser.Engine.webkit) ? 'keydown' : 'keypress', this.onCommand.bind(this))
			.addEvent('click', this.onCommand.bind(this, [false]))
			.addEvent('focus', this.toggleFocus.create({bind: this, arguments: true, delay: 100}));
			//.addEvent('blur', this.toggleFocus.create({bind: this, arguments: false, delay: 100}));
		document.addEvent('click', function(e){
			if (e.target != this.choices) this.toggleFocus(false);
		}.bind(this));
	},

	destroy: function() {
		if (this.fix) this.fix.dispose();
		this.choices = this.selected = this.choices.destroy();
	},

	toggleFocus: function(state) {
		this.focussed = state;
		if (!state) this.hideChoices(true);
		this.fireEvent((state) ? 'onFocus' : 'onBlur', [this.element]);
	},

	onCommand: function(e) {
		if (!e && this.focussed) return this.prefetch();
		if (e && e.key && !e.shift) {
			switch (e.key) {
				case 'enter':
					if (this.element.value != this.opted) return true;
					if (this.selected && this.visible) {
						this.choiceSelect(this.selected);
						return !!(this.options.autoSubmit);
					}
					break;
				case 'up': case 'down':
					if (!this.prefetch() && this.queryValue !== null) {
						var up = (e.key == 'up');
						this.choiceOver((this.selected || this.choices)[
							(this.selected) ? ((up) ? 'getPrevious' : 'getNext') : ((up) ? 'getLast' : 'getFirst')
						](this.options.choicesMatch), true);
					}
					return false;
				case 'esc': case 'tab':
					this.hideChoices(true);
					break;
			}
		}
		return true;
	},

	setSelection: function(finish) {
		var input = this.selected.inputValue, value = input;
		var start = this.queryValue.length, end = input.length;
		if (input.substr(0, start).toLowerCase() != this.queryValue.toLowerCase()) start = 0;
		if (this.options.multiple) {
			var split = this.options.separatorSplit;
			value = this.element.value;
			start += this.queryIndex;
			end += this.queryIndex;
			var old = value.substr(this.queryIndex).split(split, 1)[0];
			value = value.substr(0, this.queryIndex) + input + value.substr(this.queryIndex + old.length);
			if (finish) {
				var space = /[^\s,]+/;
				var tokens = value.split(this.options.separatorSplit).filter(space.test, space);
				if (!this.options.allowDupes) tokens = [].combine(tokens);
				var sep = this.options.separator;
				value = tokens.join(sep) + sep;
				end = value.length;
			}
		}
		this.observer.setValue(value);
		this.opted = value;
		if (finish || this.selectMode == 'pick') start = end;
		this.element.selectRange(start, end);
		this.fireEvent('onSelection', [this.element, this.selected, value, input]);
	},

	showChoices: function() {
		var match = this.options.choicesMatch, first = this.choices.getFirst(match);
		this.selected = this.selectedValue = null;
		if (this.fix) {
			var pos = this.element.getCoordinates(this.relative), width = this.options.width || 'auto';
			this.choices.setStyles({
				'left': pos.left,
				'top': pos.bottom,
				'width': (width === true || width == 'inherit') ? pos.width : width
			});
		}
		if (!first) return;
		if (!this.visible) {
			this.visible = true;
			this.choices.setStyle('display', '');
			if (this.fx) this.fx.start(1);
			this.fireEvent('onShow', [this.element, this.choices]);
		}
		if (this.options.selectFirst || this.typeAhead || first.inputValue == this.queryValue) this.choiceOver(first, this.typeAhead);
		var items = this.choices.getChildren(match), max = this.options.maxChoices;
		var styles = {'overflowY': 'hidden', 'height': ''};
		this.overflown = false;
		if (items.length > max) {
			var item = items[max - 1];
			styles.overflowY = 'scroll';
			styles.height = item.getCoordinates(this.choices).bottom;
			this.overflown = true;
		};
		this.choices.setStyles(styles);
		this.fix.show();
	},

	hideChoices: function(clear) {
		if (clear) {
			var value = this.element.value;
			if (this.options.forceSelect) value = this.opted;
			if (this.options.autoTrim) {
				value = value.split(this.options.separatorSplit).filter($arguments(0)).join(this.options.separator);
			}
			this.observer.setValue(value);
		}
		if (!this.visible) return;
		this.visible = false;
		this.observer.clear();
		var hide = function(){
			this.choices.setStyle('display', 'none');
			this.fix.hide();
		}.bind(this);
		if (this.fx) this.fx.start(0).chain(hide);
		else hide();
		this.fireEvent('onHide', [this.element, this.choices]);
	},

	prefetch: function() {
		var value = this.element.value, query = value;
		if (this.options.multiple) {
			var split = this.options.separatorSplit;
			var values = value.split(split);
			var index = this.element.getCaretPosition();
			var toIndex = value.substr(0, index).split(split);
			var last = toIndex.length - 1;
			index -= toIndex[last].length;
			query = values[last];
		}
		if (query.length < this.options.minLength) {
			this.hideChoices();
		} else {
			if (query === this.queryValue || (this.visible && query == this.selectedValue)) {
				if (this.visible) return false;
				this.showChoices();
			} else {
				this.queryValue = query;
				this.queryIndex = index;
				if (!this.fetchCached()) this.query();
			}
		}
		return true;
	},

	fetchCached: function() {
		return false;
		if (!this.options.cache
			|| !this.cached
			|| !this.cached.length
			|| this.cached.length >= this.options.maxChoices
			|| this.queryValue) return false;
		this.update(this.filter(this.cached));
		return true;
	},

	update: function(tokens) {
		this.choices.empty();
		this.cached = tokens;
		if (!tokens || !tokens.length) {
			this.hideChoices();
		} else {
			if (this.options.maxChoices < tokens.length && !this.options.overflow) tokens.length = this.options.maxChoices;
			tokens.each(this.options.injectChoice || function(token){
				var choice = new Element('li', {'html': this.markQueryValue(token)});
				choice.inputValue = token;
				this.addChoiceEvents(choice).inject(this.choices);
			}, this);
			this.showChoices();
		}
	},

	choiceOver: function(choice, selection) {
		if (!choice || choice == this.selected) return;
		if (this.selected) this.selected.removeClass('autocompleter-selected');
		this.selected = choice.addClass('autocompleter-selected');
		this.fireEvent('onSelect', [this.element, this.selected, selection]);
		if (!selection) return;
		this.selectedValue = this.selected.inputValue;
		if (this.overflown) {
			var coords = this.selected.getCoordinates(this.choices), margin = this.options.overflowMargin,
				top = this.choices.scrollTop, height = this.choices.offsetHeight, bottom = top + height;
			if (coords.top - margin < top && top) this.choices.scrollTop = Math.max(coords.top - margin, 0);
			else if (coords.bottom + margin > bottom) this.choices.scrollTop = Math.min(coords.bottom - height + margin, bottom);
		}
		if (this.selectMode) this.setSelection();
	},

	choiceSelect: function(choice) {
		if (choice) this.choiceOver(choice);
		this.setSelection(true);
		this.queryValue = false;
		this.hideChoices();
	},

	filter: function(tokens) {
		return (tokens || this.tokens).filter(function(token) {
			return this.test(token);
		}, new RegExp(((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp(), (this.options.filterCase) ? '' : 'i'));
	},

	/**
	 * markQueryValue
	 *
	 * Marks the queried word in the given string with <span class="autocompleter-queried">*</span>
	 * Call this i.e. from your custom parseChoices, same for addChoiceEvents
	 *
	 * @param		{String} Text
	 * @return		{String} Text
	 */
	markQueryValue: function(str) {
		return (!this.options.markQuery || !this.queryValue) ? str
			: str.replace(new RegExp('(' + ((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp() + ')', (this.options.filterCase) ? '' : 'i'), '<span class="autocompleter-queried">$1</span>');
	},

	/**
	 * addChoiceEvents
	 *
	 * Appends the needed event handlers for a choice-entry to the given element.
	 *
	 * @param		{Element} Choice entry
	 * @return		{Element} Choice entry
	 */
	addChoiceEvents: function(el) {
		return el.addEvents({
			'mouseover': this.choiceOver.bind(this, [el]),
			'click': this.choiceSelect.bind(this, [el])
		});
	}
});
/**
 * Autocompleter.Local
 *
 * @version		1.1.1
 *
 * @todo: Caching, no-result handling!
 *
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */
Autocompleter.Local = new Class({

	Extends: Autocompleter.Base,

	options: {
		minLength: 0,
		delay: 200
	},

	initialize: function(element, tokens, options) {
		this.parent(element, options);
		this.tokens = tokens;
	},

	query: function() {
		this.update(this.filter());
	}

});
/**
 * Autocompleter.Remote
 *
 * @version		1.1.1
 *
 * @todo: Caching, no-result handling!
 *
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */

Autocompleter.Ajax = {};

Autocompleter.Ajax.Base = new Class({

	Extends: Autocompleter.Base,

	options: {
		postVar: 'value',
		postData: {},
		ajaxOptions: {},
		onRequest: $empty,
		onComplete: $empty
	},

	initialize: function(element, options) {
		this.parent(element, options);
		var indicator = document.id(this.options.indicator);
		if (indicator) {
			this.addEvents({
				'onRequest': indicator.show.bind(indicator),
				'onComplete': indicator.hide.bind(indicator)
			}, true);
		}
	},

	query: function(){
		var data = $unlink(this.options.postData);
		data[this.options.postVar] = this.queryValue;
		this.fireEvent('onRequest', [this.element, this.request, data, this.queryValue]);
		this.request.send({'data': data});
	},

	/**
	 * queryResponse - abstract
	 *
	 * Inherated classes have to extend this function and use this.parent(resp)
	 *
	 * @param		{String} Response
	 */
	queryResponse: function() {
		this.fireEvent('onComplete', [this.element, this.request, this.response]);
	}

});

Autocompleter.Ajax.Json = new Class({

	Extends: Autocompleter.Ajax.Base,

	initialize: function(el, url, options) {
		this.parent(el, options);
		this.request = new Request.JSON($merge({
			'url': url,
			'link': 'cancel'
		}, this.options.ajaxOptions)).addEvent('onComplete', this.queryResponse.bind(this));
	},

	queryResponse: function(response) {
		this.parent();
		this.update(response);
	}

});

Autocompleter.Ajax.Xhtml = new Class({

	Extends: Autocompleter.Ajax.Base,

	initialize: function(el, url, options) {
		this.parent(el, options);
		this.request = new Request.HTML($merge({
			'url': url,
			'link': 'cancel',
			'update': this.choices
		}, this.options.ajaxOptions)).addEvent('onComplete', this.queryResponse.bind(this));
	},

	queryResponse: function(tree, elements) {
		this.parent();
		if (!elements || !elements.length) {
			this.hideChoices();
		} else {
			this.choices.getChildren(this.options.choicesMatch).each(this.options.injectChoice || function(choice) {
				var value = choice.innerHTML;
				choice.inputValue = value;
				this.addChoiceEvents(choice.set('html', this.markQueryValue(value)));
			}, this);
			this.showChoices();
		}

	}

});
/*
Script: Autocompleter.JSONP.js
	Implements Request.JSONP support for the Autocompleter class.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Autocompleter.JSONP = new Class({

	Extends: Autocompleter.Ajax.Json,

	options: {
		postVar: 'query',
		jsonpOptions: {},
//		onRequest: $empty,
//		onComplete: $empty,
//		filterResponse: $empty
		minLength: 1
	},

	initialize: function(el, url, options) {
		this.url = url;
		this.setOptions(options);
		this.parent(el, options);
	},

	query: function(){
		var data = $unlink(this.options.jsonpOptions.data||{});
		data[this.options.postVar] = this.queryValue;
		this.jsonp = new Request.JSONP($merge({url: this.url, data: data},	this.options.jsonpOptions));
		this.jsonp.addEvent('onComplete', this.queryResponse.bind(this));
		this.fireEvent('onRequest', [this.element, this.jsonp, data, this.queryValue]);
		this.jsonp.send();
	},
	
	queryResponse: function(response) {
		this.parent();
		var data = (this.options.filter)?this.options.filter.run([response], this):response;
		this.update(data);
	}

});
Autocompleter.JsonP = Autocompleter.JSONP;/**
 * Observer - Observe formelements for changes
 *
 * @version		1.0rc3
 *
 * @license		MIT-style license
 * @author		Harald Kirschner <mail [at] digitarald.de>
 * @copyright	Author
 */
var Observer = new Class({

	Implements: [Options, Events],

	options: {
		periodical: false,
		delay: 1000
	},

	initialize: function(el, onFired, options){
		this.setOptions(options);
		this.addEvent('onFired', onFired);
		this.element = document.id(el) || $$(el);
		/* Clientcide change */
		this.boundChange = this.changed.bind(this);
		this.resume();
	},

	changed: function() {
		var value = this.element.get('value');
		if ($equals(this.value, value)) return;
		this.clear();
		this.value = value;
		this.timeout = this.onFired.delay(this.options.delay, this);
	},

	setValue: function(value) {
		this.value = value;
		this.element.set('value', value);
		return this.clear();
	},

	onFired: function() {
		this.fireEvent('onFired', [this.value, this.element]);
	},

	clear: function() {
		$clear(this.timeout || null);
		return this;
	},
	/* Clientcide change */
	pause: function(){
		$clear(this.timeout);
		$clear(this.timer);
		this.element.removeEvent('keyup', this.boundChange);
		return this;
	},
	resume: function(){
		this.value = this.element.get('value');
		if (this.options.periodical) this.timer = this.changed.periodical(this.options.periodical, this);
		else this.element.addEvent('keyup', this.boundChange);
		return this;
	}

});

var $equals = function(obj1, obj2) {
	return (obj1 == obj2 || JSON.encode(obj1) == JSON.encode(obj2));
};/*
Script: AutoCompleter.Clientcide.js
	Adds Clientcide css assets to autocompleter automatically.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
(function(){
	Autocompleter.Base = Class.refactor(Autocompleter.Base, {
		initialize: function(a1,a2,a3) {
			this.previous(a1,a2,a3);
			this.writeStyle();
		},
		writeStyle: function(){
			window.addEvent('domready', function(){
				if (document.id('AutocompleterCss')) return;
				new Element('link', {
					rel: 'stylesheet', 
					media: 'screen', 
					type: 'text/css', 
					href: (this.options.baseHref || Clientcide.assetLocation + '/autocompleter')+'/Autocompleter.css', 
					id: 'AutocompleterCss'
				}).inject(document.head);
			}.bind(this));
		}
	});
})();
/*
Script: Lightbox.js
	A lightbox clone for MooTools.

* Christophe Beyls (http://www.digitalia.be); MIT-style license.
* Inspired by the original Lightbox v2 by Lokesh Dhakar: http://www.huddletogether.com/projects/lightbox2/.
* Refactored by Aaron Newton 

*/
var Lightbox = new Class({
	Implements: [Options, Events],
	Binds: ['click', 'keyboardListener', 'addHtmlElements'],
	options: {
//		anchors: null,
		resizeDuration: 400,
//		resizeTransition: false,	// default transition
		initialWidth: 250,
		initialHeight: 250,
		zIndex: 5000,
		animateCaption: true,
		showCounter: true,
		autoScanLinks: true,
		relString: 'lightbox',
		useDefaultCss: true,
		overlayStyles: {
			'background-color':'#333',
			opacity:0.8
		}
//		onImageShow: $empty,
//		onDisplay: $empty,
//		onHide: $empty
	},

	initialize: function(){
		var args = Array.link(arguments, {options: Object.type, links: Array.type});
		this.setOptions(args.options);
		var anchors = args.links || this.options.anchors;
		if (this.options.autoScanLinks && !anchors) anchors = $$('a[rel^='+this.options.relString+']');
		if (!$$(anchors).length) return; //no links!
		this.addAnchors(anchors);
		if (this.options.useDefaultCss) this.addCss();
		window.addEvent('domready', this.addHtmlElements.bind(this));
	},
		
	anchors: [],
	
	addAnchors: function(anchors){
		$$(anchors).each(function(el){
			if (!el.retrieve('lightbox')) {
				el.store('lightbox', this);
				this.attach(el);
			}
		}.bind(this));
	},
	
	attach: function(el) {		
		el.addEvent('click', this.click.pass(el, this));
		this.anchors.include(el);
	},

	addHtmlElements: function(){
		this.container = new Element('div', {
			'class':'lbContainer'
		}).inject(document.body);
		this.mask = new Mask(document.body, {
			onHide: this.close.bind(this),
			style: this.options.overlayStyles,
			hideOnClick: true
		});
		this.popup = new Element('div', {
			'class':'lbPopup'
		}).inject(this.container);
		this.center = new Element('div', {
			styles: {	
				width: this.options.initialWidth, 
				height: this.options.initialHeight, 
				marginLeft: (-(this.options.initialWidth/2)),
				display: 'none',
				zIndex:this.options.zIndex+1
			}
		}).inject(this.popup).addClass('lbCenter');
		this.image = new Element('div', {
			'class': 'lbImage'
		}).inject(this.center);
		
		this.prevLink = new Element('a', {
			'class': 'lbPrevLink', 
			href: 'javascript:void(0);', 
			styles: {'display': 'none'}
		}).inject(this.image);
		this.nextLink = this.prevLink.clone().removeClass('lbPrevLink').addClass('lbNextLink').inject(this.image);
		this.prevLink.addEvent('click', this.previous.bind(this));
		this.nextLink.addEvent('click', this.next.bind(this));

		this.bottomContainer = new Element('div', {
			'class': 'lbBottomContainer', 
			styles: {
				display: 'none', 
				zIndex:this.options.zIndex+1
		}}).inject(this.popup);
		this.bottom = new Element('div', {'class': 'lbBottom'}).inject(this.bottomContainer);
		new Element('a', {
			'class': 'lbCloseLink', 
			href: 'javascript:void(0);'
		}).inject(this.bottom).addEvent('click', this.close.bind(this));
		this.caption = new Element('div', {'class': 'lbCaption'}).inject(this.bottom);
		this.number = new Element('div', {'class': 'lbNumber'}).inject(this.bottom);
		new Element('div', {'styles': {'clear': 'both'}}).inject(this.bottom);
		var nextEffect = this.nextEffect.bind(this);
		this.fx = {
			resize: new Fx.Morph(this.center, $extend({
				duration: this.options.resizeDuration, 
				onComplete: nextEffect}, 
				this.options.resizeTransition ? {transition: this.options.resizeTransition} : {})),
			image: new Fx.Tween(this.image, {property: 'opacity', duration: 500, onComplete: nextEffect}),
			bottom: new Fx.Tween(this.bottom, {property: 'margin-top', duration: 400, onComplete: nextEffect})
		};

		this.preloadPrev = new Element('img');
		this.preloadNext = new Element('img');
	},
	
	addCss: function(){
		window.addEvent('domready', function(){
			if (document.id('LightboxCss')) return;
			new Element('link', {
				rel: 'stylesheet', 
				media: 'screen', 
				type: 'text/css', 
				href: (this.options.assetBaseUrl || Clientcide.assetLocation + '/slimbox') + '/slimbox.css',
				id: 'LightboxCss'
			}).inject(document.head);
		}.bind(this));
	},

	click: function(el){
		link = document.id(el);
		var rel = link.get('rel')||this.options.relString;
		if (rel == this.options.relString) return this.show(link.get('href'), link.get('title'));

		var j, imageNum, images = [];
		this.anchors.each(function(el){
			if (el.get('rel') == link.get('rel')){
				for (j = 0; j < images.length; j++) {
					if (images[j][0] == el.get('href')) break;
				}
				if (j == images.length){
					images.push([el.get('href'), el.get('title')]);
					if (el.get('href') == link.get('href')) imageNum = j;
				}
			}
		}, this);
		return this.open(images, imageNum);
	},

	show: function(url, title){
		return this.open([[url, title]], 0);
	},

	open: function(images, imageNum){
		this.fireEvent('onDisplay');
		this.images = images;
		this.setup(true);
		this.top = (window.getScroll().y + (window.getSize().y / 15)).toInt();
		this.center.setStyles({
			top: this.top,
			display: ''
		});
		this.mask.show();
		return this.changeImage(imageNum);
	},

	setup: function(open){
		var elements = $$('iframe');
		elements.extend($$(Browser.Engine.trident ? 'select' : 'embed, object'));
		elements.reverse().each(function(el){
			if (open) el.store('lbBackupStyle', el.getStyle('visibility') || 'visible');
			var vis = (open ? 'hidden' : el.retrieve('lbBackupStyle') || 'visible');
			el.setStyle('visibility', vis);
		});
		var fn = open ? 'addEvent' : 'removeEvent';
		document[fn]('keydown', this.keyboardListener);
		this.step = 0;
	},

	keyboardListener: function(event){
		switch (event.code){
			case 27: case 88: case 67: this.close(); break;
			case 37: case 80: this.previous(); break;	
			case 39: case 78: this.next();
		}
	},

	previous: function(){
		return this.changeImage(this.activeImage-1);
	},

	next: function(){
		return this.changeImage(this.activeImage+1);
	},

	changeImage: function(imageNum){
		this.fireEvent('onImageShow', [imageNum, this.images[imageNum]]);
		if (this.step || (imageNum < 0) || (imageNum >= this.images.length)) return false;
		this.step = 1;
		this.activeImage = imageNum;

		this.center.setStyle('backgroundColor', '');
		this.bottomContainer.setStyle('display', 'none');
		this.prevLink.setStyle('display', 'none');
		this.nextLink.setStyle('display', 'none');
		this.fx.image.set(0);
		this.center.addClass('lbLoading');
		this.preload = new Element('img', {
			events: {
				load: function(){
					this.nextEffect.delay(100, this);
				}.bind(this)
			}
		});
		this.preload.set('src', this.images[imageNum][0]);
		return false;
	},

	nextEffect: function(){
		switch (this.step++){
		case 1:
			this.image.setStyle('backgroundImage', 'url('+escape(this.images[this.activeImage][0])+')');
			this.image.setStyle('width', this.preload.width);
			this.bottom.setStyle('width',this.preload.width);
			this.image.setStyle('height', this.preload.height);
			this.prevLink.setStyle('height', this.preload.height);
			this.nextLink.setStyle('height', this.preload.height);

			this.caption.set('html',this.images[this.activeImage][1] || '');
			this.number.set('html',(!this.options.showCounter || (this.images.length == 1)) ? '' : 'Image '+(this.activeImage+1)+' of '+this.images.length);

			if (this.activeImage) document.id(this.preloadPrev).set('src', this.images[this.activeImage-1][0]);
			if (this.activeImage != (this.images.length - 1)) 
				document.id(this.preloadNext).set('src',  this.images[this.activeImage+1][0]);
			if (this.center.clientHeight != this.image.offsetHeight){
				this.fx.resize.start({height: this.image.offsetHeight});
				break;
			}
			this.step++;
		case 2:
			if (this.center.clientWidth != this.image.offsetWidth){
				this.fx.resize.start({width: this.image.offsetWidth, marginLeft: -this.image.offsetWidth/2});
				break;
			}
			this.step++;
		case 3:
			this.bottomContainer.setStyles({
				top: (this.top + this.center.getSize().y), 
				height: 0, 
				marginLeft: this.center.getStyle('margin-left'), 
				display: ''
			});
			this.fx.image.start(1);
			break;
		case 4:
			this.center.style.backgroundColor = '#000';
			if (this.options.animateCaption){
				this.fx.bottom.set(-this.bottom.offsetHeight);
				this.bottomContainer.setStyle('height', '');
				this.fx.bottom.start(0);
				break;
			}
			this.bottomContainer.style.height = '';
		case 5:
			if (this.activeImage) this.prevLink.setStyle('display', '');
			if (this.activeImage != (this.images.length - 1)) this.nextLink.setStyle('display', '');
			this.step = 0;
		}
	},

	close: function(){
		this.fireEvent('onHide');
		if (this.step < 0) return;
		this.step = -1;
		if (this.preload) this.preload.destroy();
		for (var f in this.fx) this.fx[f].cancel();
		this.center.setStyle('display', 'none');
		this.bottomContainer.setStyle('display', 'none');
		this.mask.hide();
		this.setup(false);
		return;
	}
});
window.addEvent('domready', function(){if (document.id(document.body).get('html').match(/rel=?.lightbox/i)) new Lightbox();});
/*
Script: SimpleEditor.English.US.js
	SimpleEditor messages in English.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('en-US', 'SimpleEditor', {
	woops:'Woops',
	linkURL:'The URL for the link',
	linkText:'The link text',
	imgURL:'The URL to the image',
	imgAlt:'The title (alt) for the image'
});/*
Script: SimpleEditor.Dutch.js
	SimpleEditor messages in Dutch. Thanks Lennart Pilon.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('nl-NL', 'SimpleEditor', {
	woops:'Oeps',
	nopeCtrlC:'Sorry, deze functie werkt niet; gebruik ctrl+c.',
	nopeCtrlX:'Sorry, deze functie werkt niet; gebruik ctrl+x.',
	linkURL:'De URL voor de snelkoppeling',
	linkText:'De tekst van de snelkoppeling',
	imgURL:'De URL van de afbeelding',
	imgAlt:'De titel (alt) voor de afbeelding'
});/*
Script: SimpleEditor.French.js
	SimpleEditor messages in French. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('fr-FR', 'SimpleEditor', {
	woops:'Oops',
	nopeCtrlC:'Désolé, cette fonction ne fonctionne pas ici. Utilisez ctrl+c.',
	nopeCtrlX:'Désolé, cette fonction ne fonctionne pas ici. Utilisez ctrl+x.',
	linkURL:'L\'URL pour le lien',
	linkText:'Texte du lien',
	imgURL:'L\'URL de l\'image',
	imgAlt:'Le titre (alt) de l\'image'
});/*
Script: SimpleEditor.Spanish.js
	SimpleEditor messages in Spanish. Thanks Marco Cervellin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('it', 'SimpleEditor', {
       woops:'Oops!',
       linkURL:'La URL del link',
       linkText:'Il testo del link',
       imgURL:'La URL dell\'immagine',
       imgAlt:'Il titolo (alt) dell\'immagine'
});/*
Script: SimpleEditor.Portuguese.js
	SimpleEditor messages in Portuguese. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('pt-PT', 'SimpleEditor', {
	woops:'Opa',
	nopeCtrlC:'Desculpe, esta função não funciona aqui. Use ctrl+c.',
	nopeCtrlX:'Desculpe, esta função não funciona aqui. Use ctrl+x.',
	linkURL:'O URL para o link',
	linkText:'Texto do link',
	imgURL:'A URL para a imagem',
	imgAlt:'O título (alt) para a imagem'
});/*
Script: SimpleEditor.Spanish.js
	SimpleEditor messages in Spanish. Thanks Miquel Hudin.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
MooTools.lang.set('es-ES', 'SimpleEditor', {
	woops:'¡Vaya!',
	nopeCtrlC:'Lo sentimos, esta función no funciona aquí.  Uso ctrl+c.',
	nopeCtrlX:'Lo sentimos, esta función no funciona aquí.  Uso ctrl+x.',
	linkURL:'La URL para el enlace',
	linkText:'Texto de enlace',
	imgURL:'La URL de la imagen',
	imgAlt:'El título (alt) de la imagen'
});/*
Script: PostEditor.js
	Using postEditor you can tabulate without losing your focus and maintain the tabsize in line brakes. 
	You can also use snippets like in TextMate.

Author:
	Daniel Mota aka IceBeat, <http://icebeat.bitacoras.com>

Contributors:
	Sergio Álvarez aka Xergio, <http://xergio.net>
	Jordi Rivero aka Godsea, <http://godsea.dsland.org>
	Aaron Newton, <http://www.clientcide.com>

License:
	MIT-style license.
*/
var PostEditor = new Class({
	
	Implements: [Options],

	tab: "\t",

	options: {
		snippets : {},
		smartTypingPairs : {},
		selections : {}
	},

	initialize: function(el, options){
		if (Browser.Engine.trident) return;
		this.element = document.id(el);
		this.setOptions(options);
		this.styles = {
			line_height: this.element.getStyle('line-height').toInt() || 14,
			font_size: this.element.getStyle('font-size').toInt() || 11,
			height: this.element.getStyle('height').toInt()
		};
		this.autoTab = null;
		this.ssKey = 0;
		this.seKey = 0;
		this.completion = null;
		this.tabl = this.tab.length;
		this.element.onkeypress = this.onKeyPress.bind(this);
	},

	changeSnippets: function(snippets){
		this.options.snippets = snippets || {};
	},

	changeSmartTypingPairs: function(smartTypingPairs){
		this.options.smartTypingPairs = smartTypingPairs || {};
	},

	changeSelections: function(selections){
		this.options.selections = selections || {};
	},

	ss: function(){
		return this.element.selectionStart;
	},

	se: function(){
		return this.element.selectionEnd;
	},

	slice: function(start, end){
		return this.element.value.slice(start, end);
	},

	value: function(value){
		this.element.value = value.join("");
	},
	
	getStart: function(rest){
		rest = rest ? rest.length : 0;
		return this.slice(0, this.ss() - rest);
	},
	
	getEnd: function(rest){
		rest = rest ? rest.length : 0;
		return this.element.value.slice(this.se()-rest);
	},
	
	selectRange: function(start,end){
		this.element.selectionStart = start;
		this.element.selectionEnd = start+end;
	},

	focus: function(focus, type){
		if (type){
			this.scrollTop	= this.element.scrollTop;
			this.scrollLeft = this.element.scrollLeft;
		} else {
			this.element.scrollTop	= this.scrollTop;
			this.element.scrollLeft = this.scrollLeft;
		}
		if (focus) this.element.focus();
	},

	updateScroll: function(){
		var lines = this.getStart().split("\n").length;
		var height = (lines - Math.round(this.element.scrollTop/this.styles.line_height)) * this.styles.line_height;
		height += this.styles.line_height;
		if (height >= this.styles.height) this.element.scrollTop += this.styles.line_height;
		this.focus(true, 1);
	},

	onKeyPress: function(e){
		if (this.filterByPairs(e)) return;
		this.filterBySelect(e);
		if (this.filterByTab(e)) return;
		if ([13,9,8,46].contains(e.keyCode)) this.focus(false, true);
		switch(e.keyCode){
			case 27:
				this.completion = null;
				this.autoTab = null; break;
			case 39: this.onKeyRight(e); break;
			case 13: this.onEnter(e); break;
			case 9: this.onTab(e); break;
			case 8: this.onBackspace(e); break;
			case 46: this.onDelete(e); break;
		}
		if ([13,9,8,46].contains(e.keyCode)) this.focus(true, false);
	},

	filterByPairs: function(e){
		var charCode = String.fromCharCode(e.charCode);
		var stpair = this.options.smartTypingPairs[charCode];
		if (stpair){
			if ($type(stpair) == 'string') stpair = {pair : stpair};
			if (!stpair.scope || this.scope(stpair.scope)){
				var ss = this.ss(), se = this.se(), start = this.getStart();
				if (ss == se){
					this.value([start,stpair.pair,this.getEnd()]);
					this.selectRange(start.length,0);
				} else {
					e.preventDefault();
					this.ssKey = ss;
					this.seKey = se;
					this.value([start,charCode,this.slice(ss,se),stpair.pair,this.getEnd()]);
					this.selectRange(ss+1,se-ss);
				}
			}
			stpair = null;
			return true;
		}
		return false;
	},

	filterBySelect: function(e){
		var charCode = String.fromCharCode(e.charCode);
		if (e.ctrlKey && e.shiftKey){
			if ([0,1,2,3,4,5,6,7,8,9].contains(charCode)){
				var fn = this.options.selections[charCode];
				if (fn){
					var ss = this.ss(), se = this.se(), 
							sel = fn.apply(this, [this.slice(ss,se)]);
					if (sel){
						var start = this.getStart();
						if ($type(sel) == 'array'){
							this.value([start,sel.join(""),this.getEnd()]);
							this.selectRange(start.length+sel[0].length,sel[1].length);
						} else {
							if (sel.selection){
								if (sel.snippet){
									start = this.slice(0,sel.selection[0]);
									var end = this.slice(sel.selection[1],this.element.value.length);
									this.value([start,sel.snippet.join(""),end]);
									this.selectRange(start.length+sel.snippet[0].length,sel.snippet[1].length);
								} else {
									this.selectRange(sel.selection[0],sel.selection[1]);
								}
							} else {
								this.value([start,sel.snippet.join(""),this.getEnd()]);
								this.selectRange(start.length+sel.snippet[0].length,sel.snippet[1].length);
							}
						}
					}
				}
			}
		}
	},

	filterByTab: function(e){
		if (this.autoTab){
			var ss = this.ss();
			var se = this.se();
			var  key = this.ssKey;
			var end = this.seKey;
			if (![key + 1,key,key - 1, end].contains(ss)){
				this.completion = null;
				this.autoTab = null;
			}
			if (this.autoTab && [38, 39].contains(e.keyCode) && ss == se){
				this.completion = null;
				this.autoTab = null;
			}
			this.ssKey = ss;
			this.seKey = se;
		} else {
			this.ssKey = 0;
			this.seKey = 0;
		}
		return false;
	},

	scope: function(scopes){
		var ss = this.ss();
		var text = this.getStart();
		for (var key in scopes){
			if (!key) return true;
			var open = text.lastIndexOf(key);
			if (open > -1){
				var close = this.slice(open + key.length, ss).lastIndexOf(scopes[key]);
				if (close == -1) return true;
			}
		}
		return false;
	},

	onKeyRight: function(e){
		var ss = this.ss();
		var se = this.se();
		var start = this.getStart();
		if (ss != se){
			e.preventDefault();
			this.selectRange(se, 0);
		}
	},

	onEnter: function(e){
		this.updateScroll();
		var ss = this.ss();
		var se = this.se();
		var start = this.getStart();
		if (ss == se){
			var line = start.split("\n").pop(),
				tab = line.match(/^\s+/gi);
			if (tab){
				e.preventDefault();
				tab = tab.join("");
				this.value([start,"\n",tab,this.getEnd()]);
				this.selectRange(ss + 1 + tab.length,0);
			}
		}
	},

	onBackspace: function(e){
		var ss = this.ss();
		var se = this.se();
		if (ss == se && this.slice(ss - this.tabl, ss) == this.tab){
			e.preventDefault();
			var start = this.getStart(this.tab), end = this.slice(ss, this.element.value.length);
			if (start.match(/\n$/g) && end.match(/^\n/g)){
				this.value([start, this.slice(ss - 1, this.element.value.length)]);
			} else {
				this.value([start, end]);
			}
			this.selectRange(ss - this.tabl, 0);
		} else if (ss == se){
			var charCode = this.slice(ss - 1, ss), 
				close = this.slice(ss,ss+1), 
				stpair = this.options.smartTypingPairs[charCode];
			if ($type(stpair) == 'string') stpair = {pair : stpair};
			if (stpair && stpair.pair == close){
				this.value([this.getStart(stpair.pair), this.slice(ss, this.element.value.length)]);
				this.selectRange(ss,0);
			}
		}
	},

	onDelete: function(e){
		var ss = this.ss(), se = this.se();
		if (ss == se && this.slice(ss,ss+this.tabl) == this.tab){
			e.preventDefault();
			this.value([this.getStart(),this.slice(ss+this.tabl,this.element.value.length)]);
			this.selectRange(ss,0);
		}
	},

	onTab: function(e){
		e.preventDefault();
		var ss = this.ss(), se = this.se(), sel = this.slice(ss,se), text = this.getStart();
		if (this.filterCompletion(e, ss, se)) return;
		if (this.filterAutoTab(e, ss, se)) return;
		
		if (ss != se && sel.indexOf("\n") != -1){
			var newsel = sel.replace(/\n/g,"\n" + this.tab);
			this.value([text,this.tab,newsel,this.getEnd()]);
			this.selectRange(ss + this.tabl,se + (this.tabl * sel.split("\n").length) - ss - this.tabl);
		} else {
			var snippetObj = null;
			for (var key in this.options.snippets){
				var value = this.options.snippets[key];
				if ($type(value) == 'function') continue;
				if (text.length-key.length==-1) continue;
				if (text.length-key.length==text.lastIndexOf(key)){
					if ($type(value) == 'array') value = { snippet:value };
					snippetObj = Object.extend({},value);
					break;
				}
			}
			if (snippetObj && (!snippetObj.scope || this.scope(snippetObj.scope))){
			
				if (snippetObj.command){
					var command = snippetObj.command.apply(this, [key]);
					if ($type(command) == 'array') snippetObj.snippet = command;
					else snippetObj = command;
				}
			
				var snippet = snippetObj.snippet.copy(), tab = text.split("\n").pop().match(/^\s+/gi);
				var start = this.getStart(snippetObj.key || key);
			
				if (tab){
					tab = tab.join("");
					snippet[0] = snippet[0].replace(/\n/g,"\n"+tab);
					snippet[1] = snippet[1].replace(/\n/g,"\n"+tab);
					snippet[2] = snippet[2].replace(/\n/g,"\n"+tab);
				}
			
				this.value([start, snippet[0], snippet[1], snippet[2], this.getEnd()]);
			
				if (snippetObj.tab){
				
					this.autoTab = {
						tab: snippetObj.tab.copy(),
						snippet: snippet.copy(),
						start: snippetObj.start
					};
				
					var item = this.autoTab.tab.shift();
					this.autoTab.ss = snippet[1].indexOf(item);
				
					if (this.autoTab.ss > -1){
						this.autoTab.ssLast = start.length + snippet[0].length + this.autoTab.ss;
						this.ssKey = this.autoTab.ssLast;
						this.seKey = this.ssKey + item.length;
						this.completion = null;
						if (snippetObj.completion){
							this.autoTab.completion = snippetObj.completion;
							this.autoTab.item = item;
							this.autoTab.loop = true;
							if (typeof snippetObj.loop == 'boolean') this.autoTab.loop = snippetObj.loop;
							var completion = this.autoTab.completion[item];
							if (completion){
								var i = [item].extend(completion);
								var a = completion.copy().extend(['']);
								this.autoTab.index = item;
								this.completion = a.associate(i);
							}
						}
						this.selectRange(start.length + snippet[0].length + this.autoTab.ss, item.length);
					
					} else {
						this.autoTab = null;
						this.selectRange(start.length + snippet[0].length, snippet[1].length);
					}
				} else {
					this.selectRange(start.length + snippet[0].length,snippet[1].length);
				}
				snippet = null;
			} else {
				this.value([text,this.tab,this.slice(ss, this.element.value.length)]);
				if (ss == se) this.selectRange(ss + this.tabl,0);
				else this.selectRange(ss + this.tabl,se - ss);
			}
		}
	},

	filterAutoTab: function(e,ss,se){
		if (this.autoTab){
			var length = this.autoTab.tab.length;
			if (length){
				if (this.autoTab.ssLast <= ss){
					var item = this.autoTab.tab.shift();
					var next = this.slice(ss, ss + this.autoTab.snippet[1].length - this.autoTab.ss).indexOf(item);
					if (length == 1 && !item){
						var end = this.autoTab.snippet[2].length;
						if ($type(this.autoTab.start) == 'number') end = this.autoTab.start;
						else if (this.autoTab.start) end = 0;
						this.selectRange(se + this.getEnd().indexOf(this.autoTab.snippet[2])+end,0);
						this.completion = null;
						return true;
					} else if (next > -1){
						this.autoTab.ss = next;
						this.autoTab.ssLast = next + ss;
						this.ssKey = this.autoTab.ssLast;
						this.seKey = this.ssKey + item.length;
						this.autoTab.item = item;
						if (this.completion){
							var completion = this.autoTab.completion[item];
							if (completion){
								var i = [item].extend(completion);
								var a = completion.copy().extend(['']);
								this.autoTab.index = item;
								this.completion = a.associate(i);
							} else {
								this.completion = null;
							}
						}
						this.selectRange(ss + next,item.length);
						return true;
					} else {
						this.onTab(e);
						return true;
					}
				}
			}
			this.autoTab = null;
		}
		return false;
	},

	filterCompletion: function(e,ss,se){
		if (this.completion && ss == this.ssKey && se == this.seKey && this.autoTab.item.length == se - ss){
			var item = this.completion[this.autoTab.item];
			if (item){
				this.seKey = this.ssKey + item.length;
				this.autoTab.item = item;
				this.value([this.getStart(),item,this.getEnd()]);
				this.selectRange(ss, item.length);
				return true;
			} else if (this.autoTab.loop){
				item = this.autoTab.index;
				this.autoTab.item = item;
				this.seKey = this.ssKey + item.length;
				this.value([this.getStart(), item,this.getEnd()]);
				this.selectRange(ss, item.length);
				return true;
			}
		}
		this.completion = null;
		return false;
	}

});/*
Script: PostEditor.Forum.js
	Default snippets for PostEditor.

Author:
	Daniel Mota aka IceBeat, <http://icebeat.bitacoras.com>

Contributors:
	Sergio Álvarez aka Xergio, <http://xergio.net>
	Jordi Rivero aka Godsea, <http://godsea.dsland.org>
	Aaron Newton, <http://www.clientcide.com>

License:
	MIT-style license.
*/
PostEditor.Forum = new Class({
	Extends: PostEditor,
	options: {
		snippets: {

			"strong" : ["<strong>\n		","something here","\n</strong>"],
			"em" : ["<em>\n		","something here","\n</em>"],
			"blockquote" : ["<blockquote>\n		","something here","\n</blockquote>"],
			"code" : ["<code>\n		","something here","\n</code>"],
			"javascript" : ["<javascript>\n		","something here","\n</javascript>"],
			"html" : ["<html>\n		","something here","\n</html>"],
			"bq" : ["<blockquote>\n		","something here","\n</blockquote>"],
			"js" : ["<javascript>\n		","something here","\n</javascript>"],

			"$" : {
				snippet:["document.id('","id')","."],
				tab:['id','']
			},

			"ul" : {
				snippet:["<ul>\n		<li>","something here","</li>\n</ul>"],
				tab:['something here',''],
				start: 5
			},

			"ol" : {
				snippet:["<ol>\n		<li>","something here","</li>\n</ol>"],
				tab:['something',''],
				completion: {
					'something':['text','snippet']
				},
				loop: true, //optional, default true
				start: 5 //position snippet[2] default false == snippet[2].length, true == 0
			},

			"li" : {
				snippet:["<li>","something here","</li>"],
				tab:['something here','']
			},
			"</li>" : {
				snippet:["</li>\n<li>","something here","</li>"],
				tab:['something here','']
			},

			"new Class" : {
				scope: {"<javascript>":"</javascript>"},
				snippet:["new Class({\n		initialize: function(value){\n				","this.key = value;","\n		}\n});"],
				tab:['this.key','key','value']
			},

			".extend" : {
				snippet:[".extend({\n		","initialize: function(value){\n				","\n		}\n});"],
				tab:['initialize','value',''],
				start:true
			},

			"date" : {
				command: function(k){
					var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
							monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"],
							dt = new Date(),
							y	= dt.getYear();
					if (y < 1000) y +=1900;
					return {
						//key:"date", optional
						snippet:['',dayNames[dt.getDay()] + ", " + monthNames[dt.getMonth()] + " " + dt.getDate() + ", " + y,' '],
						tab:[dayNames[dt.getDay()] + ", " + monthNames[dt.getMonth()] + " " + dt.getDate() + ", " + y,'']
					};
				}
			},

			"a" : {
				snippet:['<a href="','http://" title="desc">text','</a> '],
				tab:['http://',' title="desc"','desc','text','']
			},

			"{" : ["{\n		","","\n"]

		},

		smartTypingPairs: {
			'"' : '"',
			'(' : ')',
			'{' : '}',
			'[' : ']',
			"<" : ">",
			"`" : "`",
			"'" : {
				scope:{
					"<javascript>":"</javascript>",
					"<code>":"</code>",
					"<html>":"</html>"
				},
				pair:"'"
			}
		},

		//ctrl+shift+number
		selections: {
			"0": function(sel){
				return ['<strong>',sel,'</strong>'];
			},
			"1": function(sel){
				return ['<em>',sel,'</em>'];
			},
			"2": function(sel){
				return ['<blockquote>',sel,'</blockquote>'];
			},
			"3": function(sel){
				return ['<code>',sel,'</code>'];
			},
			"4": function(sel){
				return ['<javascript>',sel,'</javascript>'];
			},
			"5": function(sel){
				return ['<html>',sel,'</html>'];
			},
			"6": function(sel){
				return ['<a href="">',sel,'</a>'];
			},
			"7": function(sel){
				return {
					selection: [this.ss(),this.se()],
					snippet: ['',sel.toLowerCase(),'']
				};
			},
			"8": function(sel){
				return ['',sel.toUpperCase(),''];
			},
			"9": function(sel){
				var mtoc = /<([^<>]*)>/g;
				return ['',sel.replace(mtoc,"&lt;$1&gt;"),''];
			}
		}		
	}
});$extend(Browser, {
	getHost: function(url) {
		return new URI(url).get('host');
	},
	getQueryStringValue: function(key, url){
		return new URI(url).getData(key);
	},
	getQueryStringValues: function(url){
		return new URI(url).getData();
	},
	getPort: function(url){
		return new URI(url).get('port');
	},
	redraw: function(element){
	    var n = document.createTextNode(' ');
	    this.adopt(n);
	    (function(){n.dispose()}).delay(1);
	    return this;
	}	
});
window.addEvent('domready', function(){
	var count = 0;
	//this is in case domready fires before string.extras loads
	function setQs(){
		function retry(){
			count++;
			if (count < 20) setQs.delay(50);
		}; 
		try {
			if (!Browser.getQueryStringValues()) retry();
			else Browser.qs = Browser.getQueryStringValues();
		} catch(e){
			retry();
		}
	}
	setQs();
});$extend(Class.prototype, { 
	refactor: function(props){ 
		this.prototype = Class.refactor(this, props).prototype;
		return this;
	}
});Number.implement({
	zeroise: function(length) {
		return String(this).zeroise(length);
	}
});

String.implement({
	zeroise: function(length) {
		return '0'.repeat(length - this.length) + this;
	}
});

Date.prototype.compare = Date.prototype.diff;
Date.prototype.strftime = Date.prototype.format;$E = document.getElement.bind(document);//returns a collection given an id or a selector
$G = function(elements) {
	return $splat(document.id(elements)||$$(elements));
};/*

Element Property: inputValue {#Element-Properties:inputValue}
-------------------------------------------------------------

### Setter:

Sets the value of the form Element.

#### Syntax:

	myElement.set('inputValue', value);

#### Arguments:

1. value - (*mixed*) a *string*, *boolean*, or *array*, depending on the type of input.

#### Returns:

* (*element*) This Element.

#### Notes:

* When this setter is used on a standard text input or textarea, it just proxies *myInput.set('value', value);*
* When used on a radio or checkbox, you can pass in a *boolean* to check or uncheck it, or pass in a *string* and if the string matches the name, the input will be checked
* When used on a select, you can pass in a *string* for the option to check (unchecking all others) or an *array* of strings to check more than one (for multi-selects) 

#### Examples:

	document.id('mySelect').set('inputValue', 'option1'); //option with value 'option1' is selected
	document.id('myMultiSelect').set('inputValue', ['option1', 'option2']); 
		//options w/ values 'option1' and 'option2' are selected
	document.id('myRadio').set('inputValue', true); //the radio is checked
	document.id('myRadio').set('inputValue', 'red'); //if the radio's name is 'red', it is checked
	document.id('myCheckbox').set('inputValue', true); //the checkbox is checked
	document.id('myCheckbox').set('inputValue', 'red'); //if the checkbox's name is 'red', it is checked
	document.id('myTextArea').set('inputValue', 'foo'); //the value of the textarea is 'foo'
	document.id('myTextInput').set('inputValue', 'foo'); //the value of the text input is 'foo'

### Getter:	
	
Returns the value of the input.

#### Syntax:

	myElement.get('inputValue');

#### Returns:

* (*mixed*) Depending on the type of object, it may return a *string*, *boolean*, or *array*

#### Notes:

* When this getter is used on a standard text input or textarea, it just proxies *myInput.get('value');*
* When used on a checkbox, if the input is checked it will return the *true*, other wise *false*
* When used on a radio it will return the value of the radio that is checked that shares the same name or *null* if none are.
* When used on a select list it will return the value (a *string*) of the selected option or its text value if the value is not defined
* When used on a multi-select it will always return an *array* of the values (*strings*) of the selected options (or their text values if value is not defined)

*/

Element.Properties.inputValue = {

	get: function(){
		 switch(this.get('tag')) {
		 	case 'select':
				vals = this.getSelected().map(function(op){ 
					var v = $pick(op.get('value'),op.get('text')); 
					return (v=="")?op.get('text'):v;
				});
				return this.get('multiple')?vals:vals[0];
			case 'input':
				switch(this.get('type')) {
					case 'checkbox':
						return this.get('checked')?this.get('value'):false;
					case 'radio':
						var checked;
						if (this.get('checked')) return this.get('value');
						document.id(this.getParent('form')||document.body).getElements('input').each(function(input){
							if (input.get('name') == this.get('name') && input.get('checked')) checked = input.get('value');
						}, this);
						return checked||null;
				}
		 	case 'input': case 'textarea':
				return this.get('value');
			default:
				return this.get('inputValue');
		 }
	},

	set: function(value){
		switch(this.get('tag')){
			case 'select':
				this.getElements('option').each(function(op){
					var v = $pick(op.get('value'), op.get('text'));
					if (v=="") v = op.get('text');
					op.set('selected', $splat(value).contains(v));
				});
				break;
			case 'input':
				if (['radio','checkbox'].contains(this.get('type'))) {
					this.set('checked', $type(value)=="boolean"?value:$splat(value).contains(this.get('value')));
					break;
				}
			case 'textarea': case 'input':
				this.set('value', value);
				break;
			default:
				this.set('inputValue', value);
		}
		return this;
	},

	erase: function() {
		switch(this.get('tag')) {
			case 'select':
				this.getElements('option').each(function(op) {
					op.erase('selected');
				});
				break;
			case 'input':
				if (['radio','checkbox'].contains(this.get('type'))) {
					this.set('checked', false);
					break;
				}
			case 'input': case 'textarea':
				this.set('value', '');
				break;
			default:
				this.set('inputValue', '');
		}
		return this;
	}

};/*
Script: Element.MouseOvers.js

Collection of mouseover behaviours (images, class toggles, etc.).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Element.implement({
	autoMouseOvers: function(options){
		options = $extend({
			outString: '_out',
			overString: '_over',
			cssOver: 'hover',
			cssOut: 'hoverOut',
			subSelector: '',
			applyToBoth: false
		}, options);
		el = this;
		if (options.subSelector) {
			el = this.getElements(options.subSelector);
			if (el.every(function(kid){
				return kid.retrieve('autoMouseOverSetup');
			})) return this;
		}
		el.store('autoMouseOverSetup', true);
		return el.addEvents({
			mouseenter: function(){
				this.swapClass(options.cssOut, options.cssOver);
				if (this.src && this.src.contains(options.outString))
					this.src = this.src.replace(options.outString, options.overString);
				if (options.applyToBoth && options.subSelector) {
					this.getElements(options.subSelector).each(function(el){
						el.swapClass(options.cssOut, options.cssOver);
					});
				}
			}.bind(this),
			mouseleave: function(){
				this.swapClass(options.cssOver, options.cssOut);
				if (this.src && this.src.contains(options.overString))
					this.src = this.src.replace(options.overString, options.outString);
				if (options.applyToBoth && options.subSelector) {
					this.getElements(options.subSelector).each(function(el){
						el.swapClass(options.cssOver, options.cssOut);
					});
				}
			}.bind(this)
		}).swapClass(options.cssOver, options.cssOut);
		el = null;
	}
});
window.addEvent('domready', function(){
	$$('img.autoMouseOver').each(function(img){
		img.autoMouseOvers();
	});
});
(function(){
	var orig = Element.prototype.setPosition;
	Element.implement({
		setPosition: function(options){
			//call setPosition if the options are x/y values
			if (options && ($defined(options.x) || $defined(options.y))) return orig.apply(this, arguments);
			else return this.position(options);
		}
	});
})();Element.alias('isDisplayed', 'isVisible');IframeShim = Class.refactor(IframeShim, {
	initialize: function(element, options){
		if (options && options.zindex) options.zIndex = options.zindex;
		this.previous(element, options);
	}
});var JsonP = Class.refactor(Request.JSONP, {
	initialize: function() {
		var params = Array.link(arguments, {url: String.type, options: Object.type});
		options = (params.options || {});
		options.url = options.url || params.url;
		if (options.callBackKey) options.callbackKey = options.callBackKey;
		this.previous(options);
	},
	getScript: function(options) {
		var queryString = options.queryString || this.options.queryString;
		if(options.url && queryString) options.url += (options.url.indexOf("?") >= 0 ? "&" : "?") + queryString;
		var script = this.previous(options);
		if ($chk(options.globalFunction)) {
			window[options.globalFunction] = function(r){
				JsonP.requestors[index].handleResults(r)
			};
		}
		return script;
	},
	request: function(url) {
		this.send({url: url||this.options.url});
	}
});var Modalizer = new Class({
	defaultModalStyle: {
		display:'block',
		position:'fixed',
		top:0,
		left:0,	
		'z-index':5000,
		'background-color':'#333',
		opacity:0.8
	},
	setModalOptions: function(options){
		this.modalOptions = $merge({
			width:(window.getScrollSize().x),
			height:(window.getScrollSize().y),
			elementsToHide: 'select, embed' + (Browser.Engine.trident ? '': ', object'),
			hideOnClick: true,
			modalStyle: {},
			updateOnResize: true,
			layerId: 'modalOverlay',
			onModalHide: $empty,
			onModalShow: $empty
		}, this.modalOptions, options);
		return this;
	},
	layer: function(){
		if (!this.modalOptions.layerId) this.setModalOptions();
		return document.id(this.modalOptions.layerId) || new Element('div', {id: this.modalOptions.layerId}).inject(document.body);
	},
	resize: function(){
		if (this.layer()) {
			this.layer().setStyles({
				width:(window.getScrollSize().x),
				height:(window.getScrollSize().y)
			});
		}
	},
	setModalStyle: function (styleObject){
		this.modalOptions.modalStyle = styleObject;
		this.modalStyle = $merge(this.defaultModalStyle, {
			width:this.modalOptions.width,
			height:this.modalOptions.height
		}, styleObject);
		if (this.layer()) this.layer().setStyles(this.modalStyle);
		return(this.modalStyle);
	},
	modalShow: function(options){
		this.setModalOptions(options);
		this.layer().setStyles(this.setModalStyle(this.modalOptions.modalStyle));
		if (Browser.Engine.trident4) this.layer().setStyle('position','absolute');
		this.layer().removeEvents('click').addEvent('click', function(){
			this.modalHide(this.modalOptions.hideOnClick);
		}.bind(this));
		this.bound = this.bound||{};
		if (!this.bound.resize && this.modalOptions.updateOnResize) {
			this.bound.resize = this.resize.bind(this);
			window.addEvent('resize', this.bound.resize);
		}
		if ($type(this.modalOptions.onModalShow)  == "function") this.modalOptions.onModalShow();
		this.togglePopThroughElements(0);
		this.layer().setStyle('display','block');
		return this;
	},
	modalHide: function(override, force){
		if (override === false) return false; //this is internal, you don't need to pass in an argument
		this.togglePopThroughElements(1);
		if ($type(this.modalOptions.onModalHide) == "function") this.modalOptions.onModalHide();
		this.layer().setStyle('display','none');
		if (this.modalOptions.updateOnResize) {
			this.bound = this.bound||{};
			if (!this.bound.resize) this.bound.resize = this.resize.bind(this);
			window.removeEvent('resize', this.bound.resize);
		}
		return this;
	},
	togglePopThroughElements: function(opacity){
		if (Browser.Engine.trident4 || (Browser.Engine.gecko && Browser.Platform.mac)) {
			$$(this.modalOptions.elementsToHide).each(function(sel){
				sel.setStyle('opacity', opacity);
			});
		}
	}
});OverText = Class.refactor(OverText, {
	initialize: function(inputs, options){
		this.instances = [];
		if (['array', 'string'].contains($type(inputs))) {
			this.setOptions(options);
			$$(inputs).each(this.addElement, this);
		} else {
			return this.previous.apply(this, arguments);
		}
	},
	addElement: function(el) {
		this.instances.push(new OverText(el, this.options))
	},
	startPolling: function(){
		if (!this.instances || !this.instances.length) return this.previous.apply(this, arguments);
		this.instances.each(function(instance) {
			instance.startPolling();
		});
	},
	stopPolling: function(){
		if (!this.instances.length) return this.previous.apply(this, arguments);
		this.instances.each(function(instance) {
			instance.stopPolling();
		});
	},
	hideTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.hide();
	},
	showTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.show();
	},
	testOverTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.test();		
	},
	repositionAll: function() {
		this.instances.each(function(instance) {
			instance.reposition();
		});
	},
	repositionOverTxt: function(el) {
		var ot = el.retrieve('OverText');
		if (ot) ot.reposition();
	}

});Request.Queue = Class.refactor(Request.Queue, {
	initialize: function(options) {
		if (options) {
			$each({
				onRequestStart: 'onRequest', 
				onRequestSuccess: 'onSuccess',
				onRequestComplete: 'onComplete',
				onRequestCancel: 'onCancel',
				onRequestException: 'onException',
				onRequestFailure: 'onFailure'
			}, function(value, key) {
				if (options[key]) options[value] = options[key];
			});
		}
		this.previous(options);
	}
});String.implement({
	findAllEmails: function(){
			return this.match(new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "gi")) || [];
	}
});
String.alias('parseQueryString', 'parseQuery');/*
Script: Waiter.Compat.js

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Waiter = new Class({
	
	Extends: Spinner,
	
	options: {
		baseHref: 'http://www.cnet.com/html/rb/assets/global/waiter/',
		containerProps: {
			styles: {
				position: 'absolute',
				'text-align': 'center'
			},
			'class':'waiterContainer'
		},
		containerPosition: {},
		msg: false,
		msgProps: {
			styles: {
				'text-align': 'center',
				fontWeight: 'bold'
			},
			'class':'waiterMsg'
		},
		img: {
			src: 'waiter.gif',
			styles: {
				width: 24,
				height: 24
			},
			'class':'waiterImg'
		},
		layer:{
			styles: {
				width: 0,
				height: 0,
				position: 'absolute',
				zIndex: 999,
				display: 'none',
				opacity: 0.9,
				background: '#fff'
			},
			'class': 'waitingDiv'
		},
		useIframeShim: true,
		fxOptions: {},
		injectWhere: null
//	iframeShimOptions: {},
//	onShow: $empty
//	onHide: $empty
	},

	render: function(){
		this.parent();
		this.waiterContainer = this.element.set(this.options.containerProps);
		if (this.msgContainer) this.msgContainer = this.content.set(this.options.msgProps);
		
		if (this.options.img) this.waiterImg = document.id(this.options.img.id) || new Element('img', $merge(this.options.img, {
			src: this.options.baseHref + this.options.img.src
		})).inject(this.img);
		this.element.set(this.options.layer);
	},
	place: function(){
		this.inject.apply(this, arguments);
	},
	reset: function(){
		return this.hide();
	},
	start: function(element){
		return this.show();
	},
	stop: function(callback){
		return this.hide();
	}
});

if (window.Request) {
	Request = Class.refactor(Request, {
		options: {
			useWaiter: false,
			waiterOptions: {},
			waiterTarget: false
		},
		initialize: function(options){
			if (options) {
				if (options.useWaiter) options.useSpinner = options.useWaiter;
				if (options.waiterOptions) options.spinnerOptions = options.waiterOptions;
				if (options.waiterTarget) options.spinnerTarget = options.waiterTarget;
			}
			this.previous(options);
		}
	});
}

Element.Properties.waiter = {

	set: function(options){
		return this.set('spinner', options);
	},

	get: function(options){
		return this.get('spinner', options);
	}

};

Element.implement({

	wait: function(options){
		return this.spin(options);
	},
	
	release: function(){
		return this.unspin(options);
	}

});