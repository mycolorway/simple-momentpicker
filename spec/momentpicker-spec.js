(function() {
  describe('simple-momentpicker', function() {
    var $date_input, $date_panel, $el, $time_input, $time_panel, picker;
    $el = $('<input id="test_input" type="datetime" value="2014-08-01 10:30" style="width: 120px;"/>');
    $el.appendTo('body');
    $date_input = null;
    $time_input = null;
    $date_panel = null;
    $time_panel = null;
    picker = null;
    beforeEach(function() {
      picker = simple.momentpicker({
        el: '#test_input'
      });
      $date_input = $('.momentpicker-input.date-input');
      $time_input = $('.momentpicker-input.time-input');
      $date_panel = $('.simple-momentpicker.date-picker');
      return $time_panel = $('.simple-momentpicker.time-picker');
    });
    afterEach(function() {
      picker.destroy();
      $date_input = null;
      $time_input = null;
      $date_panel = null;
      return $time_panel = null;
    });
    it('should render input and panel', function() {
      expect($el).not.toBeVisible();
      expect($date_input).toExist();
      expect($time_input).toExist();
      expect($date_panel).toExist();
      return expect($time_panel).toExist();
    });
    it('should show panel when focused', function() {
      $date_input.focus();
      expect($date_panel).toBeVisible();
      $time_input.focus();
      return expect($time_panel).toBeVisible();
    });
    it('should change month when click date prev/next button', function() {
      $date_input.focus();
      $date_panel.find('.menu-item[data-action="prev"]').click();
      expect($date_panel.find('.cur-month').html()).toBe('2014.07');
      $date_panel.find('.menu-item[data-action="next"]').click();
      $date_panel.find('.menu-item[data-action="next"]').click();
      return expect($date_panel.find('.cur-month').html()).toBe('2014.09');
    });
    it('should set initial value to view', function() {
      expect($date_input.val()).toBe('2014-08-01');
      expect($date_panel.find('.panel-item.selected').data('value')).toBe('2014-08-01');
      return expect($time_input.val()).toBe('10:30');
    });
    it('should trigger select and datechange event when click panel-item', function() {
      var spyEventDateChange, spyEventSelect;
      spyEventSelect = spyOnEvent(picker, 'select');
      spyEventDateChange = spyOnEvent(picker, 'datechange');
      $date_panel.find('.panel-item[data-value=2014-08-20]').trigger('click');
      expect(spyEventSelect).toHaveBeenTriggered();
      expect(spyEventDateChange).toHaveBeenTriggered();
      return expect($date_input.val()).toBe('2014-08-20');
    });
    it('should hidden panel when press keyboard', function() {
      $date_input.focus();
      expect($date_panel).toBeVisible();
      $date_input.trigger($.Event('keydown', {
        keyCode: 40,
        which: 40
      }));
      return expect($date_panel).not.toBeVisible();
    });
    it('should reset all when destroy', function() {
      var el, momentpicker;
      el = $('<input id="month_input" type="month" style="width: 120px;"/>');
      el.appendTo('body');
      momentpicker = simple.momentpicker({
        el: '#month_input'
      });
      expect(el).not.toBeVisible();
      expect($('.momentpicker-input.month-input')).toExist();
      expect($('.simple-momentpicker.month-picker')).toExist();
      momentpicker.destroy();
      expect(el).toBeVisible();
      expect($('.momentpicker-input.month-input')).not.toExist();
      return expect($('.simple-momentpicker.month-picker')).not.toExist();
    });
    return it("should not be shared moment object between two component", function() {
      var moment_one, momentpicker;
      $("<input id='timeWithValue' type='date' value='2015-01-01'>").appendTo('body');
      momentpicker = simple.momentpicker({
        el: '#timeWithValue'
      });
      moment_one = momentpicker.getMoment();
      picker.setMoment(moment_one);
      moment_one._i = '2015-11-11';
      expect(picker.getMoment()._i === '2015-11-11').toBe(false);
      if (momentpicker != null) {
        momentpicker.destroy();
      }
      return $('#timeWithValue').remove();
    });
  });

}).call(this);
