"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Detecting option support */
var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function get() {
      return passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch (error) {}

var eventOptions = passiveSupported ? { passive: true } : false;

var Keyboard = function () {
  function Keyboard(container) {
    _classCallCheck(this, Keyboard);

    /* Whether the keyboard skips the default behaviours upon the listen element. */
    this.preventDefault = false;

    /* Whether the keyboard skips any further key down event after the first one. */
    this.preventHoldDownEvent = false;

    /* The list of key codes of the keys that has been pressed. */
    this.keyCodesPressed = [];

    /* The list of listeners this keyboard is appended to.
    * Each keyboard event will trigger the corresponding method of each listeners. */
    this.downEvents = [];
    this.upEvents = [];

    /* Add bindings to all event methods to secure scoping. */
    this._keyDown = this._keyDown.bind(this);
    this._keyUp = this._keyUp.bind(this);

    /* Append the keyboard to the container if given */
    if (container) {
      this.attach(container);
    }
  }

  /** Generic function for adding events. */


  _createClass(Keyboard, [{
    key: "_addEvent",
    value: function _addEvent(event, events) {
      var _this = this;

      if (typeof event === "function") {
        events.push(event);
      }

      return function () {
        return _this._removeEvent(event, events);
      };
    }

    /** Generic function for removing events. */

  }, {
    key: "_removeEvent",
    value: function _removeEvent(event, events) {
      var index = events.indexOf(event);

      if (index !== -1) {
        events.splice(index, 1);
      }

      this.updateListeners();
    }

    /** Generic function for firing events. */

  }, {
    key: "_fireEvent",
    value: function _fireEvent(events, eventParams) {
      for (var i = 0; i < events.length; i++) {
        events[i](eventParams);
      }
    }

    /** When a key is pressed. */

  }, {
    key: "_keyDown",
    value: function _keyDown(event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = this;

      /* Skip the default behaviours upon this event. */
      if (this.preventDefault === true) {
        event.preventDefault();
      }

      var keyCode = event.which || event.keyCode;
      var newKeyPressed = this.keyCodesPressed.indexOf(keyCode) === -1;

      /* Add a new key pressed to the key pressed list. */
      if (newKeyPressed) {
        this.keyCodesPressed.push(keyCode);
      }

      if (newKeyPressed || !this.preventHoldDownEvent) {
        /* Perform action for down event. */
        this._fireEvent(this.downEvents, event);
      }
    }

    /** When a key is released. */

  }, {
    key: "_keyUp",
    value: function _keyUp(event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = this;

      /* Skip the default behaviours upon this event. */
      if (this.preventDefault === true) {
        event.preventDefault();
      }

      var keyCode = event.which || event.keyCode;
      var index = this.keyCodesPressed.indexOf(keyCode);

      /* Remove the key from the key pressed list. */
      if (index !== -1) {
        this.keyCodesPressed.splice(index, 1);
      }

      /* Perform action for up event. */
      this._fireEvent(this.upEvents, event);
    }

    /** Append the keyboard to the a DOM element and event handlers to it. */

  }, {
    key: "attach",
    value: function attach(element) {
      if (element.tagName !== "INPUT" && element.tabIndex < 0) {
        element.tabIndex = -1;
      }

      /* Store a reference of the DOM element. */
      this.listenElement = element;

      /* Engage the essential keyboard events to each corresponding handler. */
      element.addEventListener("keydown", this._keyDown, eventOptions);
      element.addEventListener("keyup", this._keyUp, eventOptions);
    }

    /** Detach the keyboard from DOM element and event handlers from it. */

  }, {
    key: "detach",
    value: function detach() {
      /* Detach all the keyboard events from each corresponding handler. */
      if (this.listenElement && this.listenElement.removeEventListener) {
        var element = this.listenElement;

        element.removeEventListener("keydown", this._keyDown, eventOptions);
        element.removeEventListener("keyup", this._keyUp, eventOptions);

        if (element.tagName !== "INPUT" && element.tabIndex < 0) {
          element.removeAttribute("tabIndex");
        }

        /* Remove the reference of the DOM element. */
        this.listenElement = null;
      }
    }

    /** Toggle value for keyboard prevent default on all events. */

  }, {
    key: "setPreventDefault",
    value: function setPreventDefault(preventDefault) {
      this.preventDefault = preventDefault;
    }

    /** Toggle value for keyboard skipping further key down events. */

  }, {
    key: "setPreventHoldDownEvent",
    value: function setPreventHoldDownEvent(preventHoldDownEvent) {
      this.preventHoldDownEvent = preventHoldDownEvent;
    }

    /** Bind an event handler to the key down event. */

  }, {
    key: "onKeyDown",
    value: function onKeyDown(downEvent) {
      return this._addEvent(downEvent, this.downEvents);
    }

    /** Unbind an event handler to the key down event. */

  }, {
    key: "removeKeyDown",
    value: function removeKeyDown(downEvent) {
      return this._removeEvent(downEvent, this.downEvents);
    }

    /** Unbind all event handlers from the key down event. */

  }, {
    key: "clearKeyDown",
    value: function clearKeyDown() {
      this.downEvents = [];
    }

    /** Bind an event handler to the key up event. */

  }, {
    key: "onKeyUp",
    value: function onKeyUp(upEvent) {
      return this._addEvent(upEvent, this.upEvents);
    }

    /** Unbind an event handler to the key up event. */

  }, {
    key: "removeKeyUp",
    value: function removeKeyUp(upEvent) {
      return this._removeEvent(upEvent, this.upEvents);
    }

    /** Unbind all event handlers from the key up event. */

  }, {
    key: "clearKeyUp",
    value: function clearKeyUp() {
      this.upEvents = [];
    }

    /** Checks if a given keyCode has been pressed. */

  }, {
    key: "hasKeyPressed",
    value: function hasKeyPressed(keyCode) {
      return this.keyCodesPressed.indexOf(keyCode) !== -1;
    }

    /** Get the last keyCode that has been pressed. */

  }, {
    key: "getLastKeyPressed",
    value: function getLastKeyPressed() {
      var pressed = this.keyCodesPressed;


      return pressed.length > 0 ? pressed[pressed.length - 1] : null;
    }
  }]);

  return Keyboard;
}();

/* Introduce keycodes. */


var Keys = exports.Keys = {
  BACKSPACE_DELETE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESCAPE: 27,
  SPACE_BAR: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  NUMPAD_MULTIPLY: 106,
  NUMPAD_ADD: 107,
  NUMPAD_SUBTRACT: 109,
  NUMPAD_DECIMAL_POINT: 110,
  NUMPAD_DIVIDE: 111,
  EQUAL: 187,
  MINUS: 189,
  PERIOD: 190,
  FORWARD_SLASH: 191,
  BACK_SLASH: 220
};

exports.default = Keyboard;