
class MomentPicker extends SimpleModule

  opts:
    list: ['year','%-',  'month', '%-', 'date', '%   ', 'hour', '%:', 'minute']
    el: null
    inline: false
    valueFormat: 'YYYY-MM-DD HH:mm'
    displayFormat: 'LLLL'
    defaultView: 'auto'
    class: 'datetime-picker'
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
    @picker.addClass @opts.class if @opts.class
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
          defaultValue: @date

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
      if source is 'date'
        @date = event.moment
      else
        @date.set source, event.moment.get(event.source)

      switch source
        when 'year', 'month'
          @view['date']?.trigger 'datechange',
            moment: @date
        when 'date'
          @view['year']?.trigger 'datechange',
            moment: @date
          @view['month']?.trigger 'datechange',
            moment: @date

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
    @date = if moment.isMoment(date) then date.clone() else moment(date, @opts.valueFormat)
    @el.val @date.format(@opts.valueFormat)
    @input.val @date.format(@opts.displayFormat) if @input

    @view['year']?.trigger 'datechange', {moment: @date}
    @view['month']?.trigger 'datechange', {moment: @date}
    @view['date']?.trigger 'datechange', {moment: @date}
    @view['hour']?.trigger 'datechange', {moment: @date}
    @view['minute']?.trigger 'datechange', {moment: @date}

  clear: ->
    @el.val ''
    @input.val ''
    @date = null
    for name in @viewList
      @view[name].clear()

  getDate: ->
    @date ||= moment(@el.val(), @opts.valueFormat) if @el.val()
    if @date then @date.clone() else null 

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

momentpicker.View = View

momentpicker.date = (opts) ->
  opts = $.extend
    list:['year', '%-', 'month', '%-', 'date']
    displayFormat: 'LL'
    valueFormat: 'YYYY-MM-DD'
    class: 'date-picker'
    defaultView: 'date'
  , opts

  return new MomentPicker opts

momentpicker.month = (opts) ->
  opts = $.extend
    list:['year', '%-', 'month']
    displayFormat: 'YYYY-MM'
    valueFormat: 'YYYY-MM'
    class: 'month-picker'
    defaultView: 'month'
  , opts

  return new MomentPicker opts

momentpicker.time = (opts) ->
  opts = $.extend
    list:['hour', '%-', 'minute']
    displayFormat: 'LT'
    valueFormat: 'HH:mm'
    class: 'time-picker'
  , opts

  return new MomentPicker opts

