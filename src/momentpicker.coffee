class MomentPicker extends SimpleModule
  opts:
    el: null
    inline: false
    valueFormat: 'YYYY-MM-DD HH:mm'
    monthDisplayFormat: 'YYYY-MM'
    dateDisplayFormat: 'YYYY-MM-DD'
    timeDisplayFormat: 'HH:mm'
    cls: ''
    viewOpts:
      date:
        disableBefore: null
        disableAfter: null

  @_count = 0

  _init: ->
    @el = $(@opts.el)
    @type = @el.attr('type')
    @id = ++ MomentPicker._count
    @views = {}

    unless @el.length
      throw 'simple momentpicker: option el is required'
      return

    val = @el.val() || moment()
    @moment = if moment.isMoment(val) then val else moment(val, @opts.valueFormat)

    @_render()
    @_bind()

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
    opt = 
      id: @id
      cls: @opts.cls
      inline: @opts.inline
      moment: @moment
      format: @opts["#{name}DisplayFormat"]
      parent: @

    $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
    @views[name] = new View::constructor.views[name](opt)

  _bind: ->
    @on 'datechange.momentpicker', (e, d)=>
      if d.type == 'date' or d.type == 'month'
        @moment.set('date', d.moment.date())
        @moment.set('month', d.moment.month())
        @moment.set('year', d.moment.year())
      else if d.type == 'time'
        @moment.set('hour', d.moment.hour())
        @moment.set('minute', d.moment.minute())

  getMoment: ->
    @moment.clone()

  getValue: ->
    @moment.format(@opts.valueFormat)

  setMoment: (m)->
    if moment.isMoment(m)
      @moment = m.clone()
    else
      @moment = moment(m, @opts.valueFormat)
    for name of @views
      @views[name].setMoment(m)

  destroy: ->
    for name of @views
      @off '.momentpicker'
      @views[name].destroy()
    @el.show()

momentpicker = (opts) ->
  new MomentPicker opts

momentpicker.View = View

