(function() {
  describe('Simple datetimepicker', function() {
    return it('should inherit from SimpleModule', function() {
      var datetimepicker;
      datetimepicker = simple.datetimepicker();
      return expect(datetimepicker instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
