class MonthView extends View
  name: 'month'
  opts:
    format: 'YYYY-MM'

  panelTpl: """
    <div class="simple-momentpicker month-picker">
    <div>
  """

  _init: ->
    super()
    @moment.set('date', 1)

  _getPanelTpl: ->
    menu = @_getMenuTpl()
    panel = @_getMonthPanelTpl()
    """
      <div class="calendar-menu">#{menu}</div>
      <div class="calendar-panel">#{panel}</div>
    """

  _getMenuTpl: ->
    year = @moment.format('YYYY')
    """
      <a class="menu-item" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a>
      <span class="cur-month">#{year}</span>
      <a class="menu-item" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>
    """

  _getMonthPanelTpl: ->
    cur_month = moment().format('YYYY-M')
    selected_month = moment(@el.val(), @opts.format).format('YYYY-M')
    el = ''
    for month in [0..11]
      cls = ''
      if cur_month == @moment.format('YYYY-') + ( month + 1 )
        cls += ' cur'
      if selected_month == @moment.format('YYYY-') + ( month + 1 )
        cls += ' selected'
      el += "<a class='#{cls} panel-item' data-value='#{month}'>#{month + 1}</a>"
    el

  _menuItemHandler: (e)->
    action = $(e.currentTarget).data('action')
    num = if action == 'next' then 1 else -1
    @moment.add(num, 'year')
    @_reRenderPanel()

  _panelItemHandler: (e)->
    value = $(e.currentTarget).data('value')
    @moment.set('month', value)
    @_setElValue()
    @hide()

View.addView(MonthView)
