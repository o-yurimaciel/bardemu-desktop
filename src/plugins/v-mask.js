import Vue from 'vue'
 
import VueMask from 'v-mask'
Vue.use(VueMask);

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

import { VueMaskFilter } from 'v-mask'
Vue.filter('VMask', VueMaskFilter)