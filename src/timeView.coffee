class Timeview extends View
  name: 'time'
  opts:
    format: 'A hh:mm'
    startingHour: 0

  panelTpl: """
    <div class='simple-momentpicker time-picker'>
    </div>
  """

  _getPanelTpl: ->
    items = ''
    m = moment()

    for hour in [@opts.startingHour..23]
      for minute in [0, 30]
        m.hour hour
        m.minute minute

        items += """
          <a class='panel-item' data-value='#{m.format 'HH:mm'}'>
            #{m.format @opts.format}
          </a>
        """

    "<div class='hour-panel'>#{items}</div>"

  _setActive: ->
    super()

  _panelItemHandler: (e)->
    value = $(e.currentTarget).data('value')
    m = moment value, 'HH:mm'
    @moment.hour m.hour()
    @moment.minute m.minute()
    @moment.second 0
    @_setElValue()
    @hide()

View.addView Timeview
