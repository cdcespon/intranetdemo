/*!
  * Based on: Bootstrap Dynamic Tabs v1.0.3 (https://github.com/JayrAlencar/bootstrap-dynamic-tabs)
  * Copyright 2015 Jayr Alencar (http://jayralencar.com.br)
 * Licensed under the The MIT License (MIT) (https://github.com/JayrAlencar/bootstrap-dynamic-tabs/blob/master/LICENSE)
 */
var anchor;
(function ($) {
 	
 	var tabs = [];
 	$.fn.bootstrapDynamicTabs = function(options) {
 		var settings = $.extend({
            // These are the defaults
        }, options );

 		if(this.find('.nav-tabs').length==0){
 			this.append($('<ul/>', {class: 'nav nav-tabs'}).sortable({
 				connectWith: this
 			}));
 		}else{
 			this.find('.nav-tabs').sortable({
 				connectWith: this
 			});
 		}

 		if(this.find('.tab-content').length==0){
 			this.append($('<div/>', {class: 'tab-content'}));
 		}

 		return this;
 	};

 	$.fn.addTab = function(options){
 		var settings = $.extend({
            // These are the defaults.
            title: "Parent Title",
            closable: true,
			reloadble: true

        }, options );

 		if(!settings.id){
 			settings.id = processId(settings.title);
 		}else{
 			settings.id = processId(settings.id)
 		}

 		if(tabs.indexOf(settings.id)>=0){
 			var aba = this.find('.nav-tabs').find('li').find('a[href="#'+settings.id+'"]');
 			aba.tab('show');
 			$(settings.id).tab('show');
 		}else{

 			tabs.push(settings.id);

 			btn_close = $('<button/>', {
 			    class: 'close fa fa-times',
 				type: 'button'
 			}).text('').click(function(){
				
 				closer = $(this);     
 				a = closer.parent();
 				href = a.attr('href');
 				a.parent().remove(); 
 				var active = $(href).hasClass('active');
 				$(href).remove();
 				var idx = href.substring(1);
				var indiceAnterior = tabs.indexOf(idx) - 1;
				tabs.splice(tabs.indexOf(idx),1);
 				if(active){
 					//$('.nav-tabs li:eq(0) a').tab('show');	
					$('.nav-tabs li:eq(' + indiceAnterior +') a').tab('show');	
 				}
 			});
			
 			btn_reload = $('<button/>', {
 			    class: 'close fa fa-repeat',
 				type: 'button'
 			}).text('').click(function(){
				var srcIframe;
				if ($('.tab-pane.active iframe')[0].src.indexOf('aux=') != -1)
					srcIframe = $('.tab-pane.active iframe')[0].src.substring(0, $('.tab-pane.active iframe')[0].src.indexOf('aux=')) + 'aux=' + new Date().toLocaleString();
				else
					srcIframe = $('.tab-pane.active iframe')[0].src
				
				$('.tab-pane.active iframe')[0].src = srcIframe;
				
 			});

 			this.find('.active').removeClass('active')

 			 anchor = $('<a/>',{
 				href: '#'+settings.id,
 				'data-toggle': 'tab',
 			    'style' : 'display:inline-block; vertical-align: middle;'
 			});

 			if(settings.closable){
 				anchor.mousedown(function(e) {
 					e.stopPropagation();
 					if(e.which == 2){
 						a = $(this);
 						href = a.attr('href');
 						a.parent().remove(); 
 						var active = $(href).hasClass('active');
 						$(href).remove();
 						var idx = href.substring(1)
 						tabs.splice(tabs.indexOf(idx),1);
 						if(active){
							
 							$('.nav-tabs li:eq(0) a').tab('show');	
 						}
 						return false;
 					}
 				})
 			}
			//FALTA UNO DE ESTOS??

 			if(settings.icon){
 				anchor.append($('<i/>').addClass(settings.icon)).append(' ')
 			}

 			if(settings.closable){
 				anchor.append(btn_close)
 			}

 			if(settings.closable){
 				anchor.append(btn_reload)
 			}
			
 			if (settings.title) {
 			    anchor.append('&nbsp;&nbsp;' + settings.title + '&nbsp;&nbsp;')
 			}

 			if (settings.loadingimage) {
 			    anchor.append('<img class="' + settings.id + '" id="imgloading" src="' + settings.loadingimage + '" height="18px" width="18px" style="align-content:center" />&nbsp;&nbsp;')
 			}

			//Loading scripts
			if(settings.loadScripts){

				if(typeof(settings.loadScripts) == 'string'){
					var script = $('<script/>',{
						type:"text/javascript",
						src: settings.loadScripts
					});
					$('head').append(script)
					btn_close.on('click',function(){
						script.remove();
					})
				}else if(typeof(settings.loadScripts) == 'object'){
					var scripts = [];
					for(var i = 0 ; i < settings.loadScripts.length; i++){
						var script = $('<script/>',{
							type:"text/javascript",
							src: settings.loadScripts[i]
						});
						scripts.push(script);
						$('head').append(script);

					}
					btn_close.on('click',function(){
						for(var i = 0 ; i < scripts.length; i++){
							scripts[i].remove();	
						}
					})
				}
			}

			//Loading CSS
			if(settings.loadStyles){
				if(typeof(settings.loadStyles) == 'string'){
					var style = $('<link/>',{
						href: settings.loadStyles,
						rel: 'stylesheet',
						type: 'text/css'
					});
					$('head').append(style);
					btn_close.on('click', function(){
						style.remove();
					})

				}else if(typeof(settings.loadStyles) == 'object'){
					var styles = [];
					for(var i = 0 ; i < settings.loadStyles.length; i++){
						var style = $('<link/>',{
							href: settings.loadStyles[i],
							rel: 'stylesheet',
							type: 'text/css'
						});
						styles.push(style);
						$('head').append(style);
					}
					btn_close.on('click',function(){
						for(var i = 0 ; i < styles.length; i++){
							styles[i].remove();	
						}
					})
				}
			}

			this.find('.nav-tabs').append($('<li/>', {class:'active'})
				.append(anchor));

			this.find('.tab-content').append($('<div/>', {
				class:'tab-pane active',
				id: settings.id
			}));

			var page = this.find('.tab-content').find('#'+settings.id);

			if(settings.text){
				page.text(settings.text)
			}

			if(settings.html){
				page.html(settings.html)
			}

			if (settings.iframeurl) {
			    if (settings.loadingimage) {
			        page.html('<iframe style="background-color:white;" id="' + settings.id + '" src="' + settings.iframeurl + '"  width="100%" height="900px" frameborder="0"  onload="onLoadHandler(this);"></iframe>')
			        //page.html('<div class="' + settings.id + '" width="300px" heigth="800px"><img style="display:block;margin:auto;margin-top:auto;;margin-bottom:auto" class="' + settings.id + '" id="imgloading" src="' + settings.loadingimage + '" height="50px" width="50px" style="align-content:center" /></div><iframe style="background-color:#d7ebf9;" id="' + settings.id + '" src="' + settings.iframeurl + '"  width="100%" height="900px" frameborder="0"  onload="onLoadHandler(this);"></iframe>')
			    }
			    else {
			        page.html('<div class="' + settings.id + '" width="300px" heigth="800px"></div><iframe style="background-color:#d7ebf9;" id="' + settings.id + '" src="' + settings.iframeurl + '"  width="100%" height="900px" frameborder="0"  onload="onLoadHandler(this);"></iframe>')
			        //page.html('<div class="' + settings.id + '" width="300px" heigth="800px"></div><iframe style="background-color:#d7ebf9;" id="' + settings.id + '" src="' + settings.iframeurl + '"  width="100%" height="900px" frameborder="0"  onload="onLoadHandler(this);"></iframe>')
			    }

			}
	
			if(settings.ajaxUrl){
				$.ajax({
		            mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
		            url: settings.ajaxUrl,
		            type: 'GET',
		            success: function(data) {
		            	page.html(data)
		            },
		            error: function (jqXHR, textStatus, errorThrown) {
		            	alert(errorThrown);
		            },
		            dataType: "html"
		            // async: false
		        });
			}
		}
		return this;
	}

	$.fn.closeById = function(id){
		a = this.find('.nav-tabs').find('a[href="#'+id+'"]');
		if (a.length > 0){
		href = a.attr('href');
		a.parent().remove(); 
		var active = $(href).hasClass('active');
		$(href).remove();
		var idx = href.substring(1)
		tabs.splice(tabs.indexOf(idx),1);
		if(active){
			$('.nav-tabs li:eq(0) a').tab('show');	
		}
		}
	}
	
	$.fn.reloadById = function(id){
		var srcIframe;
		if ($('.tab-pane #' + id)[0].src.indexOf('aux=') != -1)
			srcIframe = $('.tab-pane #' + id)[0].src.substring(0, $('.tab-pane #' + id)[0].src.indexOf('aux=')) + 'aux=' + new Date().toLocaleString();
		else
			srcIframe = $('.tab-pane #' + id)[0].src
		
		$('.tab-pane #' + id)[0].src = srcIframe;
	}

		$.fn.closeAll = function () {

	    var tabsLength = tabs.length;

	    while (tabs.length > 1) {
	        a = this.find('.nav-tabs').find('a[href="#' + tabs[tabs.length -1] + '"]');
	        href = a.attr('href');
	        a.parent().remove();
	        var active = $(href).hasClass('active');
	        $(href).remove();
	        var idx = href.substring(1)
	        tabs.splice(tabs.indexOf(idx), 1);
	    }

	    a = this.find('.nav-tabs').find('a[href="#' + tabs[0] + '"]');
	    href = a.attr('href');
	    var active = $(href).hasClass('active');
	    if (!active) {
	        $('.nav-tabs li:eq(0) a').tab('show');
	    }

	}
	
	$.fn.closeThis = function(){
		a = this.find('.nav-tabs').find('.active').find('a');
		href = a.attr('href');
		a.parent().remove(); 
		var active = $(href).hasClass('active');
		$(href).remove();
		var idx = href.substring(1)
		tabs.splice(tabs.indexOf(idx),1);
		if(active){
			$('.nav-tabs li:eq(0) a').tab('show');	
		}
	}

	function processId(s){
		var r=s.toLowerCase();
		r = r.replace(new RegExp("\\s", 'g'),"");
		r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
		r = r.replace(new RegExp("æ", 'g'),"ae");
		r = r.replace(new RegExp("ç", 'g'),"c");
		r = r.replace(new RegExp("[èéêë]", 'g'),"e");
		r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
		r = r.replace(new RegExp("ñ", 'g'),"n");                            
		r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
		r = r.replace(new RegExp("œ", 'g'),"oe");
		r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
		r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
		r = r.replace(new RegExp("\\W", 'g'),"");
		r = r.replace(/[^\w\s]/gi, '');
		return r;
	}
}( jQuery ));
 function onLoadHandler(iframe) {
     var sdiv = "." + iframe.id.toLowerCase();
     $(sdiv).hide();
 }
