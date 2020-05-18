// import Vue from 'vue';
import Vuex from 'vuex';
import user from './moudle/user';
import silderBar from './moudle/silderBar';
import getters from './getters';


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        silderBar
    },
    getters
});