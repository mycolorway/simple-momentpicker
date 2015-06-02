class Hourview extends View

  name: 'hour'

  _inputTpl: '<input type="text" class="view-input hour-input" data-type="hour" data-min="0" data-max="23"/>'

  _renderPanel: ->
    el = "<div class='panel panel-hour'>"

    for hour in [0..23]
      el += "<a class='panel-item' data-value='#{hour}'>#{String("00" + hour).slice(-2)}</a>"

    el += '</div>'

  _onInputHandler: (e) ->
    value = @input.val()
    if value.length is 2 and Number(value) < 24
      @select(value, true, true)
    else if value.length is 1
      if Number(value) > 2
        @select(value, true, true)
      else
        @timer = setTimeout =>
          @select(value, false, true)
          @timer = null
        , 800

  _onKeydownHandler: (e) ->
    clearTimeout @timer if @timer

    super(e)

  _onDateChangeHandler: (e) ->
    @value = e.hour

    @_refreshInput()
    @_refreshSelected()

  _refreshInput: ->
    @input.val String('00' + @value).slice(-2)
View.addView Hourview
