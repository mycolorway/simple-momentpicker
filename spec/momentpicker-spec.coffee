describe 'Class View', ->
  View = simple.momentpicker.View
  class TestView extends View
    name: 'test'

    _inputTpl: '<input type="text" class="test-input" data-min="6" data-max="10"/>'

    _renderPanel: ->
      """
      <div class="panel panel-test">
        <a class="menu-item" data-action="testAction"></a>
        <a class="panel-item" data-value='6' id="testClick">6</a>
        <a class="panel-item" data-value='7' id="testClick">7</a>
        <a class="panel-item" data-value='8' id="testClick">8</a>
        <a class="panel-item" data-value='9' id="testClick">9</a>
        <a class="panel-item" data-value='10' id="testClick">10</a>
      </div>
      """

    _handleAction: (action) ->

    _onDateChangeHandler: ->


  tpl = """
    <div class='test-view'>
      <div class='input-insert-point'></div>
      <div class='panel-insert-point'></div>
    </div>
  """

  $parent = $(tpl).appendTo 'body'

  testView = new TestView
    inputContainer: $('.input-insert-point')
    panelContainer: $('.panel-insert-point')
    defaultValue: 8

  $input = $parent.find('.input-insert-point input.test-input')
  $panel = $parent.find('.panel-insert-point .panel.panel-test')

  it 'should render input and panel to specific insert point', ->
    expect($input).toExist()
    expect($panel.find('.panel-item')).toExist()
    expect($panel.find('.menu-item')).toExist()

  it 'should set initial value to view', ->
    expect($input.val()).toBe('8')
    expect($panel.find('.selected').data('value')).toBe(8)

  it 'should trigger select event when click panel-item', ->
    spySelectEvent = spyOn(testView, 'select').and.callThrough()
    $panel.find('[data-value=9]').trigger('click')

    expect(spySelectEvent).toHaveBeenCalled()
    expect($input.val()).toBe('9')
    expect($panel.find('.selected').data('value')).toBe(9)

  it 'should handle antion when click menu-item', ->
    spyAction = spyOn(testView, '_handleAction').and.callThrough()
    $panel.find('.menu-item').trigger('click')

    expect(spyAction).toHaveBeenCalled()

  it 'should add or minus value when click up or down on input', ->
    $input.val '7'

    $input.trigger $.Event('keydown',{keyCode: 40, which: 40})
    expect($input.val()).toBe('6')
    expect($panel.find('.selected').data('value')).toBe(6)

    $input.trigger $.Event('keydown',{keyCode: 38, which: 38})
    expect($input.val()).toBe('7')
    expect($panel.find('.selected').data('value')).toBe(7)

    $input.trigger $.Event('keydown',{keyCode: 38, which: 38})
    $input.trigger $.Event('keydown',{keyCode: 38, which: 38})
    $input.trigger $.Event('keydown',{keyCode: 38, which: 38})
    $input.trigger $.Event('keydown',{keyCode: 38, which: 38})

    expect($input.val()).toBe('6')
    expect($panel.find('.selected').data('value')).toBe(6)

  it 'should handle datechange when trigger datechange event', ->
    spyDatechange = spyOn(testView, '_onDateChangeHandler').and.callThrough()
    testView.trigger('datechange')

    expect(spyDatechange).toHaveBeenCalled()

  it 'should set active when class setActive', ->
    testView.setActive()
    expect($panel).toHaveClass 'active'

    testView.setActive(false)
    expect($panel).not.toHaveClass 'active'

  it 'should add self to class View when call addview', ->
    View.addView(TestView)

    expect(View::constructor.views['test']).not.toBeUndefined()


describe 'simple-momentpicker', ->
  beforeEach ->
    $('<input id="time">').appendTo 'body'

  afterEach ->
    momentpicker = $('#time').data 'momentpicker'
    momentpicker?.destroy()
    $('#time').remove()

  it 'should throw error when option is invalid', ->
    testError = ->
      simple.momentpicker
        el: null

    expect(testError).toThrow()

  it 'should render specific DOM', ->
    momentpicker = simple.momentpicker
      el: '#time'

    $momentpicker = $('.simple-momentpicker')

    expect($momentpicker).toExist()
    expect($momentpicker.find('.picker-header')).toExist()
    expect($momentpicker.find('.picker-panels')).toExist()
    expect($momentpicker.find('.panel.panel-date table.calendar')).toExist()
    expect($momentpicker.find('.panel.panel-month')).toExist()
    expect($momentpicker.find('.panel.panel-year')).toExist()

    momentpicker.destroy()

    momentpicker = simple.momentpicker
      el: '#time'
      inline: true
      list: ['month', 'year']

    $momentpicker = $('.simple-momentpicker')
    expect($momentpicker.find('table.calendar')).not.toExist()


  it 'should show when focused and inline off', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: false

    $('.momentpicker-input').blur()
    expect($('.simple-momentpicker')).not.toBeVisible()
    $('.momentpicker-input').focus()
    $('.momentpicker-input').focus() #patch
    expect($('.simple-momentpicker')).toBeVisible()

  it 'should render right calendar based on year and month', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-year a[data-value=2016]').click()
    $momentpicker.find('.panel-month a[data-value=5]').click()

    expect($momentpicker.find('.panel-date a[data-value=2016-06-01]')).toExist()

  it 'should change different panel when focus on different field', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.year-input').focus()
    expect($momentpicker.find('.panel-year')).toBeVisible()

    $momentpicker.find('.month-input').focus()
    expect($momentpicker.find('.panel-month')).toBeVisible()

    $momentpicker.find('.date-input').focus()
    expect($momentpicker.find('.panel-date')).toBeVisible()

    $momentpicker.find('.hour-input').focus()
    expect($momentpicker.find('.panel-hour')).toBeVisible()

    $momentpicker.find('.minute-input').focus()
    expect($momentpicker.find('.panel-minute')).toBeVisible()


  it 'should pick correct time', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-year a[data-value=2016]').click()
    $momentpicker.find('.panel-month a[data-value=6]').click()
    $momentpicker.find('.panel-date a[data-value=2016-06-01]').click()
    $momentpicker.find('.panel-hour a[data-value=8]').click()
    $momentpicker.find('.panel-minute a[data-value=15]').click()

    expect($('#time').val()).toBe('2016-06-01 08:15')

    momentpicker.destroy()

    #test pick date
    momentpicker = simple.momentpicker.date
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-year a[data-value=2016]').click()
    $momentpicker.find('.panel-month a[data-value=6]').click()
    $momentpicker.find('.panel-date a[data-value=2016-06-01]').click()

    expect($('#time').val()).toBe('2016-06-01')

    momentpicker.destroy()

    #test pick month
    momentpicker = simple.momentpicker.month
      el: '#time'
      valueFormat: 'YYYY-MM'

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-year a[data-value=2016]').click()
    $momentpicker.find('.panel-month a[data-value=6]').click()
    expect($('#time').val()).toBe('2016-06')

    momentpicker.destroy()

    #test pick time
    momentpicker = simple.momentpicker.time
      el: '#time'
      valueFormat: 'HH:mm'

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-hour a[data-value=8]').click()
    $momentpicker.find('.panel-minute a[data-value=15]').click()
    expect($('#time').val()).toBe('08:15')


  it 'should change month when click date prev/next button', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    $momentpicker.find('.panel-year a[data-value=2016]').click()
    $momentpicker.find('.panel-month a[data-value=6]').click()
    expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected')
    $momentpicker.find('.panel-date a[data-action=prev]').click()
    expect($momentpicker.find('.panel-month a[data-value=5]')).toHaveClass('selected')
    $momentpicker.find('.panel-date a[data-action=next]').click()
    expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected')

  it 'should change year panel when click prev/next button', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    expect($momentpicker.find('.panel-year a[data-value=2010]')).toExist()

    $momentpicker.find('.panel-year a[data-action=prev]').click()
    expect($momentpicker.find('.panel-year a[data-value=2000]')).toExist()

    $momentpicker.find('.panel-year a[data-action=next]').click()
    expect($momentpicker.find('.panel-year a[data-value=2010]')).toExist()


  it 'should set correct date', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true

    $momentpicker = $('.simple-momentpicker')
    momentpicker.setDate('2016-06-01 08:42')

    expect($momentpicker.find('.panel-year a[data-value=2016]')).toHaveClass('selected')
    expect($momentpicker.find('.panel-month a[data-value=6]')).toHaveClass('selected')
    expect($momentpicker.find('.panel-date a[data-value=2016-06-01]')).toHaveClass('selected')
    expect($momentpicker.find('.panel-hour a[data-value=8]')).toHaveClass('selected')
    expect($momentpicker.find('.panel-minute a[data-value=40]')).toHaveClass('selected')
    expect($momentpicker.find('.year-input').val()).toBe('2016')
    expect($momentpicker.find('.month-input').val()).toBe('06')
    expect($momentpicker.find('.date-input').val()).toBe('01')
    expect($momentpicker.find('.hour-input').val()).toBe('08')
    expect($momentpicker.find('.minute-input').val()).toBe('42')
    expect($('#time').val()).toBe('2016-06-01 08:42')

  it 'should clear value when clear is called', ->
    momentpicker = simple.momentpicker
      el: '#time'

    momentpicker.setDate('2016-06-01 08:42')
    momentpicker.clear()

    expect(momentpicker.getDate()).toBe(null)

  it 'should reset all when destroy', ->
    momentpicker = simple.momentpicker
      el: '#time'
      inline: true
      monthpicker: true

    momentpicker.destroy()
    expect($('.simple-momentpicker')).not.toExist()

  it "should fetch date from @el by @getDate if @date is undefined", ->
    date = "2015-01-01"

    $("<input id='timeWithValue' value='#{date}'>").appendTo 'body'
    momentpicker = simple.momentpicker
      el: '#timeWithValue'
    expect momentpicker.getDate().isSame date
      .toBe true
    $("#timeWithValue").remove()




