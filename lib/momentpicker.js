(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-momentpicker', ["jquery","simple-module"], function (a0,b1) {
      return (root['momentpicker'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['momentpicker'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.opts = {
    parent: null,
    inputContainer: null,
    panelContainer: null
  };

  View.prototype.name = '';

  View.prototype._inputTpl = '<input class="input"/>';

  View.prototype._panelTpl = '<div class="panel"></div>';

  View.addView = function(view) {
    if (!this.views) {
      this.views = [];
    }
    return this.views[view.prototype.name] = view;
  };

  View.prototype._init = function() {
    this.parent = $(this.opts.parent);
    this.inputContainer = $(this.opts.inputContainer);
    this.panelContainer = $(this.opts.panelContainer);
    this.moment = this.opts.defaultValue || moment();
    this._render();
    this._bindInput();
    this._bindPanel();
    return this._bindView();
  };

  View.prototype._render = function() {
    this.input = $(this._renderInput());
    this.panel = $(this._renderPanel());
    this.inputContainer.append(this.input);
    this.panelContainer.append(this.panel);
    this._refreshSelected();
    return this._refreshInput();
  };

  View.prototype._bindInput = function() {
    this.input.on('focus', (function(_this) {
      return function() {
        _this.panel.addClass('active');
        return _this.trigger('showpanel', {
          source: _this.name
        });
      };
    })(this));
    this.input.on('keydown', (function(_this) {
      return function(e) {
        return _this._onKeydownHandler(e);
      };
    })(this));
    this.input.on('input', (function(_this) {
      return function(e) {
        return _this._onInputHandler(e);
      };
    })(this));
    return this.input.on('click', (function(_this) {
      return function(e) {
        _this.input.focus().select();
        return false;
      };
    })(this));
  };

  View.prototype._onKeydownHandler = function(e) {
    var direction, key, max, min, type, value;
    key = e.which;
    value = this.input.val();
    type = this.input.data('type');
    min = this.input.data('min');
    max = this.input.data('max');
    if (key === 9) {
      if (e.shiftKey) {
        this.trigger('showpanel', {
          source: this.name,
          prev: true
        });
      } else {
        this.select(value, false, true);
      }
    } else if (key === 13) {
      this.select(value, false, false);
      this.trigger('close', {
        selected: true
      });
    } else if (key === 38 || key === 40) {
      direction = key === 38 ? 1 : -1;
      value = Number(value) + direction;
      if (value < min) {
        value = max;
      }
      if (value > max) {
        value = min;
      }
      this.select(value, true, false);
    } else if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(key) !== -1) {
      return;
    } else if ([8, 46, 37, 39].indexOf(key) !== -1) {
      return;
    } else if (key === 27) {
      this.trigger('close');
    }
    return e.preventDefault();
  };

  View.prototype._onInputHandler = function() {};

  View.prototype._bindPanel = function() {
    this.panel.on('click', 'a.panel-item', (function(_this) {
      return function(e) {
        return _this._onClickHandler(e);
      };
    })(this));
    return this.panel.on('click', 'a.menu-item', (function(_this) {
      return function(e) {
        var $target, action;
        e.preventDefault();
        $target = $(e.currentTarget);
        action = $target.data('action');
        return _this._handleAction(action);
      };
    })(this));
  };

  View.prototype._onClickHandler = function(e) {
    var $target, value;
    e.preventDefault();
    $target = $(e.currentTarget);
    value = $target.data('value');
    return this.select(value, true, true);
  };

  View.prototype._handleAction = function() {};

  View.prototype._bindView = function() {
    return this.on('datechange', (function(_this) {
      return function(e, event) {
        return _this._onDateChangeHandler(event);
      };
    })(this));
  };

  View.prototype._onDateChangeHandler = function() {};

  View.prototype._renderInput = function() {
    return this._inputTpl;
  };

  View.prototype._renderPanel = function() {
    return this._panelTpl;
  };

  View.prototype._reRenderPanel = function(opt) {
    var active;
    if (this.panel.is('.active')) {
      active = true;
    }
    this.panel.replaceWith($(this._renderPanel(opt)));
    this.panel = this.panelContainer.find(".panel-" + this.name);
    if (active) {
      this.panel.addClass('active');
    }
    this._refreshSelected();
    return this._bindPanel();
  };

  View.prototype._refreshSelected = function() {
    this.panel.find('a.selected').removeClass('selected');
    return this.panel.find("a[data-value='" + (this._getValue()) + "']").addClass('selected');
  };

  View.prototype._refreshInput = function() {
    return this.input.val(this._getValue());
  };

  View.prototype._getValue = function() {
    return this.moment.get(this.name);
  };

  View.prototype.select = function(value, refreshInput, finished) {
    this.moment.set(this.name, value);
    this._refreshSelected();
    if (refreshInput) {
      this._refreshInput();
    }
    return this.triggerHandler('select', {
      source: this.name,
      moment: this.moment,
      finished: finished
    });
  };

  View.prototype.setActive = function(active) {
    if (active == null) {
      active = true;
    }
    if (active) {
      return this.input.focus().select();
    } else {
      return this.panel.removeClass('active');
    }
  };

  View.prototype.clear = function() {
    this.moment = moment();
    return this.input.val('');
  };

  return View;

})(SimpleModule);

var MomentPicker, momentpicker,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MomentPicker = (function(superClass) {
  extend(MomentPicker, superClass);

  function MomentPicker() {
    return MomentPicker.__super__.constructor.apply(this, arguments);
  }

  MomentPicker.prototype.opts = {
    list: ['year', '%-', 'month', '%-', 'date', '%   ', 'hour', '%:', 'minute'],
    el: null,
    inline: false,
    valueFormat: 'YYYY-MM-DD HH:mm',
    displayFormat: 'LLLL',
    defaultView: 'auto',
    "class": 'datetime-picker',
    viewOpts: {
      date: {
        disableBefore: null,
        disableAfter: null
      }
    }
  };

  MomentPicker.prototype._init = function() {
    var val;
    this.view = [];
    this.viewList = [];
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple momentpicker: option el is required';
      return;
    }
    this.el.data('momentpicker', this);
    val = this.el.val() || moment();
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.valueFormat);
    this._render();
    return this._bind();
  };

  MomentPicker.prototype._render = function() {
    var tpl;
    tpl = '<div class="simple-momentpicker">\n  <div class="picker-header">\n  </div>\n  <div class="picker-panels">\n  </div>\n</div>';
    this.picker = $(tpl);
    if (this.opts["class"]) {
      this.picker.addClass(this.opts["class"]);
    }
    this.headerContainer = this.picker.find('.picker-header');
    this.panelContainer = this.picker.find('.picker-panels');
    this._renderViews();
    if (this.opts.inline) {
      this.picker.insertAfter(this.el);
      return this.show();
    } else {
      this._renderFakeInput();
      return this.picker.appendTo('body');
    }
  };

  MomentPicker.prototype._renderFakeInput = function() {
    var type;
    type = this.el.attr('type');
    this.input = $('<input />').addClass('momentpicker-input').attr({
      'readonly': 'true',
      'type': 'text',
      'placeholder': this.el.attr('placeholder'),
      'data-type': type
    }).css({
      'cursor': 'pointer'
    });
    if (this.el.val() !== '') {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    this.input.insertAfter(this.el);
    return this.el.hide();
  };

  MomentPicker.prototype._renderViews = function() {
    var i, len, name, opt, ref, results;
    ref = this.opts.list;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      if (name.indexOf('%') === -1) {
        opt = {
          parent: this,
          inputContainer: this.headerContainer,
          panelContainer: this.panelContainer,
          defaultValue: this.date
        };
        if (this.opts['viewOpts'][name]) {
          $.extend(opt, this.opts['viewOpts'][name]);
        }
        this.view[name] = new View.prototype.constructor.views[name](opt);
        this.viewList.push(name);
        results.push(this._bindView(this.view[name]));
      } else {
        results.push(this.headerContainer.append("<span>" + (name.substr(1)) + "</span>"));
      }
    }
    return results;
  };

  MomentPicker.prototype._setPosition = function() {
    var offset;
    offset = this.input.offset();
    return this.picker.css({
      'position': 'absolute',
      'left': offset.left,
      'top': offset.top + this.input.outerHeight(true)
    });
  };

  MomentPicker.prototype._bind = function() {
    this.picker.on('click mousedown', function() {
      return false;
    });
    if (this.opts.inline) {
      return;
    }
    this.input.on('focus.momentpicker', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    return $(document).on('click.momentpicker', (function(_this) {
      return function(e) {
        if (_this.input.is(e.target)) {
          return;
        }
        if (_this.picker.has(e.target).length) {
          return;
        }
        if (_this.picker.is(e.target)) {
          return;
        }
        return _this.hide();
      };
    })(this));
  };

  MomentPicker.prototype._bindView = function(view) {
    view.on('select', (function(_this) {
      return function(e, event) {
        var index, ref, ref1, ref2, source;
        source = event.source;
        if (source === 'date') {
          _this.date = event.moment;
        } else {
          _this.date.set(source, event.moment.get(event.source));
        }
        switch (source) {
          case 'year':
          case 'month':
            if ((ref = _this.view['date']) != null) {
              ref.trigger('datechange', {
                moment: _this.date
              });
            }
            break;
          case 'date':
            if ((ref1 = _this.view['year']) != null) {
              ref1.trigger('datechange', {
                moment: _this.date
              });
            }
            if ((ref2 = _this.view['month']) != null) {
              ref2.trigger('datechange', {
                moment: _this.date
              });
            }
        }
        if (event.finished) {
          index = _this.viewList.indexOf(source);
          if (index === _this.viewList.length - 1) {
            return _this._selectDate();
          } else {
            return _this.view[_this.viewList[index + 1]].setActive();
          }
        }
      };
    })(this));
    view.on('showpanel', (function(_this) {
      return function(e, event) {
        var i, index, len, name, ref, results, source;
        source = event.source;
        if (event.prev) {
          _this.view[source].setActive(false);
          index = _this.viewList.indexOf(source) - 1;
          if (index < 0) {
            index = 0;
          }
          return _this.view[_this.viewList[index]].setActive();
        } else {
          ref = _this.viewList;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            name = ref[i];
            if (name !== source) {
              results.push(_this.view[name].setActive(false));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
    })(this));
    return view.on('close', (function(_this) {
      return function(e, event) {
        if (event != null ? event.selected : void 0) {
          _this._selectDate();
        }
        if (!_this.opts.inline) {
          return _this.hide();
        }
      };
    })(this));
  };

  MomentPicker.prototype._selectDate = function() {
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this.hide();
    }
  };

  MomentPicker.prototype.setDate = function(date) {
    var ref, ref1, ref2, ref3, ref4;
    this.date = moment.isMoment(date) ? date.clone() : moment(date, this.opts.valueFormat);
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    if ((ref = this.view['year']) != null) {
      ref.trigger('datechange', {
        moment: this.date
      });
    }
    if ((ref1 = this.view['month']) != null) {
      ref1.trigger('datechange', {
        moment: this.date
      });
    }
    if ((ref2 = this.view['date']) != null) {
      ref2.trigger('datechange', {
        moment: this.date
      });
    }
    if ((ref3 = this.view['hour']) != null) {
      ref3.trigger('datechange', {
        moment: this.date
      });
    }
    return (ref4 = this.view['minute']) != null ? ref4.trigger('datechange', {
      moment: this.date
    }) : void 0;
  };

  MomentPicker.prototype.clear = function() {
    var i, len, name, ref, results;
    this.el.val('');
    this.input.val('');
    this.date = moment();
    ref = this.viewList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      results.push(this.view[name].clear());
    }
    return results;
  };

  MomentPicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date.clone() || (this.date = moment(this.el.val(), this.opts.valueFormat));
    } else {
      return null;
    }
  };

  MomentPicker.prototype.show = function() {
    var view;
    if (!this.opts.inline) {
      this._setPosition();
    }
    this.picker.show();
    this.picker.addClass('active');
    view = this.opts.defaultView;
    if (this.viewList.indexOf(view) !== -1) {
      return this.view[view].setActive();
    } else {
      if (this.view['date']) {
        return this.view['date'].setActive();
      } else {
        return this.view[this.viewList[0]].setActive();
      }
    }
  };

  MomentPicker.prototype.hide = function() {
    this.picker.hide();
    return this.picker.removeClass('active');
  };

  MomentPicker.prototype.toggle = function() {
    if (this.picker.is('.active')) {
      return this.hide();
    } else {
      return this.show();
    }
  };

  MomentPicker.prototype.destroy = function() {
    var ref;
    if ((ref = this.picker) != null) {
      ref.remove();
    }
    this.picker = null;
    if (!this.opts.inline) {
      this.input.remove();
      this.el.show();
      return $(document).off('.momentpicker');
    }
  };

  return MomentPicker;

})(SimpleModule);

momentpicker = function(opts) {
  return new MomentPicker(opts);
};

momentpicker.View = View;

momentpicker.date = function(opts) {
  opts = $.extend({
    list: ['year', '%-', 'month', '%-', 'date'],
    displayFormat: 'LL',
    valueFormat: 'YYYY-MM-DD',
    "class": 'date-picker',
    defaultView: 'date'
  }, opts);
  return new MomentPicker(opts);
};

momentpicker.month = function(opts) {
  opts = $.extend({
    list: ['year', '%-', 'month'],
    displayFormat: 'YYYY-MM',
    valueFormat: 'YYYY-MM',
    "class": 'month-picker',
    defaultView: 'month'
  }, opts);
  return new MomentPicker(opts);
};

momentpicker.time = function(opts) {
  opts = $.extend({
    list: ['hour', '%-', 'minute'],
    displayFormat: 'LT',
    valueFormat: 'HH:mm',
    "class": 'time-picker'
  }, opts);
  return new MomentPicker(opts);
};

var DateView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DateView = (function(superClass) {
  extend(DateView, superClass);

  function DateView() {
    return DateView.__super__.constructor.apply(this, arguments);
  }

  DateView.prototype.name = 'date';

  DateView.prototype.currentMonth = moment().format('YYYY-MM');

  DateView.prototype.opts = {
    el: null,
    disableBefore: null,
    disableAfter: null
  };

  DateView.prototype.value = moment().format('YYYY-MM-DD');

  DateView.prototype._inputTpl = '<input type="text" class="view-input date-input" data-type="date" data-min="1"/>';

  DateView.prototype._renderPanel = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<div class=\"panel panel-date\">\n  <div class=\"calendar-menu\">\n    " + (this._renderDayMenu()) + "\n  </div>\n  <table class=\"calendar\"\">\n    <tr class=\"datepicker-dow\">\n      " + week + "\n    </tr>\n    " + (this._renderDaySelectors()) + "\n  </table>\n</div>";
  };

  DateView.prototype._renderDayMenu = function() {
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>";
  };

  DateView.prototype._renderDaySelectors = function() {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, tmpDate, today, until_, x, y;
    today = moment().startOf("day");
    tmpDate = moment(this.currentMonth, 'YYYY-MM');
    this.input.attr({
      'data-max': tmpDate.endOf('month').date()
    });
    firstDate = tmpDate.clone().startOf("month");
    lastDate = tmpDate.clone().endOf("month");
    prevLastDate = tmpDate.clone().add(-1, "months").endOf("month");
    days = "";
    y = 0;
    i = 0;
    while (y < 6) {
      row = "";
      x = 0;
      while (x < 7) {
        p = (prevLastDate.date() - prevLastDate.day()) + i + 1;
        n = p - prevLastDate.date();
        c = (x === 6 ? "sun" : (x === 5 ? "sat" : "day"));
        date = tmpDate.clone().date(n);
        if (n >= 1 && n <= lastDate.date()) {
          if (today.isSame(date, 'day') === true) {
            c += ' today';
          }
          if (this.selectedDate) {
            c += (date.diff(this.selectedDate) === 0 ? " selected" : " ");
          }
        } else if (n > lastDate.date() && x === 0) {
          break;
        } else {
          c = (x === 6 ? "sun" : (x === 5 ? "sat" : "day")) + " others";
          n = (n <= 0 ? p : (p - lastDate.date()) - prevLastDate.date());
        }
        if (moment.isMoment(this.opts.disableBefore)) {
          until_ = moment(this.opts.disableBefore, "YYYY-MM-DD");
          c += (date.diff(until_) < 0 ? " disabled" : "");
        }
        if (moment.isMoment(this.opts.disableAfter)) {
          until_ = moment(this.opts.disableAfter, "YYYY-MM-DD");
          c += (date.diff(until_) > 0 ? " disabled" : "");
        }
        row += "<td class='datepicker-day'>\n  <a href=\"javascript:;\" class=\"" + c + " panel-item\" data-value=\"" + (date.format('YYYY-MM-DD')) + "\">\n    " + n + "\n  </a>\n</td>";
        x++;
        i++;
      }
      if (row) {
        days += "<tr class=\"days\">" + row + "</tr>";
      }
      y++;
    }
    return days;
  };

  DateView.prototype._onInputHandler = function() {
    var max, value;
    max = moment(this.currentMonth, 'YYYY-MM').endOf('month').date();
    while (Number(this.input.val()) > max) {
      this.input.val(this.input.val().substr(1));
    }
    if (this.input.val().length === 3) {
      this.input.val(this.input.val().substr(1));
    }
    value = this.input.val();
    if (value.length === 1) {
      if (Number(value) > 3) {
        return this.select(value, false, true);
      } else if (Number(value) !== 0) {
        return this.timer = setTimeout((function(_this) {
          return function() {
            _this.select(value, false, true);
            return _this.timer = null;
          };
        })(this), 800);
      }
    } else if (value.length === 2 && Number(value) <= max && Number(value) !== 0) {
      return this.select(value, false, true);
    }
  };

  DateView.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return DateView.__super__._onKeydownHandler.call(this, e);
  };

  DateView.prototype._handleAction = function(action) {
    var direction, tmpDate;
    tmpDate = moment(this.currentMonth, 'YYYY-MM');
    direction = action === 'prev' ? -1 : 1;
    tmpDate.add(direction, 'month');
    this.currentMonth = tmpDate.format('YYYY-MM');
    this.triggerHandler('select', {
      source: 'date',
      moment: tmpDate,
      finished: false
    });
    this._reRenderPanel();
    return this.panel.addClass('active');
  };

  DateView.prototype._refreshInput = function() {
    var date;
    date = this.moment.date();
    return this.input.val(String('00' + date).slice(-2));
  };

  DateView.prototype._getValue = function() {
    return this.moment.format('YYYY-MM-DD');
  };

  DateView.prototype._onDateChangeHandler = function(e) {
    var newMonth;
    this.moment = e.moment;
    newMonth = this.moment.format('YYYY-MM');
    this._refreshSelected();
    this._refreshInput();
    if (newMonth === this.currentMonth) {
      return;
    }
    this.currentMonth = newMonth;
    return this._reRenderPanel();
  };

  DateView.prototype._onClickHandler = function(e) {
    var $target, date, value;
    e.preventDefault();
    $target = $(e.currentTarget);
    value = $target.data('value');
    date = moment(value);
    return this.select(date.format('D'), true, true);
  };

  DateView.prototype.select = function(value, refreshInput, finished) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return DateView.__super__.select.call(this, value, refreshInput, finished);
  };

  return DateView;

})(View);

View.addView(DateView);

var Hourview,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Hourview = (function(superClass) {
  extend(Hourview, superClass);

  function Hourview() {
    return Hourview.__super__.constructor.apply(this, arguments);
  }

  Hourview.prototype.name = 'hour';

  Hourview.prototype._inputTpl = '<input type="text" class="view-input hour-input" data-type="hour" data-min="0" data-max="23"/>';

  Hourview.prototype._renderPanel = function() {
    var el, hour, i;
    el = "<div class='panel panel-hour'>";
    for (hour = i = 0; i <= 23; hour = ++i) {
      el += "<a class='panel-item' data-value='" + hour + "'>" + (String("00" + hour).slice(-2)) + "</a>";
    }
    return el += '</div>';
  };

  Hourview.prototype._onInputHandler = function(e) {
    var value;
    value = this.input.val();
    if (value.length === 2 && Number(value) < 24) {
      return this.select(value, true, true);
    } else if (value.length === 1) {
      if (Number(value) > 2) {
        return this.select(value, true, true);
      } else {
        return this.timer = setTimeout((function(_this) {
          return function() {
            _this.select(value, false, true);
            return _this.timer = null;
          };
        })(this), 800);
      }
    }
  };

  Hourview.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return Hourview.__super__._onKeydownHandler.call(this, e);
  };

  Hourview.prototype._onDateChangeHandler = function(e) {
    this.moment = e.moment;
    this._refreshInput();
    return this._refreshSelected();
  };

  Hourview.prototype._refreshInput = function() {
    return this.input.val(String('00' + this._getValue()).slice(-2));
  };

  return Hourview;

})(View);

View.addView(Hourview);

var MinuteView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MinuteView = (function(superClass) {
  extend(MinuteView, superClass);

  function MinuteView() {
    return MinuteView.__super__.constructor.apply(this, arguments);
  }

  MinuteView.prototype.name = 'minute';

  MinuteView.prototype._inputTpl = '<input type="text" class="view-input minute-input" data-type="minute" data-min="0" data-max="59"/>';

  MinuteView.prototype._renderPanel = function() {
    var el, i, minute;
    el = "<div class='panel panel-minute'>";
    for (minute = i = 0; i <= 55; minute = i += 5) {
      el += "<a class='panel-item' data-value='" + minute + "'>" + (String("00" + minute).slice(-2)) + "</a>";
    }
    return el += '</div>';
  };

  MinuteView.prototype._onInputHandler = function(e) {
    var value;
    value = this.input.val();
    if (value.length === 2 && Number(value) < 60) {
      return this.select(value, true, true);
    } else if (value.length === 1) {
      return this.timer = setTimeout((function(_this) {
        return function() {
          _this.select(value, false, true);
          return _this.timer = null;
        };
      })(this), 800);
    }
  };

  MinuteView.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return MinuteView.__super__._onKeydownHandler.call(this, e);
  };

  MinuteView.prototype._onDateChangeHandler = function(e) {
    this.moment = e.moment;
    this._refreshInput();
    return this._refreshSelected();
  };

  MinuteView.prototype._refreshSelected = function() {
    var value;
    value = this._getValue();
    value = Math.floor(value / 5) * 5;
    value += this._getValue() % 5 >= 3 ? 5 : 0;
    this.panel.find('.selected').removeClass('selected');
    return this.panel.find("[data-value=" + value + "]").addClass('selected');
  };

  MinuteView.prototype._refreshInput = function() {
    return this.input.val(String('00' + this._getValue()).slice(-2));
  };

  return MinuteView;

})(View);

View.addView(MinuteView);

var MonthView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MonthView = (function(superClass) {
  extend(MonthView, superClass);

  function MonthView() {
    return MonthView.__super__.constructor.apply(this, arguments);
  }

  MonthView.prototype.name = 'month';

  MonthView.prototype._inputTpl = '<input type="text" class="view-input month-input" data-type="month" data-min="1" data-max="12"/>';

  MonthView.prototype._renderPanel = function() {
    var el, i, month;
    el = '';
    for (month = i = 1; i <= 12; month = ++i) {
      el += "<a class='panel-item' data-value='" + month + "'>" + (String('00' + month).slice(-2)) + "</a>";
    }
    return $(this._panelTpl).html(el).addClass('panel-month');
  };

  MonthView.prototype._onInputHandler = function() {
    var value;
    while (Number(this.input.val()) > 12) {
      this.input.val(this.input.val().substr(1));
    }
    value = this.input.val();
    if (value.length === 2 && Number(value) !== 0) {
      return this.select(value, false, true);
    } else if (value.length === 1) {
      if (Number(value) >= 2) {
        return this.select(value, false, true);
      } else if (Number(value) === 1) {
        return this.timer = setTimeout((function(_this) {
          return function() {
            _this.select(value, false, true);
            return _this.timer = null;
          };
        })(this), 800);
      }
    }
  };

  MonthView.prototype._getValue = function() {
    return MonthView.__super__._getValue.call(this) + 1;
  };

  MonthView.prototype._onKeydownHandler = function(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return MonthView.__super__._onKeydownHandler.call(this, e);
  };

  MonthView.prototype._refreshInput = function() {
    return this.input.val(String('00' + this._getValue()).slice(-2));
  };

  MonthView.prototype._onDateChangeHandler = function(e) {
    this.moment = e.moment;
    this._refreshInput();
    return this._refreshSelected();
  };

  MonthView.prototype.select = function(value, refreshInput, finished) {
    return MonthView.__super__.select.call(this, value - 1, refreshInput, finished);
  };

  return MonthView;

})(View);

View.addView(MonthView);

var YearView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

YearView = (function(superClass) {
  extend(YearView, superClass);

  function YearView() {
    return YearView.__super__.constructor.apply(this, arguments);
  }

  YearView.prototype.name = 'year';

  YearView.prototype._inputTpl = '<input type="text" class="view-input year-input" data-type="year" data-min="1800" data-max="3000"/>';

  YearView.prototype.firstYear = 0;

  YearView.prototype._renderPanel = function() {
    var el;
    if (this.firstYear === 0) {
      this.firstYear = Math.floor(this._getValue() / 10) * 10;
    }
    return el = "<div class=\"panel panel-year\">\n  " + (this._renderYears(this.firstYear)) + "\n</div>";
  };

  YearView.prototype._renderYears = function(firstYear) {
    var el, i, ref, ref1, year;
    el = '<a class="menu-item" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a><a class="menu-item" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>';
    for (year = i = ref = firstYear, ref1 = firstYear + 11; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
      el += "<a class='panel-item' data-value='" + year + "'>" + year + "</a>";
    }
    return el;
  };

  YearView.prototype._handleAction = function(action) {
    this.firstYear = action === 'prev' ? this.firstYear - 10 : this.firstYear + 10;
    this._reRenderPanel();
    return this.panel.addClass('active');
  };

  YearView.prototype._onInputHandler = function() {
    var value;
    value = this.input.val();
    if (value.length > 4) {
      this.input.val(value.substr(1));
    }
    value = this.input.val();
    if (value > 1900 && value < 2050) {
      return this.select(value, false, true);
    }
  };

  YearView.prototype._onDateChangeHandler = function(event) {
    var newFirstYear;
    this.moment = event.moment;
    newFirstYear = Math.floor(this._getValue() / 10) * 10;
    this._refreshInput();
    if (this.firstYear === newFirstYear) {
      return this._refreshSelected();
    } else {
      this.firstYear = newFirstYear;
      return this._reRenderPanel();
    }
  };

  YearView.prototype.select = function(value, refreshInput, finished) {
    var newFirstYear;
    newFirstYear = Math.floor(value / 10) * 10;
    if (this.firstYear !== newFirstYear) {
      this.firstYear = newFirstYear;
      this._reRenderPanel();
    }
    return YearView.__super__.select.call(this, value, refreshInput, finished);
  };

  return YearView;

})(View);

View.addView(YearView);

return momentpicker;

}));
