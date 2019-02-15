/** Detecting option support */
let passiveSupported = false;

try {
  let options = Object.defineProperty({}, "passive", {
    get: () => (passiveSupported = true)
  });

  window.addEventListener("test", null, options);
} catch (error) {}

const eventOptions = passiveSupported ? { passive: true } : false;

class Keyboard {
  constructor(container) {
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
    this._blur = this._blur.bind(this);

    /* Append the keyboard to the container if given */
    if (container) {
      this.attach(container);
    }
  }

  /** Generic function for adding events. */
  _addEvent(event, events) {
    if (typeof event === "function") {
      events.push(event);
    }

    return () => this._removeEvent(event, events);
  }

  /** Generic function for removing events. */
  _removeEvent(event, events) {
    const index = events.indexOf(event);

    if (index !== -1) {
      events.splice(index, 1);
    }

    this.updateListeners();
  }

  /** Generic function for firing events. */
  _fireEvent(events, eventParams) {
    for (let i = 0; i < events.length; i++) {
      events[i](eventParams);
    }
  }

  /** When a key is pressed. */
  _keyDown(event) {
    /* Put keyboard as a reference in the event. */
    event.keyboard = this;

    /* Skip the default behaviours upon this event. */
    if (this.preventDefault === true) {
      event.preventDefault();
    }

    let keyCode = event.which || event.keyCode;
    let newKeyPressed = this.keyCodesPressed.indexOf(keyCode) === -1;

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
  _keyUp(event) {
    /* Put keyboard as a reference in the event. */
    event.keyboard = this;

    /* Skip the default behaviours upon this event. */
    if (this.preventDefault === true) {
      event.preventDefault();
    }

    let keyCode = event.which || event.keyCode;
    let index = this.keyCodesPressed.indexOf(keyCode);

    /* Remove the key from the key pressed list. */
    if (index !== -1) {
      this.keyCodesPressed.splice(index, 1);
    }

    /* Perform action for up event. */
    this._fireEvent(this.upEvents, event);
  }

  /** When the attached container lost focus. */
  _blur(event) {
    /* Put keyboard as a reference in the event. */
    event.keyboard = this;

    /* Skip the default behaviours upon this event. */
    if (this.preventDefault === true) {
      event.preventDefault();
    }

    this.keyCodesPressed = [];

    /* Perform action for up event. */
    this._fireEvent(this.upEvents, event);
  }

  /** Append the keyboard to the a DOM element and event handlers to it. */
  attach(element) {
    if (element.tagName !== "INPUT" && element.tabIndex < 0) {
      element.tabIndex = -1;
    }

    /* Store a reference of the DOM element. */
    this.listenElement = element;

    /* Engage the essential keyboard events to each corresponding handler. */
    element.addEventListener("keydown", this._keyDown, eventOptions);
    element.addEventListener("keyup", this._keyUp, eventOptions);
    element.addEventListener("blur", this._blur, eventOptions);
  }

  /** Detach the keyboard from DOM element and event handlers from it. */
  detach() {
    /* Detach all the keyboard events from each corresponding handler. */
    if (this.listenElement && this.listenElement.removeEventListener) {
      let element = this.listenElement;

      element.removeEventListener("keydown", this._keyDown, eventOptions);
      element.removeEventListener("keyup", this._keyUp, eventOptions);
      element.removeEventListener("blur", this._blur, eventOptions);

      if (element.tagName !== "INPUT" && element.tabIndex < 0) {
        element.removeAttribute("tabIndex");
      }

      /* Remove the reference of the DOM element. */
      this.listenElement = null;
    }
  }

  /** Toggle value for keyboard prevent default on all events. */
  setPreventDefault(preventDefault) {
    this.preventDefault = preventDefault;
  }

  /** Toggle value for keyboard skipping further key down events. */
  setPreventHoldDownEvent(preventHoldDownEvent) {
    this.preventHoldDownEvent = preventHoldDownEvent;
  }

  /** Bind an event handler to the key down event. */
  onKeyDown(downEvent) {
    return this._addEvent(downEvent, this.downEvents);
  }

  /** Unbind an event handler to the key down event. */
  removeKeyDown(downEvent) {
    return this._removeEvent(downEvent, this.downEvents);
  }

  /** Unbind all event handlers from the key down event. */
  clearKeyDown() {
    this.downEvents = [];
  }

  /** Bind an event handler to the key up event. */
  onKeyUp(upEvent) {
    return this._addEvent(upEvent, this.upEvents);
  }

  /** Unbind an event handler to the key up event. */
  removeKeyUp(upEvent) {
    return this._removeEvent(upEvent, this.upEvents);
  }

  /** Unbind all event handlers from the key up event. */
  clearKeyUp() {
    this.upEvents = [];
  }

  /** Checks if a given keyCode has been pressed. */
  hasKeyPressed(keyCode) {
    return this.keyCodesPressed.indexOf(keyCode) !== -1;
  }

  /** Get the last keyCode that has been pressed. */
  getLastKeyPressed() {
    const { keyCodesPressed: pressed } = this;

    return pressed.length > 0 ? pressed[pressed.length - 1] : null;
  }
}

/* Introduce key name to key codes mapping. */
export const Keys = {
  BACKSPACE_DELETE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  CAPSLOCK: 20,
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
  SEMICOLON_FIREFOX: 59,
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
  META_LEFT: 91,
  META_RIGHT: 93,
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
  SEMICOLON: 186,
  EQUAL: 187,
  COMMA: 188,
  MINUS: 189,
  PERIOD: 190,
  SLASH: 191,
  BACK_QUOTE: 192,
  BRACKET_LEFT: 219,
  BACK_SLASH: 220,
  BRACKET_RIGHT: 221,
  QUOTE: 222,
  META_FIREFOX: 224
};

/* Introduce key codes to key name mapping. */
export const KeyCodes = {
  8: "BACKSPACE/DELETE",
  9: "TAB",
  13: "ENTER",
  16: "SHIFT",
  17: "CTRL",
  18: "ALT",
  20: "CAPSLOCK",
  27: "ESCAPE",
  32: "SPACE BAR",
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  59: "SEMICOLON (FIREFOX)",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  91: "META LEFT",
  93: "META RIGHT",
  96: "NUMPAD 0",
  97: "NUMPAD 1",
  98: "NUMPAD 2",
  99: "NUMPAD 3",
  100: "NUMPAD 4",
  101: "NUMPAD 5",
  102: "NUMPAD 6",
  103: "NUMPAD 7",
  104: "NUMPAD 8",
  105: "NUMPAD 9",
  106: "NUMPAD MULTIPLY",
  107: "NUMPAD ADD",
  109: "NUMPAD SUBTRACT",
  110: "NUMPAD DECIMAL POINT",
  111: "NUMPAD DIVIDE",
  186: "SEMICOLON",
  187: "EQUAL",
  188: "COMMA",
  189: "SUBTRACT",
  190: "PERIOD",
  191: "SLASH",
  192: "BACK QUOTE",
  219: "BRACKET LEFT",
  221: "BRACKET RIGHT",
  220: "BACK SLASH",
  222: "QUOTE",
  224: "META (FIREFOX)"
};

export default Keyboard;
