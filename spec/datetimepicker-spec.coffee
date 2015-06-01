
describe 'Simple datetimepicker', ->

  it 'should inherit from SimpleModule', ->
    datetimepicker = simple.datetimepicker()
    expect(datetimepicker instanceof SimpleModule).toBe(true)
