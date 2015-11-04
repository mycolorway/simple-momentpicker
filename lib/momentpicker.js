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

  View.prototype.inputTpl = '<input class="momentpicker-input" />';

  View.prototype.panelTpl = '';

  View.prototype._init = function() {
    this.id = this.opts.id;
    this.parent = this.opts.parent;
    this.moment = this.opts.moment;
    this._render();
    return this._bind();
  };

  View.prototype._render = function() {
    this._renderInput();
    this._renderPanel();
    if (this.opts.inline) {
      this.el.hide();
      return this.panel.show();
    } else {
      return this._setPosition();
    }
  };

  View.prototype._renderInput = function() {
    this.el = $(this.inputTpl).addClass(this.name + "-input").attr({
      'type': 'text',
      'placeholder': this.parent.el.attr('placeholder')
    });
    this.el.appendTo(this.parent.el.parent());
    if (this.parent.el.val()) {
      return this.el.val(this.moment.format(this.opts.format));
    }
  };

  View.prototype._renderPanel = function() {
    this.panel = $(this.panelTpl).html(this._getPanelTpl()).addClass(this.opts.cls).attr('id', this.name + "-" + this.id);
    return this.panel.insertAfter(this.el);
  };

  View.prototype._getPanelTpl = function() {
    return this.panelTpl;
  };

  View.prototype._reRenderPanel = function() {
    this.panel.html(this._getPanelTpl());
    if (!this.opts.inline) {
      return this._setPosition();
    }
  };

  View.prototype._setPosition = function() {
    var position;
    position = this.el.position();
    return this.panel.css({
      'position': 'absolute',
      'left': position.left,
      'top': position.top + this.el.outerHeight(true)
    });
  };

  View.prototype._bind = function() {
    this._bindEl();
    this._bindPanel();
    $(document).on("mousedown.momentpicker-" + this.id, (function(_this) {
      return function(e) {
        if (_this.el.is(e.target) || !!_this.panel.has(e.target).length || _this.panel.is(e.target)) {
          return;
        }
        if (!_this.opts.inline) {
          return _this.hide();
        }
      };
    })(this));
    return $(window).on("resize.momentpicker-" + this.id, (function(_this) {
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
    })(this)).on('click', function() {
      return this.select();
    }).on('keydown', (function(_this) {
      return function(e) {
        if (_this.el.val() && e.keyCode === 13) {
          _this.verifyValue();
        }
        return _this.hide();
      };
    })(this)).on('blur', (function(_this) {
      return function() {
        if (_this.el.val()) {
          return _this.verifyValue();
        }
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
        return _this._panelItemHandler(e);
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
    new_moment = moment(this.el.val(), 'YYYYMMDD');
    if (!new_moment.isValid()) {
      new_moment = moment(this.el.val());
    }
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

  View.prototype.clear = function() {
    this.el.val('');
    return this.moment = moment();
  };

  View.prototype.destroy = function() {
    this.panel.remove();
    this.el.remove();
    $(document).off('.momentpicker-#{@id}');
    return $(window).off('.momentpicker-#{@id}');
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
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    formatSplit: ' ',
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
    this.type = this.el.attr('type');
    if (this.type === 'time') {
      this._inputValueFormat = 'HH:mm:ss';
    } else if (this.type === 'datetime' || this.type === 'datetime-local') {
      this._inputValueFormat = 'YYYY-MM-DDTHH:mm:ss';
    } else if (this.type === 'date') {
      this._inputValueFormat = 'YYYY-MM-DD';
    } else if (this.type === 'month') {
      this._inputValueFormat = 'YYYY-MM';
    }
    this.id = ++MomentPicker._count;
    this.views = {};
    if (!this.el.length) {
      throw 'simple momentpicker: option el is required';
      return;
    }
    val = this.el.val() || moment();
    this.moment = moment.isMoment(val) ? val : moment(val, this.opts.valueFormat);
    this._render();
    this._bind();
    return this.el.data('momentpicker', this);
  };

  MomentPicker.prototype._render = function() {
    this.el.hide();
    return this._renderViews();
  };

  MomentPicker.prototype._renderViews = function() {
    if (this.type === 'time') {
      return this._creaetView('time');
    } else if (this.type === 'datetime' || this.type === 'datetime-local') {
      this._creaetView('date');
      return this._creaetView('time');
    } else if (this.type === 'date') {
      return this._creaetView('date');
    } else if (this.type === 'month') {
      return this._creaetView('month');
    }
  };

  MomentPicker.prototype._creaetView = function(name) {
    var format, opt;
    if (this.opts.displayFormat != null) {
      format = this.opts.displayFormat;
      if (name === 'time') {
        format = format.split(this.opts.formatSplit)[1];
      }
      if (name === 'date') {
        format = format.split(this.opts.formatSplit)[0];
      }
    }
    opt = {
      id: this.id,
      cls: this.opts.cls,
      inline: this.opts.inline,
      moment: this.moment,
      format: format,
      parent: this
    };
    if (this.opts['viewOpts'][name]) {
      $.extend(opt, this.opts['viewOpts'][name]);
    }
    return this.views[name] = new View.prototype.constructor.views[name](opt);
  };

  MomentPicker.prototype._bind = function() {
    return this.on('datechange.momentpicker', (function(_this) {
      return function(e, d) {
        if (d.type === 'date' || d.type === 'month') {
          _this.moment.set('date', d.moment.date());
          _this.moment.set('month', d.moment.month());
          _this.moment.set('year', d.moment.year());
        } else if (d.type === 'time') {
          _this.moment.set('hour', d.moment.hour());
          _this.moment.set('minute', d.moment.minute());
        }
        _this.el.val(_this.moment.format(_this._inputValueFormat)).change();
        return _this.trigger('select', {
          type: d.type,
          moment: _this.moment.clone()
        });
      };
    })(this));
  };

  MomentPicker.prototype.getMoment = function() {
    return this.moment.clone();
  };

  MomentPicker.prototype.getValue = function() {
    if (this.el.val()) {
      return this.moment.format(this.opts.valueFormat);
    } else {
      return null;
    }
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
      results.push(this.views[name].setMoment(this.moment));
    }
    return results;
  };

  MomentPicker.prototype.clear = function() {
    var name, results;
    this.el.val('');
    results = [];
    for (name in this.views) {
      results.push(this.views[name].clear());
    }
    return results;
  };

  MomentPicker.prototype.destroy = function() {
    var name;
    for (name in this.views) {
      this.off('.momentpicker');
      this.views[name].destroy();
    }
    this.el.removeData('momentpicker');
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
    format: 'YYYY-MM-DD',
    disableBefore: null,
    disableAfter: null
  };

  DateView.prototype.panelTpl = "<div class=\"simple-momentpicker date-picker\">\n</div>";

  DateView.prototype._getPanelTpl = function() {
    var i, j, len, ref, week;
    week = '';
    ref = [1, 2, 3, 4, 5, 6, 0];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      week += "<td>" + (moment.weekdaysMin(i)) + "</td>";
    }
    return "<div class=\"calendar-menu\">\n  " + (this._getDayMenuTpl()) + "\n</div>\n<table class=\"calendar\"\">\n  <tr class=\"datepicker-dow\">\n    " + week + "\n  </tr>\n  " + (this._getDaySelectorsTpl()) + "\n</table>";
  };

  DateView.prototype._getDayMenuTpl = function() {
    var month;
    month = this.moment.format('YYYY.MM');
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<span class=\"cur-month\">" + month + "</span>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>";
  };

  DateView.prototype._getDaySelectorsTpl = function() {
    var c, date, days, firstDate, i, lastDate, n, p, prevLastDate, row, selectDate, today, until_, x, y;
    today = moment().startOf("day");
    selectDate = this.el.val() ? moment(this.el.val(), this.opts.format).startOf("day") : null;
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
        date = this.moment.clone().date(n).startOf("day");
        if (n >= 1 && n <= lastDate.date()) {
          if (today.isSame(date, 'day') === true) {
            c += ' today';
          }
          if (selectDate) {
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

  MonthView.prototype.opts = {
    format: 'YYYY-MM'
  };

  MonthView.prototype.panelTpl = "<div class=\"simple-momentpicker month-picker\">\n<div>";

  MonthView.prototype._init = function() {
    MonthView.__super__._init.call(this);
    return this.moment.set('date', 1);
  };

  MonthView.prototype._getPanelTpl = function() {
    var menu, panel;
    menu = this._getMenuTpl();
    panel = this._getMonthPanelTpl();
    return "<div class=\"calendar-menu\">" + menu + "</div>\n<div class=\"calendar-panel\">" + panel + "</div>";
  };

  MonthView.prototype._getMenuTpl = function() {
    var year;
    year = this.moment.format('YYYY');
    return "<a class=\"menu-item\" data-action=\"prev\"><i class=\"icon-chevron-left\"><span>&lt;</span></i></a>\n<span class=\"cur-month\">" + year + "</span>\n<a class=\"menu-item\" data-action=\"next\"><i class=\"icon-chevron-right\"><span>&gt;</span></i></a>";
  };

  MonthView.prototype._getMonthPanelTpl = function() {
    var cls, cur_month, el, i, month, selected_month;
    cur_month = moment().format('YYYY-M');
    selected_month = this.el.val() ? moment(this.el.val(), this.opts.format).format('YYYY-M') : null;
    el = '';
    for (month = i = 0; i <= 11; month = ++i) {
      cls = '';
      if (cur_month === this.moment.format('YYYY-') + (month + 1)) {
        cls += ' cur';
      }
      if (selected_month && selected_month === this.moment.format('YYYY-') + (month + 1)) {
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

  Timeview.prototype.opts = {
    format: 'HH:mm'
  };

  Timeview.prototype.panelTpl = "<div class='simple-momentpicker time-picker'>\n</div>";

  Timeview.prototype._getPanelTpl = function() {
    var el, hour, i, j, len, m, minute, ref;
    el = "<div class='hour-panel'>";
    m = window.moment();
    for (hour = i = 0; i <= 23; hour = ++i) {
      ref = [0, 30];
      for (j = 0, len = ref.length; j < len; j++) {
        minute = ref[j];
        m.hour(hour);
        m.minute(minute);
        el += "<a class='panel-item' data-value='" + (m.format('HH:mm')) + "'>" + (m.format('A hh:mm')) + "</a>";
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
