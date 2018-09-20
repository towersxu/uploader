(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Uploader = factory());
}(this, (function () { 'use strict';

  var I18n = {
    'FE1000': '调用参数错误',
    'FE1001': '上传按钮必须为DOM节点',
    'FE1002': '文件列表元素必须为DOM节点',
    'FE1003': '未指明上传模式',
    'NW1001': '网络连接失败',
    'NW1002': '服务器地址错误',
    'UPLOADING': '正在上传',
    'UPLOADED': '上传完成'
  };

  var LOG = {
    error: function error(msg) {
      msg = I18n[msg] || msg;
      throw new Error(msg);
    },
    log: function log(msg) {
      if (console && console.log) {
        console.log(msg);
      }
    }
  };

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

  var css = ".default-filebutton-wrapper {\n  position: relative;\n  overflow: hidden;\n  margin: 0 60px;\n}\n.default-filebutton-wrapper input[type=\"file\"] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  opacity: 0;\n  height: 100%;\n  width: 100%;\n  font-size: 10000px;\n  cursor: pointer;\n}\n.default-fileset {\n  position: fixed;\n  bottom: 0px;\n  right: 20px;\n  width: 500px;\n  height: 344px;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  border: 1px solid #e2e2e2;\n  box-shadow: 0 0 10px #ccc;\n  margin-bottom: -2px;\n  font-family: 'Microsoft YaHei', SimSun;\n}\n.default-fileset-header {\n  height: 44px;\n  line-height: 44px;\n  display: block;\n  position: relative;\n  border-bottom: 1px solid #f2f6fd;\n}\n.default-fileset-list {\n  height: 300px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n.default-header-text {\n  color: #424e67;\n  font-size: 14px;\n  margin-left: 20px;\n}\n.default-progress {\n  width: 100%;\n  height: 50px;\n  position: relative;\n  border-bottom: 1px solid #f2f6fd;\n}\n.default-progress-bg {\n  position: absolute;\n  height: 50px;\n  z-index: 0;\n  background: #e2eeff;\n  top: 0;\n  left: 0;\n  width: 0;\n  transition: width 1s linear;\n}\n.default-progress-bar {\n  position: relative;\n  z-index: 1;\n}\n.default-progress-bar .default-icon-suffix {\n  line-height: 50px;\n  vertical-align: middle;\n  margin: 0 10px;\n}\n.default-progress.default-progress-uploaded .default-progress-bg {\n  display: none;\n}\n.default-progress-filename {\n  line-height: 50px;\n  font-size: 12px;\n  color: #424e67;\n  display: inline-block;\n  width: 250px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n}\n.default-progress-filesize {\n  line-height: 50px;\n  font-size: 12px;\n  color: #424e67;\n  display: inline-block;\n  width: 130px;\n  padding-left: 15px;\n  box-sizing: border-box;\n}\n.default-progress-tools {\n  display: inline-block;\n  vertical-align: middle;\n  line-height: 50px;\n  width: 64px;\n  height: 50px;\n  overflow: hidden;\n}\n.default-tool {\n  display: inline-block;\n  vertical-align: middle;\n  line-height: 50px;\n  float: right;\n  margin-top: 3px;\n}\n.default-status-tips {\n  color: #E5A146;\n}\n.default-status-tips.default-status-auth {\n  color: #409EFF;\n}\n.default-icon {\n  width: 36px;\n  height: 36px;\n  display: inline-block;\n}\n.default-icon-close {\n  width: 14px;\n  height: 14px;\n  margin-right: 15px;\n  cursor: pointer;\n}\n.default-icon-pause {\n  width: 14px;\n  height: 14px;\n  margin-right: 15px;\n  cursor: pointer;\n}\n.default-icon-success {\n  width: 20px;\n  height: 20px;\n  margin-right: 15px;\n}\n.default-icon-waiting {\n  width: 20px;\n  height: 20px;\n  margin-right: 15px;\n}\n.default-animate-rotate {\n  -webkit-animation: waitingrotate 1s infinite linear;\n          animation: waitingrotate 1s infinite linear;\n}\n@-webkit-keyframes waitingrotate {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes waitingrotate {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@font-face {\n  font-family: \"default-icon\";\n  src: url('fonts/iconfont.eot?t=1527162342206');\n  /* IE9*/\n  src: url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'), url('fonts/iconfont.ttf?t=1527162342206') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('fonts/iconfont.svg?t=1527162342206#iconfont') format('svg');\n  /* iOS 4.1- */\n}\n.default-icon-doc:before {\n  content: \"\\e64f\";\n}\n.default-icon-jpg:before {\n  content: \"\\e650\";\n}\n.default-icon-html:before {\n  content: \"\\e651\";\n}\n.default-icon-icon_MP-:before {\n  content: \"\\e652\";\n}\n.default-icon-png:before {\n  content: \"\\e653\";\n}\n.default-icon-dll:before {\n  content: \"\\e654\";\n}\n.default-icon-ppt:before {\n  content: \"\\e655\";\n}\n.default-icon-mp4:before {\n  content: \"\\e656\";\n}\n.default-icon-pdf:before {\n  content: \"\\e657\";\n}\n.default-icon-gif:before {\n  content: \"\\e658\";\n}\n.default-icon-exe:before {\n  content: \"\\e659\";\n}\n.default-icon-mpg:before {\n  content: \"\\e65a\";\n}\n.default-icon-psd:before {\n  content: \"\\e65b\";\n}\n.default-icon-mkv:before {\n  content: \"\\e65c\";\n}\n.default-icon-xls:before {\n  content: \"\\e65d\";\n}\n.default-icon-rmvb:before {\n  content: \"\\e65e\";\n}\n.default-icon-txt:before {\n  content: \"\\e65f\";\n}\n.default-icon-wav:before {\n  content: \"\\e660\";\n}\n.default-icon-swf:before {\n  content: \"\\e661\";\n}\n.default-icon-avi:before {\n  content: \"\\e662\";\n}\n.default-icon-othe:before {\n  content: \"\\e665\";\n}\n";
  styleInject(css);

  function vnode(sel, data, children, text, elm) {
      var key = data === undefined ? undefined : data.key;
      return { sel: sel, data: data, children: children,
          text: text, elm: elm, key: key };
  }
  //# sourceMappingURL=vnode.js.map

  var array = Array.isArray;
  function primitive(s) {
      return typeof s === 'string' || typeof s === 'number';
  }
  //# sourceMappingURL=is.js.map

  function createElement(tagName) {
      return document.createElement(tagName);
  }
  function createElementNS(namespaceURI, qualifiedName) {
      return document.createElementNS(namespaceURI, qualifiedName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(elm) {
      return elm.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function getTextContent(node) {
      return node.textContent;
  }
  function isElement(node) {
      return node.nodeType === 1;
  }
  function isText(node) {
      return node.nodeType === 3;
  }
  function isComment(node) {
      return node.nodeType === 8;
  }
  var htmlDomApi = {
      createElement: createElement,
      createElementNS: createElementNS,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      getTextContent: getTextContent,
      isElement: isElement,
      isText: isText,
      isComment: isComment,
  };
  //# sourceMappingURL=htmldomapi.js.map

  function addNS(data, children, sel) {
      data.ns = 'http://www.w3.org/2000/svg';
      if (sel !== 'foreignObject' && children !== undefined) {
          for (var i = 0; i < children.length; ++i) {
              var childData = children[i].data;
              if (childData !== undefined) {
                  addNS(childData, children[i].children, children[i].sel);
              }
          }
      }
  }
  function h(sel, b, c) {
      var data = {}, children, text, i;
      if (c !== undefined) {
          data = b;
          if (array(c)) {
              children = c;
          }
          else if (primitive(c)) {
              text = c;
          }
          else if (c && c.sel) {
              children = [c];
          }
      }
      else if (b !== undefined) {
          if (array(b)) {
              children = b;
          }
          else if (primitive(b)) {
              text = b;
          }
          else if (b && b.sel) {
              children = [b];
          }
          else {
              data = b;
          }
      }
      if (array(children)) {
          for (i = 0; i < children.length; ++i) {
              if (primitive(children[i]))
                  children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
          }
      }
      if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
          (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
          addNS(data, children, sel);
      }
      return vnode(sel, data, children, text, undefined);
  }
  //# sourceMappingURL=h.js.map

  //# sourceMappingURL=thunk.js.map

  function isUndef(s) { return s === undefined; }
  function isDef(s) { return s !== undefined; }
  var emptyNode = vnode('', {}, [], undefined, undefined);
  function sameVnode(vnode1, vnode2) {
      return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
  }
  function isVnode(vnode$$1) {
      return vnode$$1.sel !== undefined;
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i, map = {}, key, ch;
      for (i = beginIdx; i <= endIdx; ++i) {
          ch = children[i];
          if (ch != null) {
              key = ch.key;
              if (key !== undefined)
                  map[key] = i;
          }
      }
      return map;
  }
  var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
  function init$1(modules, domApi) {
      var i, j, cbs = {};
      var api = domApi !== undefined ? domApi : htmlDomApi;
      for (i = 0; i < hooks.length; ++i) {
          cbs[hooks[i]] = [];
          for (j = 0; j < modules.length; ++j) {
              var hook = modules[j][hooks[i]];
              if (hook !== undefined) {
                  cbs[hooks[i]].push(hook);
              }
          }
      }
      function emptyNodeAt(elm) {
          var id = elm.id ? '#' + elm.id : '';
          var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
          return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
      }
      function createRmCb(childElm, listeners) {
          return function rmCb() {
              if (--listeners === 0) {
                  var parent_1 = api.parentNode(childElm);
                  api.removeChild(parent_1, childElm);
              }
          };
      }
      function createElm(vnode$$1, insertedVnodeQueue) {
          var i, data = vnode$$1.data;
          if (data !== undefined) {
              if (isDef(i = data.hook) && isDef(i = i.init)) {
                  i(vnode$$1);
                  data = vnode$$1.data;
              }
          }
          var children = vnode$$1.children, sel = vnode$$1.sel;
          if (sel === '!') {
              if (isUndef(vnode$$1.text)) {
                  vnode$$1.text = '';
              }
              vnode$$1.elm = api.createComment(vnode$$1.text);
          }
          else if (sel !== undefined) {
              // Parse selector
              var hashIdx = sel.indexOf('#');
              var dotIdx = sel.indexOf('.', hashIdx);
              var hash = hashIdx > 0 ? hashIdx : sel.length;
              var dot = dotIdx > 0 ? dotIdx : sel.length;
              var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
              var elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                  : api.createElement(tag);
              if (hash < dot)
                  elm.setAttribute('id', sel.slice(hash + 1, dot));
              if (dotIdx > 0)
                  elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
              for (i = 0; i < cbs.create.length; ++i)
                  cbs.create[i](emptyNode, vnode$$1);
              if (array(children)) {
                  for (i = 0; i < children.length; ++i) {
                      var ch = children[i];
                      if (ch != null) {
                          api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                      }
                  }
              }
              else if (primitive(vnode$$1.text)) {
                  api.appendChild(elm, api.createTextNode(vnode$$1.text));
              }
              i = vnode$$1.data.hook; // Reuse variable
              if (isDef(i)) {
                  if (i.create)
                      i.create(emptyNode, vnode$$1);
                  if (i.insert)
                      insertedVnodeQueue.push(vnode$$1);
              }
          }
          else {
              vnode$$1.elm = api.createTextNode(vnode$$1.text);
          }
          return vnode$$1.elm;
      }
      function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
          for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (ch != null) {
                  api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
              }
          }
      }
      function invokeDestroyHook(vnode$$1) {
          var i, j, data = vnode$$1.data;
          if (data !== undefined) {
              if (isDef(i = data.hook) && isDef(i = i.destroy))
                  i(vnode$$1);
              for (i = 0; i < cbs.destroy.length; ++i)
                  cbs.destroy[i](vnode$$1);
              if (vnode$$1.children !== undefined) {
                  for (j = 0; j < vnode$$1.children.length; ++j) {
                      i = vnode$$1.children[j];
                      if (i != null && typeof i !== "string") {
                          invokeDestroyHook(i);
                      }
                  }
              }
          }
      }
      function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
          for (; startIdx <= endIdx; ++startIdx) {
              var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
              if (ch != null) {
                  if (isDef(ch.sel)) {
                      invokeDestroyHook(ch);
                      listeners = cbs.remove.length + 1;
                      rm = createRmCb(ch.elm, listeners);
                      for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                          cbs.remove[i_1](ch, rm);
                      if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                          i_1(ch, rm);
                      }
                      else {
                          rm();
                      }
                  }
                  else {
                      api.removeChild(parentElm, ch.elm);
                  }
              }
          }
      }
      function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
          var oldStartIdx = 0, newStartIdx = 0;
          var oldEndIdx = oldCh.length - 1;
          var oldStartVnode = oldCh[0];
          var oldEndVnode = oldCh[oldEndIdx];
          var newEndIdx = newCh.length - 1;
          var newStartVnode = newCh[0];
          var newEndVnode = newCh[newEndIdx];
          var oldKeyToIdx;
          var idxInOld;
          var elmToMove;
          var before;
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (oldStartVnode == null) {
                  oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
              }
              else if (oldEndVnode == null) {
                  oldEndVnode = oldCh[--oldEndIdx];
              }
              else if (newStartVnode == null) {
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (newEndVnode == null) {
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newStartVnode)) {
                  patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                  oldStartVnode = oldCh[++oldStartIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (sameVnode(oldEndVnode, newEndVnode)) {
                  patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newEndVnode)) {
                  patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                  api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                  oldStartVnode = oldCh[++oldStartIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldEndVnode, newStartVnode)) {
                  patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                  api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else {
                  if (oldKeyToIdx === undefined) {
                      oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                  }
                  idxInOld = oldKeyToIdx[newStartVnode.key];
                  if (isUndef(idxInOld)) {
                      api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                      newStartVnode = newCh[++newStartIdx];
                  }
                  else {
                      elmToMove = oldCh[idxInOld];
                      if (elmToMove.sel !== newStartVnode.sel) {
                          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                      }
                      else {
                          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                          oldCh[idxInOld] = undefined;
                          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                      }
                      newStartVnode = newCh[++newStartIdx];
                  }
              }
          }
          if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
              if (oldStartIdx > oldEndIdx) {
                  before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                  addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
              }
              else {
                  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
              }
          }
      }
      function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
          var i, hook;
          if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
              i(oldVnode, vnode$$1);
          }
          var elm = vnode$$1.elm = oldVnode.elm;
          var oldCh = oldVnode.children;
          var ch = vnode$$1.children;
          if (oldVnode === vnode$$1)
              return;
          if (vnode$$1.data !== undefined) {
              for (i = 0; i < cbs.update.length; ++i)
                  cbs.update[i](oldVnode, vnode$$1);
              i = vnode$$1.data.hook;
              if (isDef(i) && isDef(i = i.update))
                  i(oldVnode, vnode$$1);
          }
          if (isUndef(vnode$$1.text)) {
              if (isDef(oldCh) && isDef(ch)) {
                  if (oldCh !== ch)
                      updateChildren(elm, oldCh, ch, insertedVnodeQueue);
              }
              else if (isDef(ch)) {
                  if (isDef(oldVnode.text))
                      api.setTextContent(elm, '');
                  addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
              }
              else if (isDef(oldCh)) {
                  removeVnodes(elm, oldCh, 0, oldCh.length - 1);
              }
              else if (isDef(oldVnode.text)) {
                  api.setTextContent(elm, '');
              }
          }
          else if (oldVnode.text !== vnode$$1.text) {
              api.setTextContent(elm, vnode$$1.text);
          }
          if (isDef(hook) && isDef(i = hook.postpatch)) {
              i(oldVnode, vnode$$1);
          }
      }
      return function patch(oldVnode, vnode$$1) {
          var i, elm, parent;
          var insertedVnodeQueue = [];
          for (i = 0; i < cbs.pre.length; ++i)
              cbs.pre[i]();
          if (!isVnode(oldVnode)) {
              oldVnode = emptyNodeAt(oldVnode);
          }
          if (sameVnode(oldVnode, vnode$$1)) {
              patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
          }
          else {
              elm = oldVnode.elm;
              parent = api.parentNode(elm);
              createElm(vnode$$1, insertedVnodeQueue);
              if (parent !== null) {
                  api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
                  removeVnodes(parent, [oldVnode], 0, 0);
              }
          }
          for (i = 0; i < insertedVnodeQueue.length; ++i) {
              insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
          }
          for (i = 0; i < cbs.post.length; ++i)
              cbs.post[i]();
          return vnode$$1;
      };
  }
  //# sourceMappingURL=snabbdom.js.map

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _class = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function updateClass(oldVnode, vnode) {
      var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
      if (!oldClass && !klass)
          return;
      if (oldClass === klass)
          return;
      oldClass = oldClass || {};
      klass = klass || {};
      for (name in oldClass) {
          if (!klass[name]) {
              elm.classList.remove(name);
          }
      }
      for (name in klass) {
          cur = klass[name];
          if (cur !== oldClass[name]) {
              elm.classList[cur ? 'add' : 'remove'](name);
          }
      }
  }
  exports.classModule = { create: updateClass, update: updateClass };
  exports.default = exports.classModule;
  //# sourceMappingURL=class.js.map
  });

  var classMod = unwrapExports(_class);
  var _class_1 = _class.classModule;

  var style = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
  var nextFrame = function (fn) { raf(function () { raf(fn); }); };
  function setNextFrame(obj, prop, val) {
      nextFrame(function () { obj[prop] = val; });
  }
  function updateStyle(oldVnode, vnode) {
      var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
      if (!oldStyle && !style)
          return;
      if (oldStyle === style)
          return;
      oldStyle = oldStyle || {};
      style = style || {};
      var oldHasDel = 'delayed' in oldStyle;
      for (name in oldStyle) {
          if (!style[name]) {
              if (name[0] === '-' && name[1] === '-') {
                  elm.style.removeProperty(name);
              }
              else {
                  elm.style[name] = '';
              }
          }
      }
      for (name in style) {
          cur = style[name];
          if (name === 'delayed' && style.delayed) {
              for (var name2 in style.delayed) {
                  cur = style.delayed[name2];
                  if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                      setNextFrame(elm.style, name2, cur);
                  }
              }
          }
          else if (name !== 'remove' && cur !== oldStyle[name]) {
              if (name[0] === '-' && name[1] === '-') {
                  elm.style.setProperty(name, cur);
              }
              else {
                  elm.style[name] = cur;
              }
          }
      }
  }
  function applyDestroyStyle(vnode) {
      var style, name, elm = vnode.elm, s = vnode.data.style;
      if (!s || !(style = s.destroy))
          return;
      for (name in style) {
          elm.style[name] = style[name];
      }
  }
  function applyRemoveStyle(vnode, rm) {
      var s = vnode.data.style;
      if (!s || !s.remove) {
          rm();
          return;
      }
      var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
      for (name in style) {
          applied.push(name);
          elm.style[name] = style[name];
      }
      compStyle = getComputedStyle(elm);
      var props = compStyle['transition-property'].split(', ');
      for (; i < props.length; ++i) {
          if (applied.indexOf(props[i]) !== -1)
              amount++;
      }
      elm.addEventListener('transitionend', function (ev) {
          if (ev.target === elm)
              --amount;
          if (amount === 0)
              rm();
      });
  }
  exports.styleModule = {
      create: updateStyle,
      update: updateStyle,
      destroy: applyDestroyStyle,
      remove: applyRemoveStyle
  };
  exports.default = exports.styleModule;
  //# sourceMappingURL=style.js.map
  });

  var stylMod = unwrapExports(style);
  var style_1 = style.styleModule;

  var props = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function updateProps(oldVnode, vnode) {
      var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
      if (!oldProps && !props)
          return;
      if (oldProps === props)
          return;
      oldProps = oldProps || {};
      props = props || {};
      for (key in oldProps) {
          if (!props[key]) {
              delete elm[key];
          }
      }
      for (key in props) {
          cur = props[key];
          old = oldProps[key];
          if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
              elm[key] = cur;
          }
      }
  }
  exports.propsModule = { create: updateProps, update: updateProps };
  exports.default = exports.propsModule;
  //# sourceMappingURL=props.js.map
  });

  var props$1 = unwrapExports(props);
  var props_1 = props.propsModule;

  var attributes = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var xmlNS = 'http://www.w3.org/XML/1998/namespace';
  var colonChar = 58;
  var xChar = 120;
  function updateAttrs(oldVnode, vnode) {
      var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
      if (!oldAttrs && !attrs)
          return;
      if (oldAttrs === attrs)
          return;
      oldAttrs = oldAttrs || {};
      attrs = attrs || {};
      // update modified attributes, add new attributes
      for (key in attrs) {
          var cur = attrs[key];
          var old = oldAttrs[key];
          if (old !== cur) {
              if (cur === true) {
                  elm.setAttribute(key, "");
              }
              else if (cur === false) {
                  elm.removeAttribute(key);
              }
              else {
                  if (key.charCodeAt(0) !== xChar) {
                      elm.setAttribute(key, cur);
                  }
                  else if (key.charCodeAt(3) === colonChar) {
                      // Assume xml namespace
                      elm.setAttributeNS(xmlNS, key, cur);
                  }
                  else if (key.charCodeAt(5) === colonChar) {
                      // Assume xlink namespace
                      elm.setAttributeNS(xlinkNS, key, cur);
                  }
                  else {
                      elm.setAttribute(key, cur);
                  }
              }
          }
      }
      // remove removed attributes
      // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
      // the other option is to remove all attributes with value == undefined
      for (key in oldAttrs) {
          if (!(key in attrs)) {
              elm.removeAttribute(key);
          }
      }
  }
  exports.attributesModule = { create: updateAttrs, update: updateAttrs };
  exports.default = exports.attributesModule;
  //# sourceMappingURL=attributes.js.map
  });

  var attributes$1 = unwrapExports(attributes);
  var attributes_1 = attributes.attributesModule;

  var eventlisteners = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function invokeHandler(handler, vnode, event) {
      if (typeof handler === "function") {
          // call function handler
          handler.call(vnode, event, vnode);
      }
      else if (typeof handler === "object") {
          // call handler with arguments
          if (typeof handler[0] === "function") {
              // special case for single argument for performance
              if (handler.length === 2) {
                  handler[0].call(vnode, handler[1], event, vnode);
              }
              else {
                  var args = handler.slice(1);
                  args.push(event);
                  args.push(vnode);
                  handler[0].apply(vnode, args);
              }
          }
          else {
              // call multiple handlers
              for (var i = 0; i < handler.length; i++) {
                  invokeHandler(handler[i]);
              }
          }
      }
  }
  function handleEvent(event, vnode) {
      var name = event.type, on = vnode.data.on;
      // call event handler(s) if exists
      if (on && on[name]) {
          invokeHandler(on[name], vnode, event);
      }
  }
  function createListener() {
      return function handler(event) {
          handleEvent(event, handler.vnode);
      };
  }
  function updateEventListeners(oldVnode, vnode) {
      var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
      // optimization for reused immutable handlers
      if (oldOn === on) {
          return;
      }
      // remove existing listeners which no longer used
      if (oldOn && oldListener) {
          // if element changed or deleted we remove all existing listeners unconditionally
          if (!on) {
              for (name in oldOn) {
                  // remove listener if element was changed or existing listeners removed
                  oldElm.removeEventListener(name, oldListener, false);
              }
          }
          else {
              for (name in oldOn) {
                  // remove listener if existing listener removed
                  if (!on[name]) {
                      oldElm.removeEventListener(name, oldListener, false);
                  }
              }
          }
      }
      // add new listeners which has not already attached
      if (on) {
          // reuse existing listener or create new
          var listener = vnode.listener = oldVnode.listener || createListener();
          // update vnode for listener
          listener.vnode = vnode;
          // if element changed or added we add all needed listeners unconditionally
          if (!oldOn) {
              for (name in on) {
                  // add listener if element was changed or new listeners added
                  elm.addEventListener(name, listener, false);
              }
          }
          else {
              for (name in on) {
                  // add listener if new listener added
                  if (!oldOn[name]) {
                      elm.addEventListener(name, listener, false);
                  }
              }
          }
      }
  }
  exports.eventListenersModule = {
      create: updateEventListeners,
      update: updateEventListeners,
      destroy: updateEventListeners
  };
  exports.default = exports.eventListenersModule;
  //# sourceMappingURL=eventlisteners.js.map
  });

  var eventlisteners$1 = unwrapExports(eventlisteners);
  var eventlisteners_1 = eventlisteners.eventListenersModule;

  var vnode_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function vnode(sel, data, children, text, elm) {
      var key = data === undefined ? undefined : data.key;
      return { sel: sel, data: data, children: children,
          text: text, elm: elm, key: key };
  }
  exports.vnode = vnode;
  exports.default = vnode;
  //# sourceMappingURL=vnode.js.map
  });

  unwrapExports(vnode_1);
  var vnode_2 = vnode_1.vnode;

  var htmldomapi = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function createElement(tagName) {
      return document.createElement(tagName);
  }
  function createElementNS(namespaceURI, qualifiedName) {
      return document.createElementNS(namespaceURI, qualifiedName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(elm) {
      return elm.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function getTextContent(node) {
      return node.textContent;
  }
  function isElement(node) {
      return node.nodeType === 1;
  }
  function isText(node) {
      return node.nodeType === 3;
  }
  function isComment(node) {
      return node.nodeType === 8;
  }
  exports.htmlDomApi = {
      createElement: createElement,
      createElementNS: createElementNS,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      getTextContent: getTextContent,
      isElement: isElement,
      isText: isText,
      isComment: isComment,
  };
  exports.default = exports.htmlDomApi;
  //# sourceMappingURL=htmldomapi.js.map
  });

  unwrapExports(htmldomapi);
  var htmldomapi_1 = htmldomapi.htmlDomApi;

  var tovnode = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  function toVNode(node, domApi) {
      var api = domApi !== undefined ? domApi : htmldomapi.default;
      var text;
      if (api.isElement(node)) {
          var id = node.id ? '#' + node.id : '';
          var cn = node.getAttribute('class');
          var c = cn ? '.' + cn.split(' ').join('.') : '';
          var sel = api.tagName(node).toLowerCase() + id + c;
          var attrs = {};
          var children = [];
          var name_1;
          var i = void 0, n = void 0;
          var elmAttrs = node.attributes;
          var elmChildren = node.childNodes;
          for (i = 0, n = elmAttrs.length; i < n; i++) {
              name_1 = elmAttrs[i].nodeName;
              if (name_1 !== 'id' && name_1 !== 'class') {
                  attrs[name_1] = elmAttrs[i].nodeValue;
              }
          }
          for (i = 0, n = elmChildren.length; i < n; i++) {
              children.push(toVNode(elmChildren[i]));
          }
          return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
      }
      else if (api.isText(node)) {
          text = api.getTextContent(node);
          return vnode_1.default(undefined, undefined, undefined, text, node);
      }
      else if (api.isComment(node)) {
          text = api.getTextContent(node);
          return vnode_1.default('!', {}, [], text, node);
      }
      else {
          return vnode_1.default('', {}, [], undefined, node);
      }
  }
  exports.toVNode = toVNode;
  exports.default = toVNode;
  //# sourceMappingURL=tovnode.js.map
  });

  unwrapExports(tovnode);
  var tovnode_1 = tovnode.toVNode;

  function I18n$1 (key) {
    return I18n[key];
  }

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

  var _patch = init$1([classMod, stylMod, props$1, attributes$1, eventlisteners$1]);

  // NOTE: 先把所有的DOM操作放入这里处理，便于以后统一切换为其它处理。
  // warning: 如果每个小地方的修改都要调用一次patch, 这样似乎并不能更快，是否还是要引入周期的概念，让所有的修改在一个周期里面完成。
  // warning: 查看源码，似乎有现成的序列处理。

  var Render = function () {
    function Render(theme) {
      classCallCheck(this, Render);

      this.theme = theme;
    }

    Render.prototype.appendElTo = function appendElTo() {};

    Render.prototype.patch = function patch(oldVnode, newVnode) {
      _patch(oldVnode, newVnode);
    };

    Render.prototype.h = function h$$1() {
      return h.apply(undefined, arguments);
    };

    Render.prototype.toVNode = function toVNode$$1() {
      return tovnode_1.apply(undefined, arguments);
    };

    Render.prototype.i18n = function i18n(key) {
      return I18n$1(key);
    };

    return Render;
  }();

  var ajax = {
    post: function post(url, params) {
      var xhr = _createXhr();
      xhr.open('POST', url);
      xhr.onprogress = params.progress;
      xhr.onload = params.load;
      if (xhr.upload && params.progress) {
        xhr.upload.onprogress = throttle(function (data) {
          if (xhr.readyState === 1) {
            var progress = Math.ceil(data.loaded / data.total * 100) + '%';
            params.progress(progress, data.loaded);
          }
        }, 200);
        xhr.upload.onloadstart = params.loadStart;
        xhr.upload.onloadEnd = params.loadEnd;
        xhr.upload.onerror = params.error;
        xhr.upload.onabort = params.abort;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            var res = void 0;
            try {
              res = JSON.parse(xhr.responseText);
            } catch (e) {
              res = xhr.responseText;
            }
            // todo: 这里可能有不返回100%情况。
            params.progress('100%'); // 因为在进度里面做了throttle，并且延迟了200ms，所以可能出现无法返回正确进度。
            params.success(res);
          } else {
            params.error(xhr);
          }
        }
      };
      xhr.send(params.data);

      return xhr;
    }
  };

  function _createXhr() {
    return new XMLHttpRequest();
  }

  function throttle(fn, delay) {
    var id, args;

    return function _throttle() {
      args = arguments;

      if (!id) {
        fn.apply(window, args);
        id = setTimeout(function () {
          id = 0;
          fn.apply(window, args);
        }, delay);
      }
    };
  }

  function Events() {
    this.listeners = {};
  }
  Events.prototype.on = function (key, fn) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
      return;
    }
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    var listeners = this.listeners[key];
    var index = listeners.indexOf(fn);
    if (index !== -1) {
      listeners[index] = fn;
    } else {
      listeners.push(fn);
    }
  };

  Events.prototype.trigger = function (key) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var fns = this.listeners[key];
    if (fns && fns.length > 0) {
      fns.forEach(function (fn) {
        fn.apply(null, args);
      });
    }
  };

  Events.prototype.remove = function (key, fn) {
    var fns = this.listeners[key];
    if (fns && fns.length > 0) {
      var index = fns.indexOf(fn);
      if (index !== -1) {
        return fns.splice(index, 1);
      }
    }
  };

  /**
   * 使用ajax的方式上传文件
   * @author xutao
   * @example
   * let uploader = ajaxUploader(file)
   * uploader.status = 0
   * uploader.on('progress', function () {})
   * uploader.on('start', function () {})
   * uploader.on('error', function () {})
   */

  // 自定义一个上传队列
  // NOTE: 上传队列是否会被堵死？
  // 对于每一个正在上传的uploader，是否需要心跳来保证上传没有被堵死？
  var UPLOADER_QUEUE_STATUS = 0;
  var UPLOADER_QUEUE = Object.freeze({
    push: function push(uploader) {
      this.list.push(uploader);
      this.run();
    },
    pop: function pop() {
      UPLOADER_QUEUE_STATUS = 0;
      this.list.shift();
      this.run();
    },
    list: [],
    run: function run() {
      var _this = this;

      if (UPLOADER_QUEUE_STATUS === 1 || this.length() === 0) {
        return;
      }
      UPLOADER_QUEUE_STATUS = 1;
      var uploader = this.list[0];
      uploader.on('end', function () {
        _this.pop();
      });
      uploader.start();
    },
    length: function length() {
      return this.list.length;
    }
  });

  /**
   * uploader
   * 调用上传功能
   */

  var Uploader = function (_Events) {
    inherits(Uploader, _Events);

    function Uploader(file) {
      classCallCheck(this, Uploader);

      var _this2 = possibleConstructorReturn(this, _Events.call(this));

      _this2.file = file;
      return _this2;
    }

    Uploader.prototype.start = function start() {
      var _this3 = this;

      var form = new FormData();
      form.append('Content-Type', 'application/octet-stream');
      form.append('attach', this.file);
      this.xhr = ajax.post('http://localhost:3000/upload', {
        data: form,
        progress: function progress(_progress, loaded) {
          _this3.trigger('progress', _progress, loaded);
        },
        load: function load(data) {
          _this3.trigger('end');
        },
        success: function success(data) {
          _this3.trigger('success', data);
        },
        error: function error(data) {
          _this3.trigger('error', data);
        },
        abort: function abort(data) {
          console.log('abort');
        }
      });
    };

    Uploader.prototype.abort = function abort() {
      this.xhr.abort();
      this.trigger('end');
    };

    return Uploader;
  }(Events);

  function ajaxUploader (file) {
    var uploader = new Uploader(file);
    UPLOADER_QUEUE.push(uploader);
    return uploader;
  }

  var sparkMd5 = createCommonjsModule(function (module, exports) {
  (function (factory) {
      {
          // Node/CommonJS
          module.exports = factory();
      }
  }(function (undefined) {

      /*
       * Fastest md5 implementation around (JKM md5).
       * Credits: Joseph Myers
       *
       * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
       * @see http://jsperf.com/md5-shootout/7
       */

      /* this function is much faster,
        so if possible we use it. Some IEs
        are the only ones I know of that
        need the idiotic second function,
        generated by an if clause.  */
      var hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

      function md5cycle(x, k) {
          var a = x[0],
              b = x[1],
              c = x[2],
              d = x[3];

          a += (b & c | ~b & d) + k[0] - 680876936 | 0;
          a  = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[1] - 389564586 | 0;
          d  = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[2] + 606105819 | 0;
          c  = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
          b  = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[4] - 176418897 | 0;
          a  = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
          d  = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
          c  = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[7] - 45705983 | 0;
          b  = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
          a  = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
          d  = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[10] - 42063 | 0;
          c  = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
          b  = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
          a  = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[13] - 40341101 | 0;
          d  = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
          c  = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
          b  = (b << 22 | b >>> 10) + c | 0;

          a += (b & d | c & ~d) + k[1] - 165796510 | 0;
          a  = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
          d  = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[11] + 643717713 | 0;
          c  = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[0] - 373897302 | 0;
          b  = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[5] - 701558691 | 0;
          a  = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[10] + 38016083 | 0;
          d  = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[15] - 660478335 | 0;
          c  = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[4] - 405537848 | 0;
          b  = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[9] + 568446438 | 0;
          a  = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
          d  = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[3] - 187363961 | 0;
          c  = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
          b  = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
          a  = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[2] - 51403784 | 0;
          d  = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
          c  = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
          b  = (b << 20 | b >>> 12) + c | 0;

          a += (b ^ c ^ d) + k[5] - 378558 | 0;
          a  = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
          d  = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
          c  = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[14] - 35309556 | 0;
          b  = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
          a  = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
          d  = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[7] - 155497632 | 0;
          c  = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
          b  = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[13] + 681279174 | 0;
          a  = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[0] - 358537222 | 0;
          d  = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[3] - 722521979 | 0;
          c  = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[6] + 76029189 | 0;
          b  = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[9] - 640364487 | 0;
          a  = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[12] - 421815835 | 0;
          d  = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[15] + 530742520 | 0;
          c  = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[2] - 995338651 | 0;
          b  = (b << 23 | b >>> 9) + c | 0;

          a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
          a  = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
          d  = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
          c  = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
          b  = (b << 21 |b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
          a  = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
          d  = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
          c  = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
          b  = (b << 21 |b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
          a  = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
          d  = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
          c  = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
          b  = (b << 21 |b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
          a  = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
          d  = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
          c  = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
          b  = (b << 21 | b >>> 11) + c | 0;

          x[0] = a + x[0] | 0;
          x[1] = b + x[1] | 0;
          x[2] = c + x[2] | 0;
          x[3] = d + x[3] | 0;
      }

      function md5blk(s) {
          var md5blks = [],
              i; /* Andy King said do it this way. */

          for (i = 0; i < 64; i += 4) {
              md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
          }
          return md5blks;
      }

      function md5blk_array(a) {
          var md5blks = [],
              i; /* Andy King said do it this way. */

          for (i = 0; i < 64; i += 4) {
              md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
          }
          return md5blks;
      }

      function md51(s) {
          var n = s.length,
              state = [1732584193, -271733879, -1732584194, 271733878],
              i,
              length,
              tail,
              tmp,
              lo,
              hi;

          for (i = 64; i <= n; i += 64) {
              md5cycle(state, md5blk(s.substring(i - 64, i)));
          }
          s = s.substring(i - 64);
          length = s.length;
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (i = 0; i < length; i += 1) {
              tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
          }
          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
              md5cycle(state, tail);
              for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
              }
          }

          // Beware that the final length might not fit in 32 bits so we take care of that
          tmp = n * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;

          tail[14] = lo;
          tail[15] = hi;

          md5cycle(state, tail);
          return state;
      }

      function md51_array(a) {
          var n = a.length,
              state = [1732584193, -271733879, -1732584194, 271733878],
              i,
              length,
              tail,
              tmp,
              lo,
              hi;

          for (i = 64; i <= n; i += 64) {
              md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
          }

          // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
          // containing the last element of the parent array if the sub array specified starts
          // beyond the length of the parent array - weird.
          // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
          a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

          length = a.length;
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (i = 0; i < length; i += 1) {
              tail[i >> 2] |= a[i] << ((i % 4) << 3);
          }

          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
              md5cycle(state, tail);
              for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
              }
          }

          // Beware that the final length might not fit in 32 bits so we take care of that
          tmp = n * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;

          tail[14] = lo;
          tail[15] = hi;

          md5cycle(state, tail);

          return state;
      }

      function rhex(n) {
          var s = '',
              j;
          for (j = 0; j < 4; j += 1) {
              s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
          }
          return s;
      }

      function hex(x) {
          var i;
          for (i = 0; i < x.length; i += 1) {
              x[i] = rhex(x[i]);
          }
          return x.join('');
      }

      // In some cases the fast add32 function cannot be used..
      if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') ;

      // ---------------------------------------------------

      /**
       * ArrayBuffer slice polyfill.
       *
       * @see https://github.com/ttaubert/node-arraybuffer-slice
       */

      if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
          (function () {
              function clamp(val, length) {
                  val = (val | 0) || 0;

                  if (val < 0) {
                      return Math.max(val + length, 0);
                  }

                  return Math.min(val, length);
              }

              ArrayBuffer.prototype.slice = function (from, to) {
                  var length = this.byteLength,
                      begin = clamp(from, length),
                      end = length,
                      num,
                      target,
                      targetArray,
                      sourceArray;

                  if (to !== undefined) {
                      end = clamp(to, length);
                  }

                  if (begin > end) {
                      return new ArrayBuffer(0);
                  }

                  num = end - begin;
                  target = new ArrayBuffer(num);
                  targetArray = new Uint8Array(target);

                  sourceArray = new Uint8Array(this, begin, num);
                  targetArray.set(sourceArray);

                  return target;
              };
          })();
      }

      // ---------------------------------------------------

      /**
       * Helpers.
       */

      function toUtf8(str) {
          if (/[\u0080-\uFFFF]/.test(str)) {
              str = unescape(encodeURIComponent(str));
          }

          return str;
      }

      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
          var length = str.length,
             buff = new ArrayBuffer(length),
             arr = new Uint8Array(buff),
             i;

          for (i = 0; i < length; i += 1) {
              arr[i] = str.charCodeAt(i);
          }

          return returnUInt8Array ? arr : buff;
      }

      function arrayBuffer2Utf8Str(buff) {
          return String.fromCharCode.apply(null, new Uint8Array(buff));
      }

      function concatenateArrayBuffers(first, second, returnUInt8Array) {
          var result = new Uint8Array(first.byteLength + second.byteLength);

          result.set(new Uint8Array(first));
          result.set(new Uint8Array(second), first.byteLength);

          return returnUInt8Array ? result : result.buffer;
      }

      function hexToBinaryString(hex) {
          var bytes = [],
              length = hex.length,
              x;

          for (x = 0; x < length - 1; x += 2) {
              bytes.push(parseInt(hex.substr(x, 2), 16));
          }

          return String.fromCharCode.apply(String, bytes);
      }

      // ---------------------------------------------------

      /**
       * SparkMD5 OOP implementation.
       *
       * Use this class to perform an incremental md5, otherwise use the
       * static methods instead.
       */

      function SparkMD5() {
          // call reset to init the instance
          this.reset();
      }

      /**
       * Appends a string.
       * A conversion will be applied if an utf8 string is detected.
       *
       * @param {String} str The string to be appended
       *
       * @return {SparkMD5} The instance itself
       */
      SparkMD5.prototype.append = function (str) {
          // Converts the string to utf8 bytes if necessary
          // Then append as binary
          this.appendBinary(toUtf8(str));

          return this;
      };

      /**
       * Appends a binary string.
       *
       * @param {String} contents The binary string to be appended
       *
       * @return {SparkMD5} The instance itself
       */
      SparkMD5.prototype.appendBinary = function (contents) {
          this._buff += contents;
          this._length += contents.length;

          var length = this._buff.length,
              i;

          for (i = 64; i <= length; i += 64) {
              md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
          }

          this._buff = this._buff.substring(i - 64);

          return this;
      };

      /**
       * Finishes the incremental computation, reseting the internal state and
       * returning the result.
       *
       * @param {Boolean} raw True to get the raw string, false to get the hex string
       *
       * @return {String} The result
       */
      SparkMD5.prototype.end = function (raw) {
          var buff = this._buff,
              length = buff.length,
              i,
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              ret;

          for (i = 0; i < length; i += 1) {
              tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
          }

          this._finish(tail, length);
          ret = hex(this._hash);

          if (raw) {
              ret = hexToBinaryString(ret);
          }

          this.reset();

          return ret;
      };

      /**
       * Resets the internal state of the computation.
       *
       * @return {SparkMD5} The instance itself
       */
      SparkMD5.prototype.reset = function () {
          this._buff = '';
          this._length = 0;
          this._hash = [1732584193, -271733879, -1732584194, 271733878];

          return this;
      };

      /**
       * Gets the internal state of the computation.
       *
       * @return {Object} The state
       */
      SparkMD5.prototype.getState = function () {
          return {
              buff: this._buff,
              length: this._length,
              hash: this._hash
          };
      };

      /**
       * Gets the internal state of the computation.
       *
       * @param {Object} state The state
       *
       * @return {SparkMD5} The instance itself
       */
      SparkMD5.prototype.setState = function (state) {
          this._buff = state.buff;
          this._length = state.length;
          this._hash = state.hash;

          return this;
      };

      /**
       * Releases memory used by the incremental buffer and other additional
       * resources. If you plan to use the instance again, use reset instead.
       */
      SparkMD5.prototype.destroy = function () {
          delete this._hash;
          delete this._buff;
          delete this._length;
      };

      /**
       * Finish the final calculation based on the tail.
       *
       * @param {Array}  tail   The tail (will be modified)
       * @param {Number} length The length of the remaining buffer
       */
      SparkMD5.prototype._finish = function (tail, length) {
          var i = length,
              tmp,
              lo,
              hi;

          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
              md5cycle(this._hash, tail);
              for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
              }
          }

          // Do the final computation based on the tail and length
          // Beware that the final length may not fit in 32 bits so we take care of that
          tmp = this._length * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;

          tail[14] = lo;
          tail[15] = hi;
          md5cycle(this._hash, tail);
      };

      /**
       * Performs the md5 hash on a string.
       * A conversion will be applied if utf8 string is detected.
       *
       * @param {String}  str The string
       * @param {Boolean} raw True to get the raw string, false to get the hex string
       *
       * @return {String} The result
       */
      SparkMD5.hash = function (str, raw) {
          // Converts the string to utf8 bytes if necessary
          // Then compute it using the binary function
          return SparkMD5.hashBinary(toUtf8(str), raw);
      };

      /**
       * Performs the md5 hash on a binary string.
       *
       * @param {String}  content The binary string
       * @param {Boolean} raw     True to get the raw string, false to get the hex string
       *
       * @return {String} The result
       */
      SparkMD5.hashBinary = function (content, raw) {
          var hash = md51(content),
              ret = hex(hash);

          return raw ? hexToBinaryString(ret) : ret;
      };

      // ---------------------------------------------------

      /**
       * SparkMD5 OOP implementation for array buffers.
       *
       * Use this class to perform an incremental md5 ONLY for array buffers.
       */
      SparkMD5.ArrayBuffer = function () {
          // call reset to init the instance
          this.reset();
      };

      /**
       * Appends an array buffer.
       *
       * @param {ArrayBuffer} arr The array to be appended
       *
       * @return {SparkMD5.ArrayBuffer} The instance itself
       */
      SparkMD5.ArrayBuffer.prototype.append = function (arr) {
          var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
              length = buff.length,
              i;

          this._length += arr.byteLength;

          for (i = 64; i <= length; i += 64) {
              md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
          }

          this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

          return this;
      };

      /**
       * Finishes the incremental computation, reseting the internal state and
       * returning the result.
       *
       * @param {Boolean} raw True to get the raw string, false to get the hex string
       *
       * @return {String} The result
       */
      SparkMD5.ArrayBuffer.prototype.end = function (raw) {
          var buff = this._buff,
              length = buff.length,
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              i,
              ret;

          for (i = 0; i < length; i += 1) {
              tail[i >> 2] |= buff[i] << ((i % 4) << 3);
          }

          this._finish(tail, length);
          ret = hex(this._hash);

          if (raw) {
              ret = hexToBinaryString(ret);
          }

          this.reset();

          return ret;
      };

      /**
       * Resets the internal state of the computation.
       *
       * @return {SparkMD5.ArrayBuffer} The instance itself
       */
      SparkMD5.ArrayBuffer.prototype.reset = function () {
          this._buff = new Uint8Array(0);
          this._length = 0;
          this._hash = [1732584193, -271733879, -1732584194, 271733878];

          return this;
      };

      /**
       * Gets the internal state of the computation.
       *
       * @return {Object} The state
       */
      SparkMD5.ArrayBuffer.prototype.getState = function () {
          var state = SparkMD5.prototype.getState.call(this);

          // Convert buffer to a string
          state.buff = arrayBuffer2Utf8Str(state.buff);

          return state;
      };

      /**
       * Gets the internal state of the computation.
       *
       * @param {Object} state The state
       *
       * @return {SparkMD5.ArrayBuffer} The instance itself
       */
      SparkMD5.ArrayBuffer.prototype.setState = function (state) {
          // Convert string to buffer
          state.buff = utf8Str2ArrayBuffer(state.buff, true);

          return SparkMD5.prototype.setState.call(this, state);
      };

      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

      /**
       * Performs the md5 hash on an array buffer.
       *
       * @param {ArrayBuffer} arr The array buffer
       * @param {Boolean}     raw True to get the raw string, false to get the hex one
       *
       * @return {String} The result
       */
      SparkMD5.ArrayBuffer.hash = function (arr, raw) {
          var hash = md51_array(new Uint8Array(arr)),
              ret = hex(hash);

          return raw ? hexToBinaryString(ret) : ret;
      };

      return SparkMD5;
  }));
  });

  /**
   * 截取流
   * @param {blob} blob 流对象
   * @param {number} startByte 截取开始部分
   * @param {number} endByte 截取结束部分
   */
  function blobSlice(blob, startByte, endByte) {

    if (blob.slice) {
      return blob.slice(startByte, endByte);
    }
    // 兼容firefox
    if (blob.mozSlice) {
      return blob.mozSlice(startByte, endByte);
    }
    // 兼容webkit
    if (blob.webkitSlice) {
      return blob.webkitSlice(startByte, endByte);
    }
    return null;
  }

  /**
   * 使用sparkMD5获取文件的md5值。
   * @param {*} file file对象
   * @param {*} cb 回调函数
   */
  function getFileMd5(file, cb) {
    var chunkSize = 1024 * 1024 * 2;
    var chunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;
    var spark = new sparkMd5.ArrayBuffer();
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
      spark.append(e.target.result);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        cb(spark.end());
      }
    };

    fileReader.onerror = function () {};

    function loadNext() {
      var start = currentChunk * chunkSize;
      var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice(file, start, end));
    }

    loadNext();
  }

  /**
   * @file file-sdk
   * 通过传入file对象对文件进行处理，然后进行上传。
   * 1）计算文件的MD5 - md5.js(队列处理)
   * 2）认证是否有上传资格 - auth.js
   * 3）将文件进行分片 - section.js(队列处理)
   * 4）上传文件 - trans.js(队列处理)
   */

  var FileSdk = function (_Events) {
    inherits(FileSdk, _Events);

    function FileSdk(file) {
      classCallCheck(this, FileSdk);

      var _this = possibleConstructorReturn(this, _Events.call(this));

      _this.file = file;
      return _this;
    }

    FileSdk.prototype.start = function start() {
      this.getFileMd5();
    };

    FileSdk.prototype.getFileMd5 = function getFileMd5$$1() {
      var _this2 = this;

      this.trigger('md5');
      getFileMd5(this.file, function (md5) {
        _this2.trigger('auth');
        setTimeout(function () {
          _this2.upload();
        }, 3000);
      });
    };

    FileSdk.prototype.upload = function upload() {
      var _this3 = this;

      var uploader = ajaxUploader(this.file);
      uploader.on('progress', function (data, loaded) {
        _this3.trigger('progress', data, loaded);
      });
      uploader.on('success', function (data) {
        _this3.trigger('success', data);
      });
    };

    return FileSdk;
  }(Events);

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  var defineProperty$1 = (function() {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty = defineProperty$1;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty) {
      _defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$2.call(object, key) && eq_1(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }
    return object;
  }

  var _copyObject = copyObject;

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  var _apply = apply;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return _apply(func, this, otherArgs);
    };
  }

  var _overRest = overRest;

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  var constant_1 = constant;

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
    return _defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant_1(string),
      'writable': true
    });
  };

  var _baseSetToString = baseSetToString;

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  var _shortOut = shortOut;

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = _shortOut(_baseSetToString);

  var _setToString = setToString;

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return _setToString(_overRest(func, start, identity_1), func + '');
  }

  var _baseRest = baseRest;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  var isLength_1 = isLength;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  var _isIndex = isIndex;

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject_1(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike_1(object) && _isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq_1(object[index], value);
    }
    return false;
  }

  var _isIterateeCall = isIterateeCall;

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return _baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  var _createAssigner = createAssigner;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$3.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike_1(value) &&
      isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$4.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             _isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Assigns own enumerable string keyed properties of source objects to the
   * destination object. Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assignIn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assign({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3 }
   */
  var assign = _createAssigner(function(object, source) {
    if (_isPrototype(source) || isArrayLike_1(source)) {
      _copyObject(source, keys_1(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty$6.call(source, key)) {
        _assignValue(object, key, source[key]);
      }
    }
  });

  var assign_1 = assign;

  var mixin = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  /**
   * Mixins an object into the classes prototype.
   * @export
   * @param {...Object[]} srcs
   * @returns {ClassDecorator}
   * @example
   *
   * const myMixin = {
   *   blorg: () => 'blorg!'
   * }
   *
   * @Mixin(myMixin)
   * class MyClass {}
   *
   * const myClass = new MyClass();
   *
   * myClass.blorg(); // => 'blorg!'
   */
  function Mixin() {
      var srcs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          srcs[_i] = arguments[_i];
      }
      return (function (target) {
          assign_1.apply(void 0, [target.prototype].concat(srcs));
          return target;
      });
  }
  exports.Mixin = Mixin;
  exports.mixin = Mixin;
  exports.default = Mixin;
  //# sourceMappingURL=mixin.js.map
  });

  var mixin$1 = unwrapExports(mixin);
  var mixin_1 = mixin.Mixin;
  var mixin_2 = mixin.mixin;

  var _dec, _class$1;

  /**
   * 进度工具
   * todo: mixin的用法很别扭。
   * 是用mixin一个对象，
   */
  var UiComponents = (_dec = mixin$1(Events.prototype), _dec(_class$1 = function (_Render) {
    inherits(UiComponents, _Render);

    function UiComponents(theme) {
      classCallCheck(this, UiComponents);

      var _this = possibleConstructorReturn(this, _Render.call(this, theme));

      _this.listeners = {};
      return _this;
    }

    UiComponents.prototype.getEl = function getEl() {
      return this.el;
    };

    return UiComponents;
  }(Render)) || _class$1);

  (function (window) {
    var svgSprite = '<svg><symbol id="icon-waiting" viewBox="0 0 1024 1024"><path d="M511.998465 65.279772c-246.706845 0-446.708971 200.01543-446.708971 446.709995 0 246.700705 200.001103 446.731484 446.708971 446.731484 246.708891 0 446.711018-200.030779 446.711018-446.731484C958.709483 265.295202 758.707356 65.279772 511.998465 65.279772zM603.347986 360.490308l41.326221-41.326221c13.770632-18.351973 41.326221-18.351973 59.691497 0 18.365276 13.777795 18.365276 41.326221 0 59.691497l-41.326221 41.311895c-13.770632 18.365276-41.311895 18.365276-59.691497 0C584.997036 406.389684 584.997036 378.855584 603.347986 360.490308zM236.062925 525.766538l0-27.541263c0-18.358113 13.770632-27.548426 27.541263-27.548426l91.842755 0c13.770632 0 27.526937 13.770632 27.526937 27.548426l0 27.541263c0 18.365276-13.756305 27.555589-32.136931 27.555589l-87.233783 0C249.833557 553.322128 236.062925 539.53717 236.062925 525.766538zM419.705456 663.502529l-41.311895 41.326221c-13.784958 18.365276-41.326221 18.365276-59.69252 0-18.35095-13.770632-18.35095-41.326221 0-59.691497l41.326221-41.327244c13.770632-18.35095 41.311895-18.35095 59.677171 0C438.070732 617.59599 438.070732 645.137253 419.705456 663.502529zM419.705456 420.167478c-18.365276 18.365276-45.906539 18.365276-59.677171 0l-41.326221-41.311895c-18.35095-13.784958-18.35095-41.319058 0-59.691497 13.770632-18.351973 41.326221-18.351973 59.69252 0l41.311895 41.326221C438.070732 374.260939 438.070732 401.808342 419.705456 420.167478zM552.861128 759.925602c0 13.769608-13.784958 27.54024-27.555589 27.54024l-27.541263 0c-13.771655 0-27.556613-13.770632-27.556613-27.54024l0-87.233783c0-13.784958 13.785981-27.555589 27.556613-27.555589l27.541263 0c18.365276 0 27.555589 9.174963 27.555589 27.555589L552.861128 759.925602zM552.861128 351.299995c0 13.770632-13.784958 27.555589-27.555589 27.555589l-27.541263 0c-13.771655 0-27.556613-13.784958-27.556613-27.555589l0-87.225597c0-13.778818 9.190313-27.549449 27.556613-27.549449l27.541263 0c18.365276 0 27.555589 13.770632 27.555589 27.549449L552.861128 351.299995zM704.365704 704.82875c-13.770632 18.365276-41.326221 18.365276-59.691497 0l-41.326221-41.326221c-18.351973-13.770632-18.351973-41.311895 0-59.69252 13.784958-18.35095 41.326221-18.35095 59.691497 0l41.326221 41.327244C722.73098 658.907884 722.73098 686.46245 704.365704 704.82875zM787.003819 525.766538c0 13.770632-13.770632 27.555589-27.541263 27.555589l-87.247086 0c-13.770632 0-27.541263-13.784958-27.541263-27.555589l0-27.541263c0-13.777795 13.770632-27.548426 27.541263-27.548426l87.247086 0c13.770632 0 27.541263 9.18929 27.541263 27.548426L787.003819 525.766538z" fill="#E6A23C" ></path></symbol><symbol id="icon-contine" viewBox="0 0 1024 1024"><path d="M512 68.191078c-245.204631 0-443.808922 198.60429-443.808922 443.808922s198.60429 443.808922 443.808922 443.808922 443.808922-198.60429 443.808922-443.808922S757.203608 68.191078 512 68.191078zM423.23842 711.713554 423.23842 312.285422l266.284739 199.713554L423.23842 711.713554z" fill="#61d894" ></path></symbol><symbol id="icon-zanting" viewBox="0 0 1024 1024"><path d="M686.480358 119.560026c0-32.377408 26.325575-58.644655 58.644655-58.644655 32.386618 0 58.645678 26.420743 58.645678 58.644655l0 781.930779c0 32.376385-26.325575 58.644655-58.645678 58.644655-32.385595 0-58.644655-26.419719-58.644655-58.644655L686.480358 119.560026zM217.321072 119.560026c0-32.377408 26.325575-58.644655 58.645678-58.644655 32.385595 0 58.644655 26.420743 58.644655 58.644655l0 781.930779c0 32.376385-26.325575 58.644655-58.644655 58.644655-32.385595 0-58.645678-26.419719-58.645678-58.644655L217.321072 119.560026z" fill="#5f6f93" ></path></symbol><symbol id="icon-pause" viewBox="0 0 1024 1024"><path d="M512.26427999 54.53028029c-250.79523995 0-456.0562561 205.23054789-456.0562561 456.05360617 0 250.79656427 205.26101614 456.0562561 456.0562561 456.05625609 250.82570819 0 456.0562561-205.25969184 456.0562561-456.05625609C968.32053479 259.76215249 763.08998689 54.53028029 512.26427999 54.53028029M466.69958794 692.98969738l-91.21681463 0 0-364.83944017 91.21681463 0L466.69958794 692.98969738zM649.1345415 692.98969738l-91.21681462 0 0-364.83944017 91.21681462 0L649.1345415 692.98969738z" fill="#1296db" ></path></symbol><symbol id="icon-delete" viewBox="0 0 1024 1024"><path d="M512 62C262.25 62 62 262.25 62 512s200.25 450 450 450c249.69375 0 450-200.25 450-450S761.69375 62 512 62L512 62zM737 674L673.94375 737 512 575 349.94375 737 287 674 448.94375 512 287 350 349.94375 287 512 449 673.94375 287 737 350 574.94375 512 737 674 737 674zM737 674" fill="#F56C6C" ></path></symbol><symbol id="icon-jixu" viewBox="0 0 1024 1024"><path d="M838.22364445 467.98569836L237.55788683 95.15867614c-33.65799466-20.71261275-77.6722963 5.17815349-77.6722963 44.01430164v745.65404444c0 38.83614815 44.01430164 64.72691317 77.6722963 44.01430164l598.07668148-372.82702222c36.24707201-18.12353539 36.24707201-69.90506667 2.58907614-88.02860328z" fill="#5f6f93" ></path></symbol><symbol id="icon-success" viewBox="0 0 1024 1024"><path d="M965.2594659 512c0 250.27463749-202.82771939 453.2594659-453.2594659 453.2594659-156.4805643 0-294.42226658-79.18293616-375.80472874-199.84264841-48.8608991-72.27014015-77.45473717-159.46563532-77.45473716-253.41681749 0-250.27463749 202.82771939-453.2594659 453.2594659-453.2594659S965.2594659 261.72536251 965.2594659 512z" fill="#67C23A" ></path><path d="M455.12654189 702.25899937c-9.74075802 0-19.63862503-2.98507101-27.96540206-9.112322l-149.09644129-109.81919123c-20.89549705-15.39668203-25.45165805-44.93317409-10.05497602-65.82867113s44.93317409-25.45165805 65.82867113-10.05497601l116.10355122 85.46729616 237.39169947-243.51895048c18.22464404-18.69597103 48.07535409-19.01018903 66.61421614-0.78554501 18.69597103 18.22464404 19.01018903 48.07535409 0.78554501 66.61421614L488.90497695 687.96208035c-9.26943102 9.42654002-21.52393302 14.29691903-33.77843506 14.29691902z" fill="#FFFFFF" ></path></symbol><symbol id="icon-close" viewBox="0 0 1024 1024"><path d="M948.90666667 184.32l-109.22666667-109.22666667-327.68 327.68-327.68-327.68-109.22666667 109.22666667 327.68 327.68-327.68 327.68 109.22666667 109.22666667 327.68-327.68 327.68 327.68 109.22666667-109.22666667-327.68-327.68 327.68-327.68z" fill="#5f6f93" ></path></symbol><symbol id="icon-doc" viewBox="0 0 1024 1024"><path d="M959.16 187.68c2.14-23.23-16.1-41.26-39.32-38.92-108.92-1.76-217.84 0-326.84-0.61V66.64h-60.95C375.86 94.45 219.57 121 63.38 148.35v713c155.38 27.2 310.85 53.18 465.93 81.51H593v-81.51c102 0 203.87-0.2 305.86 0.31 17.32-0.82 36.58 0.51 51.45-10.09 11.92-18.24 8.87-41.06 9.89-61.64-1.45-200.72 0.69-401.53-1.04-602.25z" fill="#2A5699" ></path><path d="M593 178.71h336.21v652.08H593v-81.51h264.9v-40.76H593v-50.94h264.9v-40.76H593v-50.94h264.9v-40.75H593v-50.95h264.9v-40.75H593v-50.94h264.9v-40.76H593v-50.94h264.9V250H593zM115.57 419.49h42.54q14.39 0 21.94 2.38a38.18 38.18 0 0 1 17.38 11.46 55.43 55.43 0 0 1 11 20.18q3.78 11.94 3.78 29.43 0 15.37-3.54 26.51-4.33 13.58-12.35 22-6.05 6.37-16.35 9.94-7.71 2.64-20.6 2.64h-43.8z m23.28 21.06V523h17.38q9.75 0 14.07-1.18a21 21 0 0 0 9.39-5.18q3.74-3.66 6.09-12t2.36-22.81q0-14.43-2.36-22.17t-6.6-12.06a21.6 21.6 0 0 0-10.78-5.87q-4.87-1.18-19.1-1.18zM227.23 482.51q0-19 5.27-31.94a59.12 59.12 0 0 1 10.73-17.07 45.09 45.09 0 0 1 14.9-11.21q10.78-4.93 24.85-4.93 25.48 0 40.77 17.07T339 481.92q0 30.15-15.17 47.18t-40.58 17q-25.72 0-40.89-16.94t-15.13-46.65z m24-0.85q0 21.15 9 32.06a29.54 29.54 0 0 0 45.8 0.09Q315 503 315 481.32q0-21.4-8.69-31.94t-23.08-10.54q-14.39 0-23.19 10.67t-8.83 32.15zM351.31 503.49l22.69-2.38q2 12.31 8.29 18.09t16.82 5.8q11.25 0 16.94-5.14t5.7-12a11.94 11.94 0 0 0-2.4-7.51q-2.4-3.1-8.37-5.39-4.09-1.54-18.64-5.44-18.72-5-26.26-12.32a33.55 33.55 0 0 1-10.62-25.05 33.91 33.91 0 0 1 5-17.8 31.92 31.92 0 0 1 14.39-12.61q9.4-4.34 22.69-4.34 21.7 0 32.67 10.28t11.52 27.44l-23.28 1.1q-1.49-9.6-6.41-13.8t-14.74-4.21q-10.15 0-15.88 4.5a9.33 9.33 0 0 0-3.7 7.73 9.85 9.85 0 0 0 3.46 7.56q4.4 4 21.39 8.33t25.12 9a33.6 33.6 0 0 1 12.74 12.66q4.6 8 4.6 19.84a38.79 38.79 0 0 1-5.51 20A33.64 33.64 0 0 1 424 541.67q-10.07 4.55-25.08 4.55-21.86 0-33.58-10.91t-14.03-31.82z" fill="#FFFFFF" ></path></symbol><symbol id="icon-jpg" viewBox="0 0 1048 1024"><path d="M551.510689 0h67.548646v107.117869c127.253687 0.702412 254.741511-1.287756 381.878129 0.585344 27.394078-2.575512 48.817652 18.730993 46.125072 46.125071 1.990168 222.430548-0.468275 444.978164 1.170687 667.52578-1.170687 23.999085 2.341374 50.690751-11.472734 71.997256-17.326169 12.643421-40.037499 11.004459-60.407454 11.941009-119.058877-0.585344-238.117755-0.351206-357.2937-0.351206v119.058877h-74.104493c-181.456499-33.130445-363.264205-63.334172-544.837773-95.293929C0 650.902024 0 373.215045 0.117069 95.528067 183.797874 63.685378 367.595747 31.257345 551.510689 0z" fill="#077467" ></path><path d="M615.078999 142.823825v515.102321l8.897221-4.448611 16.38962-7.492397 16.389619-19.316337h32.779239l53.617468-64.036584 93.772037 101.264433h34.184063l72.933806 56.544187-77.382417-32.779239h-28.330628l-86.279639-53.5004-46.125071 55.022293-22.360124-26.808734-68.485194-4.448611v211.426089H1007.961587V142.823825H615.078999z m264.926489 287.286613c-29.618383 0-53.617469-23.999085-53.617469-53.617469s23.999085-53.617469 53.617469-53.617469c29.618383 0 53.617469 23.999085 53.617468 53.617469v0.117069c-0.117069 29.618383-23.999085 53.617469-53.617468 53.5004z" fill="#FFFFFF" ></path><path d="M109.225106 414.189093h29.852521V508.078198c0 12.292214-1.053618 21.657711-3.277924 28.330628-2.926718 8.663084-8.19481 15.570138-15.804276 20.83823s-17.677375 7.843604-30.086658 7.843604c-14.633589 0-25.872185-4.097405-33.832857-12.292215-7.843604-8.19481-11.82394-20.252887-11.941009-36.057162l28.213559-3.277924c0.351206 8.546016 1.638962 14.51652 3.746199 18.028581 3.277924 5.385161 8.19481 7.960672 14.750657 7.960672 6.672916 0 11.355665-1.873099 14.165314-5.736366 2.809649-3.863267 4.097405-11.706871 4.097405-23.764948v-95.762205zM170.920316 562.398079V414.189093h47.99817c18.262719 0 30.086658 0.702412 35.588888 2.224306 8.546016 2.224305 15.570138 7.024123 21.306505 14.51652 5.736367 7.492397 8.546016 17.092032 8.546016 28.915971 0 9.131359-1.638962 16.740825-4.916886 22.945467-3.277924 6.204642-7.492397 11.121527-12.643421 14.633589-5.033954 3.512061-10.302046 5.853435-15.570138 7.024122-7.141191 1.404825-17.443238 2.107237-31.023208 2.107237h-19.550474v55.958843H170.920316z m29.85252-123.156282v42.027667h16.38962c11.82394 0 19.667543-0.819481 23.647879-2.341374 3.980336-1.521893 7.141191-3.980336 9.365497-7.25826 2.224305-3.277924 3.394993-7.141191 3.394992-11.472734 0-5.385161-1.638962-9.833772-4.799817-13.345833-3.160855-3.512061-7.141191-5.736367-12.058077-6.555847-3.62913-0.702412-10.770321-1.053618-21.540642-1.053619h-14.399452zM378.014862 507.96113v-24.935636H442.519721V542.028124c-6.32171 6.087573-15.336001 11.355665-27.277009 16.038413-11.941008 4.56568-23.999085 6.907054-36.174231 6.907054-15.570138 0-29.03304-3.277924-40.505774-9.716703-11.472734-6.555848-20.252887-15.804276-25.989253-27.862353-5.853435-12.058077-8.663084-25.286841-8.663085-39.452155 0-15.45307 3.277924-29.150109 9.716703-41.208185 6.438779-12.058077 15.921344-21.189436 28.447696-27.628216 9.482565-4.916886 21.306505-7.375329 35.471819-7.375328 18.379787 0 32.779239 3.863267 43.081285 11.589802 10.302046 7.726535 16.974963 18.379787 20.01875 31.959757l-29.735452 5.619298c-2.107237-7.25826-5.970504-12.994627-11.82394-17.2091s-12.994627-6.32171-21.540643-6.32171c-13.111695 0-23.530811 4.097405-31.257345 12.409283-7.726535 8.311878-11.589802 20.604093-11.589802 36.876643 0 17.560306 3.863267 30.789071 11.706871 39.569224 7.843604 8.780153 18.028581 13.228764 30.78907 13.228764 6.32171 0 12.526352-1.287756 18.848062-3.746198 6.32171-2.458443 11.706871-5.502229 16.272551-8.897222v-18.848062h-34.301132z" fill="#FFFFFF" ></path></symbol><symbol id="icon-html" viewBox="0 0 1024 1024"><path d="M535.42 74.41H593v91.38c108.53 0.61 217.17-1.12 325.6 0.51 23.35-2.23 41.63 15.94 39.29 39.29 1.73 189.66-0.41 379.42 1 569.19-1 20.5 2 43.25-9.75 61.42-14.82 10.76-34.11 9.34-51.47 10.15-101.53-0.51-203.06-0.35-304.67-0.35v101.57h-63.18c-154.73-28.23-309.77-54-464.6-81.22q-0.15-355.31 0-710.51c156.67-27.12 313.33-54.73 470.2-81.43z" fill="#64A247" ></path><path d="M112.32 550.12V426h23.19v48.84h45.44V426h23.2v124.1h-23.2v-54.25h-45.44v54.27zM254 550.12V447h-34.11v-21h91.29v21h-34v103.12zM325.84 550.12V426h34.71l20.84 84.65L402 426h34.79v124.1h-21.55v-97.67l-22.8 97.68h-22.33l-22.73-97.68v97.68zM460.44 550.12V427h23.2v102.2h57.67v20.91zM589.6 196.24v619.34h335.05V196.24z m75.43 361l-48.73-39a7.37 7.37 0 0 1-2.44-5.69 9.22 9.22 0 0 1 2.44-6.5l48.73-39a8 8 0 1 1 11.37 11.37l-42.24 34.18 42.24 34.12c3.25 3.25 3.25 8.12 0 10.56a7.85 7.85 0 0 1-11.4-0.01z m17.87 57.67c-4.87-0.81-5.69-6.5-3.25-10.56l101.53-195.72c2.44-4.06 7.31-5.69 11.37-3.25a8.74 8.74 0 0 1 2.45 11.37L694.27 611.69c-2.44 4.06-6.5 4.88-11.37 3.25z m172.2-95.85l-48.74 39A8 8 0 0 1 795 546.71l42.24-34.12L795 478.48a8 8 0 0 1 11.37-11.37l48.74 39q2.44 2.44 2.44 7.31a8.78 8.78 0 0 1-2.46 5.68z" fill="#FFFFFF" ></path></symbol><symbol id="icon-icon_MP-" viewBox="0 0 1024 1024"><path d="M535.19 75.72h57.66v91.52c108.7 0.61 217.51-1.12 326.11 0.51 23.39-2.23 41.7 16 39.36 39.36 1.73 190-0.41 380 1 570.08-1 20.54 2 43.32-9.76 61.52-14.85 10.77-34.16 9.35-51.55 10.17-101.69-0.51-203.38-0.31-305.17-0.31v101.69h-63.25c-155-28.27-310.26-54.1-465.33-81.35q-0.15-355.87 0-711.63c156.91-27.16 313.82-54.82 470.93-81.56z" fill="#733781" ></path><path d="M111 552.18v-124.3h34.8l20.87 84.78 20.64-84.78h34.84v124.3h-21.57v-97.84l-22.84 97.84h-22.37l-22.76-97.84v97.84zM245.23 552.18v-124.3h37.28q21.19 0 27.62 1.87 9.89 2.8 16.56 12.17t6.67 24.21q0 11.44-3.84 19.24a33.43 33.43 0 0 1-9.77 12.25 32.34 32.34 0 0 1-12 5.89q-8.32 1.79-24.09 1.79h-15.2v46.88z m23.23-103.27v35.27h12.72q13.73 0 18.36-1.95a15.49 15.49 0 0 0 7.26-6.11 17.68 17.68 0 0 0 2.63-9.66 16.84 16.84 0 0 0-3.69-11.19 15.77 15.77 0 0 0-9.34-5.51q-4.16-0.85-16.71-0.85zM346.78 519.2l21.34-2.8q1 8.82 5.49 13.49a14.77 14.77 0 0 0 22.33-0.93q4.66-5.6 4.67-15.09 0-9-4.47-14.24a13.84 13.84 0 0 0-10.91-5.26 35.72 35.72 0 0 0-10.12 1.79l2.43-19.41q8.94 0.25 13.65-4.2t4.71-11.83q0-6.27-3.46-10a11.9 11.9 0 0 0-9.18-3.73 12.8 12.8 0 0 0-9.66 4.24c-2.66 2.83-4.29 7-4.86 12.37l-20.33-3.72q2.12-11.28 6.4-18a29.52 29.52 0 0 1 11.93-10.61 37.68 37.68 0 0 1 17.15-3.85q16.24 0 26 11.19a30.42 30.42 0 0 1 8.11 20.64q0 16.36-16.55 26.11a26.58 26.58 0 0 1 15.81 10.26q5.93 8 5.93 19.25a38.8 38.8 0 0 1-11.06 27.9q-11.07 11.53-27.55 11.53-15.63 0-25.9-9.7t-11.9-25.4z" fill="#FFFFFF" ></path><path d="M688 548.33a39.47 39.47 0 1 0-39.47-39.47A39.47 39.47 0 0 0 688 548.33z m0-69.56a30.09 30.09 0 1 1-30.09 30.09A30.12 30.12 0 0 1 688 478.77z" fill="#FFFFFF" ></path><path d="M688 530.36a21.49 21.49 0 1 0-21.49-21.49A21.51 21.51 0 0 0 688 530.36zM696.18 461.14l11.39-49.9s-19-6-30.91 0l8.14 49.9z" fill="#FFFFFF" ></path><path d="M589.46 197.75v223.14A131.9 131.9 0 0 1 688 376.54c64.77 0 118.79 46.79 130.11 108.34L805.3 487c-10.3-55.4-58.96-97.45-117.3-97.45a119.26 119.26 0 0 0-98.58 52.2v27.45a106.26 106.26 0 0 1 203 19.84l-58.32 9.46v99a39 39 0 0 0-7.73 1.12c-9.72 2.43-17.38 8.12-21.64 15.2a107.36 107.36 0 0 1-16.73 1.35 106.27 106.27 0 0 1-98.58-66.64V576a119 119 0 0 0 111.61 51.48 23.27 23.27 0 0 0 0.58 4.73 20.39 20.39 0 0 0 3.28 7.9 131.31 131.31 0 0 1-115.47-43.24v221.19H925V197.75z m242.19 409c0 9.5-7.08 17.08-18.13 19.87-12.13 3-23.84-2.07-26.17-11.37s5.62-19.3 17.74-22.34a27.08 27.08 0 0 1 15.39 0.51V524.3l-62 11.34-0.29 86c-0.06 8.14-7.4 16.14-18 18.75-12 3-24.54-2.69-25.89-11.22-2.3-9.21 5.55-19.1 17.56-22.1a26.55 26.55 0 0 1 15.13 0.48V505.74L831.65 492z" fill="#FFFFFF" ></path></symbol><symbol id="icon-png" viewBox="0 0 1024 1024"><path d="M536.5 73.3h57.7v91.5c108.7 0.6 217.6-1.1 326.2 0.5 23.4-2.2 41.7 16 39.4 39.4 1.7 190-0.4 380.1 1 570.2-1 20.5 2 43.3-9.8 61.5-14.8 10.8-34.2 9.4-51.6 10.2-101.7-0.5-203.4-0.3-305.2-0.3V948h-63.3c-155-28.3-310.3-54.1-465.4-81.4-0.1-237.3-0.1-474.6 0-711.8 156.9-27.1 313.9-54.8 471-81.5z" fill="#077467" ></path><path d="M590.8 195.3v439.9l7.6-3.8 14-6.4 14-16.5h28l45.8-54.7 80.1 86.5h29.2l62.3 48.3-66.1-28h-24.2l-73.7-45.7-39.4 47-19.1-22.9-58.5-3.8v180.6h335.6V195.3H590.8z m226.3 245.4c-25.3 0-45.8-20.5-45.8-45.8 0-25.3 20.5-45.8 45.8-45.8 25.3 0 45.8 20.5 45.8 45.8s-20.5 45.8-45.8 45.8zM112.9 553.7V427.1h41c15.6 0 25.7 0.6 30.4 1.9 7.3 1.9 13.3 6 18.2 12.4 4.9 6.4 7.3 14.6 7.3 24.7 0 7.8-1.4 14.3-4.2 19.6-2.8 5.3-6.4 9.5-10.8 12.5-4.3 3-8.8 5-13.3 6-6.1 1.2-14.9 1.8-26.5 1.8h-16.7v47.8h-25.4z m25.6-105.2v35.9h14c10.1 0 16.8-0.7 20.2-2 3.4-1.3 6.1-3.4 8-6.2 1.9-2.8 2.9-6.1 2.9-9.8 0-4.6-1.4-8.4-4.1-11.4-2.7-3-6.1-4.9-10.3-5.6-3.1-0.6-9.2-0.9-18.4-0.9h-12.3zM231.2 553.7V427.1h24.9l51.8 84.6v-84.6h23.8v126.7H306l-51-82.7v82.6h-23.8zM417.7 507.2v-21.3h55.1v50.5c-5.4 5.2-13.1 9.7-23.3 13.7-10.2 3.9-20.5 5.9-30.9 5.9-13.2 0-24.8-2.8-34.6-8.3-9.8-5.6-17.3-13.5-22.2-23.8-5-10.3-7.4-21.6-7.4-33.7 0-13.2 2.8-24.9 8.3-35.2 5.5-10.3 13.6-18.1 24.3-23.6 8.1-4.2 18.2-6.3 30.3-6.3 15.7 0 28 3.3 36.8 9.9 8.8 6.6 14.5 15.7 17.1 27.3l-25.4 4.8c-1.8-6.2-5.1-11.1-10.1-14.7-4.9-3.6-11.1-5.4-18.4-5.4-11.2 0-20.1 3.5-26.7 10.6-6.6 7.1-9.9 17.6-9.9 31.5 0 15 3.3 26.3 10 33.8 6.7 7.5 15.4 11.3 26.3 11.3 5.4 0 10.7-1.1 16.1-3.2 5.4-2.1 10-4.7 13.9-7.6v-16.1h-29.3z" fill="#FFFFFF" ></path></symbol><symbol id="icon-dll" viewBox="0 0 1024 1024"><path d="M535.16 75.38h57.65v91.52c108.69 0.61 217.5-1.12 326.09 0.51 23.39-2.23 41.7 16 39.35 39.35 1.73 189.95-0.41 380 1 570-1 20.53 2 43.31-9.76 61.52-14.85 10.77-34.16 9.35-51.55 10.17-101.68-0.51-203.37-0.31-305.15-0.31v101.71h-63.23c-155-28.27-310.23-54.1-465.3-81.35q-0.15-355.84 0-711.58c156.9-27.14 313.79-54.8 470.9-81.54z" fill="#0071C5" ></path><path d="M111.26 435.08h42.46q14.36 0 21.9 2.37A38.11 38.11 0 0 1 193 448.89a55.17 55.17 0 0 1 11 20.14q3.77 11.92 3.77 29.37 0 15.34-3.54 26.45-4.32 13.55-12.32 21.95-6 6.36-16.32 9.92-7.7 2.64-20.57 2.63h-43.76z m23.24 21v82.31h17.34q9.73 0 14.05-1.18a20.94 20.94 0 0 0 9.37-5.17q3.72-3.65 6.08-12t2.36-22.76q0-14.4-2.36-22.12t-6.58-12a21.6 21.6 0 0 0-10.76-5.88q-4.87-1.18-19.07-1.18zM228 559.35V436.09h23.24v102.32H309v20.94zM326.2 559.35V436.09h23.23v102.32h57.76v20.94zM722.67 577.25a12.93 12.93 0 1 0 12.9 12.93 12.9 12.9 0 0 0-12.9-12.93zM729.11 473.83H716.2a6.45 6.45 0 0 0-6.46 6.46v64.64a6.47 6.47 0 0 0 6.46 6.46h12.9a6.45 6.45 0 0 0 6.46-6.46V480.3a6.47 6.47 0 0 0-6.45-6.47z" fill="#FFFFFF" ></path><path d="M589.42 205v333.45a132.51 132.51 0 0 1 39.06-94.31A10.31 10.31 0 0 1 643 458.72a112.83 112.83 0 0 0 0 159.49 10.3 10.3 0 1 1-14.54 14.58 132.6 132.6 0 0 1-39.06-94.35v286.78H925V205z m133.39 436.89a103.42 103.42 0 1 1 103.42-103.42 103.43 103.43 0 0 1-103.42 103.42z m94.3-9.1a10.3 10.3 0 0 1-14.55 0 10.3 10.3 0 0 1 0-14.6 112.75 112.75 0 0 0 0-159.46 10.3 10.3 0 0 1 14.57-14.57 133.38 133.38 0 0 1 0 188.63z" fill="#FFFFFF" ></path></symbol><symbol id="icon-ppt" viewBox="0 0 1024 1024"><path d="M536.3 70.5h57.4v91.12c108.22 0.61 216.55-1.12 324.67 0.5 23.28-2.22 41.51 15.9 39.18 39.18 1.72 189.12-0.41 378.34 1 567.56-1 20.45 2 43.13-9.72 61.25-14.78 10.73-34 9.31-51.32 10.12-101.24-0.5-202.48-0.31-303.82-0.31v101.25h-63C376.44 913 221.84 887.3 67.45 860.18q-0.15-354.29 0-708.48c156.22-27.04 312.43-54.58 468.85-81.2z" fill="#D24625" ></path><path d="M593.7 192h334.1v617.55H593.7v-81h243v-40.5h-243v-50.6h243v-40.5H593.8c-0.1-19.84-0.1-39.69-0.21-59.53 40.1 12.45 85.76 12.15 121.6-12 38.78-23 59-66.82 62.37-110.55-44.45-0.3-88.89-0.2-133.23-0.2-0.11-44 0.5-88.08-0.91-132q-24.92 4.86-49.71 10.22z" fill="#FFFFFF" ></path><path d="M664.67 261.54C735 264.78 794.16 324 797.91 394.16c-44.45 0.51-88.89 0.31-133.33 0.31-0.01-44.34-0.12-88.69 0.09-132.93zM290 392.75c19.94-0.91 44.65-4.56 58.1 14.17 11.55 19.84 10.93 46 1.32 66.41-11.55 20.86-37.67 18.83-57.81 21.26-2.13-33.91-1.94-67.83-1.61-101.84z" fill="#D24625" ></path><path d="M114.33 544.84V421.11h37.12q21.1 0 27.5 1.86 9.85 2.77 16.49 12.11t6.64 24.09q0 11.39-3.83 19.16a33.28 33.28 0 0 1-9.73 12.2 32.5 32.5 0 0 1-12 5.86q-8.28 1.76-24 1.77h-15.06v46.68zM137.46 442v35.11h12.66q13.67 0 18.28-1.94a15.42 15.42 0 0 0 7.23-6.08 17.58 17.58 0 0 0 2.62-9.62 16.79 16.79 0 0 0-3.67-11.14 15.7 15.7 0 0 0-9.3-5.49q-4.15-0.83-16.64-0.84zM221.06 544.84V421.11h37.12q21.1 0 27.5 1.86 9.85 2.77 16.49 12.11t6.64 24.09q0 11.39-3.83 19.16a33.28 33.28 0 0 1-9.73 12.2 32.5 32.5 0 0 1-12 5.86q-8.28 1.76-24 1.77h-15.07v46.68zM244.18 442v35.11h12.66q13.67 0 18.28-1.94a15.42 15.42 0 0 0 7.23-6.08 17.58 17.58 0 0 0 2.62-9.62 16.79 16.79 0 0 0-3.67-11.14 15.7 15.7 0 0 0-9.3-5.49q-4.15-0.83-16.64-0.84zM353.57 544.84V442h-34v-20.89h91V442H376.7v102.8z" fill="#FFFFFF" ></path></symbol><symbol id="icon-mp4" viewBox="0 0 1024 1024"><path d="M534.1 74.69h57.35v91c108.12 0.61 216.35-1.12 324.38 0.5 23.25-2.19 41.47 15.92 39.17 39.18 1.72 188.95-0.41 378 1 567-1 20.43 2 43.09-9.71 61.19-14.77 10.72-34 9.3-51.28 10.11-101.15-0.5-202.3-0.31-303.55-0.31v101.21h-62.94c-154.14-28.12-308.6-53.81-462.85-80.92q-0.15-354 0-707.84c156.08-27 312.15-54.52 468.43-81.12z" fill="#477DA7" ></path><path d="M112.19 548.6V425h34.58l20.76 84.33L188.07 425h34.66v123.6h-21.47v-97.31l-22.72 97.31H156.3l-22.64-97.32v97.32zM245.68 548.6V425h37.08q21.08 0 27.48 1.86 9.84 2.77 16.47 12.1t6.63 24.04q0 11.38-3.82 19.14a33.25 33.25 0 0 1-9.72 12.19 32.47 32.47 0 0 1-12 5.86q-8.28 1.76-24 1.77h-15.02v46.64z m23.1-102.71V481h12.65q13.66 0 18.26-1.94a15.41 15.41 0 0 0 7.22-6.07 17.56 17.56 0 0 0 2.62-9.61 16.77 16.77 0 0 0-3.67-11.13 15.68 15.68 0 0 0-9.29-5.48q-4.14-0.83-16.62-0.84zM390.48 548.6v-24.87h-46.84V503l49.65-78.51h18.42v78.41h14.2v20.83h-14.2v24.87z m0-45.7v-42.25l-26.31 42.25z" fill="#FFFFFF" ></path><path d="M804.322 502.66l9.232-32.11 32.11 9.232-9.232 32.109zM767.409 631.115l9.231-32.109 32.11 9.231-9.232 32.11zM617.6 588.06l9.23-32.1-32.1-9.23-6.65 23.13v9.71l29.52 8.49zM785.9 566.932l9.23-32.11 32.11 9.232-9.231 32.11z" fill="#FFFFFF" ></path><path d="M588.07 196.07v293.19l29.37-102.15c2.86-10 18.07-14 26.52-11.63l-4.62 16.05 32.11 9.23 4.62-16.05L825.9 427.8l-4.62 16.05 32.11 9.23L858 437c8.39 2.51 19.16 14 16.29 23.94l-62.08 215.97c-2.87 10-18.07 14-26.52 11.63l4.62-16.05-32.11-9.23-4.62 16.05-149.83-43.09 4.62-16.05-20.29-5.84v198.75h333.79v-617z" fill="#FFFFFF" ></path><path d="M603.934 514.575l9.232-32.109 32.109 9.232-9.231 32.109zM764.29 547.61l-72.68-75.91-29.22 101.62 101.9-25.71zM622.428 450.4l9.231-32.11 32.11 9.232-9.232 32.11z" fill="#FFFFFF" ></path></symbol><symbol id="icon-pdf" viewBox="0 0 1024 1024"><path d="M534.78 74.67h57.71v91.61c108.81 0.61 217.73-1.12 326.43 0.51 23.41-2.24 41.74 16 39.39 39.39 1.73 190.15-0.41 380.39 1 570.64-1 20.56 2 43.36-9.77 61.58-14.86 10.78-34.2 9.36-51.6 10.18-101.79-0.51-203.58-0.31-305.47-0.31v101.8h-63.3C374 921.77 218.61 895.92 63.38 868.64q-0.15-356.22 0-712.33c157.07-27.18 314.13-54.87 471.4-81.64z" fill="#DC2E1B" ></path><path d="M110.51 551.6V427.19h37.32q21.22 0 27.65 1.87 9.9 2.8 16.57 12.18t6.68 24.23q0 11.45-3.85 19.25A33.46 33.46 0 0 1 185.1 497a32.41 32.41 0 0 1-12.1 5.88q-8.34 1.79-24.12 1.79h-15.12v46.93z m23.25-103.37v35.31h12.73q13.75 0 18.38-1.95a15.53 15.53 0 0 0 7.27-6.11 17.74 17.74 0 0 0 2.63-9.67 16.84 16.84 0 0 0-3.7-11.2 15.77 15.77 0 0 0-9.34-5.52q-4.18-0.85-16.73-0.85zM217.74 427.19h42.51q14.37 0 21.92 2.38A38.25 38.25 0 0 1 299.52 441a55.26 55.26 0 0 1 11 20.15q3.77 11.93 3.78 29.41 0 15.36-3.54 26.47-4.32 13.58-12.34 22-6 6.37-16.33 9.93-7.71 2.64-20.59 2.63h-43.76z m23.26 21v82.41h17.36q9.74 0 14.07-1.18a21 21 0 0 0 9.38-5.18q3.73-3.65 6.08-12t2.37-22.78q0-14.43-2.37-22.16t-6.59-12a21.61 21.61 0 0 0-10.77-5.85q-4.88-1.19-19.09-1.19zM334.16 551.6V427.19h78.95v21h-55.7v29.45h48.08v21h-48.08v52.96z" fill="#FFFFFF" ></path><path d="M815.32 596.59a22.61 22.61 0 0 0-3.14-2.81c-4.66-3.52-14.15-8.66-32.86-13.11q-2.79-0.67-5.77-1.29c12.42 9.27 23 15 31.7 17 5.21 1.3 8.38 0.8 10.07 0.21zM708.86 409c2.43-8.52 4.09-23.81 0.57-26.88l-0.06 0.07c-4.7 6.5-10.64 33.19-8.67 49.29 3.73-6.64 4.91-11.08 8.16-22.48zM709.47 552.2A211.78 211.78 0 0 1 683 499.62a541.34 541.34 0 0 1-45.11 54.52c16.99-1.68 43.93-2.64 71.58-1.94z" fill="#FFFFFF" ></path><path d="M589.1 196.82v361.91c9.41-2.69 15.9-4.05 15.9-4.05 5.64-5.88 5-5.33 11.77-12.6a758.94 758.94 0 0 0 59.94-73.54c-0.18-2.36-6.65-91.12 21.44-102.93a18.67 18.67 0 0 1 11.64-0.85c5.13 1.22 10 4.54 12.5 8.45 6.34 10.07 6.22 24.77 1 45.35-8.28 32.57-20.9 50.71-20.9 50.71s4 40.18 42 84.79c17.45 1.48 32.46 3.69 44.64 6.59 20.94 5 33.39 11.92 38.06 21.19 2.64 5.24 3 11.7-0.16 19.32s-6.37 11.4-12.2 13.64c-4.88 1.88-11 2-18.13 0.26-21.32-5.08-49.59-25.37-68-41.71-29.78-2.34-65.92-2.6-107.48-0.8q-18.53 19.91-32.07 31.85v213.35H925V196.82z" fill="#FFFFFF" ></path></symbol><symbol id="icon-gif" viewBox="0 0 1024 1024"><path d="M535.86 75.89h57.68v91.56c108.75 0.61 217.61-1.12 326.26 0.51 23.4-2.24 41.72 16 39.37 39.37 1.73 190-0.41 380.18 1 570.33-1 20.55 2 43.34-9.77 61.55-14.85 10.78-34.18 9.36-51.57 10.17-101.73-0.51-203.47-0.31-305.3-0.31v101.74h-63.27c-155-28.29-310.39-54.13-465.53-81.39q-0.15-356 0-711.94c156.98-27.16 313.95-54.83 471.13-81.59z" fill="#C12D84" ></path><path d="M165.37 506.84v-21h50.09v49.53q-7.3 7.64-21.15 13.45a72.18 72.18 0 0 1-28.08 5.8q-18.06 0-31.48-8.18a50.71 50.71 0 0 1-20.18-23.42 80.72 80.72 0 0 1-6.74-33.02q0-19.42 7.53-34.52a52.78 52.78 0 0 1 22.07-23.15q11.07-6.2 27.56-6.2 21.43 0 33.48 9.72t15.53 26.8l-23.08 4.66a26.5 26.5 0 0 0-9.15-14.46q-6.77-5.3-16.77-5.3-15.23 0-24.22 10.43t-9 31q0 22.15 9.11 33.2t23.86 11.08a37.41 37.41 0 0 0 14.64-3.1 49.21 49.21 0 0 0 12.6-7.51v-15.81zM236.2 552.55V428.22h23.24v124.33zM281.73 552.55V428.22h78.9v21H305v29.43h48v21h-48v52.83zM811.45 524.48c0 2.45-0.15 4.76-0.36 7.13a56.27 56.27 0 1 0-67.93-86v0.06h0.12a80 80 0 0 1 68.17 78.81z" fill="#FFFFFF" ></path><path d="M707.82 473.55a56.73 56.73 0 0 0-20.49 16.39A79.76 79.76 0 0 1 758.1 555a65.35 65.35 0 0 1 1.17 14.2c0 1.39 0 2.85-0.07 4.24v0.07l0.15-0.07a56.74 56.74 0 0 0 16.25-13.83A56.09 56.09 0 0 0 786.49 537a58.51 58.51 0 0 0 1.39-12.51 56.31 56.31 0 0 0-55.62-56.28h-0.59a55.6 55.6 0 0 0-23.85 5.34z" fill="#FFFFFF" ></path><path d="M652.12 520.24h-0.08a56.26 56.26 0 1 0 72 83.58 54.13 54.13 0 0 0 10.69-23.13 53.46 53.46 0 0 0 1.17-11.42A56.35 56.35 0 0 0 679.64 513c-1 0-2.07 0-3.07 0.07a56.54 56.54 0 0 0-24.45 7.17z" fill="#FFFFFF" ></path><path d="M590.15 198v620.55h335.73V198z m213.58 360.66v0.08a80 80 0 0 1-50.94 42.6h-0.25a79.68 79.68 0 1 1-93.87-109h0.16a79.92 79.92 0 0 1 56.41-45.78 79.7 79.7 0 1 1 88.52 112.12z" fill="#FFFFFF" ></path><path d="M708.7 495.06A79.73 79.73 0 0 1 758.1 555a79.59 79.59 0 0 0-49.4-59.94z" fill="#F9E4B7" ></path><path d="M652.12 520.2a56.54 56.54 0 0 1 24.45-7.17h-0.07a56.52 56.52 0 0 0-24.38 7.17z" fill="#FFCA55" ></path></symbol><symbol id="icon-exe" viewBox="0 0 1024 1024"><path d="M534.29 76.75h57.54v91.34c108.49 0.61 217.08-1.12 325.47 0.51 23.34-2.23 41.62 15.94 39.28 39.28 1.72 189.59-0.41 379.27 1 569-1 20.5 2 43.23-9.74 61.4-14.84 10.72-34.08 9.29-51.44 10.11-101.49-0.51-203-0.31-304.57-0.31v101.49H528.7c-154.66-28.22-309.64-54-464.42-81.19q-0.15-355.17 0-710.23c156.61-27.1 313.2-54.71 470.01-81.4z" fill="#477DA7" ></path><path d="M111.28 552.27v-124h85.14v21h-62v27.5h57.68v20.89h-57.64v33.76h64.14v20.9zM206.59 552.27l39.25-64.73-35.56-59.31h27.1l23 39.85L283 428.23h26.86l-35.72 60.24 39.25 63.8h-28l-25.45-42.9-25.53 42.9zM325.26 552.27v-124h85.14v21h-62v27.5h57.64v20.89h-57.6v33.76h64.15v20.9z" fill="#FFFFFF" ></path><path d="M780.67 636.78m-15.75 0a15.75 15.75 0 1 0 31.5 0 15.75 15.75 0 1 0-31.5 0Z" fill="#FFFFFF" ></path><path d="M697.08 492.73m-33.31 0a33.31 33.31 0 1 0 66.62 0 33.31 33.31 0 1 0-66.62 0Z" fill="#FFFFFF" ></path><path d="M588.45 198.54v272h11.45a99.81 99.81 0 0 1 12.89-30.65L595 422a11.1 11.1 0 0 1 0-15.69l15.7-15.7a11.09 11.09 0 0 1 15.69 0l17.72 17.72a98.75 98.75 0 0 1 30.75-13v-24.76a11.11 11.11 0 0 1 11.14-11.1h22.21a11.11 11.11 0 0 1 11.1 11.11v24.79a98.76 98.76 0 0 1 30.75 13l17.72-17.72a11.1 11.1 0 0 1 15.69 0l15.7 15.7a11.09 11.09 0 0 1 0 15.69l-17.81 17.81a100.08 100.08 0 0 1 12.89 30.65h25a11.11 11.11 0 0 1 11.1 11.11v22.21a11.1 11.1 0 0 1-11.1 11.1h-25a99.83 99.83 0 0 1-12.89 30.65l17.81 17.81a11.09 11.09 0 0 1 0 15.69l-8 8v3.63a46.66 46.66 0 0 1 14.54 6.16l8.38-8.38a5.25 5.25 0 0 1 7.42 0l7.42 7.42a5.25 5.25 0 0 1 0 7.42l-8.42 8.42a47.32 47.32 0 0 1 6.1 14.49h11.82a5.25 5.25 0 0 1 5.25 5.25V642a5.25 5.25 0 0 1-5.25 5.25h-11.82a47.2 47.2 0 0 1-6.09 14.49l8.42 8.42a5.24 5.24 0 0 1 0 7.42l-7.43 7.42a5.25 5.25 0 0 1-7.42 0l-8.38-8.38a46.55 46.55 0 0 1-14.54 6.16v11.71a5.25 5.25 0 0 1-5.25 5.25h-10.5a5.25 5.25 0 0 1-5.25-5.25v-11.67a46.55 46.55 0 0 1-14.54-6.16l-8.37 8.34a5.25 5.25 0 0 1-7.42 0l-7.42-7.42a5.24 5.24 0 0 1 0-7.42l8.42-8.42a47.33 47.33 0 0 1-6.09-14.49h-11.84a5.25 5.25 0 0 1-5.24-5.25v-10.5a5.25 5.25 0 0 1 5.25-5.25h11.81a47.17 47.17 0 0 1 6.1-14.49l-8.42-8.42a5.24 5.24 0 0 1 0-7.42l7.42-7.42a5.25 5.25 0 0 1 7.42 0l8.38 8.38a46.61 46.61 0 0 1 9.67-4.57L750 577.09a98.54 98.54 0 0 1-30.75 13v24.76A11.11 11.11 0 0 1 708.19 626H686a11.11 11.11 0 0 1-11.1-11.11v-24.78a98.47 98.47 0 0 1-30.75-13L626.4 594.8a11.1 11.1 0 0 1-15.69 0L595 579.1a11.09 11.09 0 0 1 0-15.69l17.81-17.81a100.13 100.13 0 0 1-12.89-30.65h-11.47v302.68h334.92V198.54z" fill="#FFFFFF" ></path><path d="M697.08 570.46a77.73 77.73 0 1 0-77.73-77.74 77.73 77.73 0 0 0 77.73 77.74z m0-133.26a55.52 55.52 0 1 1-55.52 55.52 55.51 55.51 0 0 1 55.52-55.52zM743.92 636.78A36.75 36.75 0 1 0 780.67 600a36.75 36.75 0 0 0-36.75 36.78z m63 0a26.25 26.25 0 1 1-26.25-26.25 26.24 26.24 0 0 1 26.24 26.25z" fill="#FFFFFF" ></path></symbol><symbol id="icon-mpg" viewBox="0 0 1024 1024"><path d="M537.58 73H595v91.15c108.26 0.61 216.63-1.12 324.79 0.5 23.29-2.23 41.53 15.9 39.2 39.2 1.72 189.19-0.41 378.48 1 567.78-1 20.45 2 43.14-9.72 61.27-14.79 10.73-34 9.32-51.34 10.13-101.28-0.5-202.56-0.31-303.94-0.31V944H532c-154.34-28.16-309-53.88-463.45-81q-0.15-354.43 0-708.75C224.83 127.19 381.1 99.64 537.58 73z" fill="#477DA7" ></path><path d="M115 547V423h35.69L171 507.58 191.09 423H225v124h-21v-97.61L181.77 547h-23.62L136 449.39V547zM248 547V423h37.08q21.08 0 27.48 1.86Q322.4 427.64 329 437t6.67 24q0 11.38-3.82 19.13a33.25 33.25 0 0 1-9.72 12.19 32.21 32.21 0 0 1-12 5.86q-8.28 1.78-24 1.78H271v47z m23-103v35h12.62q13.63 0 18.22-1.93A15.39 15.39 0 0 0 309 471a17.58 17.58 0 0 0 2.61-9.59 16.69 16.69 0 0 0-3.61-11.09 15.63 15.63 0 0 0-9.26-5.47q-4.14-0.84-16.58-0.85zM409 502v-21h49v49.3q-7.15 7.61-20.73 13.39a69.74 69.74 0 0 1-27.5 5.78q-17.7 0-30.85-8.14A50.25 50.25 0 0 1 359.16 518a81.52 81.52 0 0 1-6.62-33q0-19.33 7.39-34.36a52.26 52.26 0 0 1 21.62-23.05q10.83-6.16 27-6.16 21 0 32.81 9.66t15.19 26.72l-22.62 4.65a26.41 26.41 0 0 0-9-14.4q-6.58-5.27-16.43-5.27-14.92 0-23.73 10.38T376 484q0 22 8.92 33.05t23.39 11a36.16 36.16 0 0 0 14.35-3.05 48.23 48.23 0 0 0 12.34-7.45V502z" fill="#FFFFFF" ></path><path d="M807.685 501.134l9.243-32.148 32.147 9.243-9.242 32.148zM770.734 629.735l9.242-32.147 32.148 9.242-9.242 32.148zM620.57 586.63l9.24-32.14-32.15-9.25-6.66 23.17v9.72l29.57 8.5zM789.246 565.471l9.242-32.147 32.148 9.242-9.243 32.148z" fill="#FFFFFF" ></path><path d="M591 194v293.67l29.39-102.31c2.87-10 18.09-14 26.53-11.65l-4.62 16.08 32.13 9.21 4.62-16L829 426.1l-4.62 16.08 32.13 9.25 4.62-16.08c8.4 2.52 19.17 14 16.3 24l-62.15 216.26c-2.87 10-18.09 14-26.54 11.65l4.62-16.08-32.13-9.25-4.61 16.07-149.93-43.14 4.62-16.08-20.31-5.84V812h334V194z" fill="#FFFFFF" ></path><path d="M607.05 513.056l9.242-32.148 32.148 9.243-9.242 32.148zM767.61 546.13l-72.77-76-29.25 101.74 102.02-25.74zM625.56 448.809l9.242-32.148 32.148 9.243-9.243 32.148z" fill="#FFFFFF" ></path></symbol><symbol id="icon-psd" viewBox="0 0 1024 1024"><path d="M535.32 78.33h57.4v91.12c108.22 0.61 216.55-1.12 324.67 0.5 23.28-2.22 41.51 15.9 39.18 39.18 1.72 189.12-0.41 378.34 1 567.56-1 20.45 2 43.13-9.72 61.25-14.78 10.73-34 9.31-51.32 10.12-101.24-0.5-202.48-0.31-303.82-0.31V949h-63c-154.28-28.15-308.88-53.86-463.28-81q-0.15-354.29 0-708.48C222.68 132.49 378.9 105 535.32 78.33z" fill="#D9A300" ></path><path d="M113.34 552.67V428.94h37.12q21.1 0 27.51 1.86 9.85 2.77 16.48 12.11t6.63 24.09q0 11.39-3.83 19.16a33.28 33.28 0 0 1-9.73 12.2 32.54 32.54 0 0 1-12 5.86q-8.29 1.76-24 1.77h-15.06v46.68z m23.13-102.8V485h12.67q13.67 0 18.28-1.94a15.44 15.44 0 0 0 7.23-6.08 17.62 17.62 0 0 0 2.62-9.62 16.76 16.76 0 0 0-3.68-11.14 15.68 15.68 0 0 0-9.29-5.49q-4.15-0.83-16.64-0.84zM214.21 512.41l22.5-2.36q2 12.23 8.24 18t16.76 5.74q11.18 0 16.84-5.11t5.67-11.94a11.83 11.83 0 0 0-2.38-7.46q-2.37-3.08-8.31-5.36-4.06-1.53-18.52-5.41-18.6-5-26.1-12.24a33.34 33.34 0 0 1-10.55-24.9 33.74 33.74 0 0 1 5-17.69 31.77 31.77 0 0 1 14.3-12.53q9.34-4.32 22.54-4.31 21.56 0 32.47 10.21t11.45 27.27l-23.14 1.1q-1.48-9.54-6.37-13.71t-14.64-4.18q-10.08 0-15.79 4.47a9.28 9.28 0 0 0-3.67 7.68 9.79 9.79 0 0 0 3.44 7.51q4.37 4 21.25 8.28t25 8.9a33.39 33.39 0 0 1 12.66 12.58q4.57 8 4.58 19.71a38.55 38.55 0 0 1-5.48 19.91 33.39 33.39 0 0 1-15.46 13.8q-10 4.52-24.92 4.52-21.73 0-33.37-10.85t-14-31.63zM326.72 428.94H369q14.3 0 21.8 2.36a38 38 0 0 1 17.26 11.39A54.93 54.93 0 0 1 419 462.74q3.75 11.86 3.76 29.25 0 15.28-3.52 26.34-4.3 13.5-12.27 21.85-6 6.33-16.24 9.88-7.67 2.62-20.48 2.62h-43.53z m23.14 20.93v82h17.26q9.68 0 14-1.18a20.85 20.85 0 0 0 9.33-5.15q3.71-3.63 6.05-11.94t2.35-22.66q0-14.34-2.35-22t-6.55-12a21.5 21.5 0 0 0-10.73-5.94q-4.85-1.17-19-1.18z" fill="#FFFFFF" ></path><path d="M707.15 513c-0.06 0-0.05 0 0 0zM716.69 499.31v0.06zM678.91 639.11h-0.06zM780.32 545.68a14 14 0 0 0 1.67-1.38 20.87 20.87 0 0 1-2.05 1.63c0.17-0.06 0.22-0.18 0.38-0.25zM694.68 677.44l0.93-2.26M697.97 669.44l0.94-2.26M690.17 688.36l3.91-9.48" fill="" ></path><path d="M589.75 199.82v418.06c29.7-189.73 240.69-234.35 278.6-221 15.22 11.27-36.64 103.73-36.64 103.73l-58.34 6.48 49.89 7.33-19.73 26.78-64.83 6.2 50.74 7.89s-26.37 26.62-32.71 27.06-48.62 5.92-48.62 5.92 28.61 4.79 32.84 5.64c-57.5 44.38-128.55 52.15-128.55 52.15L718.39 495s-68 10.08-128.64 127.13v195.26h334.1V199.82z" fill="#FFFFFF" ></path><path d="M588.71 624.09c0.34-0.67 0.69-1.29 1-2v-4.25c-0.29 2.16-0.71 4.16-1 6.25z" fill="#34C6E8" ></path></symbol><symbol id="icon-mkv" viewBox="0 0 1024 1024"><path d="M535.3 76.86h57.37v91.07c108.16 0.61 216.43-1.12 324.49 0.5 23.27-2.22 41.49 15.89 39.16 39.16 1.72 189-0.41 378.13 1 567.25-1 20.43 2 43.1-9.71 61.21-14.77 10.72-34 9.31-51.29 10.12-101.18-0.5-202.37-0.31-303.65-0.31V947h-62.94c-154.2-28.13-308.71-53.83-463-80.95Q66.57 512 66.71 158C222.85 131 379 103.47 535.3 76.86z" fill="#477DA7" ></path><path d="M113.26 550.95V427.27h34.59l20.77 84.36 20.53-84.36h34.67v123.68h-21.46V453.6l-22.73 97.35h-22.25l-22.65-97.35v97.35zM247.1 550.95V427.27h23.11v54.92l46.7-54.92H348l-43.1 48.17 45.44 75.5h-29.92L289 492.9l-18.74 20.67v37.37zM391.48 550.95l-40.92-123.68h25.07l29 91.54 28-91.54h24.52l-41 123.67z" fill="#FFFFFF" ></path><path d="M808.091 507.612l9.358-32.084 32.083 9.358-9.358 32.083zM768.703 633.478l9.235-32.12 32.119 9.235-9.235 32.119zM618.84 590.41l9.23-32.12-32.11-9.23-6.66 23.14v9.72l29.54 8.49zM787.188 569.277l9.234-32.12 32.119 9.235-9.234 32.119z" fill="#FFFFFF" ></path><path d="M589.3 198.28v293.3l29.38-102.18c2.87-10 18.08-14 26.53-11.63l-4.62 16.06 32.12 9.24 4.62-16.07 149.89 43.1-4.62 16.06 32.12 9.24 4.62-16.06c8.4 2.51 19.16 14 16.3 23.95l-62.11 216c-2.87 10-18.08 14-26.53 11.63l4.62-16.06-32.12-9.24-4.62 16.06L605 638.59l4.62-16.06-20.3-5.84v198.82h333.89V198.28z" fill="#FFFFFF" ></path><path d="M605.167 516.892l9.234-32.119 32.12 9.234-9.235 32.12zM765.58 549.94l-72.7-75.93-29.23 101.65 101.93-25.72zM623.661 452.711l9.235-32.119 32.118 9.234-9.234 32.12z" fill="#FFFFFF" ></path></symbol><symbol id="icon-xls" viewBox="0 0 1024 1024"><path d="M533.58 75H594v81.31c101.74 0 203.47 0.2 305.21-0.31 17.18 0.71 36.09-0.51 51 9.76 10.47 15 9.25 34.15 10 51.43q-0.76 264.66-0.2 529.12c-0.51 29.58 2.74 59.76-3.45 88.93-4.14 21.1-29.56 21.61-46.56 22.32-105.3 0.31-210.69-0.2-316.09 0V949h-63.07c-154.9-28.15-310.1-54.17-465.2-81.31V156.37C221.66 129.23 377.67 102.51 533.58 75z" fill="#207245" ></path><path d="M594 186.76h335.4v640.31H594v-61h81.31v-71.12H594v-40.66h81.31v-71.14H594v-40.66h81.31v-71.14H594v-40.66h81.31v-71.14H594v-40.66h81.31v-71.15H594z" fill="#FFFFFF" ></path><path d="M715.92 247.74h142.29v71.15H715.92zM715.92 359.55h142.29v71.15H715.92zM715.92 471.35h142.29v71.15H715.92zM715.92 583.15h142.29v71.15H715.92zM715.92 694.95h142.29v71.15H715.92z" fill="#207245" ></path><path d="M98.48 551.16l39.3-64.82-35.61-59.39h27.14l23.06 39.91L175 426.95h26.91l-35.77 60.33 39.3 63.89h-28l-25.49-43-25.57 43zM217.94 551.16V428h23.22v102.23h57.73v20.93zM309.56 510.75l22.59-2.37q2 12.28 8.27 18t16.82 5.77q11.22 0 16.9-5.13t5.69-12a11.91 11.91 0 0 0-2.39-7.49q-2.39-3.1-8.35-5.38-4.08-1.53-18.59-5.43-18.67-5-26.2-12.29a33.47 33.47 0 0 1-10.59-25 33.82 33.82 0 0 1 5-17.76A31.84 31.84 0 0 1 333 429.15q9.37-4.33 22.63-4.33 21.65 0 32.59 10.25t11.49 27.37l-23.22 1.1q-1.49-9.57-6.39-13.77t-14.7-4.2q-10.12 0-15.85 4.49a9.3 9.3 0 0 0-3.69 7.71 9.83 9.83 0 0 0 3.45 7.54q4.39 4 21.33 8.31t25.06 8.93a33.52 33.52 0 0 1 12.7 12.63q4.59 8 4.59 19.79a38.7 38.7 0 0 1-5.49 20 33.56 33.56 0 0 1-15.5 13.86q-10 4.54-25 4.54-21.81 0-33.49-10.89t-13.95-31.73z" fill="#FFFFFF" ></path></symbol><symbol id="icon-rmvb" viewBox="0 0 1024 1024"><path d="M535.16 72.24h57.63v91.47c108.65 0.61 217.4-1.12 325.95 0.51 23.37-2.23 41.68 16 39.34 39.34 1.73 189.86-0.41 379.82 1 569.79-1 20.53 2 43.29-9.76 61.49-14.84 10.77-34.14 9.35-51.52 10.16-101.64-0.51-203.28-0.31-305-0.31v101.64h-63.24C374.67 918.07 219.47 892.26 64.47 865q-0.15-355.69 0-711.27C221.3 126.62 378.13 99 535.16 72.24z" fill="#477DA7" ></path><path d="M101.45 548.45V424.23h48.87q18.43 0 26.78 3.34a27 27 0 0 1 13.37 11.9 38 38 0 0 1 5 19.58q0 14-7.61 23.09t-22.74 11.48a55.23 55.23 0 0 1 12.43 10.42q4.9 5.67 13.22 20.16l14 24.24h-27.71l-16.78-27q-8.94-14.49-12.24-18.26a17.85 17.85 0 0 0-7-5.17q-3.69-1.4-11.69-1.4h-4.71v51.86z m23.22-71.68h17.18q16.7 0 20.86-1.53a12.65 12.65 0 0 0 6.51-5.25 17.18 17.18 0 0 0 2.35-9.32q0-6.27-3.1-10.12a13.91 13.91 0 0 0-8.75-4.87q-2.82-0.43-16.94-0.43h-18.12zM217.06 548.45V424.23h34.75L272.68 509l20.63-84.74h34.82v124.19h-21.57v-97.79l-22.83 97.79h-22.35l-22.75-97.79v97.79zM380.53 548.45l-41.1-124.22h25.18l29.1 91.94 28.16-91.94h24.63l-41.18 124.22zM458.42 424.23h46q13.65 0 20.35 1.23a28.56 28.56 0 0 1 12 5.12 31.08 31.08 0 0 1 8.8 10.42 29.87 29.87 0 0 1 3.53 14.53 30.66 30.66 0 0 1-4.35 16 27.69 27.69 0 0 1-11.81 10.94q10.51 3.31 16.16 11.27a31.53 31.53 0 0 1 5.65 18.73 39.35 39.35 0 0 1-3.65 16.48 32.64 32.64 0 0 1-10 12.79 31.37 31.37 0 0 1-15.57 5.9q-5.81 0.67-28 0.84h-39.11z m23.22 20.68v28.72h15.22q13.57 0 16.87-0.43a14.81 14.81 0 0 0 9.37-4.45 13.7 13.7 0 0 0 3.41-9.7 14.35 14.35 0 0 0-2.94-9.37q-2.94-3.6-8.74-4.36-3.45-0.43-19.85-0.43z m0 49.4v33.21h21.49q12.55 0 15.92-0.76a14.08 14.08 0 0 0 8.43-5q3.26-3.95 3.26-10.55a17.18 17.18 0 0 0-2.51-9.49 14.4 14.4 0 0 0-7.26-5.68q-4.75-1.77-20.59-1.78z" fill="#FFFFFF" ></path><path d="M806.683 502.289l9.276-32.263 32.263 9.275-9.276 32.264zM769.605 631.362l9.276-32.263 32.263 9.275-9.276 32.263zM619.07 588.1l9.28-32.26-32.26-9.28-6.69 23.25v9.76l29.67 8.53zM788.185 566.857l9.276-32.263 32.263 9.275-9.276 32.264z" fill="#FFFFFF" ></path><path d="M589.4 194.21v294.61l29.51-102.64c2.88-10 18.16-14 26.65-11.68l-4.64 16.13 32.26 9.28 4.64-16.13 150.56 43.29-4.64 16.13 32.26 9.27 4.64-16.13c8.43 2.52 19.25 14 16.37 24.05l-62.39 217c-2.88 10-18.16 14-26.65 11.68l4.64-16.13-32.26-9.28-4.64 16.13-150.55-43.3 4.64-16.13-20.4-5.86v199.7h335.41v-620z" fill="#FFFFFF" ></path><path d="M605.337 514.254l9.276-32.263 32.263 9.276-9.276 32.263zM766.47 547.45l-73.03-76.27-29.36 102.11 102.39-25.84zM623.925 449.779l9.275-32.263 32.263 9.275-9.275 32.263z" fill="#FFFFFF" ></path></symbol><symbol id="icon-txt" viewBox="0 0 1024 1024"><path d="M535.94 71.69h57.58v91.4c108.56 0.61 217.22-1.12 325.68 0.51 23.36-2.23 41.64 15.95 39.3 39.3 1.73 189.71-0.41 379.52 1 569.33-1 20.51 2 43.26-9.75 61.44-14.83 10.76-34.12 9.34-51.48 10.16-101.56-0.51-203.11-0.31-304.77-0.31v101.55h-63.15C375.59 916.83 220.5 891 65.63 863.82q-0.15-355.4 0-710.69C222.34 126 379 98.39 535.94 71.69z" fill="#868695" ></path><path d="M138.52 547.51V444.39h-34.1v-21h91.31v21h-34v103.12zM199 547.51l39.27-64.77-35.58-59.35h27.12l23 39.88 22.57-39.88h26.89l-35.74 60.28 39.27 63.84h-28l-25.4-42.92-25.55 42.92zM343.63 547.51V444.39h-34.1v-21h91.31v21h-34v103.12zM590.14 193.55v302.14h126.94v12.69H590.14v88.86h265.74v38.08H590.14v48.24h265.74v38.08H590.14V813h335.14V193.55z m198.11 250c-4.53 6.7-10.62 17.86-12.12 31.13a8.11 8.11 0 0 1-5.17 6.88l-43.83 15.86-4.93-2.57 20.22-27.09a15.45 15.45 0 0 0 5 0.79c7.84-0.08 14.14-5.95 14.07-13.09s-6.49-12.89-14.33-12.81-14.14 5.94-14.06 13.09a11.89 11.89 0 0 0 1 4.63 8.05 8.05 0 0 1-0.55 8.14l-17.15 23-4.09-3.82-0.13-42.48a8.25 8.25 0 0 1 4.66-7.51c6.93-3.32 20.19-10.74 30.28-22.81a8.22 8.22 0 0 1 10.81-1.46l28 18.43a8.35 8.35 0 0 1 2.32 11.72z m19.94-14.67a8.35 8.35 0 0 1-11 2l-42.74-26.63a8.35 8.35 0 0 1-2.52-11.73l0.32-0.47c2.53-3.77 4.47-1.64 8.3 0.8L802.93 420c4.13 2.61 8.25 5 5.25 8.91z m36.18-53.69l-24.11 35.7a13 13 0 0 1-18 3.48l-28.55-19.27a13 13 0 0 1-3.48-18l24.11-35.69a12.94 12.94 0 0 1 18-3.48l28.56 19.29a13 13 0 0 1 3.46 18z" fill="#FFFFFF" ></path></symbol><symbol id="icon-wav" viewBox="0 0 1024 1024"><path d="M534.84 73.7h57.61v91.45c108.62 0.61 217.34-1.12 325.86 0.51 23.37-2.23 41.67 16 39.33 39.33 1.73 189.81-0.41 379.73 1 569.65-1 20.52 2 43.28-9.75 61.47-14.84 10.77-34.14 9.35-51.51 10.16-101.61-0.51-203.22-0.31-304.94-0.31v101.61h-63.2c-154.85-28.25-310-54.06-465-81.29q-0.15-355.59 0-711.08c156.82-27.13 313.61-54.77 470.6-81.5z" fill="#733781" ></path><path d="M127.64 549.79L100.19 425.6h23.76l17.34 85.31 21-85.31h27.6L210 512.35l17.64-86.75h23.37L223.1 549.8h-24.57l-22.9-92.85-22.83 92.84zM357.71 549.79h-25.25l-10-28.21h-46L267 549.79h-24.64l44.78-124.2h24.54zM315 500.66l-15.84-46.08-15.53 46.08zM387.43 549.79L346.34 425.6h25.17l29.09 91.93 28.15-91.93h24.63l-41.17 124.2z" fill="#FFFFFF" ></path><path d="M687.57 546a39.44 39.44 0 1 0-39.44-39.44A39.44 39.44 0 0 0 687.57 546z m0-69.5a30.07 30.07 0 1 1-30.07 30.07 30.1 30.1 0 0 1 30.07-30.12z" fill="#FFFFFF" ></path><path d="M687.57 528a21.48 21.48 0 1 0-21.48-21.48A21.5 21.5 0 0 0 687.57 528zM695.7 458.83L707.08 409s-19-6-30.89 0l8.13 49.86z" fill="#FFFFFF" ></path><path d="M589.07 195.64v223a131.8 131.8 0 0 1 98.5-44.32c64.72 0 118.7 46.76 130 108.26l-12.84 2.08c-10.31-55.32-58.91-97.34-117.17-97.34a119.17 119.17 0 0 0-98.5 52.16v27.43a106.18 106.18 0 0 1 202.85 19.82l-58.28 9.45v98.92a39 39 0 0 0-7.73 1.12c-9.71 2.43-17.36 8.11-21.63 15.19a107.28 107.28 0 0 1-16.72 1.32 106.19 106.19 0 0 1-98.5-66.59v27.43A118.91 118.91 0 0 0 700.59 625a23.26 23.26 0 0 0 0.58 4.72 20.37 20.37 0 0 0 3.28 7.89 131.21 131.21 0 0 1-115.38-43.21v221h335.32V195.64z m242 408.68c0 9.49-7.08 17.07-18.12 19.86-12.12 3-23.82-2.07-26.15-11.36s5.61-19.29 17.73-22.32a27.05 27.05 0 0 1 15.38 0.51v-69.07l-62 11.33-0.29 85.93c-0.06 8.13-7.39 16.13-17.95 18.73-12 3-24.52-2.68-25.87-11.21-2.3-9.2 5.55-19.08 17.55-22.09a26.53 26.53 0 0 1 15.11 0.48V503.4l84.59-13.72z" fill="#FFFFFF" ></path></symbol><symbol id="icon-swf" viewBox="0 0 1024 1024"><path d="M535.06 75.11h57.64v91.5c108.67 0.61 217.45-1.12 326 0.51 23.38-2.23 41.69 16 39.35 39.34 1.73 189.91-0.41 379.91 1 569.92-1 20.53 2 43.3-9.76 61.5-14.84 10.77-34.15 9.35-51.54 10.17-101.66-0.51-203.32-0.31-305.08-0.31V949.4h-63.21c-154.93-28.27-310.17-54.09-465.2-81.33q-0.15-355.77 0-711.43C221.13 129.5 378 101.85 535.06 75.11z" fill="#A33639" ></path><path d="M105.45 511l22.6-2.38q2 12.3 8.27 18.06t16.83 5.77q11.22 0 16.91-5.13t5.69-12a11.92 11.92 0 0 0-2.39-7.51q-2.39-3.08-8.35-5.38-4.08-1.52-18.59-5.42-18.67-5-26.2-12.29a34.53 34.53 0 0 1-5.63-42.72 31.81 31.81 0 0 1 14.36-12.59q9.37-4.32 22.64-4.32 21.65 0 32.6 10.26t11.5 27.37l-23.23 1.1q-1.46-9.6-6.41-13.82t-14.71-4.2q-10.13 0-15.85 4.5a9.28 9.28 0 0 0-3.69 7.71 9.84 9.84 0 0 0 3.45 7.55q4.39 4 21.34 8.3t25.07 8.95a33.39 33.39 0 0 1 12.71 12.63q4.59 8 4.59 19.79a38.72 38.72 0 0 1-5.5 20 33.57 33.57 0 0 1-15.53 13.86q-10 4.54-25 4.54-21.82 0-33.5-10.89T105.45 511zM234.82 551.44l-27.46-124.26h23.77l17.34 85.35 21-85.35h27.61l20.2 86.82 17.65-86.79h23.38l-27.93 124.23h-24.63l-22.91-92.9-22.84 92.9zM370.32 551.44V427.18h78.85v21h-55.63v29.42h48v21h-48v52.81zM589.31 197.11v620.13h335.48V197.11zM826 446.15a11 11 0 1 1 11 11 11 11 0 0 1-11-11zM651.32 551.57a28.78 28.78 0 1 1 28.77-28.79 28.8 28.8 0 0 1-28.77 28.79z m32.33 73.15a24.41 24.41 0 1 1 24.35-24.4 24.43 24.43 0 0 1-24.35 24.4z m0-147a32.64 32.64 0 1 1 32.63-32.64 32.68 32.68 0 0 1-32.63 32.66z m76.06 175A21.32 21.32 0 1 1 781 631.37a21.34 21.34 0 0 1-21.29 21.32z m0-203.33a35.73 35.73 0 1 1 35.72-35.73 35.77 35.77 0 0 1-35.72 35.7z m77.22 167.29a17.21 17.21 0 1 1 17.21-17.21 17.23 17.23 0 0 1-17.21 17.19zM868.55 537a14.12 14.12 0 1 1 14.12-14.12A14.14 14.14 0 0 1 868.55 537z" fill="#FFFFFF" ></path><path d="M825.98 446.15v0.01-0.01z" fill="" ></path></symbol><symbol id="icon-avi" viewBox="0 0 1024 1024"><path d="M536.36 72.13h57.52v91.3c108.44 0.61 217-1.12 325.33 0.51 23.33-2.23 41.6 15.93 39.26 39.26 1.72 189.5-0.41 379.11 1 568.72-1 20.49 2 43.21-9.74 61.37-14.81 10.75-34.08 9.33-51.43 10.14-101.45-0.51-202.89-0.31-304.44-0.31v101.45h-63.08c-154.6-28.21-309.51-54-464.22-81.16q-0.15-355 0-709.92c156.54-27.09 313.07-54.68 469.8-81.36z" fill="#477DA7" ></path><path d="M217 547.44h-25.18l-10-28.17h-45.9l-9.47 28.17h-24.58l44.7-124h24.5z m-42.67-49l-15.82-46-15.5 46zM246.71 547.44l-41-124h25.13l29 91.77L288 423.45h24.58l-41.1 124zM323.67 547.44v-124h23.17v124z" fill="#FFFFFF" ></path><path d="M807.375 501.365l9.259-32.205 32.205 9.259-9.259 32.205zM770.368 630.185l9.26-32.206 32.205 9.26-9.26 32.205zM620.12 587.01l9.25-32.2-32.2-9.26-6.67 23.2v9.75l29.62 8.51zM788.9 565.818l9.26-32.205 32.205 9.259-9.26 32.205z" fill="#FFFFFF" ></path><path d="M590.5 193.86v294.06L620 385.47c2.87-10 18.13-14 26.6-11.66l-4.63 16.1 32.2 9.26 4.63-16.1L829 426.28l-4.63 16.1 32.2 9.26 4.63-16.1c8.42 2.52 19.21 14 16.34 24L815.3 676.12c-2.88 10-18.13 14-26.6 11.66l4.63-16.1-32.2-9.26-4.63 16.1-150.27-43.21 4.63-16.1-20.35-5.85v199.33h334.77V193.86z" fill="#FFFFFF" ></path><path d="M606.405 513.31l9.259-32.206 32.205 9.259-9.259 32.205zM767.23 546.44l-72.88-76.13-29.31 101.92 102.19-25.79zM624.95 448.943l9.259-32.205 32.205 9.259-9.259 32.205z" fill="#FFFFFF" ></path></symbol><symbol id="icon-othe" viewBox="0 0 1024 1024"><path d="M535.06 75.11h57.64v91.5c108.67 0.61 217.45-1.12 326 0.51 23.38-2.23 41.69 16 39.35 39.34 1.73 189.91-0.41 379.91 1 569.92-1 20.53 2 43.3-9.76 61.5-14.84 10.77-34.15 9.35-51.54 10.17-101.66-0.51-203.32-0.31-305.08-0.31V949.4h-63.21c-154.93-28.27-310.17-54.09-465.2-81.33q-0.15-355.77 0-711.43C221.13 129.5 378 101.85 535.06 75.11z" fill="#A33639" ></path><path d="M162.87 462.07q12.3 13.67 12.3 36.35 0 22.28-12.3 36.21Q150 549 127.75 549t-35.12-14.51q-12.16-13.8-12.16-36.08t12.16-36.21q12.57-14.62 35.12-14.62 22.25 0 35.12 14.49z m-59.31 9.16q-8.2 10-8.2 27.19 0 16.95 8.2 27.06 8.74 10.39 24.19 10.39t24.05-10.11q8.33-10 8.34-27.33t-8.34-27.6q-8.34-10.11-24.05-10.11t-24.19 10.5zM182.68 449.49h79.94v12.71H230.1v84.86h-14.76V462.2h-32.66zM274.38 449.49h14.9v41.13h51.11v-41.13h14.9v97.57h-14.9v-43.72h-51.12v43.73h-14.9zM374.41 449.49h70.1v12.71H389.3v28.42h51.93v12.71H389.3v31h57.53v12.71h-72.42zM462 449.49h43.18q15 0 23.5 6.7 9 7.38 9 21.18a23.68 23.68 0 0 1-4.1 13.67 21.57 21.57 0 0 1-12.71 8.61v0.27q13 2.87 14.62 17.22l1.64 15.58q0.82 9 5.74 14.35h-16.09q-3.42-4.37-4.24-12.85l-1.23-12.16q-0.82-7.92-5.19-11.75-4.37-3.55-12.84-3.55H476.9v40.31H462z m14.9 12.71V494h26.37q9.7 0 14.76-4.24 4.78-4.1 4.78-11.89 0-8.06-4.65-11.89t-15-3.83zM589.31 197.11v620.13h335.48V197.11z m156.05 373.26a19.35 19.35 0 0 1-13.09 4.94 18.13 18.13 0 0 1-18-17.78q0-7.9 5.43-12.6 4.69-4.94 12.6-4.94 8.15 0 13.09 4.94 5.19 4.69 5.19 12.6a17.44 17.44 0 0 1-5.22 12.84zM780.68 474q-3.7 4.45-21 19.27a43.09 43.09 0 0 0-10.13 12.6 33.69 33.69 0 0 0-4 16.55v4.2h-26.37v-4.2q0-14.08 4.69-23.47 5.19-10.12 28.16-30.63l4.2-4.69q6.67-8.64 6.67-18 0-12.6-7.16-20.25Q748.33 418 735 418q-16.8 0-24.21 10.37-6.67 8.89-6.67 25.44h-26.19q0-26.92 15.81-42.48 15.56-15.8 42.73-15.81 24.21 0 38.78 13.09t14.57 35.32q0 18-9.14 30.07z" fill="#FFFFFF" ></path></symbol></svg>';var script = function () {
      var scripts = document.getElementsByTagName("script");return scripts[scripts.length - 1];
    }();var shouldInjectCss = script.getAttribute("data-injectcss");var ready = function ready(fn) {
      if (document.addEventListener) {
        if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
          setTimeout(fn, 0);
        } else {
          var loadFn = function loadFn() {
            document.removeEventListener("DOMContentLoaded", loadFn, false);fn();
          };document.addEventListener("DOMContentLoaded", loadFn, false);
        }
      } else if (document.attachEvent) {
        IEContentLoaded(window, fn);
      }function IEContentLoaded(w, fn) {
        var d = w.document,
            done = false,
            init = function init() {
          if (!done) {
            done = true;fn();
          }
        };var polling = function polling() {
          try {
            d.documentElement.doScroll("left");
          } catch (e) {
            setTimeout(polling, 50);return;
          }init();
        };polling();d.onreadystatechange = function () {
          if (d.readyState == "complete") {
            d.onreadystatechange = null;init();
          }
        };
      }
    };var before = function before(el, target) {
      target.parentNode.insertBefore(el, target);
    };var prepend = function prepend(el, target) {
      if (target.firstChild) {
        before(el, target.firstChild);
      } else {
        target.appendChild(el);
      }
    };function appendSvg() {
      var div, svg;div = document.createElement("div");div.innerHTML = svgSprite;svgSprite = null;svg = div.getElementsByTagName("svg")[0];if (svg) {
        svg.setAttribute("aria-hidden", "true");svg.style.position = "absolute";svg.style.width = 0;svg.style.height = 0;svg.style.overflow = "hidden";prepend(svg, document.body);
      }
    }if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
      window.__iconfont__svg__cssinject__ = true;try {
        document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
      } catch (e) {
        console && console.log(e);
      }
    }ready(appendSvg);
  })(window);

  var icons = ['avi', 'swf', 'wav', 'txt', 'rmvb', 'xls', 'mkv', 'psd', 'mpg', 'exe', 'gif', 'pdf', 'mp4', 'ppt', 'dll', 'png', 'mp3', 'html', 'jpg', 'doc', 'close', 'zanting', 'success', 'delete', 'pause', 'contine', 'jixu', 'waiting'];

  function getIconSuffix(suffix) {
    suffix = suffix.toLowerCase();
    if (icons.indexOf(suffix) !== -1) {
      return suffix;
    }
    return 'othe';
  }

  var Icon = function (_UiComponents) {
    inherits(Icon, _UiComponents);

    function Icon(theme, suffix) {
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 36;
      var cls = arguments[4];
      var svgcls = arguments[5];
      classCallCheck(this, Icon);

      var _this = possibleConstructorReturn(this, _UiComponents.call(this, theme));

      suffix = getIconSuffix(suffix);
      var str = 'span.' + _this.theme + '-icon';
      if (cls) {
        str += '.' + cls;
      }
      var tag = 'svg';
      if (svgcls) {
        tag = tag + '.' + svgcls;
      }
      _this.el = _this.h(str, [_this.h(tag, {
        attrs: {
          'width': width + 'px',
          'height': height + 'px',
          'aria-hidden': 'true'
        }
      }, [_this.h('use', {
        attrs: {
          'xlink:href': '#icon-' + suffix
        }
      })])]);
      return _this;
    }

    return Icon;
  }(UiComponents);

  /**
   * 进度条
   */

  var Progress = function (_UiComponents) {
    inherits(Progress, _UiComponents);

    function Progress(theme, name, suffix, size) {
      classCallCheck(this, Progress);

      var _this = possibleConstructorReturn(this, _UiComponents.call(this, theme));

      _this.progressbar = new ProgressBar(theme, name, suffix, size);
      _this.progressbg = new ProgressBg(theme);
      var children = [];
      children.push(_this.progressbar.getEl());
      children.push(_this.progressbg.getEl());
      _this.el = _this.h('div.' + _this.theme + '-progress', children);
      return _this;
    }

    Progress.prototype.setProgress = function setProgress(p, loaded) {
      this.progressbg.setProgress(p);
      this.progressbar.setProgress(p, loaded);
    };

    Progress.prototype.setStatus = function setStatus(statu, data) {
      this.progressbar.setStatus(statu, data);
    };

    return Progress;
  }(UiComponents);

  var ProgressBar = function (_UiComponents2) {
    inherits(ProgressBar, _UiComponents2);

    function ProgressBar(theme, name, suffix, size) {
      classCallCheck(this, ProgressBar);

      var _this2 = possibleConstructorReturn(this, _UiComponents2.call(this, theme));

      _this2.icon = new Icon(theme, suffix, 36, 36, _this2.theme + '-icon-suffix');
      _this2.name = name;
      _this2.nameEle = _this2.h('span.' + _this2.theme + '-progress-filename', _this2.name);
      _this2.size = new FileSizeEl(theme, size);
      _this2.ptools = new ProgressTools(theme);
      _this2.el = _this2.h('div.' + _this2.theme + '-progress-bar', [_this2.icon.getEl(), _this2.nameEle, _this2.size.getEl(), _this2.ptools.getEl()]);
      return _this2;
    }
    // 处理删除


    ProgressBar.prototype.handlePTools = function handlePTools() {
      this.ptools.on('pause', function () {
        console.log('pause');
      });
    };

    ProgressBar.prototype.setStatus = function setStatus(statu, data) {
      if (statu === 'auth') {
        this.size.setStatus(1, '认证中');
      }
      this.ptools.setStatus(statu, data);
    };

    ProgressBar.prototype.setProgress = function setProgress(p, loaded) {
      this.size.setStatus(2, loaded);
    };

    return ProgressBar;
  }(UiComponents);

  /**
   * 进度条背景色
   */


  var ProgressBg = function (_UiComponents3) {
    inherits(ProgressBg, _UiComponents3);

    function ProgressBg(theme) {
      classCallCheck(this, ProgressBg);

      var _this3 = possibleConstructorReturn(this, _UiComponents3.call(this, theme));

      _this3.el = _this3.h('div.' + _this3.theme + '-progress-bg');
      return _this3;
    }

    ProgressBg.prototype.setProgress = function setProgress(p) {
      var el = this.h('div.' + this.theme + '-progress-bg.uploading', {
        style: {
          width: p
        }
      });
      this.patch(this.el, el);
      this.el = el;
    };

    return ProgressBg;
  }(UiComponents);

  /**
   * 文件大小
   */


  var FileSizeEl = function (_UiComponents4) {
    inherits(FileSizeEl, _UiComponents4);

    function FileSizeEl(theme, size, status) {
      classCallCheck(this, FileSizeEl);

      var _this4 = possibleConstructorReturn(this, _UiComponents4.call(this, theme));

      _this4.total = _this4.h('span.' + _this4.theme + '-filesize-name', calcSize(size));
      _this4.splitor = _this4.h('span', '/');
      _this4.p = _this4.h('span.' + _this4.theme + '-status-tips', '预处理中');
      _this4.el = _this4.h('div.' + _this4.theme + '-progress-filesize', [_this4.total, _this4.splitor, _this4.p]);
      return _this4;
    }

    FileSizeEl.prototype.setProgress = function setProgress(size) {
      if (typeof size === 'number') {
        size = calcSize(size);
      }
      var el = this.h('span', size);
      this.patch(this.p, el);
      this.p = el;
    };

    FileSizeEl.prototype.setStatus = function setStatus(type, text) {
      var el = void 0;
      if (type === 1) {
        el = this.h('span.' + this.theme + '-status-tips.' + this.theme + '-status-auth', text);
      } else {
        el = this.h('span', calcSize(text));
      }
      this.patch(this.p, el);
      this.p = el;
    };

    return FileSizeEl;
  }(UiComponents);

  var DW = ['B', 'K', 'M', 'G', 'T'];
  function calcSize(size) {
    var d = 0;
    while (size > 1024) {
      size = size / 1024;
      d++;
    }
    // 如果是1位就取一位小数，否则直接四舍五入
    if (size < 10) {
      size = size.toFixed(1);
    } else {
      size = Math.round(size);
    }
    return size + DW[d];
  }

  var ProgressTools = function (_UiComponents5) {
    inherits(ProgressTools, _UiComponents5);

    function ProgressTools(theme) {
      classCallCheck(this, ProgressTools);

      var _this5 = possibleConstructorReturn(this, _UiComponents5.call(this, theme));

      _this5.listeners = {};
      _this5.closeEl = _this5.createCloseIcon();
      _this5.pauseEl = _this5.createPauseIcon();
      _this5.startEl = _this5.createStartIcon();
      _this5.md5El = _this5.createMd5Icon();
      _this5.el = _this5.h('div.' + _this5.theme + '-progress-tools', [_this5.closeEl, _this5.md5El]);
      return _this5;
    }

    ProgressTools.prototype.createCloseIcon = function createCloseIcon() {
      var icon = new Icon(this.theme, 'delete', 20, 20, this.theme + '-icon-close');
      return this.h('span.' + this.theme + '-tool-close.' + this.theme + '-tool', {
        on: {
          click: this.deleteUpload.bind(this)
        }
      }, [icon.getEl()]);
    };

    ProgressTools.prototype.createPauseIcon = function createPauseIcon() {
      var icon = new Icon(this.theme, 'pause', 20, 20, this.theme + '-icon-pause');
      return this.h('span.' + this.theme + '-tool-pause.' + this.theme + '-tool', {
        on: {
          click: this.pauseUpload.bind(this)
        }
      }, [icon.getEl()]);
    };

    ProgressTools.prototype.createStartIcon = function createStartIcon() {
      var icon = new Icon(this.theme, 'contine', 20, 20, this.theme + '-icon-pause');
      return this.h('span.' + this.theme + '-tool-pause.' + this.theme + '-tool', {
        on: {
          click: this.startUpload.bind(this)
        }
      }, [icon.getEl()]);
    };

    ProgressTools.prototype.createMd5Icon = function createMd5Icon() {
      var icon = new Icon(this.theme, 'waiting', 20, 20, this.theme + '-icon-waiting', this.theme + '-animate-rotate');
      return this.h('span.' + this.theme + '-tool-waiting.' + this.theme + '-tool', [icon.getEl()]);
    };
    // 暂停上传


    ProgressTools.prototype.pauseUpload = function pauseUpload() {
      var newEl = this.h('div.' + this.theme + '-progress-tools', [this.closeEl, this.startEl]);
      this.patch(this.el, newEl);
      this.el = newEl;
      this.trigger('pause');
    };
    // 开始上传


    ProgressTools.prototype.startUpload = function startUpload() {
      var newEl = this.h('div.' + this.theme + '-progress-tools', [this.closeEl, this.pauseEl]);
      this.patch(this.el, newEl);
      this.el = newEl;
    };
    /**
     * 删除上传
     */


    ProgressTools.prototype.deleteUpload = function deleteUpload() {
      this.trigger('delete');
    };
    /**
     * 上传成功,
     * 隐藏暂停按钮，
     * 显示成功按钮
     */


    ProgressTools.prototype.uploadSuccess = function uploadSuccess() {
      if (!this.successEl) {
        var icon = new Icon(this.theme, 'success', 20, 20, this.theme + '-icon-success');
        this.successEl = this.h('span.' + this.theme + '-tool-success.' + this.theme + '-tool', [icon.getEl()]);
      }
      var newEl = this.h('div.' + this.theme + '-progress-tools', [this.closeEl, this.successEl]);
      this.patch(this.el, newEl);
      this.el = newEl;
    };
    /**
     * 上传失败
     */
    // todo: 上传失败


    ProgressTools.prototype.uploadFailed = function uploadFailed() {};
    /**
     * 根据不同的上传状态，显示不同的ICON
     * @param {string} statu 上传状态
     */


    ProgressTools.prototype.setStatus = function setStatus(statu) {
      // 上传成功
      if (statu === 'success') {
        this.uploadSuccess();
      }
      // else if (statu === 'md5') { // MD5计算
      //   this.md5Calculating()
      // }
      else {
          this.uploadFailed();
        }
    };

    return ProgressTools;
  }(UiComponents);

  var STATUS_TEXT = ['UPLOADING', 'UPLOADED'];

  var Header = function (_UiComponents) {
    inherits(Header, _UiComponents);

    function Header(theme) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, Header);

      var _this = possibleConstructorReturn(this, _UiComponents.call(this));

      _this.theme = theme;
      _this.setStatus(status);
      return _this;
    }

    Header.prototype.getTextByStatus = function getTextByStatus(status) {
      return this.i18n(STATUS_TEXT[status]);
    };
    /**
     * 设置上传的状态
     * 1表示正在上传
     * 0表示上传完成
     */


    Header.prototype.setStatus = function setStatus(status) {
      var text = this.getTextByStatus(status);
      this.el = this.h('div.' + this.theme + '-fileset-header', [this.h('span.' + this.theme + '-header-text', text)]);
    };

    Header.prototype.changeStatus = function changeStatus(status) {
      var text = this.getTextByStatus(status);
      if (this.el) {
        var newEl = this.h('div.' + this.theme + '-fileset-header', [this.h('span.' + this.theme + '-header-text', text)]);
        this.patch(this.el, newEl);
      }
    };

    return Header;
  }(UiComponents);

  var WebUi = function (_Render) {
    inherits(WebUi, _Render);

    function WebUi(btnEl, fileListEl, theme) {
      classCallCheck(this, WebUi);

      var _this = possibleConstructorReturn(this, _Render.call(this, theme));

      _this.btnEl = btnEl;
      _this.files = [];
      // this.fileListId = fileListEl.getAttribute('id')
      _this.resetUploadBtn();
      _this.progressEls = [];
      _this.fileListHeader = new Header(theme);
      _this.progressEls.push(_this.fileListHeader.getEl());
      _this.fileListHeader.setStatus(0);
      _this.list = _this.h('div.' + _this.theme + '-progress-list', []);
      _this.progressEls.push(_this.list);
      _this.fileListVnode = _this.h('div.' + _this.theme + '-fileset', _this.progressEls);
      _this.patch(fileListEl, _this.fileListVnode);
      return _this;
    }
    /**
     * 包裹上传元素，使其能进行上传
     */


    WebUi.prototype.resetUploadBtn = function resetUploadBtn() {
      var nEl = this.h('div.' + this.theme + '-filebutton-wrapper', {
        style: {
          width: this.btnEl.offsetWidth + 'px',
          height: this.btnEl.offsetHeight + 'px'
        }
      }, [this.toVNode(this.btnEl), this.h('input', {
        props: {
          type: 'file',
          multiple: 'multiple'
        },
        on: {
          change: this.fileChange.bind(this)
        }
      })]);
      this.patch(this.btnEl, nEl);
    };
    // 根据上传的文件数，初始化文件上传对象


    WebUi.prototype.fileChange = function fileChange(e) {
      var _this2 = this;

      // todo: IE9 无法获取file
      var files = [];
      Array.prototype.map.call(e.target.files, function (f) {
        if (/\.([a-zA-Z]+?)$/.test(f.name)) {
          // 只能上传带有后缀的文件
          var fs = new FileSdk(f);
          var suffix = RegExp.$1;
          var progress = new Progress(_this2.theme, f.name, suffix, f.size);
          fs.on('progress', function (data, loaded) {
            console.log(loaded);
            if (!loaded) {
              loaded = f.size;
            }
            progress.setProgress(data, loaded);
          });
          fs.on('success', function (data) {
            progress.setStatus('success', data);
          });
          fs.on('md5', function () {
            progress.setStatus('md5');
          });
          fs.on('auth', function () {
            progress.setStatus('auth');
          });
          progress.on('pause', function () {
            // fs.pause()
          });
          progress.on('start', function () {
            // fs.start()
          });
          progress.on('delete', function () {
            // 1) 取消上传
            // 2) 上传上传进度条
            // 3) 同步修改上传文件对象列表
            // fs.cancel()
          });
          fs.start();
          files.push({
            f: fs,
            p: progress,
            name: f.name,
            size: f.size,
            suffix: suffix
          });
        }
      });
      this.files = this.files.concat(files);
      this.handleFiles();
    };

    WebUi.prototype.handleFiles = function handleFiles() {
      var allProgress = [];
      this.files.map(function (file) {
        allProgress.push(file.p.getEl());
      });
      // warning: 感觉这种写法好傻，创建一个新对象，比较新对象与之前的对象。在DOM渲染后在将旧对象引用指向新对象，然后回收旧对象。
      // warning: 如果双向绑定一定是这样做，注意不要一次修改整个对象树，而是只修改某个子树。
      var newList = this.h('div.' + this.theme + '-fileset-list', allProgress);
      this.patch(this.list, newList);
      this.list = newList;
    };

    return WebUi;
  }(Render);

  // import './assets/less/common.less'

  var UI_TYPES = ['webui', // 带样式的web端文件上传
  'mobileui', // 带样式的mobile端文件上传
  'websdk', // 无样式的web端文件上传
  'mobilesdk' // 无样式的mobile端文件上传
  ];

  var Uploader$1 = function () {
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
          _ref$theme = _ref.theme,
          theme = _ref$theme === undefined ? 'default' : _ref$theme,
          options = _ref.options;
      classCallCheck(this, Uploader);

      if (this.validate(env, btnEl, fileListEl)) {
        this.env = env;
        this.btnEl = btnEl;
        this.fileListEl = fileListEl;
        this.path = path;
        this.options = options;
        this.theme = theme;
        this.handleUploader();
      }
    }

    Uploader.prototype.handleUploader = function handleUploader() {
      if (this.env === 'webui') {
        this.uploader = new WebUi(this.btnEl, this.fileListEl, this.theme);
      }
    };

    Uploader.prototype.start = function start() {
      console.log('start');
    };

    Uploader.prototype.validate = function validate(env) {
      if (UI_TYPES.indexOf(env) === -1) {
        LOG.error('FE1003');
        return;
      }
      if (env === 'webui') {
        var btnEl = arguments.length <= 1 ? undefined : arguments[1];
        var fileListEl = arguments.length <= 2 ? undefined : arguments[2];
        if (!(btnEl instanceof HTMLElement)) {
          LOG.error('FE1001');
          return;
        }
        if (!(fileListEl instanceof HTMLElement)) {
          LOG.error('FE1002');
          return;
        }
      }
      return true;
    };

    return Uploader;
  }();

  return Uploader$1;

})));
