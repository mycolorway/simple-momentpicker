class MomentPicker extends SimpleModule
  opts:
    el: null
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
    @_renderFakeInput()
    @_renderViews()

  _renderFakeInput: ->
    type = @el.attr('type') || 'datetime'
    @input_time = null
    @input_date = null
    @input_month = null
    if type == 'time'
      @input_time = $("<input class='momentpicker-input'/>").addClass('time-input').attr
        'type': 'text'
        'placeholder': @el.attr 'placeholder'
      @views['time'] = null
    else if type == 'datetime'
      @input_date = $("<input class='momentpicker-input'/>").addClass('date-input').attr
        'type': 'text'
      @input_time = $("<input class='momentpicker-input'/>").addClass('time-input').attr
        'type': 'text'
      @views['date'] = null
      @views['time'] = null
    else if type == 'date'
      @input_date = $("<input class='momentpicker-input'/>").addClass('date-input').attr
        'type': 'text'
        'placeholder': @el.attr 'placeholder'
      @views['date'] = null
    else if type == 'month'
      @input_month = $("<input class='momentpicker-input'/>").addClass('month-input').attr
        'type': 'text'
        'placeholder': @el.attr 'placeholder'
      @views['month'] = null

    if @input_month
      @input_month.val @moment.format(@opts.monthDisplayFormat) if @el.val()?
      @input_month.insertAfter(@el)

    if @input_date 
      @input_date.val @moment.format(@opts.dateDisplayFormat) if @el.val()?
      @input_date.insertAfter(@el)

    if @input_time
      @input_time.val @moment.format(@opts.timeDisplayFormat) if @el.val()?
      if @input_date then @input_time.insertAfter(@input_date) else @input_time.insertAfter(@el)

    @el.hide()

  _renderViews: ->
    for name of @views
      opt = 
        id: @id
        el: @["input_#{name}"]
        cls: @opts.cls
        format: @opts["#{name}DisplayFormat"]
        parent: @

      $.extend opt, @opts['viewOpts'][name] if @opts['viewOpts'][name]
      @views[name] = new View::constructor.views[name](opt)

  _bind: ->
    @on 'datechange', (e, d)=>
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

  setMoment: (moment)->
    @moment = moment(moment, @opts.valueFormat)

momentpicker = (opts) ->
  new MomentPicker opts

momentpicker.View = View

