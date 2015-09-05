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
      for minute in [0, 30]
        m.hour(hour)
        m.minute(minute)
        el += "<a class='panel-item' data-value='#{m.format('HH:mm')}'>#{m.format('A HH:mm')}</a>"
    el

  _setActive: ->
    super()

  _panelItemHandler: (e)->
    value = $(e.currentTarget).data('value')
    m = moment(value, 'HH:mm')
    @moment.set('hour', m.hour())
    @moment.set('minute', m.minute())
    @_setElValue()
    @hide()

View.addView Timeview
