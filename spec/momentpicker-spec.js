(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  describe('Class View', function() {
    var $input, $panel, $parent, TestView, View, testView, tpl;
    View = simple.momentpicker.View;
    TestView = (function(superClass) {
      extend(TestView, superClass);

      function TestView() {
        return TestView.__super__.constructor.apply(this, arguments);
      }

      TestView.prototype.name = 'second';

      TestView.prototype._inputTpl = '<input type="text" class="test-input" data-min="6" data-max="10"/>';

      TestView.prototype._renderPanel = function() {
        return "<div class=\"panel panel-test\">\n  <a class=\"menu-item\" data-action=\"testAction\"></a>\n  <a class=\"panel-item\" data-value='6' id=\"testClick\">6</a>\n  <a class=\"panel-item\" data-value='7' id=\"testClick\">7</a>\n  <a class=\"panel-item\" data-value='8' id=\"testClick\">8</a>\n  <a class=\"panel-item\" data-value='9' id=\"testClick\">9</a>\n  <a class=\"panel-item\" data-value='10' id=\"testClick\">10</a>\n</div>";
      };

      TestView.prototype._handleAction = function(action) {};

      TestView.prototype._onDateChangeHandler = function() {};

      return TestView;

    })(View);
    tpl = "<div class='test-view'>\n  <div class='input-insert-point'></div>\n  <div class='panel-insert-point'></div>\n</div>";
    $parent = $(tpl).appendTo('body');
    testView = new TestView({
      inputContainer: $('.input-insert-point'),
      panelContainer: $('.panel-insert-point'),
      defaultValue: moment().second(8)
    });
    $input = $parent.find('.input-insert-point input.test-input');
    $panel = $parent.find('.panel-insert-point .panel.panel-test');
    it('should render input and panel to specific insert point', function() {
      expect($input).toExist();
      expect($panel.find('.panel-item')).toExist();
      return expect($panel.find('.menu-item')).toExist();
    });
    it('should set initial value to view', function() {
      expect($input.val()).toBe('8');
      return expect($panel.find('.selected').data('value')).toBe(8);
    });
    it('should trigger select event when click panel-item', function() {
      var spySelectEvent;
      spySelectEvent = spyOn(testView, 'select').and.callThrough();
      $panel.find('[data-value=9]').trigger('click');
      expect(spySelectEvent).toHaveBeenCalled();
      expect($input.val()).toBe('9');
      return expect($panel.find('.selected').data('value')).toBe(9);
    });
    it('should handle antion when click menu-item', function() {
      var spyAction;
      spyAction = spyOn(testView, '_handleAction').and.callThrough();
      $panel.find('.menu-item').trigger('click');
      return expect(spyAction).toHaveBeenCalled();
    });
    it('should add or minus value when click up or down on input', function() {
      $input.val('7');
      $input.trigger($.Event('keydown', {
        keyCode: 40,
        which: 40
      }));
      expect($input.val()).toBe('6');
      expect($panel.find('.selected').data('value')).toBe(6);
      $input.trigger($.Event('keydown', {
        keyCode: 38,
        which: 38
      }));
      expect($input.val()).toBe('7');
      expect($panel.find('.selected').data('value')).toBe(7);
      $input.trigger($.Event('keydown', {
        keyCode: 38,
        which: 38
      }));
      $input.trigger($.Event('keydown', {
        keyCode: 38,
        which: 38
      }));
      $input.trigger($.Event('keydown', {
        keyCode: 38,
        which: 38
      }));
      $input.trigger($.Event('keydown', {
        keyCode: 38,
        which: 38
      }));
      expect($input.val()).toBe('6');
      return expect($panel.find('.selected').data('value')).toBe(6);
    });
    it('should handle datechange when trigger datechange event', function() {
      var spyDatechange;
      spyDatechange = spyOn(testView, '_onDateChangeHandler').and.callThrough();
      testView.trigger('datechange');
      return expect(spyDatechange).toHaveBeenCalled();
    });
    it('should set active when class setActive', function() {
      testView.setActive();
      expect($panel).toHaveClass('active');
      testView.setActive(false);
      return expect($panel).not.toHaveClass('active');
    });
    return it('should add self to class View when call addview', function() {
      View.addView(TestView);
      return expect(View.prototype.constructor.views['second']).not.toBeUndefined();
    });
  });

  describe('simple-momentpicker', function() {
    beforeEach(function() {
      return $('<input id="time">').appendTo('body');
    });
    afterEach(function() {
      var momentpicker;
      momentpicker = $('#time').data('momentpicker');
      if (momentpicker != null) {
        momentpicker.destroy();
      }
      return $('#time').remove();
    });
    it('should throw error when option is invalid', function() {
      var testError;
      testError = function() {
        return simple.momentpicker({
          el: null
        });
      };
      return expect(testError).toThrow();
    });
    it('should render specific DOM', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time'
      });
      $momentpicker = $('.simple-momentpicker');
      expect($momentpicker).toExist();
      expect($momentpicker.find('.picker-header')).toExist();
      expect($momentpicker.find('.picker-panels')).toExist();
      expect($momentpicker.find('.panel.panel-date table.calendar')).toExist();
      expect($momentpicker.find('.panel.panel-month')).toExist();
      expect($momentpicker.find('.panel.panel-year')).toExist();
      momentpicker.destroy();
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true,
        list: ['month', 'year']
      });
      $momentpicker = $('.simple-momentpicker');
      return expect($momentpicker.find('table.calendar')).not.toExist();
    });
    it('should show when focused and inline off', function() {
      var momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: false
      });
      $('.momentpicker-input').blur();
      expect($('.simple-momentpicker')).not.toBeVisible();
      $('.momentpicker-input').focus();
      $('.momentpicker-input').focus();
      return expect($('.simple-momentpicker')).toBeVisible();
    });
    it('should render right calendar based on year and month', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-year a[data-value=2016]').click();
      $momentpicker.find('.panel-month a[data-value=5]').click();
      return expect($momentpicker.find('.panel-date a[data-value=2016-06-01]')).toExist();
    });
    it('should change different panel when focus on different field', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.year-input').focus();
      expect($momentpicker.find('.panel-year')).toBeVisible();
      $momentpicker.find('.month-input').focus();
      expect($momentpicker.find('.panel-month')).toBeVisible();
      $momentpicker.find('.date-input').focus();
      expect($momentpicker.find('.panel-date')).toBeVisible();
      $momentpicker.find('.hour-input').focus();
      expect($momentpicker.find('.panel-hour')).toBeVisible();
      $momentpicker.find('.minute-input').focus();
      return expect($momentpicker.find('.panel-minute')).toBeVisible();
    });
    it('should pick correct time', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-year a[data-value=2016]').click();
      $momentpicker.find('.panel-month a[data-value=6]').click();
      $momentpicker.find('.panel-date a[data-value=2016-06-01]').click();
      $momentpicker.find('.panel-hour a[data-value=8]').click();
      $momentpicker.find('.panel-minute a[data-value=15]').click();
      expect($('#time').val()).toBe('2016-06-01 08:15');
      momentpicker.destroy();
      momentpicker = simple.momentpicker.date({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-year a[data-value=2016]').click();
      $momentpicker.find('.panel-month a[data-value=6]').click();
      $momentpicker.find('.panel-date a[data-value=2016-06-01]').click();
      expect($('#time').val()).toBe('2016-06-01');
      momentpicker.destroy();
      momentpicker = simple.momentpicker.month({
        el: '#time',
        valueFormat: 'YYYY-MM'
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-year a[data-value=2016]').click();
      $momentpicker.find('.panel-month a[data-value=6]').click();
      expect($('#time').val()).toBe('2016-06');
      momentpicker.destroy();
      momentpicker = simple.momentpicker.time({
        el: '#time',
        valueFormat: 'HH:mm'
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-hour a[data-value=8]').click();
      $momentpicker.find('.panel-minute a[data-value=15]').click();
      return expect($('#time').val()).toBe('08:15');
    });
    it('should change month when click date prev/next button', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      $momentpicker.find('.panel-year a[data-value=2016]').click();
      $momentpicker.find('.panel-month a[data-value=6]').click();
      expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
      $momentpicker.find('.panel-date a[data-action=prev]').click();
      expect($momentpicker.find('.panel-month a[data-value=5]')).toHaveClass('selected');
      $momentpicker.find('.panel-date a[data-action=next]').click();
      return expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
    });
    it('should change year panel when click prev/next button', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      expect($momentpicker.find('.panel-year a[data-value=2010]')).toExist();
      $momentpicker.find('.panel-year a[data-action=prev]').click();
      expect($momentpicker.find('.panel-year a[data-value=2000]')).toExist();
      $momentpicker.find('.panel-year a[data-action=next]').click();
      return expect($momentpicker.find('.panel-year a[data-value=2010]')).toExist();
    });
    it('should set correct date', function() {
      var $momentpicker, momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true
      });
      $momentpicker = $('.simple-momentpicker');
      momentpicker.setDate('2016-06-01 08:42');
      expect($momentpicker.find('.panel-year a[data-value=2016]')).toHaveClass('selected');
      expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected');
      expect($momentpicker.find('.panel-date a[data-value=2016-06-01]')).toHaveClass('selected');
      expect($momentpicker.find('.panel-hour a[data-value=8]')).toHaveClass('selected');
      expect($momentpicker.find('.panel-minute a[data-value=40]')).toHaveClass('selected');
      expect($momentpicker.find('.year-input').val()).toBe('2016');
      expect($momentpicker.find('.month-input').val()).toBe('06');
      expect($momentpicker.find('.date-input').val()).toBe('01');
      expect($momentpicker.find('.hour-input').val()).toBe('08');
      expect($momentpicker.find('.minute-input').val()).toBe('42');
      return expect($('#time').val()).toBe('2016-06-01 08:42');
    });
    it('should clear value when clear is called', function() {
      var momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time'
      });
      momentpicker.setDate('2016-06-01 08:42');
      momentpicker.clear();
      return expect(momentpicker.getDate()).toBe(null);
    });
    it('should reset all when destroy', function() {
      var momentpicker;
      momentpicker = simple.momentpicker({
        el: '#time',
        inline: true,
        monthpicker: true
      });
      momentpicker.destroy();
      return expect($('.simple-momentpicker')).not.toExist();
    });
    return it("should fetch date from @el by @getDate if @date is undefined", function() {
      var date, momentpicker;
      date = "2015-01-01";
      $("<input id='timeWithValue' value='" + date + "'>").appendTo('body');
      momentpicker = simple.momentpicker({
        el: '#timeWithValue'
      });
      expect(momentpicker.getDate().isSame(date)).toBe(true);
      return $("#timeWithValue").remove();
    });
  });

}).call(this);
