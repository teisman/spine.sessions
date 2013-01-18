$ = jQuery

response_session = 
  access_token: '274484'
  is_authenticated: false
  user: {}

response_login = 
  access_token: '274485'
  is_authenticated: true
  user: {
    name: 'Mark'    
  }


class Sessions extends Spine.Controller
  events:
    'submit #form-login': 'login'
    'click .logout': 'logout'

  constructor: ->
    super
    Session.bind 'refresh', @initialize
    Session.bind 'change', @render
    Session.fetch()

  validate: ->
    item = @item
    data =
      access_token: item.access_token
    $.mockjax
      url: '/sessions'
      responseText : response_session
    $.getJSON '/sessions', data, (response) ->
      item.updateAttributes response
      window.authenticated = item.authenticated()
    $.mockjaxClear()

  initialize: =>
    Session.deleteAll() if Session.count() isnt 1
    @item = Session.first() ? Session.create()
    @validate()

  login: (e) =>
    e.preventDefault()
    item = @item
    data = $(e.target).serializeArray()
    $.mockjax
      url: '/sessions'
      responseText : response_login
    $.post '/sessions', data, ((response) ->
      item.updateAttributes response
      window.authenticated = item.authenticated()
      ), 'json'
    $.mockjaxClear()

  logout: (e) =>
    e.preventDefault()
    $.mockjax
      url: '/sessions'
      responseText : response_session
    Session.each (item) ->
      $.ajax(
        type: 'DELETE'
        url: '/sessions'
        data:
          access_token: item.access_token
        success: (response) =>
          delete window.authenticated
          session.destroy()
        error: (err) =>
          @log err
        )
    $.mockjaxClear()
    @initialize()
    
  template: (item) ->
    (Handlebars.compile $('#auth-template').html()) item

  render: =>
    @html @template @item
    

$ ->
  new Sessions(el: $('#main'))
