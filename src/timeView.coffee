class Timeview extends View
  name: 'time'
  opts:
    format: 'A hh:mm'

  panelTpl: """
    <div class='simple-momentpicker time-picker'>
    </div>
  """

  _getPanelTpl: ->
    items = ''
    m = moment()

    for hour in [@opts.startingHour..23]
      for minute in [0, 30]
        m = m.set
          hour: hour
          minute: minute
        s = m.format @opts.format

        items += "<a class='panel-item' data-value='#{s}'>#{s}</a>"

    "<div class='hour-panel'>#{items}</div>"

  _setActive: ->
    super()

  _panelItemHandler: (e)->
    value = $(e.currentTarget).data('value')
    m = moment value, @opts.format
    @moment.set
      hour: m.hour()
      minute: m.minute()
      second: 0

    @_setElValue()
    @hide()

View.addView Timeview
