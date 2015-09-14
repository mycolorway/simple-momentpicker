class View extends SimpleModule
  opts:
    cls: ''

  inputTpl: '<input class="momentpicker-input" />'
  panelTpl: ''

  _init: ->
    @id = @opts.id
    @parent = @opts.parent
    @moment = @opts.moment

    @_render()
    @_bind()

  _render: ->
    @_renderInput()
    @_renderPanel()
    if @opts.inline
      @el.hide()
      @panel.show()
    else
      @_setPosition()

  _renderInput: ->
    @el = $(@inputTpl).addClass("#{@name}-input").attr
      'type': 'text'
      'placeholder': @parent.el.attr 'placeholder'
    @el.appendTo(@parent.el.parent())
    @el.val(@moment.format(@opts.format))

  _renderPanel: ->
    @panel = $(@panelTpl).html(@_getPanelTpl()).addClass(@opts.cls).attr('id', "#{@name}-#{@id}")
    if @opts.inline
      @panel.insertAfter(@parent.el)
    else
      @panel.appendTo('body')

  _getPanelTpl: ->
    @panelTpl

  _reRenderPanel: ->
    @panel.html(@_getPanelTpl())
    @_setPosition()

  _setPosition: ->
    offset = @el.offset()
    @panel.css
      'position': 'absolute'
      'left': offset.left
      'top': offset.top + @el.outerHeight(true)

  _bind: ->
    @_bindEl()
    @_bindPanel()

    $(document).on "mousedown.momentpicker-#{@id}", (e)=>
      return if @el.is(e.target) or !!@panel.has(e.target).length or @panel.is(e.target)
      @hide()
    $(window).on "resize.momentpicker-#{@id}", (e)=>
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
    $(document).off '.momentpicker-#{@id}'
    $(window).off '.momentpicker-#{@id}'

  setMoment: (m)->
    @moment = m
    @_setElValue()

  @addView: (view) ->
    unless @views
      @views = {}
    @views[view::name] = view