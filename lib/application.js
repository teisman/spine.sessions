(function() {
  var Session,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Session = (function(_super) {

    __extends(Session, _super);

    function Session() {
      return Session.__super__.constructor.apply(this, arguments);
    }

    Session.configure('Session', 'access_token', 'user', 'is_authenticated');

    Session.extend(Spine.Model.Local);

    Session.prototype.authenticated = function() {
      return this.is_authenticated;
    };

    Session.prototype.full_name = function() {
      if (!this.is_authenticated()) {
        return;
      }
      return [this.user.first_name, this.user.last_name].join(' ');
    };

    return Session;

  })(Spine.Model);

  window.Session = Session;

}).call(this);

(function() {
  var $, Sessions, response_login, response_session,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  response_session = {
    access_token: '274484',
    is_authenticated: false,
    user: {}
  };

  response_login = {
    access_token: '274485',
    is_authenticated: true,
    user: {
      name: 'Mark'
    }
  };

  Sessions = (function(_super) {

    __extends(Sessions, _super);

    Sessions.prototype.events = {
      'submit #form-login': 'login',
      'click .logout': 'logout'
    };

    function Sessions() {
      this.render = __bind(this.render, this);

      this.logout = __bind(this.logout, this);

      this.login = __bind(this.login, this);

      this.initialize = __bind(this.initialize, this);
      Sessions.__super__.constructor.apply(this, arguments);
      Session.bind('refresh', this.initialize);
      Session.bind('change', this.render);
      Session.fetch();
    }

    Sessions.prototype.validate = function() {
      var data, item;
      item = this.item;
      data = {
        access_token: item.access_token
      };
      $.mockjax({
        url: '/sessions',
        responseText: response_session
      });
      $.getJSON('/sessions', data, function(response) {
        item.updateAttributes(response);
        return window.authenticated = item.authenticated();
      });
      return $.mockjaxClear();
    };

    Sessions.prototype.initialize = function() {
      var _ref;
      if (Session.count() !== 1) {
        Session.deleteAll();
      }
      this.item = (_ref = Session.first()) != null ? _ref : Session.create();
      return this.validate();
    };

    Sessions.prototype.login = function(e) {
      var data, item;
      e.preventDefault();
      item = this.item;
      data = $(e.target).serializeArray();
      $.mockjax({
        url: '/sessions',
        responseText: response_login
      });
      $.post('/sessions', data, (function(response) {
        item.updateAttributes(response);
        return window.authenticated = item.authenticated();
      }), 'json');
      return $.mockjaxClear();
    };

    Sessions.prototype.logout = function(e) {
      e.preventDefault();
      $.mockjax({
        url: '/sessions',
        responseText: response_session
      });
      Session.each(function(item) {
        var _this = this;
        return $.ajax({
          type: 'DELETE',
          url: '/sessions',
          data: {
            access_token: item.access_token
          },
          success: function(response) {
            delete window.authenticated;
            return session.destroy();
          },
          error: function(err) {
            return _this.log(err);
          }
        });
      });
      $.mockjaxClear();
      return this.initialize();
    };

    Sessions.prototype.template = function(item) {
      return (Handlebars.compile($('#auth-template').html()))(item);
    };

    Sessions.prototype.render = function() {
      return this.html(this.template(this.item));
    };

    return Sessions;

  })(Spine.Controller);

  $(function() {
    return new Sessions({
      el: $('#main')
    });
  });

}).call(this);
