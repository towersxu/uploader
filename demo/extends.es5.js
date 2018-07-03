function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
  function Events() {
    _classCallCheck(this, Events);

    this.listeners = {};
  }

  Events.prototype.on = function on(key, fn) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      return;
    }
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    var index = this.listeners[key].indexOf(fn);
    if (index !== -1) {
      this.listeners[index] = fn;
    } else {
      this.listeners[key].push(fn);
    }
  };

  Events.prototype.trigger = function trigger(key) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var fns = this.listeners[key];
    if (fns.length > 0) {
      fns.forEach(function (fn) {
        fn.apply(null, args);
      });
    }
  };

  Events.prototype.remove = function remove(key, fn) {
    var fns = this.listeners[key];
    if (fns.length > 0) {
      var index = fns.indexOf(fn);
      if (index !== -1) {
        return fns.splice(index, 1);
      }
    }
  };

  return Events;
}();

var Ui = function () {
  function Ui(el) {
    _classCallCheck(this, Ui);

    this.el = el;
  }
  // todo: 不兼容IE9的话，可以考虑用classList


  Ui.prototype.addClass = function addClass(cls) {
    var className = this.el.className;
    if (className) {
      var names = className.split(' ');
      if (names.indexOf(cls) === -1) {
        names.push(cls);
        this.el.className = names.join(' ');
      }
    } else {
      this.el.className = cls;
    }
  };

  Ui.prototype.removeClass = function removeClass(cls) {
    var className = this.el.className;
    if (className) {
      var names = className.split(' ');
      var index = names.indexOf(cls);
      if (index !== -1) {
        names.splice(index, 1);
        this.el.className = names.join(' ');
      }
    }
  };

  return Ui;
}();

function mixin(cls) {
  return function (_cls) {
    _inherits(_class, _cls);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _cls.apply(this, arguments));
    }

    _class.prototype.toString1 = function toString1() {
      console.log('123');
    };

    return _class;
  }(cls);
}

var Element = function (_mixin) {
  _inherits(Element, _mixin);

  function Element(el) {
    _classCallCheck(this, Element);

    return _possibleConstructorReturn(this, _mixin.call(this, el));
  }

  return Element;
}(mixin(Ui, Events));

var el = document.getElementById('el');
var ele = new Element(el);
ele.addClass('name');

ele.toString1();
