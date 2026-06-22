/**
 * Button
 *
 * @version 1.0.3
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/button}
 */

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import { getActiveElement } from 'power-focusable';

// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

export default class Button {
  #element!: HTMLElement;
  #controller: AbortController | null = null;
  #isDestroyed = false;

  constructor(element: HTMLElement) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Invalid element');
    }

    if (element.hasAttribute('data-button-initialized')) {
      console.warn('Already initialized');
      return;
    }

    this.#element = element;
    this.#initialize();
  }

  destroy(): void {
    if (this.#isDestroyed) {
      return;
    }

    this.#isDestroyed = true;
    this.#controller?.abort();
    this.#controller = null;
    this.#element.removeAttribute('data-button-initialized');
  }

  #initialize(): void {
    this.#controller = new AbortController();
    this.#element.addEventListener('keydown', this.#onKeyDown, {
      signal: this.#controller.signal,
    });
    this.#element.setAttribute('data-button-initialized', '');
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    const { key, altKey, ctrlKey, metaKey, shiftKey } = event;

    if (altKey || ctrlKey || metaKey || shiftKey) {
      return;
    }

    if (!['Enter', ' '].includes(key)) {
      return;
    }

    const active = getActiveElement();

    if (!(active instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    active.click();
  };
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export { getActiveElement };
