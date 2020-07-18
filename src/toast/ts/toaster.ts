import { UID } from "@/util"

import { Toast, ToastOptions } from "./toast"
import animations from './animations';

export class Toaster {

  // Properties
  id: string;
  options: ToasterOptions;
  toasts: Toast[];
  container: HTMLDivElement;

  constructor(options: ToasterOptions) {
    this.id = UID();
    this.options = options;
    this.toasts = [];
    this.container = this.makeToastContainer(options);
  }


  // Showing
  show(message: string, options?: ToastOptions): Toast {
    return this._show(message, options);
  }

  success(message: string, options?: ToastOptions): Toast {
    options = options || {};
    options.type = "success";
    return this._show(message, options);
  }

  info(message: string, options?: ToastOptions): Toast {
    options = options || {};
    options.type = "info";
    return this._show(message, options);
  }

  error(message: string, options?: ToastOptions): Toast {
    options = options || {};
    options.type = "error";
    return this._show(message, options);
  }


  // Removing
  remove(id: string, el: HTMLElement) {
    this.toasts = this.toasts.filter((t) => {
      return t.id !== id;
    })
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  clear(): boolean {
    animations.clearAnimation(this.toasts);
    this.toasts = [];

    return true;
  }


  // Helpers
  _show(message: string, options?: ToastOptions) {
    // singleton feature
    if(this.options.singleton && this.toasts.length > 0) {
      this.toasts[this.toasts.length - 1].goAway(0);
    }
  
    let toast = new Toast(message, options ?? {}, this);
    toast.display();
    this.toasts.push(toast);
  
    return toast;
  }

  makeToastContainer(options: ToasterOptions): HTMLDivElement {
    const container = document.createElement('div');
    container.id = this.id;
    container.classList.add("toaster");
    container.classList.add(options.position ?? "bottom-right");
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
  
    document.body.appendChild(container);
    return container
  }

}

export type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'

export interface ToasterOptions {
  /**
   * Position of the toast container (default: 'bottom-right')
   */
  position?: ToastPosition,
  /**
   * Only allows one toast at a time.
   */
  singleton?: boolean,
}
