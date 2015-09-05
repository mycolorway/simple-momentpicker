class View extends SimpleModule
  opts:
    cls: ''

  panelTpl: ''

  _init: ->
    @id = @opts.id
    @el = @opts.el
    @parent = @opts.parent
    @moment = moment(@el.val(), @opts.format) || moment()

    @_render()
    @_bind()

  _render: ->
    @panel = $(@panelTpl).html(@_renderPanel()).addClass(@opts.cls).attr('id', "#{@name}_#{@id}")
    @panel.appendTo('body')
    if @opts.inline
      @el.hide()
      @panel.show()
    else
      @_setPosition()

  _renderPanel: ->
    false

  _reRenderPanel: ->
    @panel.html(@_renderPanel())

  _setPosition: ->
    offset = @el.offset()
    @panel.css
      'position': 'absolute'
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  _bind: ->
    @_bindEl()
    @_bindPanel()

    $(document).on "mousedown.momentpicker_#{@id}", (e)=>
      return if @el.is(e.target) or !!@panel.has(e.target).length or @panel.is(e.target)
      @hide()
    $(window).on "resize.momentpicker_#{@id}", (e)=>
      @_setPosition()

  _bindEl: ->
    @el.on 'focus', => 
      @show()
    .on 'click', (e)=>
      @show()
    .on 'keydown', =>
      @hide()
    .on 'blur', =>
      @verifyValue()

  _bindPanel: ->
    @panel.on 'click', '.menu-item', (e)=>
      e.stopPropagation()
      @_menuItemHandler(e)

    .on 'click', '.panel-item', (e)=>
      e.stopPropagation()
      @_panelItemHandler(e)
      @parent.trigger 'select',
        type: @name
        moment: @moment.clone()

  _menuItemHandler: ->
    false

  _panelItemHandler: ->
    false

  _setElValue: ->
    @el.val(@moment.format(@opts.format))
    @parent.trigger 'datechange',
      type: @name
      moment: @moment.clone()

  _setActive: ->
    @_reRenderPanel()

  verifyValue: ->
    new_moment = moment(@el.val(), @opts.format)
    if new_moment.isValid()
      @moment = new_moment
    @_setElValue()

  show: ->
    @_setActive()
    @panel.show()

  hide: ->
    @panel.hide()

  destroy: ->
    @panel.remove()
    @el.remove()
    $(document).off '.momentpicker_#{@id}'
    $(window).off '.momentpicker_#{@id}'

  setMoment: (m)->
    @moment = m
    @_setElValue()

  @addView: (view) ->
    unless @views
      @views = {}
    @views[view::name] = view