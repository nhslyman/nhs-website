import {Toaster as T} from './ts/toaster';
import ToastComponent from './toast.vue';

const Toaster = {
    install(Vue, options) {
        if (!options) {
            options = {};
        }

        const Toast = new T(options);
        Vue.component('toaster', ToastComponent);
        Vue.toaster = Vue.prototype.$toaster = Toast;
    }
};

export default Toaster
