(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Uploader = factory());
}(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "body {\n  background: #ffd;\n}\n";
  styleInject(css);

  function fetch() {
    console.log('fetch');
  }

  var errorinfo = {
    'FE1000': '调用参数错误',
    'FE1001': '上传按钮必须为DOM节点',
    'FE1002': '文件列表元素必须为DOM节点'
  };

  var LOG = {
    error: function error(msg) {
      msg = errorinfo[msg] || msg;
      throw new Error(msg);
    },
    log: function log(msg) {
      if (console && console.log) {
        console.log(msg);
      }
    }
  };

  var css$1 = "";
  styleInject(css$1);

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Theme = function Theme() {
    classCallCheck(this, Theme);

    console.log(222);
  };

  var WebUi = function (_Theme) {
    inherits(WebUi, _Theme);

    function WebUi(btnEl, fileListEl) {
      classCallCheck(this, WebUi);

      var _this = possibleConstructorReturn(this, _Theme.call(this));

      console.log('webui uploader');
      return _this;
    }

    return WebUi;
  }(Theme);

  var UI_TYPES = ['webui', // 带样式的web端文件上传
  'mobileui', // 带样式的mobile端文件上传
  'websdk', // 无样式的web端文件上传
  'mobilesdk' // 无样式的mobile端文件上传
  ];

  var Uploader = function () {
    /**
     * 上传的构造函数
     * @param { string } path - 上传路径
     * @param { HTMLElement } btnEl - 上传元素
     * @param { HTMLElement } fileListEl - 显示上传进度的列表
     * @param { string } env - 上传插件的运行环境
     * @param { string } theme - 上传的主题标签
     * @param { object } options - 上传设置配置
     */
    function Uploader(_ref) {
      var path = _ref.path,
          btnEl = _ref.btnEl,
          fileListEl = _ref.fileListEl,
          env = _ref.env,
          theme = _ref.theme,
          options = _ref.options;
      classCallCheck(this, Uploader);

      if (!(btnEl instanceof HTMLElement)) {
        LOG.error('FE1001');
      }
      if (!(fileListEl instanceof HTMLElement)) {
        LOG.error('FE1002');
      }
      this.env = UI_TYPES.indexOf(env) === -1 ? 'webui' : env;
      this.btnEl = btnEl;
      this.fileListEl = fileListEl;
      this.path = path;
      this.options = options;
    }

    Uploader.prototype.handleUploader = function handleUploader() {
      if (this.env === 'webui') {
        this.uploader = new WebUi(this.btnEl, this.fileListEl);
      }
    };

    Uploader.prototype.start = function start() {
      console.log('start');
      fetch();
    };

    return Uploader;
  }();

  return Uploader;

})));
