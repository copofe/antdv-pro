import enUS from 'ant-design-vue/es/locale/en_US'

const enUSModules = import.meta.glob([
  '::/view/locales/**/en-US.ts',
  '::/view/pages/**/locales/en-US.ts',
], {
  eager: true,
})

const messages = {}

for (const item in enUSModules) {
  const locale = (enUSModules[item] as any)?.default
  if (locale)
    Object.assign(messages, locale)
}
export default {
  ...messages,
  antd: enUS,
}
