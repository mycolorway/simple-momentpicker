class DateView extends View
  name: 'date'

  opts:
    el: null
    format: 'YYYY-MM-DD'
    disableBefore: null
    disableAfter: null

  panelTpl: """
    <div class="simple-momentpicker date-picker">
    </div>
  """

  _getPanelTpl: ->
    week = ''
    for i in [1, 2, 3, 4, 5, 6 ,0]
      week += "<td>#{moment.weekdaysMin(i)}</td>"
    """
        <div class="calendar-menu">
          #{ @_getDayMenuTpl() }
        </div>
        <table class="calendar"">
          <tr class="datepicker-dow">
            #{week}
          </tr>
          #{ @_getDaySelectorsTpl() }
        </table>
    """

  _getDayMenuTpl: ->
    month = @moment.format('YYYY.MM')
    return """
      <a class="menu-item" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a>
      <span class="cur-month">#{month}</span>
      <a class="menu-item" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>
    """


  _getDaySelectorsTpl: ->
    today = moment().startOf("day")

    selectDate = if @el.val() then moment(@el.val(), @opts.format).startOf("day") else null

    # Calculate the first and last date in month being rendered.
    # Also calculate the weekday to start rendering on
    firstDate = @moment.clone().startOf("month")
    lastDate = @moment.clone().endOf("month")

    # Calculate the last day in previous month
    prevLastDate = @moment.clone().add(-1, "months").endOf("month")

    # Render the cells as <TD>
    days = ""
    y = 0
    i = 0

    while y < 6
      row = ""
      x = 0

      while x < 7
        p = ((prevLastDate.date() - prevLastDate.day()) + i + 1)
        n = p - prevLastDate.date()
        c = (if (x is 6) then "sun" else ((if (x is 5) then "sat" else "day")))
        date = @moment.clone().date(n).startOf("day")


        # If value is outside of bounds its likelym previous and next months
        if n >= 1 and n <= lastDate.date()
          # Test to see if it's today
          c += ' today' if (today.isSame(date, 'day') is true)
          c += (if(date.diff(selectDate, 'days') is 0) then " selected" else "")  if selectDate
        else if n > lastDate.date() and x is 0
          break
        else
          c = ((if (x is 6) then "sun" else ((if (x is 5) then "sat" else "day")))) + " others"
          n = (if (n <= 0) then p else ((p - lastDate.date()) - prevLastDate.date()))

        if moment.isMoment(@opts.disableBefore)
          until_ = moment(@opts.disableBefore, "YYYY-MM-DD")
          c += (if (date.diff(until_) < 0) then " disabled" else "")

        if moment.isMoment(@opts.disableAfter)
          until_ = moment(@opts.disableAfter, "YYYY-MM-DD")
          c += (if (date.diff(until_) > 0) then " disabled" else "")

        # Create the cell
        row += """
            <td class='datepicker-day'>
              <a href="javascript:;" class="#{c} panel-item" data-value="#{date.format('YYYY-MM-DD')}">
                #{n}
              </a>
            </td>
            """
        x++
        i++

      # Create the row
      if row
        days += """
            <tr class="days">#{row}</tr>
            """
      y++
    return days

  _menuItemHandler: (e)->
    action = $(e.currentTarget).data('action')
    num = if action == 'next' then 1 else -1
    @moment.add(num, 'month')
    @_reRenderPanel()

  _panelItemHandler: (e)->
    value = $(e.currentTarget).data('value')
    @moment = moment(value, 'YYYY-MM-DD')
    @_setElValue()
    @hide()

View.addView(DateView)
