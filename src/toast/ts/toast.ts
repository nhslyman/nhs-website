import animations from './animations'
import { Toaster } from './toaster'
import { UID } from '@/util';

export class Toast {
  id: string;
  message: string;
  options: ToastOptions;
  toaster: Toaster;
  el: HTMLElement;

  constructor(message: string, options: ToastOptions, toaster: Toaster) {
    this.id      = UID();
    this.message = message;
    this.options = options;
    this.toaster = toaster;
    this.el      = this.createElement(message, options);
  }

  goAway(delay: number) {
    // Animate toast out
    setTimeout( () => {

      // if the toast is on bottom set it as bottom animation
      if(this.toaster.options.position && this.toaster.options.position.includes('bottom')) {
        animations.animateOutBottom(this.el, () => {
          this.toaster.remove(this.id, this.el);
        })
        return;
      }

        animations.animateOut(this.el, () => {
          this.toaster.remove(this.id, this.el);
        })

    }, delay);
  }

  changeText(text: string) {
    this.el.innerHTML = text;
  }

  remove() {
    this.toaster.remove(this.id, this.el);
  }

  createElement(message: string, options: ToastOptions) {
    // Create element
    let el = document.createElement('div');
    el.classList.add('toast');
    el.classList.add(options.type ?? "default");
    el.innerHTML = message;
  
    // create and append dismiss action
    let action = document.createElement('a');
    action.classList.add('action');
    action.classList.add('ripple');
    action.text = "ok"
    el.addEventListener('click', (e) => {
        e.preventDefault();
        this.goAway(0);
    })
    el.appendChild(action)
  
    return el;
  }
  
  display() {
    // Add toast to parent
    const container = this.toaster.container;
    container.appendChild(this.el);
    
    // Animate toast in
    this.el.style.opacity = "0";
    animations.animateIn(this.el)
  }
  
}

export type ToastType = 'success' | 'info' | 'error' | 'default'

export interface ToastOptions {
  /**
   * Display time of the toast in millisecond
   */
  duration?: number,
  /**
   * Type of the Toast ['success', 'info', 'error']. (default: 'default')
   */
  type?: ToastType,
}
