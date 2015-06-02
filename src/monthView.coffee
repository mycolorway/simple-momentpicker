class MonthView extends View
  name: 'month'

  _inputTpl: '<input type="text" class="view-input month-input" data-type="month" data-min="1" data-max="12"/>'

  _renderPanel: ->
    el = ''
    for month in [1..12]
      el += "<a class='panel-item' data-value='#{month}'>#{String('00' + month).slice(-2)}</a>"

    $(@_panelTpl).html(el).addClass 'panel-month'

  _onInputHandler: ->
    @input.val(@input.val().substr(1)) while Number(@input.val()) > 12
    value = @input.val()
    if value.length is 2 and Number(value) isnt 0
      @select(value, false, true)
    else if value.length is 1
      if Number(value) >= 2
        @select(value, false, true)
      else if Number(value) is 1
        @timer = setTimeout =>
          @select(value, false, true)
          @timer = null
        , 800

  _onKeydownHandler: (e) ->
    clearTimeout @timer if @timer

    super(e)

  _refreshInput: ->
    @input.val String('00' + @value).slice(-2)

  _onDateChangeHandler: (e) ->
    @value = e.month
    @_refreshInput()
    @_refreshSelected()


View.addView(MonthView)
