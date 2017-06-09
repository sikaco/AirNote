import { observable, action } from 'mobx'

const i18nConfig = {
  notebooks: {
    zh: '笔记本',
    en: 'Notebooks'
  },
  tags: {
    zh: '标签',
    en: 'Tags'
  },

  recents: {
    zh: '最近',
    en: 'Recents'
  },
  trash: {
    zh: '回收站',
    en: 'Trash'
  },
}

const supportLang = ['en', 'zh']

class I18nStore {
  @observable language = ''
  @action switchLanguage(lang) {
    if (supportLang.indexOf(lang) > -1) {
      this.language = lang
      window.renderApp()
    }
  }
  @action toggleLanguage() {
    this.language = this.language === 'en' ? 'zh': 'en'
    window.renderApp()
  }

  constructor() {
    this.language = supportLang[0]
  }

  i18n = key => i18nConfig[key][this.language]
}

const i18nStore = new I18nStore()
const i18n = i18nStore.i18n

export default i18nStore
export { i18n }