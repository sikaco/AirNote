import { observable, action } from 'mobx'

interface Ii18nConfig {
  [word: string]: {
    [lang: string]: string
  }
}

const i18nConfig: Ii18nConfig = {
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
  lastSynced: {
    zh: '最近同步于',
    en: 'Last Synced'
  },
  syncing: {
    zh: '同步中...',
    en: 'Syncing...'
  },
  syncFailed: {
    zh: '同步失败',
    en: 'Sync Failed'
  },
  newPage: {
    zh: '新建页',
    en: 'New Page'
  },
}

const supportLang = ['en', 'zh']

class I18nStore {
  @observable language = ''

  @action switchLanguage(lang: string): void {
    if (supportLang.indexOf(lang) > -1) {
      this.language = lang
    }
  }

  @action toggleLanguage(): void {
    this.language = this.language === 'en' ? 'zh' : 'en'
  }

  constructor() {
    this.language = supportLang[0]  // todo: Initial language according to user's system
  }

  i18n = (word: string): string => i18nConfig[word][this.language]
}

const i18nStore = new I18nStore()
const i18n = i18nStore.i18n

export default i18nStore
export { i18n }