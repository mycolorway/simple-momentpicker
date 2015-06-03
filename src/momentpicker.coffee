
class MomentPicker extends SimpleModule

  opts:
    list: ['year','%-',  'month', '%-', 'date', '%   ', 'hour', '%:', 'minute']
    el: null
    inline: false
    valueFormat: 'YYYY-MM-DD HH:mm'
    displayFormat: 'YYYY-MM-DD HH:mm'
    defaultView: 'auto'
    cls: 'datetime-picker'
    viewOpts:
      date:
        disableBefore: null
        disableAfter: null


  _init: ->
    @view = []
    @viewList = []

    @el = $(@opts.el)

    unless @el.length
      throw 'simple momentpicker: option el is required'
      return

    @el.data 'momentpicker', @
    val = @el.val() || moment()
    @date = if moment.isMoment(val) then val else moment(val, @opts.valueFormat)

    @_render()
    @_bind()

  _render: ->
    tpl = '''
      <div class="simple-momentpicker">
        <div class="picker-header">
        </div>
        <div class="picker-panels">
        </div>
      </div>
    '''
    @picker = $(tpl)
    @picker.addClass @opts.cls if @opts.cls
    @headerContainer = @picker.find('.picker-header')
    @panelContainer = @picker.find('.picker-panels')
    @_renderViews()

    if @opts.inline
      @picker.insertAfter @el
      @show()
    else
      @_renderFakeInput()
      @picker.appendTo 'body'

  _renderFakeInput: ->
    type = @el.attr 'type'
    @input = $('<input />').addClass('momentpicker-input').attr
      'readonly': 'true'
      'type': 'text'
      'placeholder': @el.attr 'placeholder'
      'data-type': type
    .css
      'cursor': 'pointer'

    @input.val @date.format(@opts.displayFormat) if @el.val() isnt ''

    @input.insertAfter @el
    @el.hide()

  _renderViews: ->
    for name in @opts.list
      if name.indexOf('%') is -1
        opt =
          parent: @
          inputContainer: @headerContainer
          panelContainer: @panelContainer
        opt.defaultValue = switch name
          when 'year'
            @date.year()
          when 'month'
            @date.month()+1
          when 'date'
            @date.format('YYYY-MM-DD')
          when 'hour'
            @date.hour()
          when 'minute'
            @date.minute()


        $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
        @view[name] = new View::constructor.views[name](opt)
        @viewList.push name
        @_bindView(@view[name])
      else
        @headerContainer.append("<span>#{name.substr(1)}</span>")

  _setPosition: ->
    offset = @input.offset()
    @picker.css
      'position': 'absolute'
      'z-index': 100
      'left': offset.left
      'top': offset.top + @input.outerHeight(true)

  _bind: ->
    @picker.on 'click mousedown', ->
      false

    return if @opts.inline
    @input.on 'focus.momentpicker', =>
      @show()

    $(document).on 'click.momentpicker', (e) =>
      return if @input.is e.target
      return if @picker.has(e.target).length
      return if @picker.is e.target
      @hide()

  _bindView: (view) ->
    view.on 'select', (e, event) =>
      source = event.source
      newDate = event.value

      if newDate.year
        @date.year newDate.year

      if newDate.month
        @date.month newDate.month-1

      if newDate.date
        @date = moment(newDate.date, 'YYYY-MM-DD')
        @view['year'].trigger 'datechange',
          year: @date.year()
        @view['month'].trigger 'datechange',
          month: @date.month()+1

      if newDate.hour isnt null
        @date.hour newDate.hour

      if newDate.minute isnt null
        @date.minute newDate.minute

      switch source
        when 'year', 'month'
          @view['date']?.trigger 'datechange',
            year: @date.year()
            month: @date.month()+1
        when 'date'
          @view['year'].trigger 'datechange',
            year: @date.year()
          @view['month'].trigger 'datechange',
            month: @date.month()+1

      if event.finished
        index = @viewList.indexOf(source)
        if index is @viewList.length-1
          # close panel
          @_selectDate()
        else
          @view[@viewList[index+1]].setActive()

    view.on 'showpanel', (e, event) =>
      source = event.source
      if event.prev
        #show prev view
        @view[source].setActive(false)
        index = @viewList.indexOf(source) - 1
        index = 0 if index < 0
        @view[@viewList[index]].setActive()

      else
        for name in @viewList
          @view[name].setActive(false) unless name is source

    view.on 'close', (e, event) =>
      if event?.selected
        @_selectDate()
      @hide() unless @opts.inline

  _selectDate: ->
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @trigger 'select', [@date]
    @hide() unless @opts.inline

  setDate: (date) ->
    @date = if moment.isMoment(date) then date else moment(date, @opts.valueFormat)
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @view['year']?.trigger 'datechange', {year: @date.year()}
    @view['month']?.trigger 'datechange', {month: @date.month()+1}
    @view['date']?.trigger 'datechange',
      year: @date.year()
      month: @date.month()+1
      date: @date.format('YYYY-MM-DD')
    @view['hour']?.trigger 'datechange', {hour: @date.hour()}
    @view['minute']?.trigger 'datechange', {minute: @date.minute()}

  clear: ->
    @el.val ''
    @input.val ''
    @date = moment()
    for name in @viewList
      @view[name].clear()

  getDate: ->
    if @el.val()
      @date ||= moment(@el.val(), @opts.valueFormat)
    else
      null

  show: ->
    @_setPosition() unless @opts.inline

    @picker.show()
    @picker.addClass 'active'
    view = @opts.defaultView

    if @viewList.indexOf(view) isnt -1
      @view[view].setActive()
    else
      #deafultView is 'auto'
      if @view['date']
        @view['date'].setActive()
      else
        @view[@viewList[0]].setActive()

  hide: ->
    @picker.hide()
    @picker.removeClass 'active'

  toggle: ->
    if @picker.is '.active'
      @hide()
    else
      @show()

  destroy: ->
    @picker?.remove()
    @picker = null

    unless @opts.inline
      @input.remove()
      @el.show()
      $(document).off '.momentpicker'


momentpicker = (opts) ->
  return new MomentPicker opts

momentpicker.date = (opts) ->
  $.extend opts,
    list:['year', '%-', 'month', '%-', 'date']
    displayFormat: 'YYYY-MM-DD'
    valueFormat: 'YYYY-MM-DD'
    cls: 'date-picker'
    defaultView: 'date'

  return new MomentPicker opts

momentpicker.month = (opts) ->
  $.extend opts,
    list:['year', '%-', 'month']
    displayFormat: 'YYYY-MM'
    valueFormat: 'YYYY-MM'
    cls: 'month-picker'
    defaultView: 'month'

  return new MomentPicker opts

momentpicker.time = (opts) ->
  $.extend opts,
    list:['hour', '%-', 'minute']
    displayFormat: 'HH时mm分'
    valueFormat: 'HH:mm'
    cls: 'time-picker'


  return new MomentPicker opts

