import { Vue, VueConstructor } from 'vue/types/vue'
import { PluginFunction } from "vue"
import { Toaster } from "./ts/toaster"
import { ToastOptions } from "./ts/toast"


declare class ToasterPlugin {
  static install: PluginFunction<ToastOptions>
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
export { ToastOptions, ToastType } from "./ts/toast"
export default ToasterPlugin
