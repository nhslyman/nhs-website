import { VueConstructor } from 'vue/types/vue'
import { Toaster, ToasterOptions } from "./ts/toaster"
import ToastComponent from './toast.vue';

export function ToasterPlugin(vue: VueConstructor, options?: ToasterOptions) {
    if (!options) {
        options = {};
    }

    const toaster = new Toaster(options);
    vue.component('toaster', ToastComponent);
    vue.toaster = vue.prototype.$toaster = toaster;
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    toaster: Toaster
  }

  interface Vue {
    $toaster: Toaster
  }
}

export * from "./ts/toaster"
