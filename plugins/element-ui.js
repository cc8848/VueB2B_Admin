import Vue from 'vue'
import Element from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'
import locale from 'element-ui/lib/locale/lang/en'
import VueDND from 'awe-dnd'
 
Vue.use(VueDND)
export default ({app}) => {
  ElementLocale.i18n((key, value) => app.i18n.t(key, value));
  const locale = app.i18n.locale;
  Vue.use(Element,{locale: app.i18n.messages[locale]});
  Vue.use(Element, { locale })
}
