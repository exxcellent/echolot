/**
 *
 * Date picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Modified by exxcellent Solutions GmbH, Ulm
 * Author: Oliver Pehnke
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */                                         
(function($) {

	$.addPicker = function(t,options)
    {
        if (t.picker) return false; //return if already exist

        // apply default properties
        options = $.extend({
            flat: false, // do not popup, but always show the calendar
            starts: 1, // the first day of the week, Sunday = 0
            prev: '&lt;', // avoid missing unicode glyphs: '&#9664;', // the nice left arrow
            next: '&gt;', // avoid missing unicode glyphs: '&#9654;', // the nice right arrow
            mode: 'single',// the selection mode. Either single or range
            view: 'days', // the initial view. Can be days, months or years
            calendars: 1, // the amount of visible calendars
            format: 'Y-m-d', // search for 'DateFormat', to see the rules
            position: 'bottom', // location where to popup relative to the input field
            owner: false, // the owner of the datepicker component is used as 'this' for all callbacks
            onRender: function(){return {};}, // callback while rendering
            onChange: false, // callback if date was changed
            onShow: false, // callback when calendar is shown
            onBeforeShow: false, // callback before calendar is shown
            onHide: false, // callback on hiding the calendar
            hideOnSelect: true, // hiding the datepicker on selection of a date
            locale: { // the default locale
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                weekMin: 'wk'
            }
        }, options);

        var d = {
            // a date representing the selected date
            current : null,
            date : null,

            lastSel : null,
            calendars : null,
            mode : null,
            gDiv : null,
            lastSelTime : new Date().valueOf(), // dirty workaround to manage tab press & focuslost vs. selection clicks

            // the cache for the "parsed" template
            templateCache: null,
            views : null,
            template : null,

            // if the picker is event processing (used to prevent closing on clickHide() )
            processing : false,

			// Method to actually render the calendar.
			fill : function() {
                var cal = $(this.gDiv);
                var currentCal = Math.floor(options.calendars/2);
                var tmp, dow, month, cnt = 0,
                        week, days, indic, indic2, html, tblCal;

                cal.find('td>table tbody').remove();
				for (var i = 0; i < options.calendars; i++) {
                    tmp = new Date(this.current);
					this.addMonths(tmp, -currentCal + i);

                    tblCal = cal.find('table').eq(i+1);
					switch (tblCal[0].className) {
						case 'datepickerViewDays':
							dow = this.formatDate(tmp, 'B, yyyy');
							break;
						case 'datepickerViewMonths':
							dow = tmp.getFullYear();
							break;
						case 'datepickerViewYears':
							dow = (tmp.getFullYear()-6) + ' - ' + (tmp.getFullYear()+5);
							break;
					};
					tblCal.find('thead tr:first th:eq(1) span').text(dow);
					dow = tmp.getFullYear()-6;
					var yearData = {
						data: [],
						className: 'datepickerYears'
					};
					for ( var j = 0; j < 12; j++) {
						yearData.data.push(dow + j);
					}
					html = this.tmpl(this.template.months.join(''), yearData);
					tmp.setDate(1);
					var weekData = {
                        weeks:[],
                        test: 10
                    };
					month = tmp.getMonth();
					dow = (tmp.getDay() - options.starts) % 7;
					this.addDays(tmp,-(dow + (dow < 0 ? 7 : 0)));
					week = -1;
					cnt = 0;
					while (cnt < 42) {
						indic = parseInt(cnt/7,10);
						indic2 = cnt%7;
						if (!weekData.weeks[indic]) {
							week = this.getWeekNumber(tmp);
                            var elementDays = {
								week: week,
								days: []
							};
							weekData.weeks[indic] = elementDays;
						}
                        var element = {
                            text: tmp.getDate(),
							classname: []
						};
						weekData.weeks[indic].days[indic2] = element;

                        // define the classes, e.g. not in month, sunday and saturday
                        if (month != tmp.getMonth()) {
							weekData.weeks[indic].days[indic2].classname.push('datepickerNotInMonth');
						}
						if (tmp.getDay() === 0) {
							weekData.weeks[indic].days[indic2].classname.push('datepickerSunday');
						}
						if (tmp.getDay() === 6) {
							weekData.weeks[indic].days[indic2].classname.push('datepickerSaturday');
						}
                        // either user defined object or {}
                        var fromUser = options.onRender(tmp);
                        var val = tmp.valueOf();

                        // define the classes, e.g. selected (blue), disabled and user defined dates
                        if (fromUser.selected
                                || this.date === val
                                || $.inArray(val, this.date) > -1
                                || (options.mode === 'range' && this.date[0] && val >= this.date[0] && val <= this.date[1])) {
                            weekData.weeks[indic].days[indic2].classname.push('datepickerSelected');
                        }
                        if (fromUser.disabled) {
                            weekData.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                        }
                        if (fromUser.className) {
                            weekData.weeks[indic].days[indic2].classname.push(fromUser.className);
                        }
						weekData.weeks[indic].days[indic2].classname = weekData.weeks[indic].days[indic2].classname.join(' ');
						cnt++;
						this.addDays(tmp, 1);
					}
					html = this.tmpl(this.template.days.join(''), weekData) + html;
					var monthData = {
						data: options.locale.monthsShort,
						className: 'datepickerMonths'
					};
					html = this.tmpl(this.template.months.join(''), monthData) + html;
					tblCal.append(html);
				}
			},
			// DateFormat -> from String to Date
			parseDate : function (date, format) {
				if (date.constructor == Date) {
					return new Date(date);
				}
				// split the date at anything that is NOT a digit or underscore or char: /\W+/
				var parts = date.split(/\W+/);
				var against = format.split(/\W+/);
				var d, m, y;
				for (var i = 0; i < parts.length; i++) {
					switch (against[i]) {
						case 'd':
						case 'dd':
							d = parseInt(parts[i],10);
							break;
						case 'M':
						case 'MM':
                            // valid values range from 0 - 11    
							m = parseInt(parts[i], 10)-1;
							break;
						case 'yyyy':
						case 'yy':
							y = parseInt(parts[i], 10);
							y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
							break;
					}
				}
				var now = new Date();// default values.
                var enteredDate = new Date(
                    //y === undefined ? now.getFullYear() : y,
                        (isNaN(y) || y < 1900 || y > 2100) ? now.getFullYear() : y,
                        (isNaN(m) || m < 0 || m > 11) ? now.getMonth() : m,
                        (isNaN(d) || d < 0 || d > 31) ? now.getDate() : d,
                        5, 0, 0 // hours, minutes, seconds
                        );
                return isNaN(enteredDate.valueOf()) ? now : enteredDate ;
			},

			// DateFormat -> from Date to String
			formatDate : function(date, format) {
				var m = date.getMonth();
				var d = date.getDate();
				var y = date.getFullYear(date);
				var wn = this.getWeekNumber(date);

				// get the delimiter value, e.g. '.'
				var delimiter = format.match(/\W+/);
				// split the date at anything that is NOT a digit or underscore or char: /\W+/
				var parts = format.split(/\W+/), part;
				for ( var i = 0; i < parts.length; i++ ) {
					part = parts[i];
					switch (parts[i]) {
						case 'a':
							part = this.getDayName(date);
							break;
						case 'A':
							part = this.getDayName(date,true);
							break;
						case 'b':
							part = this.getMonthName(date);
							break;
						case 'B':
							part = this.getMonthName(date,true);
							break;
						case 'dd':
							part = (d < 10) ? ("0" + d) : d;
							break;
						case 'd':
							part = d;
							break;
						case 'MM':
							part = (m < 9) ? ("0" + (1+m)) : (1+m);
							break;
						case 'M':
							part = m;
							break;
						case 'yy':
							part = ('' + y).substr(2, 2);
							break;
						case 'yyyy':
							part = y;
							break;
					}
					parts[i] = part;
				}
				return parts.join(delimiter);
			},
			layout : function (el) {
				var cal = $(this.gDiv);
				if (!options.extraHeight) {
					var divs = $(el).find('div');
					options.extraHeight = divs.get(0).offsetHeight + divs.get(1).offsetHeight;
					options.extraWidth = divs.get(2).offsetWidth + divs.get(3).offsetWidth;
				}
				var tbl = cal.find('table:first').get(0);
				var width = tbl.offsetWidth;
				var height = tbl.offsetHeight;
				cal.css({
					width: width + options.extraWidth + 'px',
					height: height + options.extraHeight + 'px'
				}).find('div.datepickerContainer').css({
					width: width + 'px',
					height: height + 'px'
				});
			},

            // The main function if the user clicked an element in the calendar div
            selectElement : function(el) {
                this.lastSelTime = new Date(); // dirty workaround: record last click time in calendar
                if (window.console && window.console.log) { window.console.log('DatePicker.selectElement(' + el+' ), id: '+this.gDiv.id); }
                if (el.is('a')) {
					if (el.hasClass('datepickerDisabled')) {
						return false;
					}
					var parentEl = el.parent();
					var tblEl = parentEl.parent().parent().parent();

                    var table = tblEl.get(0);
					var tblIndex = $('table', this.gDiv).index(table) - 1;

                    var tmp = new Date(this.current);
					var changed = false;
					var fillIt = false;

					//Clicks in the calendar header (th) of the table.
					if (parentEl.is('th')) {

						//Weekday click-event. Only applied for mode=='range'
						if (parentEl.hasClass('datepickerWeek') && options.mode == 'range' && !parentEl.next().hasClass('datepickerDisabled')) {
							var val = parseInt(parentEl.next().text(), 10);
							this.addMonths(tmp, tblIndex - Math.floor(options.calendars/2));
							if (parentEl.next().hasClass('datepickerNotInMonth')) {
								this.addMonths(tmp, val > 15 ? -1 : 1);
							}
							tmp.setDate(val);
							this.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
							tmp.setHours(23,59,59,0);
							this.addDays(tmp,6);
							this.date[1] = tmp.valueOf();
							fillIt = true;
							changed = true;
							this.lastSel = false;

						// Month click-event.
						} else if (parentEl.hasClass('datepickerMonth')) {
							this.addMonths(tmp, tblIndex - Math.floor(options.calendars/2));
							switch (table.className) {
								case 'datepickerViewDays':
									table.className = 'datepickerViewMonths';
									el.find('span').text(tmp.getFullYear());
									break;
								case 'datepickerViewMonths':
									table.className = 'datepickerViewYears';
									el.find('span').text((tmp.getFullYear()-6) + ' - ' + (tmp.getFullYear()+5));
									break;
								case 'datepickerViewYears':
									table.className = 'datepickerViewDays';
									el.find('span').text(this.formatDate(tmp, 'B, yyyy'));
									break;
							}

						// Prev and Next for rolling years or month - click-event.
						} else if (parentEl.parent().parent().is('thead')) {
							switch (table.className) {
								case 'datepickerViewDays':
									this.addMonths(this.current, parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
									break;
								case 'datepickerViewMonths':
									this.addYears(this.current, parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
									break;
								case 'datepickerViewYears':
									this.addYears(this.current, parentEl.hasClass('datepickerGoPrev') ? -12 : 12);
									break;
							}
							fillIt = true;
						}

					// Click in the table itself on table data (td), e.g. date iteself
					} else if (parentEl.is('td') && !parentEl.hasClass('datepickerDisabled')) {
						switch (table.className) {

							//Clicking a month in the month view.
							case 'datepickerViewMonths':
								this.current.setMonth(tblEl.find('tbody.datepickerMonths td').index(parentEl));
								this.current.setFullYear(parseInt(tblEl.find('thead th.datepickerMonth span').text(), 10));
								this.addMonths(this.current, Math.floor(options.calendars/2) - tblIndex);
								table.className = 'datepickerViewDays';
								break;

							//Clicking a year in the years view.
							case 'datepickerViewYears':
								this.current.setFullYear(parseInt(el.text(), 10));
								table.className = 'datepickerViewMonths';
								break;

							// Clicking a date in the (normal) date calendar view.
							default:
								var day = parseInt(el.text(), 10);
								this.addMonths(tmp, tblIndex - Math.floor(options.calendars/2));
								if (parentEl.hasClass('datepickerNotInMonth')) {
									this.addMonths(tmp, day > 15 ? -1 : 1);
								}
								tmp.setDate(day);
								switch (options.mode) {
									case 'multiple':
										day = (tmp.setHours(0,0,0,0));
										if ($.inArray(day, this.date) > -1) {
											$.each(this.date, function(nr, dat){
												if (dat == day) {
													this.date.splice(nr,1);
													return false;
												}
											});
										} else {
											this.date.push(day);
										}
										break;
									case 'range':
										if (!this.lastSel) {
											this.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
										}
										day = (tmp.setHours(23,59,59,0)).valueOf();
										if (day < this.date[0]) {
											this.date[1] = this.date[0] + 86399000;
											this.date[0] = day - 86399000;
										} else {
											this.date[1] = day;
										}
										this.lastSel = !this.lastSel;
										break;
									default:
										this.date = tmp.valueOf();
                                        d.processing = false; // we are really ready
										break;
								}
								changed = true;
                                break;
						}
						fillIt = true;
					}
					if (fillIt) {
						this.fill();
					}
					if (changed) {
						// Trigger the onChange() callBack only if the date was really changed.
						// You can also click and select a year or month without changing the
						// date.
                        if(options.onChange) {
						    options.onChange.apply(options.owner, this.prepareDate(options));
                        }
					}
				}
                // help the gc do its job
                tmp = null;
			},
			prepareDate : function (options) {
				var tmp;
				if (options.mode == 'single') {
					tmp = new Date(this.date);
					return [this.formatDate(tmp, options.format), tmp, t];
				} else {
					tmp = [[],[], options.el];
                    var that = this;
					$.each(this.date, function(nr, val){
						var date = new Date(val);
						tmp[0].push(that.formatDate(date, options.format));
						tmp[1].push(date);
					});
					return tmp;
				}
			},
			getViewport : function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},

			showCalendar : function (inputfield) {
                var cal = $(this.gDiv);

				if (cal.is(':hidden') && !t.readOnly) {
					// Sync the value of the input field to the calendar widget
					if (t.value) {
						//this.current = this.parseDate(t.value, options.format);
                        //d.initDate(t.value);
                        d.setPickerDate(t.value);
					}
					// Trigger the callback before showing.
                    if (options.onBeforeShow) {
					    options.onBeforeShow.apply(options.owner, [this.gDiv]);
                    }
                    var pos = $(inputfield).position();
                    var top = pos.top;
                    var left = pos.left;

					//populate the calendar and show the date.
					this.fill();

                    var oldDisplay = $.curCSS(this.gDiv, 'display');
					cal.css({
						visibility: 'hidden',
						display: 'block'
					});

					this.layout(this.gDiv);
                    switch (options.position){
                        case 'top':
                            top -= cal.outerHeight();
                            break;
                        case 'left':
                            left -= inputfield.offsetWidth;
                            break;
                        case 'right':
                            left += inputfield.offsetWidth;
                            break;
                        case 'bottom':
                            top += inputfield.offsetHeight;
                            break;
                        case 'bottom-left':
                            top += inputfield.offsetHeight;
                            left -= cal.outerWidth() - inputfield.offsetWidth;
                            break;
                        case 'top-right':
                            top -= cal.outerHeight() - inputfield.offsetHeight;
                            left += inputfield.offsetWidth;
                            break;
                    }

					cal.css({
						visibility: 'visible',
						display: 'block',
                        top: top + 'px',
                        left: left + 'px',
                        position: 'absolute',
                        zIndex: 16777271,
					});
					if (options.onShow) {
                        options.onShow.apply(options.owner, [this.gDiv]);
					}
                    this.gDiv.style.display = "block";
				}
				return false;
			},
			hide : function () {
                if ($(this.gDiv).is(":hidden")){
                    return;
                }
				if (window.console && window.console.log) { window.console.log('DatePicker.hide()'); }
                if (options.onHide) {
                    options.onHide.apply(options.owner);
                }
                this.gDiv.style.display = "none";
                return true;
			},

			// Method to control the focus of the DatePicker Window.
			// @param focusState if true, the datePicker will be focused, otherwise blurred (hidden)
			focusPicker : function (focusState, inputfield) {
                if (window.console && window.console.log) { window.console.log('DatePicker.focusPicker(' + focusState+' ), id: '+this.gDiv.id); }
                if (focusState) {
                    this.showCalendar(inputfield);
                    $(this.gDiv).focus();
                } else {
                    this.hide();
                }
			},

            setPickerDate : function (date, shiftTo) {
                 // initialize date (from inputField.value)
                  if (date) {
				      this.current = this.parseDate(date, options.format);
                  } else {
                      this.current = new Date();
                  }
                  /*this.current.setDate(1);*/
                  this.current.setHours(0,0,0,0);

                this.date = date;

                if (this.date.constructor == String) {
                    this.date = this.parseDate(this.date, options.format);
                    this.date.setHours(0,0,0,0);
                }
                if (options.mode != 'single') {
                    if (this.date != Array) {
                        this.date = [new Date(this.date.valueOf())];
                        if (options.mode == 'range') {
                            this.date.push(new Date(((new Date(this.date[0])).setHours(23,59,59,0)).valueOf()));
                        }
                    } else {
                        for (var i = 0; i < this.date.length; i++) {
                            this.date[i] = new Date((this.parseDate(this.date[i], options.format).setHours(0,0,0,0)).valueOf());
                        }
                        if (options.mode == 'range') {
                            this.date[1] = new Date(((new Date(this.date[1])).setHours(23,59,59,0)).valueOf());
                        }
                    }
                } else {
                    this.date = this.date.valueOf();
                }
                if (shiftTo) {
                    this.current = new Date (options.mode != 'single' ? this.date[0] : this.date);
                }
                //this.fill();
            },

            getPickerDate : function (isFormated) {
                if (this.size() > 0) {
                    return this.prepareDate(options)[isFormated ? 0 : 1];
                }
            },

            clearPicker : function () {
                if (options.mode != 'single') {
                    this.date = [];
                    this.fill();
                }
            },

            tmpl : function (str, data) {
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                  this.templateCache[str] = this.templateCache[str] || this.tmpl(document.getElementById(str).innerHTML) :

                  // Generate a reusable function that will serve as a template
                  // generator (and which will be cached).
                  new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                      .replace(/[\r\t\n]/g, " ")
                      .split("<%").join("\t")
                      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                      .replace(/\t=(.*?)%>/g, "',$1,'")
                      .split("\t").join("');")
                      .split("%>").join("p.push('")
                      .split("\r").join("\\'")
                  + "');}return p.join('');");

                // Provide some basic currying to the user
                return data ? fn( data ) : fn;
              },

              getHtml : function(tpl) {
                    var html = '';
                    for (var i = 0; i < options.calendars; i++) {
                        var cnt = options.starts;
                        if (i > 0) {
                            html += tpl.space;
                        }
                        var elements = {
                            week: options.locale.weekMin,
                            prev: options.prev,
                            next: options.next,
                            day1: options.locale.daysMin[(cnt++)%7],
                            day2: options.locale.daysMin[(cnt++)%7],
                            day3: options.locale.daysMin[(cnt++)%7],
                            day4: options.locale.daysMin[(cnt++)%7],
                            day5: options.locale.daysMin[(cnt++)%7],
                            day6: options.locale.daysMin[(cnt++)%7],
                            day7: options.locale.daysMin[(cnt++)%7]
                        };
                        html += this.tmpl(tpl.head.join(''), elements);
                    }
                    return html;
              },
               /**
                * Methods to handle localised date attributes from options.locale
                * and utility methods to manipulate a given date, e.g. addMonth(count).
                * Originally it was Date.prototype but was recoded as closure.
                */
                getMonthName : function (date, fullName) {
                    if (fullName) {
                        return options.locale.months[date.getMonth()];
                    } else {
                        return options.locale.monthsShort[date.getMonth()];
                    }
                },

                getDayName : function (date, fullName) {
                    if (fullName) {
                        return options.locale.days[date.getDay()];
                    } else {
                        return options.locale.daysShort[date.getDay()];
                    }
                },
                addDays : function (date, n) {
                    date.setDate(date.getDate() + n);
                },
                addMonths : function (date, n) {
                    var tmpDate = new Date(date);
                    date.setDate(1);
                    date.setMonth(date.getMonth() + n);
                    date.setDate(Math.min(tmpDate.getDate(), this.getMaxDays(date)));
                },
                addYears : function (date, n) {
                    var tmpDate = new Date(date);

                    date.setDate(1);
                    date.setFullYear(date.getFullYear() + n);
                    date.setDate(Math.min(tmpDate.getDate(), this.getMaxDays(date))); // date.setDate(Math.min(tmpDate, this.getMaxDays(date)));
                },
                getMaxDays : function (date) {
                    var tmpDate = new Date(Date.parse(date, 10)), d = 28, m;
                    m = tmpDate.getMonth();
                    d = 28;
                    while (tmpDate.getMonth() == m) {
                        d ++;
                        tmpDate.setDate(d);
                    }
                    return d - 1;
                },
                getFirstDay : function (date) {
                    var tmpDate = new Date(Date.parse(date, 10));
                    tmpDate.setDate(1);
                    return tmpDate.getDay();
                },
                getWeekNumber : function (date) {
                    var tempDate = new Date(date);
                    tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
                    var dms = tempDate.valueOf();
                    tempDate.setMonth(0);
                    tempDate.setDate(4);
                    return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
                },
                getDayOfYear : function (date) {
                    var now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    var then = new Date(date.getFullYear(), 0, 0, 0, 0, 0);
                    var time = now - then;
                    return Math.floor(time / 24*60*60*1000);
                },

              init : function(p) {
                  this.calendars = Math.max(1, parseInt(p.calendars,10)||1);
                  this.mode = /single|multiple|range/.test(p.mode) ? p.mode : 'single';

                  //d.initDate(t.value);
                  d.setPickerDate(t.value);

                  d.templateCache = {};

                  d.views = {
                        years: 'datepickerViewYears',
                        moths: 'datepickerViewMonths',
                        days: 'datepickerViewDays'
                    };
                  d.template = {
                        wrapper: '<div class="datepicker"><div class="datepickerBorderT" /><div class="datepickerBorderB" /><div class="datepickerBorderL" /><div class="datepickerBorderR" /><div class="datepickerBorderTL" /><div class="datepickerBorderTR" /><div class="datepickerBorderBL" /><div class="datepickerBorderBR" /><div class="datepickerContainer"><table cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',
                        head: [
                            '<td>',
                            '<table cellspacing="0" cellpadding="0">',
                                '<thead>',
                                    '<tr>',
                                        '<th class="datepickerGoPrev"><a href="#"><span><%=prev%></span></a></th>',
                                        '<th colspan="6" class="datepickerMonth"><a href="#"><span></span></a></th>',
                                        '<th class="datepickerGoNext"><a href="#"><span><%=next%></span></a></th>',
                                    '</tr>',
                                    '<tr class="datepickerDoW">',
                                        '<th><span><%=week%></span></th>',
                                        '<th><span><%=day1%></span></th>',
                                        '<th><span><%=day2%></span></th>',
                                        '<th><span><%=day3%></span></th>',
                                        '<th><span><%=day4%></span></th>',
                                        '<th><span><%=day5%></span></th>',
                                        '<th><span><%=day6%></span></th>',
                                        '<th><span><%=day7%></span></th>',
                                    '</tr>',
                                '</thead>',
                            '</table></td>'
                        ],
                        space : '<td class="datepickerSpace"><div></div></td>',
                        days: [
                            '<tbody class="datepickerDays">',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[0].week%></span></a></th>',
                                    '<td class="<%=weeks[0].days[0].classname%>"><a href="#"><span><%=weeks[0].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[1].classname%>"><a href="#"><span><%=weeks[0].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[2].classname%>"><a href="#"><span><%=weeks[0].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[3].classname%>"><a href="#"><span><%=weeks[0].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[4].classname%>"><a href="#"><span><%=weeks[0].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[5].classname%>"><a href="#"><span><%=weeks[0].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[0].days[6].classname%>"><a href="#"><span><%=weeks[0].days[6].text%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[1].week%></span></a></th>',
                                    '<td class="<%=weeks[1].days[0].classname%>"><a href="#"><span><%=weeks[1].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[1].classname%>"><a href="#"><span><%=weeks[1].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[2].classname%>"><a href="#"><span><%=weeks[1].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[3].classname%>"><a href="#"><span><%=weeks[1].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[4].classname%>"><a href="#"><span><%=weeks[1].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[5].classname%>"><a href="#"><span><%=weeks[1].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[1].days[6].classname%>"><a href="#"><span><%=weeks[1].days[6].text%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[2].week%></span></a></th>',
                                    '<td class="<%=weeks[2].days[0].classname%>"><a href="#"><span><%=weeks[2].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[1].classname%>"><a href="#"><span><%=weeks[2].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[2].classname%>"><a href="#"><span><%=weeks[2].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[3].classname%>"><a href="#"><span><%=weeks[2].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[4].classname%>"><a href="#"><span><%=weeks[2].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[5].classname%>"><a href="#"><span><%=weeks[2].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[2].days[6].classname%>"><a href="#"><span><%=weeks[2].days[6].text%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[3].week%></span></a></th>',
                                    '<td class="<%=weeks[3].days[0].classname%>"><a href="#"><span><%=weeks[3].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[1].classname%>"><a href="#"><span><%=weeks[3].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[2].classname%>"><a href="#"><span><%=weeks[3].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[3].classname%>"><a href="#"><span><%=weeks[3].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[4].classname%>"><a href="#"><span><%=weeks[3].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[5].classname%>"><a href="#"><span><%=weeks[3].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[3].days[6].classname%>"><a href="#"><span><%=weeks[3].days[6].text%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[4].week%></span></a></th>',
                                    '<td class="<%=weeks[4].days[0].classname%>"><a href="#"><span><%=weeks[4].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[1].classname%>"><a href="#"><span><%=weeks[4].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[2].classname%>"><a href="#"><span><%=weeks[4].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[3].classname%>"><a href="#"><span><%=weeks[4].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[4].classname%>"><a href="#"><span><%=weeks[4].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[5].classname%>"><a href="#"><span><%=weeks[4].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[4].days[6].classname%>"><a href="#"><span><%=weeks[4].days[6].text%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<th class="datepickerWeek"><a href="#"><span><%=weeks[5].week%></span></a></th>',
                                    '<td class="<%=weeks[5].days[0].classname%>"><a href="#"><span><%=weeks[5].days[0].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[1].classname%>"><a href="#"><span><%=weeks[5].days[1].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[2].classname%>"><a href="#"><span><%=weeks[5].days[2].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[3].classname%>"><a href="#"><span><%=weeks[5].days[3].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[4].classname%>"><a href="#"><span><%=weeks[5].days[4].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[5].classname%>"><a href="#"><span><%=weeks[5].days[5].text%></span></a></td>',
                                    '<td class="<%=weeks[5].days[6].classname%>"><a href="#"><span><%=weeks[5].days[6].text%></span></a></td>',
                                '</tr>',
                            '</tbody>'
                        ],
                        months: [
                            '<tbody class="<%=className%>">',
                                '<tr>',
                                    '<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[3]%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[7]%></span></a></td>',
                                '</tr>',
                                '<tr>',
                                    '<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>',
                                    '<td colspan="2"><a href="#"><span><%=data[11]%></span></a></td>',
                                '</tr>',
                            '</tbody>'
                        ]
                    };
              }

		} // --- EOF DatePicker Declaration (d)

        if (window.console && window.console.log) { window.console.log('DatePicker.init()')};

        // a kind of constructor for the "class" 'd'
        d.init(options);

        var cal = $(d.template.wrapper);
        d.cal = cal;

        //if (options.flat) {
        // fill the calendar according to the date object in flat mode directly
        //d.fill(cal.get(0));
        //cal.appendTo(this).show().css('position', 'relative');
        //d.layout(cal.get(0));
        //} else {

        if (!options.flat) {
            // append the calendar DIV to the document.body in order to SHOW it if the user clicks it
            //cal.appendTo(document.body);
            cal.appendTo($(t).parent());
            // bind the mousedown to the inputfield on SHOW
            $(t).mousedown(inputFieldClick);
        }

        //
        // the events of the datepicker
        // @see if you don't understand url: http://howtonode.org/what-is-this
        //
        function hideOnClick(e) {
            if (!d.processing && options.hideOnSelect) {
                d.hide();
                $(document).unbind('mousedown', hideOnClick);
                $(t.cal).unbind('mousedown', calendarSelect);
                $(t).unbind('blur', hideOnBlur);
                $(t).focus();
            } else {
                d.processing = false;
            }
        }
        function hideOnBlur(e) {
            if (!d.processing && options.hideOnSelect) {
                var timeSinceLastSelection = new Date().valueOf() - d.lastSelTime;
                if (window.console && window.console.log) { window.console.log('DatePicker.hideOnBlur(). Time since last selection: ' + timeSinceLastSelection); }
                // Did we recently click the calendar?
                // If yes: ignore blur event: focus should return to textfield
                if (timeSinceLastSelection > 700) {
                    d.hide();
                    $(document).unbind('mousedown', hideOnClick);
                    $(t.cal).unbind('mousedown', calendarSelect);
                    $(t).unbind('blur', hideOnBlur);
                } else {
                    e.preventDefault();
                    t.focus();
                }
            } else {
                d.processing = false;
            }
        }
        function calendarSelect(e) {
            if ($(e.target).is('span')) {
                e.target = e.target.parentNode;
            }
            var selectedEl = (e.target || e.srcElement);
            d.processing = true;
            d.selectElement($(selectedEl));
            e.preventDefault();
            t.focus();
        }
        function inputFieldClick(e) {
            if (t.cal.is(':hidden') && !t.readOnly) {
                d.processing = true;
                d.showCalendar(t);

                // Bind the click event to the calendar
                cal = cal.mousedown(calendarSelect);
                $(document).mousedown(hideOnClick);
                $(t).blur(hideOnBlur);
            }
        }
        d.destroyPicker = function () {
            if (t.picker) {
                if (window.console && window.console.log) { window.console.log('DatePicker.cleanup(), id: '+d.gDiv.id);}

                $(document).unbind('mousedown', hideOnClick);
                $(t.cal).unbind('mousedown', calendarSelect);
                $(t).unbind('mousedown', inputFieldClick);
                $(t).unbind('blur', hideOnBlur);

                // remove All event listener from inputField
                $(t).removeData();
                // Help GC
                t.p.prev = null;
                t.p.next = null;
                t.p.owner = null;
                t.p.onRender = null;
                t.p.onChange = null;
                t.p.onShow = null;
                t.p.onBeforeShow = null;
                t.p.onHide = null;
                t.p.locale = null;
                t.p = null;

                t.picker = null;
                t.cal = null;
                t = null;

                d.lastSel = null;
                d.current = null;

                // remove the calendar global DIV from the DOM
                $(d.gDiv).removeData();
                purge(d.gDiv);
                $(d.gDiv).empty();
                $(d.gDiv).remove();

                d.templateCache = null;

                d.gDiv = null;
                d = null;

                // Remove all jQuery stuff from the whole component
                $(this).removeData();
            }
            // http://javascript.crockford.com/memory/leak.html
            function purge(d){
                var a = d.attributes, i, l, n;
                if (a) {
                    l = a.length;
                    for (i = 0; i < l; i += 1) {
                        n = a[i].name;
                        if ('function' === typeof d[n]) {
                            d[n] = null;
                        }
                    }
                }
                a = d.childNodes;
                if (a) {
                    l = a.length;
                    for (i = 0; i < l; i += 1) {
                        purge(d.childNodes[i]);
                    }
                }
            };
        };
        d.remoteControl = function(e) {
            d.hide();
        }

        if (options.className) {
            cal.addClass(options.className);
        }
        var html = d.getHtml(d.template);
        cal.find('tr:first').append(html)
                .find('table').addClass(d.views[options.view]);

        d.gDiv = cal.get(0); // the global div element of the datePicker

        t.picker = d;
        t.p = options;
        t.cal = cal;
        //t.cal.hide();

        return t;
	}; // end datePicker


    // make some functions available from outside
	$.fn.datePicker = function(options) {
       return this.each( function() {
            $.addPicker(this, options);
       });
    };
    
    $.fn.pickerHide = function() {
        return this.each( function () {
             if (this.picker) this.picker.hide();
        });
    };
    $.fn.pickerDestroy = function () {
        return this.each(function(){
           if (this.picker) this.picker.destroyPicker();
        });
    };

    $.fn.pickerFocus = function (focusState) {
        return this.each(function(){
            if (this.picker) this.picker.focusPicker(focusState);
        });
    };

    $.fn.pickerRemoteControl = function (event) {
         return this.each(function(){
            if (this.picker) this.picker.remoteControl(event);
        });
	};
    /*
    $.fn.pickerSetDate = function(date, shiftTo){
        return this.each(function(){
            if (this.picker) this.picker.setPickerDate(date, shiftTo);
        });
    };
    $.fn.pickerGetDate = function(isFormated) {
        return this.each(function(){
           if (this.picker) this.picker.getPickerDate(isFormated);
        });
    };
    $.fn.pickerClear = function(){
        return this.each(function(){
            if (this.picker) this.picker.clearPicker();
        });
    };
    */
})(jQuery);