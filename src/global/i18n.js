// import glbStore  // todo

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

export default function i18n(key, cfg = i18nConfig) {
  // todo: Get language from global store.
  // Because app's language is stable,
  // maybe wrap this function in a factory and run it once is a better way.
  let lang = 'en'
  return cfg[key][lang]
}
