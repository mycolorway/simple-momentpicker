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
    cls: ''
  };

  View.prototype.panelTpl = '';

  View.prototype._init = function() {
    this.id = this.opts.id;
    this.el = this.opts.el;
    this.parent = this.opts.parent;
    this.moment = moment(this.el.val(), this.opts.format) || moment();
    this._render();
    return this._bind();
  };

  View.prototype._render = function() {
    this.panel = $(this.panelTpl).html(this._renderPanel()).addClass(this.opts.cls).attr('id', this.name + "_" + this.id);
    this.panel.appendTo('body');
    if (this.opts.inline) {
      this.el.hide();
      return this.panel.show();
    } else {
      return this._setPosition();
    }
  };

  View.prototype._renderPanel = function() {
    return false;
  };

  View.prototype._reRenderPanel = function() {
    return this.panel.html(this._renderPanel());
  };

  View.prototype._setPosition = function() {
    var offset;
    offset = this.el.offset();
    return this.panel.css({
      'position': 'absolute',
      'left': offset.left,
      'top': offset.top + this.el.outerHeight(true)
    });
  };

  View.prototype._bind = function() {
    this._bindEl();
    this._bindPanel();
    $(document).on("mousedown.momentpicker_" + this.id, (function(_this) {
      return function(e) {
        if (_this.el.is(e.target) || !!_this.panel.has(e.target).length || _this.panel.is(e.target)) {
          return;
        }
        return _this.hide();
      };
    })(this));
    return $(window).on("resize.momentpicker_" + this.id, (function(_this) {
      return function(e) {
        return _this._setPosition();
      };
    })(this));
  };

  View.prototype._bindEl = function() {
    return this.el.on('focus', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this)).on('click', (function(_this) {
      return function(e) {
        return _this.show();
      };
    })(this)).on('keydown', (function(_this) {
      return function() {
        return _this.hide();
      };
    })(this)).on('blur', (function(_this) {
      return function() {
        return _this.verifyValue();
      };
    })(this));
  };

  View.prototype._bindPanel = function() {
    return this.panel.on('click', '.menu-item', (function(_this) {
      return function(e) {
        e.stopPropagation();
        return _this._menuItemHandler(e);
      };
    })(this)).on('click', '.panel-item', (function(_this) {
      return function(e) {
        e.stopPropagation();
        _this._panelItemHandler(e);
        return _this.parent.trigger('select', {
          type: _this.name,
          moment: _this.moment.clone()
        });
      };
    })(this));
  };

  View.prototype._menuItemHandler = function() {
    return false;
  };

  View.prototype._panelItemHandler = function() {
    return false;
  };

  View.prototype._setElValue = function() {
    this.el.val(this.moment.format(this.opts.format));
    return this.parent.trigger('datechange', {
      type: this.name,
      moment: this.moment.clone()
    });
  };

  View.prototype._setActive = function() {
    return this._reRenderPanel();
  };

  View.prototype.verifyValue = function() {
    var new_moment;
    new_moment = moment(this.el.val(), this.opts.format);
    if (new_moment.isValid()) {
      this.moment = new_moment;
    }
    return this._setElValue();
  };

  View.prototype.show = function() {
    this._setActive();
    return this.panel.show();
  };

  View.prototype.hide = function() {
    return this.panel.hide();
  };

  View.prototype.destroy = function() {
    this.panel.remove();
    this.el.remove();
    $(document).off('.momentpicker_#{@id}');
    return $(window).off('.momentpicker_#{@id}');
  };

  View.prototype.setMoment = function(m) {
    this.moment = m;
    return this._setElValue();
  };

  View.addView = function(view) {
    if (!this.views) {
      this.views = {};
    }
    return this.views[view.prototype.name] = view;
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
    el: null,
    inline: false,
    valueFormat: 'YYYY-MM-DD HH:mm',
    monthDisplayFormat: 'YYYY-MM',
    dateDisplayFormat: 'YYYY-MM-DD',
    timeDisplayFormat: 'HH:mm',
    cls: '',
    viewOpts: {
      date: {
        disableBefore: null,
        disableAfter: null
      }
    }
  };

  MomentPicker._count = 0;

  MomentPicker.prototype._init = function() {
    var val;
    this.el = $(this.opts.el);
    this.id = ++MomentPicker._count;
    this.views = {};
    if (!this.el.length) {
      throw 'simple momentpicker: option el is required';
      return;
    }
    val = this.el.val() || moment();
    this.moment = moment.isMoment(val) ? val : moment(val, this.opts.valueFormat);
    this._render();
    return this._bind();
  };

  MomentPicker.prototype._render = function() {
    this._renderFakeInput();
    return this._renderViews();
  };

  MomentPicker.prototype._renderFakeInput = function() {
    var type;
    type = this.el.attr('type') || 'datetime';
    this.input_time = null;
    this.input_date = null;
    this.input_month = null;
    if (type === 'time') {
      this.input_time = $("<input class='momentpicker-input'/>").addClass('time-input').attr({
        'type': 'text',
        'placeholder': this.el.attr('placeholder')
      });
      this.views['time'] = null;
    } else if (type === 'datetime') {
      this.input_date = $("<input class='momentpicker-input'/>").addClass('date-input').attr({
        'type': 'text'
      });
      this.input_time = $("<input class='momentpicker-input'/>").addClass('time-input').attr({
        'type': 'text'
      });
      this.views['date'] = null;
      this.views['time'] = null;
    } else if (type === 'date') {
      this.input_date = $("<input class='momentpicker-input'/>").addClass('date-input').attr({
        'type': 'text',
        'placeholder': this.el.attr('placeholder')
      });
      this.views['date'] = null;
    } else if (type === 'month') {
      this.input_month = $("<input class='momentpicker-input'/>").addClass('month-input').attr({
        'type': 'text',
        'placeholder': this.el.attr('placeholder')
      });
      this.views['month'] = null;
    }
    if (this.input_month) {
      if (this.el.val() != null) {
        this.input_month.val(this.moment.format(this.opts.monthDisplayFormat));
      }
      this.input_month.insertAfter(this.el);
    }
    if (this.input_date) {
      if (this.el.val() != null) {
        this.input_date.val(this.moment.format(this.opts.dateDisplayFormat));
      }
      this.input_date.insertAfter(this.el);
    }
    if (this.input_time) {
      if (this.el.val() != null) {
        this.input_time.val(this.moment.format(this.opts.timeDisplayFormat));
      }
      if (this.input_date) {
        this.input_time.insertAfter(this.input_date);
      } else {
        this.input_time.insertAfter(this.el);
      }
    }
    return this.el.hide();
  };

  MomentPicker.prototype._renderViews = function() {
    var name, opt, results;
    results = [];
    for (name in this.views) {
      opt = {
        id: this.id,
        el: this["input_" + name],
        cls: this.opts.cls,
        inline: this.opts.inline,
        format: this.opts[name + "DisplayFormat"],
        parent: this
      };
      if (this.opts['viewOpts'][name]) {
        $.extend(opt, this.opts['viewOpts'][name]);
      }
      results.push(this.views[name] = new View.prototype.constructor.views[name](opt));
    }
    return results;
  };

  MomentPicker.prototype._bind = function() {
    return this.on('datechange.momentpicker', (function(_this) {
      return function(e, d) {
        if (d.type === 'date' || d.type === 'month') {
          _this.moment.set('date', d.moment.date());
          _this.moment.set('month', d.moment.month());
          return _this.moment.set('year', d.moment.year());
        } else if (d.type === 'time') {
          _this.moment.set('hour', d.moment.hour());
          return _this.moment.set('minute', d.moment.minute());
        }
      };
    })(this));
  };

  MomentPicker.prototype.getMoment = function() {
    return this.moment.clone();
  };

  MomentPicker.prototype.getValue = function() {
    return this.moment.format(this.opts.valueFormat);
  };

  MomentPicker.prototype.setMoment = function(m) {
    var name, results;
    if (moment.isMoment(m)) {
      this.moment = m.clone();
    } else {
      this.moment = moment(m, this.opts.valueFormat);
    }
    results = [];
    for (name in this.views) {
      results.push(this.views[name].setMoment(m));
    }
    return results;
  };

  MomentPicker.prototype.destroy = function() {
    var name;
    for (name in this.views) {
      this.off('.momentpicker');
      this.views[name].destroy();
    }
    return this.el.show();
  };

  return MomentPicker;

})(SimpleModule);

momentpicker = function(opts) {
  return new MomentPicker(opts);
};

momentpicker.View = View;

var DateView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DateView = (function(superClass) {
  extend(DateView, superClass);

  function DateView() {
    return DateView.__super__.constructor.apply(this, arguments);
  }

  DateView.prototype.name = 'date';

  DateView.prototype.opts = {
    el: null,
    disableBefore: null,
    disableAfter: null
  };

  DateView.prototype.panelTpl = "<div class=\"simple-momentpicker date-picker\">\n</div>";

  DateView.prototype._renderPanel = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<div class=\"calendar-menu\">\n  " + (this._renderDayMenu()) + "\n</div>\n<table class=\"calendar\"\">\n  <tr class=\"datepicker-dow\">\n    " + week + "\n  </tr>\n  " + (this._renderDaySelectors()) + "\n</table>";
  };

  DateView.prototype._renderDayMenu = function() {
    var month;
    month = this.moment.format('YYYY.MM');
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<span class=\"cur-month\">" + month + "</span>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>";
  };

  DateView.prototype._renderDaySelectors = function() {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, selectDate, today, until_, x, y;
    today = moment().startOf("day");
    selectDate = moment(this.el.val(), this.opts.format);
    firstDate = this.moment.clone().startOf("month");
    lastDate = this.moment.clone().endOf("month");
    prevLastDate = this.moment.clone().add(-1, "months").endOf("month");
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
        date = this.moment.clone().date(n);
        if (n >= 1 && n <= lastDate.date()) {
          if (today.isSame(date, 'day') === true) {
            c += ' today';
          }
          if (this.moment) {
            c += (date.diff(selectDate, 'days') === 0 ? " selected" : "");
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

  DateView.prototype._menuItemHandler = function(e) {
    var action, num;
    action = $(e.currentTarget).data('action');
    num = action === 'next' ? 1 : -1;
    this.moment.add(num, 'month');
    return this._reRenderPanel();
  };

  DateView.prototype._panelItemHandler = function(e) {
    var value;
    value = $(e.currentTarget).data('value');
    this.moment = moment(value, 'YYYY-MM-DD');
    this._setElValue();
    return this.hide();
  };

  return DateView;

})(View);

View.addView(DateView);

var MonthView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MonthView = (function(superClass) {
  extend(MonthView, superClass);

  function MonthView() {
    return MonthView.__super__.constructor.apply(this, arguments);
  }

  MonthView.prototype.name = 'month';

  MonthView.prototype.panelTpl = "<div class=\"simple-momentpicker month-picker\">\n<div>";

  MonthView.prototype._init = function() {
    MonthView.__super__._init.call(this);
    return this.moment.set('date', 1);
  };

  MonthView.prototype._renderPanel = function() {
    var menu, panel;
    menu = this._renderMenu();
    panel = this._renderMonthPanel();
    return "<div class=\"calendar-menu\">" + menu + "</div>\n<div class=\"calendar-panel\">" + panel + "</div>";
  };

  MonthView.prototype._renderMenu = function() {
    var year;
    year = this.moment.format('YYYY');
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<span class=\"cur-month\">" + year + "</span>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>";
  };

  MonthView.prototype._renderMonthPanel = function() {
    var cls, cur_month, el, i, month, selected_month;
    cur_month = moment().format('YYYY-M');
    selected_month = moment(this.el.val(), this.opts.format).format('YYYY-M');
    el = '';
    for (month = i = 0; i <= 11; month = ++i) {
      cls = '';
      if (cur_month === this.moment.format('YYYY-') + (month + 1)) {
        cls += ' cur';
      }
      if (selected_month === this.moment.format('YYYY-') + (month + 1)) {
        cls += ' selected';
      }
      el += "<a class='" + cls + " panel-item' data-value='" + month + "'>" + (month + 1) + "</a>";
    }
    return el;
  };

  MonthView.prototype._menuItemHandler = function(e) {
    var action, num;
    action = $(e.currentTarget).data('action');
    num = action === 'next' ? 1 : -1;
    this.moment.add(num, 'year');
    return this._reRenderPanel();
  };

  MonthView.prototype._panelItemHandler = function(e) {
    var value;
    value = $(e.currentTarget).data('value');
    this.moment.set('month', value);
    this._setElValue();
    return this.hide();
  };

  return MonthView;

})(View);

View.addView(MonthView);

var Timeview,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Timeview = (function(superClass) {
  extend(Timeview, superClass);

  function Timeview() {
    return Timeview.__super__.constructor.apply(this, arguments);
  }

  Timeview.prototype.name = 'time';

  Timeview.prototype.panelTpl = "<div class='simple-momentpicker time-picker'>\n</div>";

  Timeview.prototype._renderPanel = function() {
    var el, hour, i, j, len, m, minute, ref;
    el = "<div class='hour-panel'>";
    m = window.moment();
    for (hour = i = 0; i <= 23; hour = ++i) {
      ref = [0, 30];
      for (j = 0, len = ref.length; j < len; j++) {
        minute = ref[j];
        m.hour(hour);
        m.minute(minute);
        el += "<a class='panel-item' data-value='" + (m.format('HH:mm')) + "'>" + (m.format('A HH:mm')) + "</a>";
      }
    }
    return el;
  };

  Timeview.prototype._setActive = function() {
    return Timeview.__super__._setActive.call(this);
  };

  Timeview.prototype._panelItemHandler = function(e) {
    var m, value;
    value = $(e.currentTarget).data('value');
    m = moment(value, 'HH:mm');
    this.moment.set('hour', m.hour());
    this.moment.set('minute', m.minute());
    this._setElValue();
    return this.hide();
  };

  return Timeview;

})(View);

View.addView(Timeview);

return momentpicker;

}));
