/*
 * Flexigrid for jQuery - New Wave Grid
 *
 * Copyright (c) 2008 Paulo P. Marinas (webplicity.net/flexigrid)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-07-14 00:09:43 +0800 (Tue, 14 Jul 2008) $
 */
 
(function($){
		  
	$.addFlex = function(t,p)
	{

		if (t.grid) return false; //return if already exist
		
		// apply default properties
		p = $.extend({
			 height: 'auto', //auto height
			 width: 'auto', //auto width
			 striped: true, //apply odd even stripes
			 novstripe: false,
			 minwidth: 30, //min width of columns
			 minheight: 80, //min height of columns
			 resizable: false, //resizable table
			 url: false, //ajax url
			 method: 'POST', // data sending method
			 dataType: 'xml', // type of data loaded
			 errormsg: 'Connection Error',
			 usepager: false, //
			 nowrap: true, //
			 page: 1, //current page
			 total: 1, //total pages
			 useRp: true, //use the results per page select box
			 rp: 15, // results per page
			 rpOptions: [10,15,20,25,40],
			 title: false,
			 colModel: false, // the column model.
			 pagestat: 'Displaying {from} to {to} of {total} items',
			 procmsg: 'Processing, please wait ...',
			 hidecolmsg: 'Hide/Show Columns',
			 mintablemsg: 'Minimize/Maximize Table',
			 query: '',
			 qtype: '',
			 nomsg: 'No items',
			 minColToggle: 1, //minimum allowed column to be hidden
			 showToggleBtn: true, //show or hide column toggle popup
			 showPageStat: true,// show or hide the page statistics in the footer
			 hideOnSubmit: true,
			 autoload: true,
			 blockOpacity: 0.5,
			 onToggleCol: false,// using custom change visibility of column function 
			 onChangeSort: false, // using custom change sort function
			 preProcess: false, // using custom pre processing before addData function 
			 onSuccess: false, // using custom validate after addData function
			 onChangePage: false, // using custom change page function
			 onSubmit: false, // using a custom populate function
			 onPopulateCallback: false, // using a custom populate callback function with parsed params
			 onDragCol: false, // using a custom on column dragdrop callback function
			 onResizeCol: false, // using a custom on column resizing callback function
			 onResizeGrid: false, // using a custom on grid resizing callback function
			 owner: false, // the owner of the flexigrid component is used as 'this' for all callbacks
			 debug: false, // if true, you may see dub messages in the console (e.g. firebug)
			 sortorder: 'asc', // the initial sorting method for the pre-sorted column
			 sortModel: {columns: []}, // the sorting model contains columns with sort information
			 clientsort: true, // if true, the table is sorted on every processing request client side.
			 digitGroupDL: '.',// the delimiter to separate a group of digits (this is extracted during the search)
             decimalDelimiter: ',', // the delimiter to separate Decimal-Values
			 heightOffset: 100, // the offset used to correctly auto height the flexigrid table. Just play with the value.
             searchitems: false
		  }, p);
		  		

		$(t)
		.show() //show if hidden
		.attr({cellPadding: 0, cellSpacing: 0, border: 0})  //remove padding and spacing
		.removeAttr('width') //remove width properties	
		;

        // -----------------------------------------------------------------------------------------------------------

		//create grid class
		var g = {
			hset : {},
			rePosDrag: function () {
				// If Debugging is enabled record the start time of the rendering process.
                if (p.debug) {
                    var startTime = new Date();
                }
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft>0) cdleft -= Math.floor(p.cgwidth/2);
				$(g.cDrag).css({top:g.hDiv.offsetTop+1});
				var cdpad = this.cdpad;
				// Select all possible drags and hide it. The selection is stored to a variable because
		        // we will reuse it later while iterate through the header cells.
				var qdrags = $('div', g.cDrag);
				qdrags.hide();
                // We do not use the regular each method of jQuery because we do need the index of the
                // header cell for other operation with the drags. (each is usually also slower than for)
                var qheaders = $('thead tr:first th:visible', this.hDiv);
                for (var n = 0; n < qheaders.length; n++) {
                    var cdpos = parseInt($('div', qheaders[n]).width());
                    if (cdleft == 0) {
                        cdleft -= Math.floor(p.cgwidth / 2);
                    }
                    cdpos = cdpos + cdleft + cdpad;
                    // Select the drag which is equals to the index of the current header cell.
                    $(qdrags[n]).css('left', cdpos + 'px').show();
                    cdleft = cdpos;
                }
                if (p.debug && window.console && window.console.log) {
                    // If debugging is enabled log the duration of this operation.
                    console.log('Duration of rePosDrag :' + (new Date() - startTime) + 'ms');
                }
            },
			
            /* ~~~~~ ECHO3 special handling start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
            autoColumnWidth: function () {
            	// If Debugging is enabled record the start time of the rendering process.
                if (p.debug) {
                    var startTime = new Date();
                }
                var n = 0;
                var flexgrid = this;
                $('thead tr:first th:visible',this.hDiv).each(
                        function() {
                            // ? Do we really need to readdress the part; isn't it available somehow by the jquery.each()?
                            var columnWidth =  $('th:visible div:eq('+n+')',this.hDiv).width();
                            $('tr',flexgrid.bDiv).each (
                                    function ()
                                    {
                                        var cellWidth = $('td:visible div:eq('+n+')',this).width();
                                         if (columnWidth < cellWidth) {
                                         columnWidth = cellWidth;
                                         }
                                    }
                                    );

                            $('th:visible div:eq('+n+')',flexgrid.hDiv).css('width',columnWidth);
                            $('tr',flexgrid.bDiv).each (
                                    function ()
                                    {
                                        $('td:visible div:eq('+n+')',this).css('width',columnWidth);
                                    }
                                    );
                            $(flexgrid.hDiv).scrollLeft($(flexgrid.bDiv).scrollLeft);
                            flexgrid.rePosDrag();
                            flexgrid.fixHeight();
                            n++;

                        });
				if (p.debug && window.console && window.console.log) {
                    // If debugging is enabled log the duration of this operation.
                    var nowTime = new Date();
                    console.log('Duration of autoColumnWidth :' + (nowTime - startTime) + 'ms');
                }                        
            },
            /* ~~~~~ ECHO3 special handling END   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
			/**
			 * Method used to fix the height of the column drag-lines and the 
			 * column visibility menu height (nDiv).
			 */
			fixHeight: function (newH) {
				// If Debugging is enabled record the start time of the rendering process.
                if (p.debug) {
                    var startTime = new Date();
                }
				newH = false;
				if (!newH) newH = $(g.bDiv).height();
				var hdHeight = $(this.hDiv).height();
				$('div',this.cDrag).each(
					function ()
						{
							$(this).height(newH+hdHeight);
						}
				);
				
				/* 
				 * adjust the column visibility menu height (nDiv).
				 */
				/*
				var nd = parseInt($(g.nDiv).height());
				if (nd>newH)
					$(g.nDiv).height(newH).width(200);
				else
					$(g.nDiv).height('auto').width('auto');
				*/
				$(g.block).css({height:newH,marginBottom:(newH * -1)});
				
				var hrH = g.bDiv.offsetTop + newH;
				if (p.height != 'auto' && p.resizable) hrH = g.vDiv.offsetTop;
					$(g.rDiv).css({height: hrH});
					
				if (p.debug && window.console && window.console.log) {
                    // If debugging is enabled log the duration of this operation.
                    var nowTime = new Date();
                    console.log('Duration of fixHeight :' + (nowTime - startTime) + 'ms');
                } 
				
			},
			dragStart: function (dragtype,e,obj) { //default drag function start
				
				if (dragtype=='colresize') //column resize
					{
						$(g.nDiv).hide();$(g.nBtn).hide();
						var n = $('div',this.cDrag).index(obj);
						var ow = $('th:visible div:eq('+n+')',this.hDiv).width();
						$(obj).addClass('dragging').siblings().hide();
						$(obj).prev().addClass('dragging').show();
						
						this.colresize = {startX: e.pageX, ol: parseInt(obj.style.left), ow: ow, n : n };
						$('body').css('cursor','col-resize');
					}
				else if (dragtype=='vresize') //table resize
					{
						var hgo = false;
						$('body').css('cursor','row-resize');
						if (obj) 
							{
							hgo = true;
							$('body').css('cursor','col-resize');
							}
						this.vresize = {h: p.height, sy: e.pageY, w: p.width, sx: e.pageX, hgo: hgo};
						
					}

				else if (dragtype=='colMove') //column header drag
					{
						$(g.nDiv).hide();$(g.nBtn).hide();
						this.hset = $(this.hDiv).offset();
						this.hset.right = this.hset.left + $('table',this.hDiv).width();
						this.hset.bottom = this.hset.top + $('table',this.hDiv).height();
						this.dcol = obj;
						this.dcoln = $('th',this.hDiv).index(obj);
						
						this.colCopy = document.createElement("div");
						this.colCopy.className = "colCopy";
						this.colCopy.innerHTML = obj.innerHTML;
						if ($.browser.msie)
						{
						this.colCopy.className = "colCopy ie";
						}
						
						
						$(this.colCopy).css({position:'absolute',"float":'left',display:'none', textAlign: obj.align});
						
						$('body').append(this.colCopy);
						$(this.cDrag).hide();
						
					}
														
                // ECHO3: Die entsprechende Eigeneschaft wird wohl nicht  inherited, weil vermutlich
                // umliegende Echo-Komponenten diese woanders definierem:
                // Daher auf dem flexigrid-DIV selber arbeiten statt dem globalen BODY-Tag
                //$('body').noSelect();
				$(g.gDiv).noSelect();

			},
			dragMove: function (e) {
			
				if (this.colresize) //column resize
					{
						var n = this.colresize.n;
						var diff = e.pageX-this.colresize.startX;
						var nleft = this.colresize.ol + diff;
						var nw = this.colresize.ow + diff;
						if (nw > p.minwidth)
							{
								$('div:eq('+n+')',this.cDrag).css('left',nleft);
								this.colresize.nw = nw;
							}
					}
				else if (this.vresize) //table resize
					{
						var v = this.vresize;
						var y = e.pageY;
						var diff = y-v.sy;
						
						if (!p.defwidth) {
                            p.defwidth = p.width;
                        }
						
						if (p.width != 'auto' && !p.nohresize && v.hgo)
						{
							var x = e.pageX;
							var xdiff = x - v.sx;
							var newW = v.w + xdiff;
							if (newW > p.defwidth)
								{
									this.gDiv.style.width = newW + 'px';
									p.width = newW;
								}
						}
						
						var newH = v.h + diff;
						if ((newH > p.minheight || p.height < p.minheight) && !v.hgo)
							{
								this.bDiv.style.height = newH + 'px';
								p.height = newH;
								this.fixHeight(newH);
							}
						v = null;
					}
				else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver'); 
					if (e.pageX > this.hset.right || e.pageX < this.hset.left
                            || e.pageY > this.hset.bottom || e.pageY < this.hset.top)
                    {
						//this.dragEnd();
						$('body').css('cursor','move');
					} else {
                        $('body').css('cursor', 'pointer');
                    }
					$(this.colCopy).css({top:e.pageY + 10,left:e.pageX + 20, display: 'block'});
				}													
			
			},
			dragEnd: function () {
				// If Debugging is enabled record the start time of the rendering process.
                if (p.debug) {
                    var startTime = new Date();
                }
				if (this.colresize)
					{
						var n = this.colresize.n;// index of column
						var nw = this.colresize.nw;// new width of column

						var columnSel = $('th:visible div:eq('+n+')',this.hDiv);
						columnSel.css('width',nw);
						$('tr',this.bDiv).each (
							function ()
								{
								$('td:visible div:eq('+n+')',this).css('width',nw);
								}
						);
						// synchronize the header and the body while scrolling
						this.hDiv.scrollLeft = this.bDiv.scrollLeft;


						$('div:eq('+n+')',this.cDrag).siblings().show();
						$('.dragging',this.cDrag).removeClass('dragging');
						this.rePosDrag();
						this.fixHeight();
						this.colresize = false;
						
						if (p.onResizeCol && p.colModel) {
							var columnId = p.colModel[n].name;
							p.onResizeCol.call(p.owner, columnId, nw);
						}
						if (p.debug && window.console && window.console.log) {
		                    // If debugging is enabled log the duration of this operation.
		                    var nowTime = new Date();
		                    console.log('Duration of dragEnd (colresize) :' + (nowTime - startTime) + 'ms');
		                }
					}
				else if (this.vresize)
					{
						this.vresize = false;
						if (p.onResizeGrid) {
							p.onResizeGrid.call(p.owner, p.width, p.height);
						}
					}
				else if (this.colCopy)
					{
						$(this.colCopy).remove();
						if (this.dcolt != null)
							{
							
							
							if (this.dcoln>this.dcolt)
								$('th:eq('+this.dcolt+')',this.hDiv).before(this.dcol);
							else
								$('th:eq('+this.dcolt+')',this.hDiv).after(this.dcol);
							
							
							
							this.switchCol(this.dcoln,this.dcolt);
							$(this.cdropleft).remove();
							$(this.cdropright).remove();
							this.rePosDrag();
							
							if (p.onDragCol && p.colModel) 
								var sourceColumnId = p.colModel[this.dcoln].name;
								var targetColumnId = p.colModel[this.dcolt].name;
								p.onDragCol.call(p.owner, sourceColumnId, targetColumnId);
																			
						}
						
						this.dcol = null;
						this.hset = null;
						this.dcoln = null;
						this.dcolt = null;
						this.colCopy = null;
						
						$('.thMove',this.hDiv).removeClass('thMove');
						$(this.cDrag).show();
						
						if (p.debug && window.console && window.console.log) {
		                    // If debugging is enabled log the duration of this operation.
		                    var nowTime = new Date();
		                    console.log('Duration of dragEnd (colCopy) :' + (nowTime - startTime) + 'ms');
		                }
					}										
				$('body').css('cursor','default');
				// $('body').noSelect(false);
                // ECHO3 : siehe comment in dragStart
				$(g.gDiv).noSelect(false);
			},
			toggleCol: function(cid,visible) {
				
				var ncol = $("th[axis='col"+cid+"']",this.hDiv)[0];
				var n = $('thead th',g.hDiv).index(ncol);
				var cb = $('input[value='+cid+']',g.nDiv)[0];
				
				
				if (visible==null)
					{
						visible = ncol.hide;
					}
				
				
				
				if ($('input:checked',g.nDiv).length<p.minColToggle&&!visible) return false;
				
				if (visible)
					{
						ncol.hide = false;
						$(ncol).show();
						cb.checked = true;
					}
				else
					{
						ncol.hide = true;
						$(ncol).hide();
						cb.checked = false;
					}
					
						$('tbody tr',t).each
							(
								function ()
									{
										if (visible)
											$('td:eq('+n+')',this).show();
										else
											$('td:eq('+n+')',this).hide();
									}
							);							
				
				this.rePosDrag();
				
				if (p.onToggleCol && p.colModel){ 
					/* 
					 * ECHO3 we need the owner of the object as 'this'.
					 * Event if column visibility is changed.
					 */
					var columnId = p.colModel[cid].name;
					p.onToggleCol.call(p.owner, columnId, visible);
				}
				return visible;
			},
			
			// After columns are dragged and dropped the data has to be adjusted.
			switchCol: function(cdrag,cdrop) { //switch columns
				
				$('tbody tr',t).each
					(
						function ()
							{
								if (cdrag>cdrop)
									$('td:eq('+cdrop+')',this).before($('td:eq('+cdrag+')',this));
								else
									$('td:eq('+cdrop+')',this).after($('td:eq('+cdrag+')',this));
							}
					);
					
					//switch order in nDiv
					if (cdrag>cdrop)
						$('tr:eq('+cdrop+')',this.nDiv).before($('tr:eq('+cdrag+')',this.nDiv));
					else
						$('tr:eq('+cdrop+')',this.nDiv).after($('tr:eq('+cdrag+')',this.nDiv));
						
					if ($.browser.msie&&$.browser.version<7.0){ $('tr:eq('+cdrop+') input',this.nDiv)[0].attr('checked', true);}	
					
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					
					if (p.debug && window.console && window.console.log) {
	                    console.log('Triggered switchCol.');
	                }
			},	

			// the action triggered by the scroll event in the body div (bDiv)
			scroll: function() {
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					this.rePosDrag();
			},
			
			addData: function (data) { //parse data
				
				if (p.preProcess)
					data = p.preProcess(data);
				
				if (!data) {
                    // There is no data after loading. Interrupt the loading here,
                    // set busy to to false and display an error message.
                    g.setBusy(false);
                    $('.pPageStat',this.pDiv).html(p.errormsg);
                    return false;
                }

				if (p.dataType=='xml') {
                    p.total = +$('rows total',data).text();
                } else {
                    p.total = data.total;
                }				
					
				if (p.total==0)
					{
					$('tr, a, td, div',t).unbind();
					$(t).empty();
					p.pages = 1;
					p.page = 1;
					this.buildpager();
					$('.pPageStat',this.pDiv).html(p.nomsg);
					// Call the onSuccess hook (if present).
                    if (p.onSuccess) {
                    	p.onSuccess.call(p.owner);
                    }
					g.setBusy(false);	
					return false;
				}
				
				p.pages = Math.ceil(p.total/p.rp);
				
				if (p.dataType=='xml')
					p.page = +$('rows page',data).text();
				else
					p.page = data.page;
				
				// Build new tbody...
				var tbody = document.createElement('tbody');
				// Select the body before. This is better because this selected jQuery object could be used more then one times in the next steps.
				var qtbody = $(tbody);
				
				// set the heights before rendering finished
                if (p.height == 'auto') {
                	var globalDiv = $(g.gDiv);
                	/* 
                	 * can not be used... its more complicated.
                	 * the idea was to measure all prev siblings (divs)
                	 *
                	var componentHeight = globalDiv.attr('offsetHeight');
					globalDiv.prevAll().each(function () {
				        componentHeight += $(this).attr('offsetHeight');
					});
					*/
                    var bHeight = globalDiv.offsetParent().attr('offsetHeight') - p.heightOffset; 
			        // adjust the flexigrid body (table) height
	                $(g.bDiv).css({ height: bHeight+"px"})
	                // adjust the column visibility menu height and width
	                var mHeight = bHeight - 100;
	                $(g.nDiv).height(mHeight > 50 ? mHeight : 100).width(200);
					if (p.debug && window.console && window.console.log) {
			            console.log('Finalize calculated height :' + bHeight + ' px, heightOffset: ' + p.heightOffset + ' px, menuHeight: ' + mHeight);
			        } 
                }
				
                if (p.debug) {
                    // If Debugging is enabled record the start time of the rendering process.
                    var startTime = new Date();
                }

                /**
                 * This method is used to finalize the rendering of the data to the body if the grid list.
                 * @return (void)
                 */
                function finalizeRendering() {
                    var qt = $(t);
                    // Clean the current body complete and add the new generated body.
                    $('tr', qt).unbind();
                    qt.empty();
                    qt.append(qtbody);
					
					g.rePosDrag();		
							
                    // This is paranoid but set the variables back to null. It is better for debugging.
                    tbody = null;
                    qtbody = null;
                    data = null;		
							
                    // Call the onSuccess hook (if present).
                    if (p.onSuccess) {
                    	p.onSuccess.call(p.owner);
                    }					
                    // Deactivate the busy mode.
                    g.setBusy(false);
                    if (g.lazyFocus) {
                    	g.lazyFocus.call(this, true);
                    }
                    g.buildpager();
                    if (p.debug && window.console && window.console.log) {
                        // If debugging is enabled log the duration of this operation.
                        var nowTime = new Date();
                        console.log('Duration of rendering data of type "' + p.dataType + '": ' + (nowTime - startTime) + 'ms');
                    }
                }
                // We will need the header cell at this point more times.
                // So we do better to store it not for further usages.
                var headers = $('thead tr:first th',g.hDiv);			
                // What is going on here? Because of many rows we have to render, we do not
                // iterate with a regular foreach method. We make a pseudo asynchron process with
                // the setTimeout method. We do better to do this because in other way we will
                // force a lagging of the whole browser. In the worst case the user will get a
                // dialog box of an "endless looping javaScript".
                if (p.dataType=='json') {
                    // Prepare the looping parameters.
                    var ji = 0;
                    var row = null;
                    function doJsonRow() {
                        // Only if there are more rows we will render a next row.
                        if (data.rows.length > ji) {
                            row = data.rows[ji];
                            // Paranoid I know but it possible that there is an array selected with
                            // null entries.
                            if (row) {
                                var tr = document.createElement('tr');
                                var qtr = $(tr);
                                if (ji % 2 && p.striped) {
                                    tr.className = 'erow';
                                }
                                if (row.id === null) {
                                	// nothing to do.
                                } else {
                                    tr.id = 'row' + row.id;
                                }
                                // Add each cell for each header column (rowDataIndex)
                                var colCount = headers.length;
                                for (var idx = 0; idx < colCount; idx++) {
                                    var th = headers[idx];
                                    var rowDataIdx = $(th).data('rowDataIndex'); // retrieves the value rowDataIndex

                                    var td = document.createElement('td');
                                    if (th) {
                                        td.align = th.align;
                                    }
                                    qtr.append(td);
                                    g.addCellProp(td, qtr, row.cell[rowDataIdx], th);
                                }
                                qtbody.append(tr);
                                g.addRowProp(qtr);
                                // Prepare the next step.
                                ji++;
                                setTimeout(doJsonRow, 1);
                            } else {
                                finalizeRendering();
                            }
                        } else {
                            finalizeRendering();
                        }
                    }
                    // Start the pseudo asynchron iteration.
                    setTimeout(doJsonRow, 1);
                } else if (p.dataType=='xml') {
                    // Prepare the looping parameters.
                    var index = 1;
                    var xi = 0;
                    var rows = $("rows row", data);
                    function doXmlRow() {
                        // Only if there are more rows we will render a next row.
                        if (xi < rows.length) {
                            var row = rows[xi];
                            // Paranoid I know but it possible that there is an array selected with
                            // null entries.
                            if (row) {
                                var qrow = $(row);
                                index++;														
                                var tr = document.createElement('tr');
                                var qtr = $(tr);
                                if (index % 2 && p.striped) {
                                    tr.className = 'erow';
                                }
                                var nid = qrow.attr('id');
                                if (nid === null) {
                                	// nothing to do
                                } else {	
                                    tr.id = 'row' + nid;
                                }
                                nid = null;
                                var cells = $('cell', row);
                                // Add each cell
                                for (var idx = 0; idx < cells.length; idx++) {
                                    var td = document.createElement('td');
                                    var th = idx < headers.length ? headers[idx] : null;
                                    if (th) {
                                        td.align = th.align;
                                    }
                                    qtr.append(td);
                                    g.addCellProp(td, qtr, $(cells[idx]).text(), th);
                                }
                                qtbody.append(tr);
                                // Prepare the next step.
                                tr = null;
                                xi++;
                                setTimeout(doXmlRow, 1);
                            } else {
                                finalizeRendering();
                            }
                        } else {
                            finalizeRendering();
                        }
                    }
                    // Start the pseudo asynchron iteration.
                    setTimeout(doXmlRow, 1);
                } else {
                    throw new Error('DataType "' + p.dataType + '" could not be handled.');
                }							
			},

			/**
			 * On change sort.
			 */
			changeSort: function(th, multiSelect) { //change sortorder
				if (p.debug){ var startTime = new Date(); }
				
				if (this.loading) return true;
				
				// we are sorting, so visualize the processing
				this.setBusy(true);
				$(g.nDiv).hide();$(g.nBtn).hide();
				
				if (!multiSelect) {
					if (p.debug){ var cleanStartTime = new Date(); }
					// remove all sorted columns from the model 
					p.sortModel.columns = [];
					// remove all classes from the other header columns.
					var thDiv = $('div', th);
					$('thead tr:first th div', this.hDiv).not(thDiv).removeClass('sdesc').removeClass('sasc');
					
					$(th).siblings().removeClass('sorted');
					if (p.debug && window.console && window.console.log){
						console.log('Multiselect is false, cleaned up columns in ' + (new Date() - cleanStartTime) + 'ms. ' 
							+ 'remaining column: "' + $(th).attr('abbr') + '" classes: "' + thDiv.attr('class') + '"'); 
					}
				}
				
				// set or add the sorting order in the model
				var thdiv = $('div', th);
				var isSorted = $(th).hasClass('sorted');
				
				var sortColumn = new Object(); 
				var abbrSelector = $(th).attr('abbr');
				// if already sorted column, toggle sorting
				if (isSorted){
					var no = ''; 
					if (p.sortModel.columns.length > 0) {
						for (var idx = 0; idx < p.sortModel.columns.length; idx++) {
							var column = p.sortModel.columns[idx];
							if (column.columnId == abbrSelector) {
								column.sortOrder = ($(thdiv).hasClass('sasc')? 'asc':'desc');
								sortColumn = column;
								break;
							}
						}
					} else {
						var sortColumn = new Object({
							columnId: abbrSelector,
							sortOrder: ($(thdiv).hasClass('sasc')? 'asc':'desc')
						});
						p.sortModel.columns.push(sortColumn);
					}
				}
				// not sorted column, activate default sorting
				else if (!isSorted) {
					$(th).addClass('sorted');
					thdiv.addClass('s' + p.sortorder);
					var sortColumn = new Object({
						columnId: abbrSelector,
						sortOrder: p.sortorder
					});
					p.sortModel.columns.push(sortColumn);
				}
					
				if (p.onChangeSort){
					/* 
					 * ECHO3 we need the owner of the object as 'this'.
					 */
					p.onChangeSort.call(p.owner, p.sortModel);
				}
				
				this.setBusy(false);
				if (p.debug && window.console && window.console.log) {
                    // If debugging is enabled log the duration of this operation.
                    var nowTime = new Date();
                    var multiSelectMsg = multiSelect ? 'yes':'no';
                    console.log('Change sort to ' + sortColumn.sortOrder + ' for column ' + sortColumn.columnId + ':' 
                    + (nowTime - startTime) + 'ms' + ' (CRTL pressed: ' + multiSelectMsg + ')');
                }
			},

			buildpager: function(){ //rebuild pager based on new properties
			
				$('.pcontrol input',this.pDiv).val(p.page);
				$('.pcontrol span',this.pDiv).html(p.pages);
				
				var r1 = (p.page-1) * p.rp + 1; 
				var r2 = r1 + p.rp - 1; 
				
				if (p.total<r2) r2 = p.total;
				
				var stat = p.pagestat;
				
				stat = stat.replace(/{from}/,r1);
				stat = stat.replace(/{to}/,r2);
				stat = stat.replace(/{total}/,p.total);
				
				$('.pPageStat',this.pDiv).html(stat);
			
			},

            /**
             * This method is used to control the grid busy state.
             *
             * @param busy if set to true the grid list will get a semi transparent layer, a loading message will be displayed and a spinner.
             * If set to false this layer, spinner and message will be removed.
             * @return (boolean) true if the state is changed.
             */
            setBusy: function (busy) {
                var result = false;
                if (busy) {
                    if (!this.loading) {
                        this.loading = true;
                        $('.pPageStat',this.pDiv).html(p.procmsg);
                        $('.pReload',this.pDiv).addClass('loading');
                        $(g.block).css({top:g.bDiv.offsetTop});
                        if (p.hideOnSubmit) {
                            $(this.gDiv).prepend(g.block); //$(t).hide();
                        }
                        if ($.browser.opera) {
                            $(t).css('visibility','hidden');
                        }
                        result = true;
                    }
                } else {
                    if (this.loading) {
                        var qstatus = $('.pPageStat',this.pDiv);
                        if (qstatus.html() == p.procmsg) {
                            $('.pPageStat',this.pDiv).text('');
                        }
                        $('.pReload',this.pDiv).removeClass('loading');
                        if (p.hideOnSubmit) {
                            $(g.block).remove(); //$(t).show();
                        }
                        g.hDiv.scrollLeft = g.bDiv.scrollLeft;
                        if ($.browser.opera) {
                            $(t).css('visibility','visible');
                        }

                        this.loading = false;
                        result = true;
                    }
                }
                return result;
            },

            populate: function () { //get latest data


				if (this.loading) return true;

				if (p.onSubmit)
					{
						var gh = p.onSubmit();
						if (!gh) return false;
					}
				
				if (!p.url) return false; 
				
                // Make this grid list busy for the user.
                this.setBusy(true);
				
				if (!p.newp) p.newp = 1;
				
				if (p.page>p.pages) p.page = p.pages;
				var params = [
					 { name : 'page', value : p.newp }
					,{ name : 'rp', value : p.rp }
					,{ name : 'query', value : p.query}
					,{ name : 'qtype', value : p.qtype}
				];							 
				var data = [];
				
                // Only add parameters to request data which are not null.
                for (i in params) {
                    var param = params[i];
                    if (param && param.name && param.value) {
                        data.push(param);
                    }
                }
                // If there are some additional parameters and each are not null add it to the request data.
                if (p.params) {
				    for (pi in p.params) {
                        var current = p.params[pi];
                        if (current && current.name && current.value) {
                            data.push(current);
                        }
                    }
                }
                // Call prepareRequest hook.
                if (p.prepareRequest) {
                    p.prepareRequest(data);
                }                
				/*
				 * COMMENT-ECHO3: We need to use echo3 calls 
				 * instead of ajax URL based approach.
				 */
				if (p.onPopulateCallback) {
					var data = p.onPopulateCallback.call(p.owner, data);
					if (!data) {
						try { if (p.onError) p.onError(data); } catch (e) {};
					} else {
						g.addData(data);
					}
				} else {
		                $.ajax({
		                   type: p.method,
		                   url: p.url,
		                   data: data,
		                   dataType: p.dataType,
		                   success: function(data){g.addData(data);},
		                   error: function(data) { try { if (p.onError) p.onError(data); } catch (e) {} }
		                 });
				}
				
				// do sorting
				if (p.clientsort && p.sortModel && p.sortModel.columns.length > 0) {
					this.multiSort(p.sortModel, new exxcellent.model.ColumnModel(p.colModel), new exxcellent.model.TableModel(new Array(data)));
            	}
			},

			doSearch: function () {
				p.query = $('input[name=q]',g.sDiv).val();
				p.qtype = $('select[name=qtype]',g.sDiv).val();
				p.newp = 1;

				this.populate();				
			},

			changePage: function (ctype){ //change page
			
				if (this.loading) return true;
			
				switch(ctype)
				{
					case 'first': p.newp = 1; break;
					case 'prev': if (p.page>1) p.newp = parseInt(p.page) - 1; break;
					case 'next': if (p.page<p.pages) p.newp = parseInt(p.page) + 1; break;
					case 'last': p.newp = p.pages; break;
					case 'input': 
							var nv = parseInt($('.pcontrol input',this.pDiv).val());
							if (isNaN(nv)) nv = 1;
							if (nv<1) nv = 1;
							else if (nv > p.pages) nv = p.pages;
							$('.pcontrol input',this.pDiv).val(nv);
							p.newp =nv;
							break;
				}
			
				if (p.newp==p.page) return false;
				
				if (p.onChangePage) { 
					/* 
					 * ECHO3 we need the owner of the object as 'this'.
					 */
					p.onChangePage.call(p.owner, p.newp);
				}
				this.populate();
			
			},

			addCellProp: function (cell, prnt, innerHtml, pth) {
                var tdDiv = document.createElement('div');
                var qtdDiv = $(tdDiv);
                var qcell = $(cell);
                if (pth != null) {
                    if ($(pth).hasClass('sorted')) {
                        //cell.className = 'sorted';
                        qcell.addClass('sorted');
                    }
                    qtdDiv.css({textAlign:pth.align,width: $('div:first', pth)[0].style.width});
                    if (pth.hide) {
                        qcell.css('display', 'none');
                    }
                }
                if (!p.nowrap) {
                    qtdDiv.css('white-space', 'normal');
                }	
                if (!innerHtml || innerHtml == '') {
                    innerHtml = '&nbsp;';
                }
				tdDiv.innerHTML = innerHtml;

				qcell.empty().append(tdDiv).removeAttr('width');
            },					 

			getCellDim: function (obj) // get cell prop for editable event
			{
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {ht:ht,wt:wt,top:top,left:left,pdl:pdl, pdt:pdt, pht:pht, pwt: pwt};
			},

			addRowProp: function(qrow) {
                qrow.click(function (e) {
                    var obj = (e.target || e.srcElement);
                    if (obj.href || obj.type) {
                        return true;
                    }
                    $(this).toggleClass('trSelected');
                    if (p.singleSelect) {
                        qrow.siblings().removeClass('trSelected');
                    }
                    g.selectedRow = $(this);
                    e.stopPropagation();
                    
                }).mousedown(function (e) {
                    if (e.shiftKey) {
                        $(this).toggleClass('trSelected');
                        g.multisel = true;
                        $(g.gDiv).noSelect();
                    }
                }).mouseup(function (e) {
                	e.stopPropagation();
                    if (g.multisel) {
                        g.multisel = false;
                        $(g.gDiv).noSelect(false);
                    }
                    // process the row selection event
                    var obj = (e.target || e.srcElement);
                    if (p.onSelectRow)  {
						/* 
						 * ECHO3 we need the p.owner of the object as 'this'.
						 */
                    	var pid = this.id.substr(3);
						p.onSelectRow.call(p.owner, pid, obj);
                    }
                }).hover(function () {/*hover-in*/
                    if (g.multisel) {
                        $(this).toggleClass('trSelected');
                    }
                }, function () {/*hover-out*/ 
                });
                if ($.browser.msie && $.browser.version < 7.0) {
                    qrow.hover(function () {
                        $(this).addClass('trOver');
                    }, function () {
                        $(this).removeClass('trOver');
                    });
                }			
			},
			pager: 0
        }; // --- EOF Grid Declaration (g)

        // -----------------------------------------------------------------------------------------------------------

		//analyze column model if any
		if (p.colModel)
		{
			var thead = document.createElement('thead');
			var tr = document.createElement('tr');

			for (var i=0;i<p.colModel.length;i++)
				{
					var cm = p.colModel[i];
					var th = document.createElement('th');

					th.innerHTML = cm.display;

					if (cm.name !== null && cm.sortable) {
						$(th).attr('abbr',cm.name);
					}
					if (cm.tooltip !== null) {
						$(th).attr('title', cm.tooltip);
					}

					$(th).attr('axis','col'+i);

					if (cm.align)
						th.align = cm.align;

					if (cm.width)
						$(th).attr('width',cm.width);

					if (cm.hide)
						{
						th.hide = true;
						}

					if (cm.process)
						{
							th.process = cm.process;
						}

					// store the data index using jquery
					$(th).data('rowDataIndex', i); // sets the value of userid

					$(tr).append(th);
				}
			$(thead).append(tr);
			$(t).prepend(thead);
		} // end if p.colmodel

		//init divs
		g.gDiv = document.createElement('div'); //create global container
		g.mDiv = document.createElement('div'); //create title container
		g.hDiv = document.createElement('div'); //create header container
		g.bDiv = document.createElement('div'); //create body container
		g.vDiv = document.createElement('div'); //create grip
		g.rDiv = document.createElement('div'); //create horizontal resizer
		g.cDrag = document.createElement('div'); //create column drag
		g.block = document.createElement('div'); //creat blocker
		g.nDiv = document.createElement('div'); //create column show/hide popup
		g.nBtn = document.createElement('div'); //create column show/hide button
		g.iDiv = document.createElement('div'); //create editable layer
		g.tDiv = document.createElement('div'); //create toolbar
		g.sDiv = document.createElement('div');
		
		if (p.usepager || p.showPageStat) g.pDiv = document.createElement('div'); //create pager container
		g.hTable = document.createElement('table');

		//set gDiv
		g.gDiv.className = 'flexigrid';
		if (p.width!='auto') g.gDiv.style.width = p.width + 'px';

		//add conditional classes
		if ($.browser.msie)
			$(g.gDiv).addClass('ie');
		
		if (p.novstripe)
			$(g.gDiv).addClass('novstripe');

		$(t).before(g.gDiv);
		$(g.gDiv).append(t);

		//set toolbar
		if (p.buttons) 
		{
			g.tDiv.className = 'tDiv';
			var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';

            if (p.debug && window.console && window.console.log) {
                console.log('Grid has ' + p.buttons.length + ' custom buttons.');
            }

			for (i=0;i<p.buttons.length;i++)
				{
					var btn = p.buttons[i];
					if (!btn.separator)
					{
						var btnDiv = document.createElement('div');
						btnDiv.className = 'fbutton';
						btnDiv.innerHTML = "<div><span>"+btn.name+"</span></div>";
						if (btn.bclass) 
							$('span',btnDiv)
							.addClass(btn.bclass)
							.css({paddingLeft:20})
							;
						btnDiv.onpress = btn.onpress;
						btnDiv.name = btn.name;
						if (btn.onpress)
						{
							$(btnDiv).click
							(	
								function () 
								{
								this.onpress(this.name,g.gDiv);
								}
							);
						}
						$(tDiv2).append(btnDiv);
						if ($.browser.msie&&$.browser.version<7.0)
						{
							$(btnDiv).hover(function(){$(this).addClass('fbOver');},function(){$(this).removeClass('fbOver');});
						}
						
					} else {
						$(tDiv2).append("<div class='btnseparator'></div>");
					}
				}
				$(g.tDiv).append(tDiv2);
				$(g.tDiv).append("<div style='clear:both'></div>");
				$(g.gDiv).prepend(g.tDiv);
		}
		
		//set hDiv
		g.hDiv.className = 'hDiv';

		$(t).before(g.hDiv);

		//set hTable
        g.hTable.cellPadding = 0;
        g.hTable.cellSpacing = 0;
        $(g.hDiv).append('<div class="hDivBox"></div>');
        $('div',g.hDiv).append(g.hTable);
        var thead = $("thead:first",t).get(0);
        if (thead) $(g.hTable).append(thead);
        thead = null;
		
		if (!p.colmodel) var ci = 0;
		if(p.debug && window.console && window.console.log){
			console.log("Building table header");
		}

		//setup table header (thead)			
		$('thead tr:first th',g.hDiv).each
		(
		 	function ()
				{
					var thdiv = document.createElement('div');
                    var qth = $(this);

                    var columnNameSelector = qth.attr('abbr');
                    if (columnNameSelector){
							// click on a column (change sorting)
							qth.click(
								function (e) {
									if (!$(this).hasClass('thOver')) return false;
									var obj = (e.target || e.srcElement);
									if (obj.href || obj.type) return true; 
									
									var thDiv = $('div', this);
									if (thDiv.hasClass('active')){
										thDiv.toggleClass('sasc');
										thDiv.toggleClass('sdesc');
									} else {
										thDiv.addClass('active');
									}
									g.changeSort(this, e.ctrlKey);
								}
							)
							;
							// setup initial sorting
							if (p.sortModel && p.sortModel.columns) {
								for (i=0; i<p.sortModel.columns.length; i++) {
									var sortColumn = p.sortModel.columns[i];
									if (columnNameSelector === sortColumn.columnId) {
                                        //var cellElement = this;
                                        //cellElement.className = 'sorted';
                                        qth.addClass('sorted');
										thdiv.className = 's'+ sortColumn.sortOrder;
									}
								}
							}	
						}
						// setup initial hiding
						if (this.hide) qth.hide();
						
						if (!p.colmodel) {
							qth.attr('axis','col' + ci++);
						}
						
						
					 $(thdiv).css({textAlign:this.align, width: this.width + 'px'});
					 thdiv.innerHTML = this.innerHTML;
					 
					qth.empty().append(thdiv).removeAttr('width')
					.mousedown(function (e) 
						{
							g.dragStart('colMove',e,this);
						})
					.hover(
						// hover in function
						function(){
							if (!g.colresize&&!$(this).hasClass('thMove')&&!g.colCopy) $(this).addClass('thOver');
							// check if sortable column
							if ($(this).attr('abbr')) {
								var thDiv = $('div',this);
								var isSorted = $(this).hasClass('sorted');
								if (!isSorted && !g.colCopy && !g.colresize) {
									thDiv.addClass('s' + p.sortorder);
								}
								else if (isSorted && !g.colCopy && !g.colresize){
									thDiv.toggleClass('sasc');
									thDiv.toggleClass('sdesc');
								}
							}
							// drop the dragged column on another column (hover-in)
							if (g.colCopy) 
								{
								var n = $('th',g.hDiv).index(this);
								
								if (n==g.dcoln) return false;
								
								
								
								if (n<g.dcoln) $(this).append(g.cdropleft);
								else $(this).append(g.cdropright);
								
								g.dcolt = n;
								
							} else if (!g.colresize) {
									
								var nv = $('th:visible',g.hDiv).index(this);
								var onl = parseInt($('div:eq('+nv+')',g.cDrag).css('left'));
								var nw = parseInt($(g.nBtn).width()) + parseInt($(g.nBtn).css('borderLeftWidth'));
								var nl = onl - nw + Math.floor(p.cgwidth/2);
								
								$(g.nDiv).hide();$(g.nBtn).hide();
								
								$(g.nBtn).css({'left':nl,top:g.hDiv.offsetTop}).show();
								
								var ndw = parseInt($(g.nDiv).width());
								
								$(g.nDiv).css({top:g.bDiv.offsetTop});
								
								if ((nl+ndw)>$(g.gDiv).width())
									$(g.nDiv).css('left',onl-ndw+1);
								else
									$(g.nDiv).css('left',nl);
									
								if ($(this).hasClass('sorted')) 
									$(g.nBtn).addClass('srtd');
								else
									$(g.nBtn).removeClass('srtd');
									
							}
								
						},
						// hover out function
						function(){
							$(this).removeClass('thOver');
							var thDiv = $('div', this);
							if(!$(thDiv).hasClass('active')) {
								var thDiv = $('div',this);
								if (!$(this).hasClass('sorted')){ 
									thDiv.removeClass('s' + p.sortorder);
								} else {
									thDiv.toggleClass('sasc');
									thDiv.toggleClass('sdesc');
								}
							} else {
								$(thDiv).removeClass('active');
							}
							if (g.colCopy) {								
								$(g.cdropleft).remove();
								$(g.cdropright).remove();
								g.dcolt = null;
							}
						})
					; //wrap content
				}
		);

		//set bDiv (body div)
		g.bDiv.className = 'bDiv';
		$(t).before(g.bDiv);
		
		$(g.bDiv).css({ height: (p.height=='auto') ? '50 px' : p.height+"px"})
		.scroll(function (e) {
			g.scroll();
			return true;
		})
		.append(t)
		;
		
		if (p.height == 'auto') 
			{
			$('table',g.bDiv).addClass('autoht');
			}


		$('tbody', g.bDiv).hide();
		
		//set cDrag
		var cdcol = $('thead tr:first th:first',g.hDiv).get(0);
		
		if (cdcol != null)
		{		
		g.cDrag.className = 'cDrag';
		g.cdpad = 0;
		
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('borderLeftWidth'))) ? 0 : parseInt($('div',cdcol).css('borderLeftWidth'))); 
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('borderRightWidth'))) ? 0 : parseInt($('div',cdcol).css('borderRightWidth'))); 
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingLeft'))) ? 0 : parseInt($('div',cdcol).css('paddingLeft'))); 
		g.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingRight'))) ? 0 : parseInt($('div',cdcol).css('paddingRight'))); 
		g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0 : parseInt($(cdcol).css('borderLeftWidth'))); 
		g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0 : parseInt($(cdcol).css('borderRightWidth'))); 
		g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0 : parseInt($(cdcol).css('paddingLeft'))); 
		g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0 : parseInt($(cdcol).css('paddingRight'))); 

		$(g.bDiv).before(g.cDrag);
		
		var cdheight = $(g.bDiv).height();
		var hdheight = $(g.hDiv).height();

		$(g.cDrag).css({top: -hdheight + 'px'});
		
		$('thead tr:first th',g.hDiv).each
			(
			 	function ()
					{
						var cgDiv = document.createElement('div');
						$(g.cDrag).append(cgDiv);
						if (!p.cgwidth) p.cgwidth = $(cgDiv).width();
						$(cgDiv).css({height: cdheight + hdheight})
						.mousedown(function(e){g.dragStart('colresize',e,this);})
						;
						if ($.browser.msie&&$.browser.version<7.0)
						{
							g.fixHeight($(g.gDiv).height());
							$(cgDiv).hover(
								function () 
								{
								g.fixHeight();
								$(this).addClass('dragging') 
								},
								function () { if (!g.colresize) $(this).removeClass('dragging') }
							);
						}
					}
			);
		//g.rePosDrag()
		}
		

		//add strip		
        if (p.striped)
        {
            $('tbody tr:odd', g.bDiv).addClass('erow');
        }

        if (p.resizable && p.height !='auto')
        {
            g.vDiv.className = 'vGrip';
            $(g.vDiv)
                    .mousedown(function (e) { g.dragStart('vresize',e); })
                    .html('<span></span>');
            $(g.bDiv).after(g.vDiv);
        }

        if (p.resizable && p.width !='auto' && !p.nohresize)
        {
            g.rDiv.className = 'hGrip';
            $(g.rDiv)
                    .mousedown(function (e) {g.dragStart('vresize',e,true);})
                    .html('<span></span>')
                    .css('height',$(g.gDiv).height())
                    ;
            if ($.browser.msie&&$.browser.version<7.0)
            {
                $(g.rDiv).hover(function(){$(this).addClass('hgOver');},function(){$(this).removeClass('hgOver');});
            }
            $(g.gDiv).append(g.rDiv);
        }
		
		// add pager
		if (p.usepager || p.showPageStat)
		{
			g.pDiv.className = 'pDiv';
			g.pDiv.innerHTML = '<div class="pDiv2"></div>';
			$(g.bDiv).after(g.pDiv);
			if (p.usepager) {
				var pagerHtml = ' <div class="pGroup"> <div class="pFirst pButton"><span></span></div>' +
                                '<div class="pPrev pButton"><span></span></div> </div> <div class="btnseparator"></div> ' +
                                '<div class="pGroup"><span class="pcontrol">Page <input type="text" size="4" value="1" /> of <span> 1 </span>' +
                                '</span></div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pNext pButton">' +
                                '<span></span></div><div class="pLast pButton"><span></span></div> </div>';
				$('div',g.pDiv).html(pagerHtml);
				// register events for pager
				$('.pReload',g.pDiv).click(function(){g.populate()});
				$('.pFirst',g.pDiv).click(function(){g.changePage('first')});
				$('.pPrev',g.pDiv).click(function(){g.changePage('prev')});
				$('.pNext',g.pDiv).click(function(){g.changePage('next')});
				$('.pLast',g.pDiv).click(function(){g.changePage('last')});
				$('.pcontrol input',g.pDiv).keydown(function(e){if(e.keyCode==13) g.changePage('input')});
				if ($.browser.msie&&$.browser.version<7) $('.pButton',g.pDiv).hover(function(){$(this).addClass('pBtnOver');},function(){$(this).removeClass('pBtnOver');});
				
				// add 'rows per page' combobox
				if (p.useRp)
				{
				var opt = "";
				for (var nx=0;nx<p.rpOptions.length;nx++)
				{
					if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"'; else sel = '';
					 opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
				};
				$('.pDiv2',g.pDiv).prepend("<div class='pGroup'><select name='rp'>"+opt+"</select></div> <div class='btnseparator'></div>");
				$('select',g.pDiv).change(
						function ()
						{
							if (p.onRpChange)
								p.onRpChange(+this.value);
							else
								{
								p.newp = 1;
								p.rp = +this.value;
								g.populate();
								}
						}
					);
				}
			}
			// add page statistics 
			if (p.showPageStat) {
				var pageStatHtml = ' <div class="btnseparator"></div> <div class="pGroup"> <div class="pReload pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pPageStat"></span></div>';
				$('.pDiv2',g.pDiv).append(pageStatHtml);
				$('.pReload',g.pDiv).click(function(){g.populate()});
			}
			//add search button
			if (p.searchitems)
			{
				$('.pDiv2',g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
				$('.pSearch',g.pDiv).click(function(){$(g.sDiv).slideToggle('fast',function(){$('.sDiv:visible input:first',g.gDiv).trigger('focus');});});				
				//add search box
				g.sDiv.className = 'sDiv';
				
				var sitems = p.searchitems;
				
				var sopt = "";
				for (var s = 0; s < sitems.length; s++)
				{
					if (p.qtype=='' && sitems[s].isdefault==true)
					{
					p.qtype = sitems[s].name;
					var sel = 'selected="selected"';
					} else sel = '';
					sopt += "<option value='" + sitems[s].name + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";						
				}
				
				if (p.qtype=='') p.qtype = sitems[0].name;
				
				$(g.sDiv).append("<div class='sDiv2'>Quick Search <input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>"+sopt+"</select> <input type='button' value='Clear' /></div>");

				$('input[name=q],select[name=qtype]',g.sDiv).keydown(function(e){if(e.keyCode==13) g.doSearch()});
				$('input[value=Clear]',g.sDiv).click(function(){$('input[name=q]',g.sDiv).val(''); p.query = ''; g.doSearch(); });
				$(g.bDiv).after(g.sDiv);				
				
			}
		
		}
		$(g.pDiv,g.sDiv).append("<div style='clear:both'></div>");
	
		// add title
		if (p.title)
		{
			g.mDiv.className = 'mDiv';
			g.mDiv.innerHTML = '<div class="ftitle">'+p.title+'</div>';
			$(g.gDiv).prepend(g.mDiv);
			if (p.showTableToggleBtn)
				{
					$(g.mDiv).append('<div class="ptogtitle" title="' + p.mintablemsg + '"><span></span></div>');
					$('div.ptogtitle',g.mDiv).click
					(
					 	function ()
							{
								$(g.gDiv).toggleClass('hideBody');
								$(this).toggleClass('vsble');
							}
					);
				}
			//g.rePosDrag();
		}

		//setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';

		//add block
		g.block.className = 'gBlock';
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		$(g.block).css(
		{
			width: g.bDiv.style.width,
			height: gh,
			background: 'white',
			position: 'relative',
			marginBottom: (gh * -1),
			zIndex: 1,
			top: gtop,
			left: '0px'
		}
		);
		$(g.block).fadeTo(0,p.blockOpacity);

		// add column control
		if ($('th',g.hDiv).length)
		{
			
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css(
			{
				marginBottom: (gh * -1),
				display: 'none',
				top: gtop
			}
			).noSelect()
			;

			var cn = 0;


			$('th div',g.hDiv).each
			(
			 	function ()
					{
						var kcol = $("th[axis='col" + cn + "']",g.hDiv)[0];
						var chk = 'checked="checked"';
						if (kcol.style.display=='none') chk = '';
						
						$('tbody',g.nDiv).append('<tr><td class="ndcol1"><input type="checkbox" '+ chk +' class="togCol" value="'+ cn +'" /></td><td class="ndcol2">'+this.innerHTML+'</td></tr>');
						cn++;
					}
			);
			
			if ($.browser.msie&&$.browser.version<7.0)
				$('tr',g.nDiv).hover
				(
				 	function () {$(this).addClass('ndcolover');},
					function () {$(this).removeClass('ndcolover');}
				);
			
			$('td.ndcol2',g.nDiv).click
			(
			 	function ()
					{
						if ($('input:checked',g.nDiv).length<=p.minColToggle&&$(this).prev().find('input')[0].checked) return false;
						return g.toggleCol($(this).prev().find('input').val());
					}
			);
			
			$('input.togCol',g.nDiv).click
			(
			 	function ()
					{
						
						if ($('input:checked',g.nDiv).length<p.minColToggle&&!this.checked) {
                            return false;
                        }
						$(this).parent().next().trigger('click');
						//return false;
					}
			);


			$(g.gDiv).prepend(g.nDiv);
			
			$(g.nBtn).addClass('nBtn')
			.html('<div></div>')
			.attr('title',p.hidecolmsg)
			.click
			(
			 	function ()
				{
			 	$(g.nDiv).slideToggle('fast'); return true;
				}
			);
			
			if (p.showToggleBtn) $(g.gDiv).prepend(g.nBtn);
			
		}
		
		// add date edit layer
		$(g.iDiv)
		.addClass('iDiv')
		.css({display:'none'})
		;
		$(g.bDiv).append(g.iDiv);
		
		// add flexigrid events
		$(g.bDiv)
		.hover(function(){$(g.nDiv).hide();$(g.nBtn).hide();},function(){if (g.multisel) g.multisel = false;}) 
		;
		$(g.gDiv)
		.hover(function(){},function(){$(g.nDiv).hide();$(g.nBtn).hide();})
		;
		
		// pinkhominid (2008.09.20): ie leak fix start
		//add document events
		// we need the document here, otherwise the dragging is restricted 
		// to the selected div, e.g $(g.gDiv)
		$(document)
        .mousemove(mousemove)
        .mouseup(mouseup)
        .mouseenter(hoverover)
        .mouseleave(hoverout);
        
        function mousemove(e) {
            g.dragMove(e);
        }
        function mouseup() {
            g.dragEnd();
        }
        function hoverover(){}
        function hoverout() {
            g.dragEnd();
        }
		  
        g.cleanup = function () {
            // Unbind events listeners attached outside flexigrid gDiv
            $(document)
                .unbind('mousemove', mousemove)
                .unbind('mouseup', mouseup)
                .unbind('mouseenter', hoverover)
                .unbind('mouseleave', hoverout);
            // Unbind all event listeners inside flexigrid gDiv
            $(t.grid.gDiv).remove();

            // Help GC
            p.onToggleCol = null;
            p.onChangeSort =  null; // using custom change sort function
            p.preProcess = null; // using custom pre processing before addData function
            p.onSuccess = null; // using custom validate after addData function
            p.onChangePage = null; // using custom change page function
            p.onSubmit = null; // using a custom populate function
            p.onPopulateCallback = null; // using a custom populate callback function with parsed params
            p.onDragCol =  null; // using a custom on column dragdrop callback function
            p.onResizeCol = null; // using a custom on column resizing callback function
            p.onResizeGrid = null; // using a custom on grid resizing callback function
            p = null;            
            g = null;
            t.grid = null;
            t.p = null;
            t = null;
        };
		// pinkhominid (2008.09.20): ie leak fix end 
        
        /**
         * Method to focus and blur the flexigrid table.
         */
        g.focus = function (focusState) {
        	// FOCUS on first row
        	if (p.debug && window.console && window.console.log) {
				console.log("FlexFocus: focus is " + focusState);
        	}
        	// if flexigrid is busy we will trigger the focus after its finished.
        	if (this.loading) {
        		g.lazyFocus = g.focus;
        	} else {
                g.lazyFocus = null;
                if (!$("table tbody tr").hasClass('trSelected')) {
		    		g.selectedRow = $("table tbody tr:first-child", g.bDiv);
					if (focusState) {
						g.selectedRow.addClass('trSelected');
					} else {
		                $("table tbody tr").removeClass('trSelected');
		           	}
        		}
        	}
        };
        
        /**
         * Method to remote control the flexigrid via keycodes.
         */
        g.remoteControl = function (keycode) {
        	if (p.debug && window.console && window.console.log) {
        		var startTime = new Date();
        		console.log('Triggered remoteControl keycode: ' + keycode);
        	}
        	if (keycode == 13) {
        		// press enter to trigger the same as mouse click (up)
        		g.selectedRow.trigger("mouseup");
        	} else if (keycode == 40) {
        		// press arrow down
        		var nextselectedRow = g.selectedRow.next();
        		if (nextselectedRow.is('tr')) {
		            g.selectedRow = nextselectedRow;
	        		g.selectedRow.toggleClass('trSelected');
	        		if (p.singleSelect) {
		                g.selectedRow.siblings().removeClass('trSelected');
		            }		            
		            var rowsHeight = 0;
					nextselectedRow.prevAll().each(function () {
					        rowsHeight += $(this).height();
					}); 
		            if ($(g.bDiv).height()/2.3 < rowsHeight)
		            	g.bDiv.scrollTop = g.bDiv.scrollTop + nextselectedRow.height();
        		}
        	} else if (keycode == 38) {
        		// press arrow up
        		var prevselectedRow = g.selectedRow.prev();
        		if (prevselectedRow.is('tr')) {
		            g.selectedRow = prevselectedRow;
	        		g.selectedRow.toggleClass('trSelected');
	        		if (p.singleSelect) {
		                g.selectedRow.siblings().removeClass('trSelected');
		            }
		            var rowsHeight = 0;
					prevselectedRow.nextAll().each(function () {
					        rowsHeight += $(this).height();
					}); 
		            if ($(g.bDiv).height()/2.3 < rowsHeight)
		            	g.bDiv.scrollTop = g.bDiv.scrollTop - prevselectedRow.height();
        		}
        	} else if (keycode == 39) {
        		// press arrow right
        		g.bDiv.scrollLeft = g.bDiv.scrollLeft + 50;
        		g.scroll();
        	} else if (keycode == 37) {
        		// press arrow left
        		g.bDiv.scrollLeft = g.bDiv.scrollLeft - 50;
        		g.scroll();
        	}
        	if (p.debug && window.console && window.console.log) {
        		console.log('Processed scrolltop: ' + g.bDiv.scrollTop + ', cHeight: ' + $(g.bDiv).height() + ' in :' + (new Date() - startTime) + 'ms');
        	}
        	return true;
        };
        
        /**
         * Method to multisort the flexigrid on demand.
         */
		g.multiSort = function (sortModel, columnModel, tableModel) {
	  		var sortingColumns = sortModel.columns;
	  		
	  		var columnsToSort = new Array();
	  		for (idx = 0; idx < sortingColumns.length; idx++) {
	  			var sortingColumn = sortingColumns[idx];
		  		for (var adx = 0; adx < columnModel.columns.length; adx++) {
		  			if(columnModel.columns[adx].name == sortingColumn.columnId){
		  				columnsToSort.push(new Object({
		  					index: adx,
		  					order: sortingColumn.sortOrder 
		  				}));
		  			}
		  		}	
	  		}
	  		columnsToSort.reverse();
	  		if (p.debug && window.console && window.console.log) {
	  			console.log('Sorting columns: ' + columnsToSort);
	  		}
	  		var allRows = new Array();
	  		for (var idx = 0; idx < tableModel.pages.length; idx++) {
	  			allRows = allRows.concat(tableModel.pages[idx].rows);
	  		}
	  		var delimiterRegExp = new RegExp('[\\' + p.digitGroupDL + ']', 'g');
            var decimalDelimiterRegExp = new RegExp('[\\' + p.decimalDelimiter + ']', 'g');
	  		allRows = multiSorter(columnsToSort, allRows);
	  		// implement paging here...
	  		var firstPage = tableModel.pages[0];
            firstPage.rows = allRows;
	  		return tableModel;
	  		
	  		/**
	  		 * A method to sort rows using multiple columns.
	  		 */
			function multiSorter (columns, rows) {
				if (p.debug) {
					var startTime = new Date();
				}
				for (idx = 0; idx < columns.length; idx++) {
					var columnIdx = columns[idx].index;
					var sortOrder = columns[idx].order;
					if (p.debug && window.console && window.console.log) {
						console.log('Sorting column: ' + columnIdx + ', ' + sortOrder);
					}
			  		rows.sort(alphaNumericSorter);
				}
		  		if (p.debug && window.console && window.console.log) {
					var nowTime = new Date();
					console.log('Duration of multiSort on ' + rows.length 
						+ ' rows :' + (nowTime - startTime) + 'ms');
				}
				return rows;
				
		  		function alphaNumericSorter (row1, row2) {
		  			var row1Cell = row1.cell[columnIdx]; 
		  			var row2Cell = row2.cell[columnIdx];

		  			// undefined rows
		  			if (!row1Cell && !row2Cell) {
	  					return 0;// test for undefined rows
	  				} else if (!row1Cell && row2Cell) {
	  					return -1;// test for undefined row1
	  				} else if (row1Cell && !row2Cell) {
	  					return 1;// test for undefined row2
	  				}
		  			if (isDigit(row1Cell) && isDigit(row2Cell)) {
		  				// convert into num value the fastest way, 
		  				// see http://www.jibbering.com/faq/faq_notes/type_convert.html
		  				if (typeof row1Cell != 'number')
		  					var row1Num = row1Cell.replace(delimiterRegExp,'');
                           // after replacing the delimiter, we make sure to have a '.' as delimiter for Decimal-Values
                          if(typeof(row1Num) != 'undefined') // can happen...
                          {
                              row1Num = (+row1Num.replace(decimalDelimiterRegExp, '.'));
                          }

		  				if (typeof row2Cell != 'number')
		  					var row2Num = row2Cell.replace(delimiterRegExp,'');
                           // after replacing the delimiter, we make sure to have a '.' as delimiter for Decimal-Values
                           if(typeof(row2Num) != 'undefined') // can happen...
                          {
                             row2Num = row2Num.replace(decimalDelimiterRegExp, '.');
                          }             
		  				if (p.debug && window.console && window.console.log) {
		  					console.log('Tested row type = "number" ' + row1Num + ' to ' + row2Num);
		  				}
		  				var result = sortOrder == 'asc' ? row1Num - row2Num : row2Num - row1Num;
			  			return result;
		  			}
		  			// string rows
		  			else {
		  				if (p.debug && window.console && window.console.log) {
		  					console.log('Tested row type = "string" '+ row1Cell + ' to ' + row2Cell);
		  				}
		  				if (row1Cell == row2Cell) {
		  					return 0;
		  				}
		  				if (sortOrder == 'asc') {
		  					return (row1Cell < row2Cell) ? -1 : 1;
		  				} else { 
		  					return (row1Cell > row2Cell) ? -1 : 1;
		  				}
		  			}
		  			
				}
	  			function isDigit(s) {
					if (typeof s == 'number') return true;
					var DECIMAL = '\\' + p.digitGroupDL;
                    var DECIMAL_DELIMITER = '\\' + p.decimalDelimiter;
                    var exp = '(^([-+]?[\\d'+ DECIMAL + DECIMAL_DELIMITER + ']*)$)';
					return RegExp(exp).test($.trim(s));
				}
				
			}
		};
        /**
         * Method to force populating the flexigrid again by setting the loading mode
         * to false. The loading mode is normally used while rendering.
         */
        g.reload = function (){
            g.loading = false;
            g.populate()
        };
        
		//browser adjustments
		if ($.browser.msie&&$.browser.version<7.0)
		{
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv',g.gDiv)
			.css({width: '100%'});
			$(g.gDiv).addClass('ie6');
			if (p.width!='auto') $(g.gDiv).addClass('ie6fullwidthbug');			
		} 
		
		g.rePosDrag();
		g.fixHeight();
		
		//make grid functions accessible
		t.p = p;
		t.grid = g;
		
        // Load data if possible and enabled.
        if (p.url && p.autoload) {
            g.populate();
        } else {
            // If Debugging is enabled record the start time of the rendering process.
            if (p.debug) {
                var startTime = new Date();
            }
            // Make this grid list busy for the user.
            g.setBusy(true);

	        // ECHO3: call our special autosize columns which assigns max width (by bsc)
	        // g.autoColumnWidth.call(g);
            
            /**
             * This method is used to finalize the rendering of the data to the body if the grid list.
             * @return (void)
             */
            function finalizeRendering() {
                g.setBusy(false);
                $('tbody', g.bDiv).show();
                if (p.debug && window.console && window.console.log) {
                    var nowTime = new Date();
                    console.log('Duration of rendering data of type "inlineHtml": ' + (nowTime - startTime) + 'ms');
                }
            }

            // Add tr and td properties

            // What is going on here? Because of many rows we have to render, we do not
            // iterate with a regular foreach method. We make a pseudo asynchron process with
            // the setTimeout method. We do better to do this because in other way we will
            // force a lagging of the whole browser. In the worst case the user will get a
            // dialog box of an "endless looping javaScript".

            // Set initial properties for rendering the data.
            var qth = $('thead tr:first th',g.hDiv);
            var rows = $('tbody tr', g.bDiv);
            var rowIndex = 0;
            function doRow() {
                // Only if there are more rows we will render a next row.
                if (rowIndex < rows.length) {
                    var tr = rows[rowIndex];
                    // Paranoid I know but it possible that there is an array selected with
                    // null entries.
                    if (tr) {
                        var qtr = $(tr);
                        var i = 0;
                        $('td', tr).each(function() {
                            var header = false;
                            if (qth.length > i) {
                                header = qth[i] || false;
                            }
                            g.addCellProp(this, tr, this.innerHTML, header);
                            i++;
                        });
                        g.addRowProp(qtr);
                        // Prepare the next step.
                        rowIndex++;
                        setTimeout(doRow, 1);
                    } else {
                        finalizeRendering();
                    }
                } else {
                    finalizeRendering();
                }
            }
            // Start the pseudo asynchron iteration.
            setTimeout(doRow, 1);
        }
        return t;
	};

	/* COMMENT-ECHO3: Not useful in echo3! changed to true, was false */
	//var docloaded = true;

	//$(document).ready(function () {docloaded = true} );

	$.fn.flexigrid = function(p) {

		return this.each( function() {
				/*if (!docloaded)
				{
					$(this).hide();
					var t = this;
					$(document).ready
					(
						function ()
						{
						$.addFlex(t,p);
						}
					);
				} else {*/
					$.addFlex(this,p);
				//}
			});

	}; //end flexigrid

	$.fn.flexReload = function(p) { // function to reload grid

		return this.each( function() {
				if (this.grid){
                    return this.grid.reload();
				}
			});

	}; //end flexReload

	$.fn.flexOptions = function(p) { //function to update general options

		return this.each( function() {
				if (this.grid) $.extend(this.p,p);
			});

	}; //end flexOptions

	$.fn.flexToggleCol = function(cid,visible) { // function to reload grid

		return this.each( function() {
				if (this.grid) this.grid.toggleCol(cid,visible);
			});

	}; //end flexToggleCol

	$.fn.flexAddData = function(data) { // function to add data to grid

		return this.each( function() {
				if (this.grid) this.grid.addData(data);
			});

	};

	$.fn.noSelect = function(p) { //no select plugin by me :-)

		if (p == null)
			var prevent = true;
		else
			prevent = p;

		if (prevent) {

		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).bind('selectstart',function(){return false;});
				else if ($.browser.mozilla)
					{
						$(this).css('MozUserSelect','none');
						$('body').trigger('focus');
					}
				else if ($.browser.opera) $(this).bind('mousedown',function(){return false;});
				else $(this).attr('unselectable','on');
			});

		} else {


		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).unbind('selectstart');
				else if ($.browser.mozilla) $(this).css('MozUserSelect','inherit');
				else if ($.browser.opera) $(this).unbind('mousedown');
				else $(this).removeAttr('unselectable','on');
			});

		}

	}; //end noSelect
	
    $.fn.flexDestroy = function() {
        return this.each( function() {
                if (this.grid) {
                    var isDebug = this.p.debug;
                    if (isDebug) {
                        var startTime = new Date();
                    }
                    this.grid.cleanup();
                    if (isDebug && window.console && window.console.log) {
                        console.log('flexDestroy took :' + (new Date() - startTime) + 'ms');
                    }
                }
            });        
    };
    
    $.fn.flexMultiSort = function(sortModel, colModel, tableModel) {
        return this.each( function() {
                if (this.grid) {
                	this.grid.multiSort(sortModel, colModel, tableModel)
                };
            });        
    };
    
    $.fn.flexFocus = function(focusState) {
        return this.each( function() {
                if (this.grid) {
                	this.grid.focus(focusState)
                };
            });        
    };
    
    $.fn.flexRemoteControl = function(keycode) {
        return this.each( function() {
                if (this.grid) {
                	this.grid.remoteControl(keycode)
                };
            });        
    };
})(jQuery);
