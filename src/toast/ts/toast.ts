import animations from "./animations"
import { Toaster } from "./toaster"
import { UID } from "@/util";

export class Toast {
  id: string;
  message: string;
  options: ToastOptions;
  toaster: Toaster;
  el: HTMLElement;

  constructor(message: string, options: ToastOptions, toaster: Toaster) {
    this.id = UID();
    this.message = message;
    this.options = options;
    this.toaster = toaster;
    this.el = this.createElement(message, options);
  }

  goAway() {
    if (this.toaster.options.position && this.toaster.options.position.includes("bottom")) {
      // if the toast is on bottom set it as bottom animation
      animations.animateOutBottom(this.el, () => {
        this.toaster.remove(this.id, this.el);
      })
    } else {
      // otherwise, go out the top
      animations.animateOut(this.el, () => {
        this.toaster.remove(this.id, this.el);
      })
    }
  }

  changeText(text: string) {
    this.el.innerHTML = text;
  }

  remove() {
    this.toaster.remove(this.id, this.el);
  }

  createElement(message: string, options: ToastOptions) {
    // Create element
    let el = document.createElement("div");
    el.classList.add("toast");
    el.classList.add(options.type ?? "default");
    el.innerHTML = message;

    // create and append dismiss action
    let action = document.createElement("a");
    action.classList.add("action");
    action.classList.add("ripple");
    action.text = "ok";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      this.goAway();
    })
    el.appendChild(action);

    return el;
  }

  display() {
    // Add toast to parent
    const container = this.toaster.container;
    container.appendChild(this.el);

    // Animate toast in
    this.el.style.opacity = "0";
    animations.animateIn(this.el);

    // set remove after duration if duration is not null 
    if (this.options.duration) {
      setTimeout(() => { this.goAway() }, this.options.duration);
    }
  }

}

export type ToastType = "success" | "info" | "error" | "default"

export interface ToastOptions {
  /**
   * Display time of the toast in millisecond
   */
  duration?: number,
  /**
   * Type of the Toast ["success", "info", "error"]. (default: "default")
   */
  type?: ToastType,
}
