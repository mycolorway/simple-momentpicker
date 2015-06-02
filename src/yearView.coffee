class YearView extends View
  name: 'year'

  _inputTpl: '<input type="text" class="view-input year-input" data-type="year" data-min="1800" data-max="3000"/>'

  # store the first year of current view
  firstYear: 0

  _renderPanel: ->
    #init firstYear
    @firstYear = Math.floor(@value/10) * 10 if @firstYear is 0

    el = """
      <div class="panel panel-year">
        #{@_renderYears(@firstYear)}
      </div>
    """

  _renderYears: (firstYear) ->
    el = '''
        <a class="menu-item" data-action="prev"><i class="icon-chevron-left"><span>&lt;</span></i></a><a class="menu-item" data-action="next"><i class="icon-chevron-right"><span>&gt;</span></i></a>
    '''

    for year in [firstYear..firstYear+11]
      el += "<a class='panel-item' data-value='#{year}'>#{year}</a>"

    el

  _handleAction: (action)->
    @firstYear = if action is 'prev' then @firstYear-10 else @firstYear+10

    @_reRenderPanel()
    @panel.addClass('active')

  _onInputHandler: ->
    value = @input.val()
    @input.val value.substr(1) if value.length > 4

    value = @input.val()
    if value > 1900 and value < 2050
      @select(value, false, true)

  _onDateChangeHandler: (event) ->
    @value = event.year
    newFirstYear = Math.floor(@value/10) * 10

    @_refreshInput()
    if @firstYear is newFirstYear
      @_refreshSelected()
    else
      @firstYear = newFirstYear
      @_reRenderPanel()


  select: (value, refreshInput, finished) ->
    newFirstYear = Math.floor(@value/10) * 10
    unless @firstYear is newFirstYear
      @firstYear = newFirstYear
      @_reRenderPanel()

    super(value, refreshInput, finished)

View.addView(YearView)
