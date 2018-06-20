# jw-keyboard

An instance class which hooks into keyup and keydown, and keeps track of all the key pressed.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/jw-keyboard.svg
[npm-url]: http://npmjs.org/package/jw-keyboard
[travis-image]: https://img.shields.io/travis/WaiChungWong/jw-keyboard.svg
[travis-url]: https://travis-ci.org/WaiChungWong/jw-keyboard
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jw-keyboard.svg
[download-url]: https://npmjs.org/package/jw-keyboard

## install

[![NPM](https://nodei.co/npm/jw-keyboard.png)](https://nodei.co/npm/jw-keyboard)

## Methods

| Method                    | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `attach`                  | append the keyboard to the a DOM element and event functions to it.      |
| `detach`                  | disengage the keyboard from DOM element and event functions from it.     |
| `setPreventDefault`       | toggle value for keyboard prevent default on all events.                 |
| `setPreventHoldDownEvent` | toggle value for keyboard skipping further key down events.              |
| `onKeyDown`               | bind an event handler to the key down event. Returns a method to unbind. |
| `clearKeyDown`            | unbind all event handlers from the key down event.                       |
| `onKeyUp`                 | bind an event handler to the key up event. Returns a method to unbind.   |
| `clearKeyUp`              | unbind all event handlers from the key up event.                         |
| `hasKeyPressed`           | check if a given keyCode has been pressed.                               |
| `getLastKeyPressed`       | get the last keyCode that has been pressed.                              |

## Handler Event

On handling the event, the same event object as the one from `addEventListener` will be passed as a parameter, with an additional `keyboard` object, which holds the following properties:

| Prop              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `keyCodesPressed` | the list of key codes of the keys that has been pressed. |

## Usage

```javascript
import Keyboard, { Keys } from "jw-keyboard";

/* Get the container for the keyboard. */
let container = document.getElementById("container");

/* Create a keyboard instance, with the element as its container.
 * This is to allow the keyboard to monitor all key events from the container. */
let keyboard = new Keyboard(container);

/** Append the keyboard to the a DOM element and event handlers to it. */
keyboard.attach(container);

/** Detach the keyboard from DOM element and event handlers from it. */
keyboard.detach();

/** Toggle value for keyboard prevent default on all events. */
keyboard.setPreventDefault(false);

/** Toggle value for keyboard skipping further key down events. */
keyboard.setPreventHoldDownEvent(false);

/** Bind an event handler to the key down event. */
let removeKeyDown = keyboard.onKeyDown(event => { ... });

/** Unbind an event handler to the key down event. */
removeKeyDown();

/** Unbind all event handlers from the key down event. */
keyboard.clearKeyDown();

/** Bind an event handler to the key up event. */
let removeKeyUp = keyboard.onKeyUp(event => { ... });

/** Unbind an event handler to the key up event. */
removeKeyUp();

/** Unbind all event handlers from the key up event. */
keyboard.clearKeyUp();

/** Check if a given keyCode has been pressed. */
keyboard.hasKeyPressed(keyCode);

/** Get the last keyCode that has been pressed. */
keyboard.getLastKeyPressed();
```
