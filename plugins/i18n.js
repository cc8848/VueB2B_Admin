import Vue from 'vue'
import VueI18n from '@cjy0208/vue-i18n'
import enlocale from 'element-ui/lib/locale/lang/en'
import idLocale from 'element-ui/lib/locale/lang/id'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'in', // 印尼
    messages: {
      'in': {
        ...require('~/locales/in.json'),
        ...idLocale
      }, 
      'en': {
        ...require('~/locales/en.json'),
        ...enlocale
      },
      'zh': {
        ...require('~/locales/zh.json'),
        ...zhLocale
      }
    }
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}