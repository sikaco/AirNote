import { observable, action } from 'mobx'

interface Ii18nConfig {
  [word: string]: {
    [lang: string]: string
  }
}

const i18nConfig: Ii18nConfig = {
  /*
    words
   */
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
  untitledNotebook: {
    zh: '未命名',
    en: 'Untitled Notebook'
  },
  untitledChapter: {
    zh: '新建章节',
    en: 'Untitled Chapter'
  },
  untitledGroup: {
    zh: '新建章节组',
    en: 'Untitled Group'
  },
  untitledNote: {
    zh: '新建笔记',
    en: 'Untitled Note'
  },

  /*
    sentences
   */
  pleaseInputNotebookName: {
    zh: '请输入笔记本名称',
    en: 'Please input notebook name'
  },
}

const supportLang = ['en', 'zh']

class I18nStore {
  @observable language = ''

  @action switchLanguage(lang: string) {
    if (supportLang.indexOf(lang) > -1) {
      this.language = lang
    }
  }

  @action toggleLanguage() {
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
