class Session extends Spine.Model
  @configure 'Session', 'access_token', 'user', 'is_authenticated'

  @extend Spine.Model.Local

  authenticated: ->
    @is_authenticated

  full_name: ->
    return unless @is_authenticated()
    [@user.first_name, @user.last_name].join(' ')

window.Session = Session
