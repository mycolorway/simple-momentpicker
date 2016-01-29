class MomentPicker extends SimpleModule
  opts:
    el: null
    inline: false
    valueFormat: 'YYYY-MM-DD HH:mm:ss'
    formatSplit: ' '
    cls: ''
    viewOpts:
      date:
        disableBefore: null
        disableAfter: null

  @_count = 0

  _init: ->
    @el = $(@opts.el)
    @type = @el.attr('type')
    if @type == 'time'
      @_inputValueFormat = 'HH:mm:ss'
    else if @type == 'datetime' or @type == 'datetime-local'
      @_inputValueFormat = 'YYYY-MM-DDTHH:mm:ss'
    else if @type == 'date'
      @_inputValueFormat = 'YYYY-MM-DD'
    else if @type == 'month'
      @_inputValueFormat = 'YYYY-MM'
    @id = ++ MomentPicker._count
    @views = {}

    unless @el.length
      throw 'simple momentpicker: option el is required'
      return

    val = @el.val() || moment()
    @moment = if moment.isMoment(val) then val else moment(val, @opts.valueFormat)

    @_render()
    @_bind()
    @el.data 'momentpicker', @

  _render: ->
    @el.hide()
    @_renderViews()

  _renderViews: ->
    if @type == 'time'
      @_creaetView('time')
    else if @type == 'datetime' or @type == 'datetime-local'
      @_creaetView('date')
      @_creaetView('time')
    else if @type == 'date'
      @_creaetView('date')
    else if @type == 'month'
      @_creaetView('month')

  _creaetView: (name)->
    if @opts.displayFormat?
      format = @opts.displayFormat
      format = format.split(@opts.formatSplit).pop() if name == 'time'
      format = format.split(@opts.formatSplit)[0] if name == 'date'
    opt =
      id: @id
      cls: @opts.cls
      inline: @opts.inline
      moment: @moment
      format: format
      parent: @
    $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
    @views[name] = new View::constructor.views[name](opt)

  _bind: ->
    @on 'datechange.momentpicker', (e, d)=>
      if d.type == 'date' or d.type == 'month'
        @moment.set('year', d.moment.year())
        @moment.set('month', d.moment.month())
        @moment.set('date', d.moment.date())
      else if d.type == 'time'
        @moment.set('hour', d.moment.hour())
        @moment.set('minute', d.moment.minute())
      @el.val(@moment.format(@_inputValueFormat)).change()
      @trigger 'select',
        type: d.type
        moment: @moment.clone()

  getMoment: ->
    @moment.clone()

  getValue: ->
    if @el.val() then @moment.format(@opts.valueFormat) else null

  setMoment: (m)->
    if moment.isMoment(m)
      @moment = m.clone()
    else
      @moment = moment(m, @opts.valueFormat)
    for name of @views
      @views[name].setMoment(@moment)

  clear: ->
    @el.val ''
    for name of @views
      @views[name].clear()

  destroy: ->
    for name of @views
      @off '.momentpicker'
      @views[name].destroy()
    @el.removeData 'momentpicker'
    @el.show()

momentpicker = (opts) ->
  new MomentPicker opts

momentpicker.View = View
