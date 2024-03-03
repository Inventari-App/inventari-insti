(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/autocompleter/autocomplete.js
  var require_autocomplete = __commonJS({
    "node_modules/autocompleter/autocomplete.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.autocomplete = factory());
      })(exports, function() {
        "use strict";
        function autocomplete2(settings) {
          var doc = document;
          var container = settings.container || doc.createElement("div");
          var containerStyle = container.style;
          var userAgent = navigator.userAgent;
          var mobileFirefox = ~userAgent.indexOf("Firefox") && ~userAgent.indexOf("Mobile");
          var debounceWaitMs = settings.debounceWaitMs || 0;
          var preventSubmit = settings.preventSubmit || false;
          var disableAutoSelect = settings.disableAutoSelect || false;
          var keyUpEventName = mobileFirefox ? "input" : "keyup";
          var items = [];
          var inputValue = "";
          var minLen = 2;
          var showOnFocus = settings.showOnFocus;
          var selected;
          var keypressCounter = 0;
          var debounceTimer;
          if (settings.minLength !== void 0) {
            minLen = settings.minLength;
          }
          if (!settings.input) {
            throw new Error("input undefined");
          }
          var input = settings.input;
          container.className = "autocomplete " + (settings.className || "");
          containerStyle.position = "absolute";
          function detach() {
            var parent = container.parentNode;
            if (parent) {
              parent.removeChild(container);
            }
          }
          function clearDebounceTimer() {
            if (debounceTimer) {
              window.clearTimeout(debounceTimer);
            }
          }
          function attach() {
            if (!container.parentNode) {
              doc.body.appendChild(container);
            }
          }
          function containerDisplayed() {
            return !!container.parentNode;
          }
          function clear() {
            keypressCounter++;
            items = [];
            inputValue = "";
            selected = void 0;
            detach();
          }
          function updatePosition() {
            if (!containerDisplayed()) {
              return;
            }
            containerStyle.height = "auto";
            containerStyle.width = input.offsetWidth + "px";
            var maxHeight = 0;
            var inputRect;
            function calc() {
              var docEl = doc.documentElement;
              var clientTop = docEl.clientTop || doc.body.clientTop || 0;
              var clientLeft = docEl.clientLeft || doc.body.clientLeft || 0;
              var scrollTop = window.pageYOffset || docEl.scrollTop;
              var scrollLeft = window.pageXOffset || docEl.scrollLeft;
              inputRect = input.getBoundingClientRect();
              var top = inputRect.top + input.offsetHeight + scrollTop - clientTop;
              var left = inputRect.left + scrollLeft - clientLeft;
              containerStyle.top = top + "px";
              containerStyle.left = left + "px";
              maxHeight = window.innerHeight - (inputRect.top + input.offsetHeight);
              if (maxHeight < 0) {
                maxHeight = 0;
              }
              containerStyle.top = top + "px";
              containerStyle.bottom = "";
              containerStyle.left = left + "px";
              containerStyle.maxHeight = maxHeight + "px";
            }
            calc();
            calc();
            if (settings.customize && inputRect) {
              settings.customize(input, inputRect, container, maxHeight);
            }
          }
          function update() {
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
            var render = function(item, currentValue) {
              var itemElement = doc.createElement("div");
              itemElement.textContent = item.label || "";
              return itemElement;
            };
            if (settings.render) {
              render = settings.render;
            }
            var renderGroup = function(groupName, currentValue) {
              var groupDiv = doc.createElement("div");
              groupDiv.textContent = groupName;
              return groupDiv;
            };
            if (settings.renderGroup) {
              renderGroup = settings.renderGroup;
            }
            var fragment = doc.createDocumentFragment();
            var prevGroup = "#9?$";
            items.forEach(function(item) {
              if (item.group && item.group !== prevGroup) {
                prevGroup = item.group;
                var groupDiv = renderGroup(item.group, inputValue);
                if (groupDiv) {
                  groupDiv.className += " group";
                  fragment.appendChild(groupDiv);
                }
              }
              var div = render(item, inputValue);
              if (div) {
                div.addEventListener("click", function(ev) {
                  settings.onSelect(item, input);
                  clear();
                  ev.preventDefault();
                  ev.stopPropagation();
                });
                if (item === selected) {
                  div.className += " selected";
                }
                fragment.appendChild(div);
              }
            });
            container.appendChild(fragment);
            if (items.length < 1) {
              if (settings.emptyMsg) {
                var empty = doc.createElement("div");
                empty.className = "empty";
                empty.textContent = settings.emptyMsg;
                container.appendChild(empty);
              } else {
                clear();
                return;
              }
            }
            attach();
            updatePosition();
            updateScroll();
          }
          function updateIfDisplayed() {
            if (containerDisplayed()) {
              update();
            }
          }
          function resizeEventHandler() {
            updateIfDisplayed();
          }
          function scrollEventHandler(e) {
            if (e.target !== container) {
              updateIfDisplayed();
            } else {
              e.preventDefault();
            }
          }
          function keyupEventHandler(ev) {
            var keyCode = ev.which || ev.keyCode || 0;
            var ignore = settings.keysToIgnore || [
              38,
              13,
              27,
              39,
              37,
              16,
              17,
              18,
              20,
              91,
              9
              /* Tab */
            ];
            for (var _i = 0, ignore_1 = ignore; _i < ignore_1.length; _i++) {
              var key = ignore_1[_i];
              if (keyCode === key) {
                return;
              }
            }
            if (keyCode >= 112 && keyCode <= 123 && !settings.keysToIgnore) {
              return;
            }
            if (keyCode === 40 && containerDisplayed()) {
              return;
            }
            startFetch(
              0
              /* Keyboard */
            );
          }
          function updateScroll() {
            var elements = container.getElementsByClassName("selected");
            if (elements.length > 0) {
              var element = elements[0];
              var previous = element.previousElementSibling;
              if (previous && previous.className.indexOf("group") !== -1 && !previous.previousElementSibling) {
                element = previous;
              }
              if (element.offsetTop < container.scrollTop) {
                container.scrollTop = element.offsetTop;
              } else {
                var selectBottom = element.offsetTop + element.offsetHeight;
                var containerBottom = container.scrollTop + container.offsetHeight;
                if (selectBottom > containerBottom) {
                  container.scrollTop += selectBottom - containerBottom;
                }
              }
            }
          }
          function selectPrev() {
            if (items.length < 1) {
              selected = void 0;
            } else {
              if (selected === items[0]) {
                selected = items[items.length - 1];
              } else {
                for (var i = items.length - 1; i > 0; i--) {
                  if (selected === items[i] || i === 1) {
                    selected = items[i - 1];
                    break;
                  }
                }
              }
            }
          }
          function selectNext() {
            if (items.length < 1) {
              selected = void 0;
            }
            if (!selected || selected === items[items.length - 1]) {
              selected = items[0];
              return;
            }
            for (var i = 0; i < items.length - 1; i++) {
              if (selected === items[i]) {
                selected = items[i + 1];
                break;
              }
            }
          }
          function keydownEventHandler(ev) {
            var keyCode = ev.which || ev.keyCode || 0;
            if (keyCode === 38 || keyCode === 40 || keyCode === 27) {
              var containerIsDisplayed = containerDisplayed();
              if (keyCode === 27) {
                clear();
              } else {
                if (!containerIsDisplayed || items.length < 1) {
                  return;
                }
                keyCode === 38 ? selectPrev() : selectNext();
                update();
              }
              ev.preventDefault();
              if (containerIsDisplayed) {
                ev.stopPropagation();
              }
              return;
            }
            if (keyCode === 13) {
              if (selected) {
                settings.onSelect(selected, input);
                clear();
              }
              if (preventSubmit) {
                ev.preventDefault();
              }
            }
          }
          function focusEventHandler() {
            if (showOnFocus) {
              startFetch(
                1
                /* Focus */
              );
            }
          }
          function startFetch(trigger) {
            var savedKeypressCounter = ++keypressCounter;
            var inputText = input.value;
            var cursorPos = input.selectionStart || 0;
            if (inputText.length >= minLen || trigger === 1) {
              clearDebounceTimer();
              debounceTimer = window.setTimeout(function() {
                settings.fetch(inputText, function(elements) {
                  if (keypressCounter === savedKeypressCounter && elements) {
                    items = elements;
                    inputValue = inputText;
                    selected = items.length < 1 || disableAutoSelect ? void 0 : items[0];
                    update();
                  }
                }, trigger, cursorPos);
              }, trigger === 0 ? debounceWaitMs : 0);
            } else {
              clear();
            }
          }
          function blurEventHandler() {
            setTimeout(function() {
              if (doc.activeElement !== input) {
                clear();
              }
            }, 200);
          }
          container.addEventListener("mousedown", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
          });
          container.addEventListener("focus", function() {
            return input.focus();
          });
          function destroy() {
            input.removeEventListener("focus", focusEventHandler);
            input.removeEventListener("keydown", keydownEventHandler);
            input.removeEventListener(keyUpEventName, keyupEventHandler);
            input.removeEventListener("blur", blurEventHandler);
            window.removeEventListener("resize", resizeEventHandler);
            doc.removeEventListener("scroll", scrollEventHandler, true);
            clearDebounceTimer();
            clear();
          }
          input.addEventListener("keydown", keydownEventHandler);
          input.addEventListener(keyUpEventName, keyupEventHandler);
          input.addEventListener("blur", blurEventHandler);
          input.addEventListener("focus", focusEventHandler);
          window.addEventListener("resize", resizeEventHandler);
          doc.addEventListener("scroll", scrollEventHandler, true);
          return {
            destroy
          };
        }
        return autocomplete2;
      });
    }
  });

  // bundles/autocompletes.js
  var autocomplete = require_autocomplete();
  var addAutocompletes = (autocompletes) => autocompletes.forEach(({ autocompleteName, filter }) => {
    const inputEl = document.querySelector(`#${autocompleteName}`);
    const optionsRoute = `/${autocompleteName}s/all`;
    autocomplete({
      input: inputEl,
      fetch: function(text, update) {
        window.fetch(optionsRoute).then((res) => res.json()).then((data) => {
          text = text.toLowerCase();
          var suggestions = data.filter(
            (data2) => data2.nom.toLowerCase().includes(text)
          );
          update(
            filter ? suggestions.filter((suggestion) => suggestion[filter]) : suggestions
          );
        });
      },
      onSelect: function(suggestion) {
        const { nom } = suggestion;
        this.input.value = nom;
      },
      render: function(suggestion) {
        if (suggestion) {
          const nom = suggestion.nom;
          const div = document.createElement("div");
          div.setAttribute("id", `autocomplete-${autocompleteName}`);
          div.textContent = nom;
          div.classList.add("autocomplete-suggestions");
          return div;
        }
      }
    });
  });
  var autocompletes_default = window.addAutocompletes = addAutocompletes;
})();
