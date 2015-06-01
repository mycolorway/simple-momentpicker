(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-datetimepicker', ["jquery","simple-module","simple-datepicker"], function (a0,b1,c2) {
      return (root['datetimepicker'] = factory(a0,b1,c2));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"),require("simple-datepicker"));
  } else {
    root.simple = root.simple || {};
    root.simple['datetimepicker'] = factory(jQuery,SimpleModule,simple.datepicker);
  }
}(this, function ($, SimpleModule, SimpleDatepicker) {

var Datetimepicker, datetimepicker,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Datetimepicker = (function(superClass) {
  extend(Datetimepicker, superClass);

  function Datetimepicker() {
    return Datetimepicker.__super__.constructor.apply(this, arguments);
  }

  Datetimepicker.prototype.opts = {
    list: ['year', '%-', 'month', '%-', 'date', '%   ', 'hour', '%:', 'minute'],
    el: null,
    inline: false,
    valueFormat: 'YYYY-MM-DD HH:mm',
    displayFormat: 'YYYY-MM-DD HH:mm',
    defaultView: 'auto',
    viewOpts: {
      date: {
        disableBefore: null,
        disableAfter: null
      }
    }
  };

  Datetimepicker.prototype._init = function() {
    var val;
    this.view = [];
    this.viewList = [];
    this.el = $(this.opts.el);
    if (!this.el.length) {
      throw 'simple datetimepicker: option el is required';
      return;
    }
    this.el.data('datetimepicker', this);
    val = this.el.val() || moment();
    this.date = moment.isMoment(val) ? val : moment(val, this.opts.valueFormat);
    this._render();
    return this._bind();
  };

  Datetimepicker.prototype._render = function() {
    var tpl;
    tpl = '<div class="simple-datetimepicker">\n  <div class="datetimepicker-header">\n  </div>\n  <div class="datetimepicker-panels">\n  </div>\n</div>';
    this.picker = $(tpl);
    this.headerContainer = this.picker.find('.datetimepicker-header');
    this.panelContainer = this.picker.find('.datetimepicker-panels');
    this._renderViews();
    if (this.opts.inline) {
      this.picker.insertAfter(this.el);
      return this.show();
    } else {
      this._renderFakeInput();
      return this.picker.appendTo('body');
    }
  };

  Datetimepicker.prototype._renderFakeInput = function() {
    var type;
    type = this.el.attr('type');
    this.input = $('<input />').addClass('display-input').attr({
      'readonly': 'true',
      'type': type
    }).css({
      'cursor': 'pointer'
    });
    this.input.insertAfter(this.el);
    return this.el.hide();
  };

  Datetimepicker.prototype._renderViews = function() {
    var i, len, name, opt, ref, results;
    ref = this.opts.list;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      if (name.indexOf('%') === -1) {
        opt = {
          parent: this,
          inputContainer: this.headerContainer,
          panelContainer: this.panelContainer
        };
        opt.defaultValue = (function() {
          switch (name) {
            case 'year':
              return this.date.year();
            case 'month':
              return this.date.month() + 1;
            case 'date':
              return this.date.format('YYYY-MM-DD');
            case 'hour':
              return this.date.hour();
            case 'minute':
              return this.date.minute();
          }
        }).call(this);
        if (this.opts['viewOpts'][name]) {
          $.extend(opt, this.opts['viewOpts'][name]);
        }
        this.view[name] = new SimpleDatepicker.View.prototype.constructor.views[name](opt);
        this.viewList.push(name);
        results.push(this._bindView(this.view[name]));
      } else {
        results.push(this.headerContainer.append("<span>" + (name.substr(1)) + "</span>"));
      }
    }
    return results;
  };

  Datetimepicker.prototype._setPosition = function() {
    var offset;
    offset = this.input.offset();
    return this.picker.css({
      'position': 'absolute',
      'z-index': 100,
      'left': offset.left,
      'top': offset.top + this.input.outerHeight(true)
    });
  };

  Datetimepicker.prototype._bind = function() {
    this.picker.on('click mousedown', function() {
      return false;
    });
    if (this.opts.inline) {
      return;
    }
    this.input.on('focus.datetimepicker', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    return $(document).on('click.datetimepicker', (function(_this) {
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

  Datetimepicker.prototype._bindView = function(view) {
    view.on('select', (function(_this) {
      return function(e, event) {
        var index, newDate, ref, source;
        source = event.source;
        newDate = event.value;
        if (newDate.year) {
          _this.date.year(newDate.year);
        }
        if (newDate.month) {
          _this.date.month(newDate.month - 1);
        }
        if (newDate.date) {
          _this.date = moment(newDate.date, 'YYYY-MM-DD');
          _this.view['year'].trigger('datechange', {
            year: _this.date.year()
          });
          _this.view['month'].trigger('datechange', {
            month: _this.date.month() + 1
          });
        }
        if (newDate.hour !== null) {
          _this.date.hour(newDate.hour);
        }
        if (newDate.minute !== null) {
          _this.date.minute(newDate.minute);
        }
        switch (source) {
          case 'year':
          case 'month':
            if ((ref = _this.view['date']) != null) {
              ref.trigger('datechange', {
                year: _this.date.year(),
                month: _this.date.month() + 1
              });
            }
            break;
          case 'date':
            _this.view['year'].trigger('datechange', {
              year: _this.date.year()
            });
            _this.view['month'].trigger('datechange', {
              month: _this.date.month() + 1
            });
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

  Datetimepicker.prototype._selectDate = function() {
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    this.trigger('select', [this.date]);
    if (!this.opts.inline) {
      return this.hide();
    }
  };

  Datetimepicker.prototype.setDate = function(date) {
    var ref, ref1, ref2, ref3, ref4;
    this.date = moment.isMoment(date) ? date : moment(date, this.opts.valueFormat);
    this.el.val(this.date.format(this.opts.valueFormat));
    if (this.input) {
      this.input.val(this.date.format(this.opts.displayFormat));
    }
    if ((ref = this.view['year']) != null) {
      ref.trigger('datechange', {
        year: this.date.year()
      });
    }
    if ((ref1 = this.view['month']) != null) {
      ref1.trigger('datechange', {
        month: this.date.month() + 1
      });
    }
    if ((ref2 = this.view['date']) != null) {
      ref2.trigger('datechange', {
        year: this.date.year(),
        month: this.date.month() + 1,
        date: this.date.format('YYYY-MM-DD')
      });
    }
    if ((ref3 = this.view['hour']) != null) {
      ref3.trigger('datechange', {
        hour: this.date.hour()
      });
    }
    return (ref4 = this.view['minute']) != null ? ref4.trigger('datechange', {
      minute: this.date.minute()
    }) : void 0;
  };

  Datetimepicker.prototype.clear = function() {
    var i, len, name, ref, results;
    this.el.val('');
    this.date = moment();
    ref = this.viewList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      results.push(this.view[name].clear());
    }
    return results;
  };

  Datetimepicker.prototype.getDate = function() {
    if (this.el.val()) {
      return this.date || (this.date = moment(this.el.val(), this.opts.valueFormat));
    } else {
      return null;
    }
  };

  Datetimepicker.prototype.show = function() {
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
      if (this.el.val() !== '' && this.view['date']) {
        return this.view['date'].setActive();
      } else {
        return this.view[this.viewList[0]].setActive();
      }
    }
  };

  Datetimepicker.prototype.hide = function() {
    this.picker.hide();
    return this.picker.removeClass('active');
  };

  Datetimepicker.prototype.toggle = function() {
    if (this.picker.is('.active')) {
      return this.hide();
    } else {
      return this.show();
    }
  };

  Datetimepicker.prototype.destroy = function() {
    var ref;
    if ((ref = this.picker) != null) {
      ref.remove();
    }
    this.picker = null;
    if (!this.opts.inline) {
      this.input.remove();
      this.el.show();
      return $(document).off('.datetimepicker');
    }
  };

  return Datetimepicker;

})(SimpleModule);

datetimepicker = function(opts) {
  return new Datetimepicker(opts);
};

return datetimepicker;

}));
