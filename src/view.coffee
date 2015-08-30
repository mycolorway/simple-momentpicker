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

    $(document).on "click.momentpicker_#{@id}", (e)=>
      return if @el.is(e.target) or !!@panel.has(e.target).length or @panel.is(e.target)
      @hide()

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
      console.log 'panel-item click'
      @_panelItemHandler(e)

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
    if @verifyValue()
      @_reRenderPanel()

  verifyValue: ->
    new_moment = moment(@el.val(), @opts.format)
    if new_moment.isValid()
      @moment = new_moment
    @_setElValue()
    return new_moment.isValid()

  show: ->
    @_setActive()
    @panel.show()

  hide: ->
    @panel.hide()

  @addView: (view) ->
    unless @views
      @views = {}
    @views[view::name] = view