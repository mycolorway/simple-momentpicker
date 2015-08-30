class Timeview extends View
  name: 'time'

  panelTpl: """
    <div class='simple-momentpicker time-picker'>
    </div>
  """

  _renderPanel: ->
    el = """
      <div class='hour-panel'>
    """
    m = window.moment()
    for hour in [0..23]
      m.hour(hour)
      el += "<a class='panel-item' data-type='hour' data-value='#{hour}'>#{m.format('A HH')}</a>"

    el += """
      </div>
      <div class='quarter-panel'>
        <a class='panel-item' data-type='minute' data-value='00'>:00</a>
        <a class='panel-item' data-type='minute' data-value='15'>:15</a>
        <a class='panel-item' data-type='minute' data-value='30'>:30</a>
        <a class='panel-item' data-type='minute' data-value='59'>:59</a>
      </div>
    """

  _setActive: ->
    super()
    @panel.find("a.panel-item[data-type='hour'][data-value='#{@moment.hour()}']").addClass('selected')
    @panel.find("a.panel-item[data-type='hour'][data-value='#{moment().hour()}']").addClass('cur')
    @panel.find("a.panel-item[data-type='minute'][data-value='#{@moment.format('mm')}']").addClass('selected')

  _menuItemHandler: (e)->
    action = $(e.currentTarget).data('action')
    num = if action == 'next' then 1 else -1
    @moment.add(num, 'year')
    @_reRenderPanel()

  _panelItemHandler: (e)->
    $currentTarget = $(e.currentTarget)
    type = $currentTarget.data('type')
    value = $currentTarget.data('value')
    if type == 'hour'
      @moment.set('hour', value)
      $('.selected').removeClass('selected')
      $currentTarget.addClass('selected')
      @_setElValue()
    else if type == 'minute'
      @moment.set('minute', value)
      @_setElValue()
      @hide()

View.addView Timeview
