import { Component, ReactNode, useState } from 'react';
import { createStyles, Group, Paper, Space, Tabs, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Prism } from '@mantine/prism';
import { useLocalStorage } from '@mantine/hooks';
import { FiCode } from 'react-icons/fi';
import { globalConfig } from '../index';

const useStyles = createStyles(() => {
  return {
    title: {
      textTransform: 'uppercase',
      fontSize: 16,
      fontFamily: `'Heebo', sans-serif`
    },
    subTitle: {
      textTransform: 'uppercase',
      fontSize: 12,
    }
  }
})

interface Tab {
  name: string
  tabKey: string
  language: string
}

function Render(): JSX.Element {
  const { t } = useTranslation()
  const { classes } = useStyles()

  const [storageTab, setStorageTab] = useLocalStorage<string | null>({
    key: 'tab',
    defaultValue: 'maven',
    getInitialValueInEffect: true
  })

  const [tabs] = useState<Tab []>([
    { name: 'Maven', tabKey: 'maven', language: 'xml' },
    { name: 'Gradle Groovy', tabKey: 'gradle_groovy', language: 'ocaml' },
    { name: 'Gradle Kotlin', tabKey: 'gradle_kotlin', language: 'ocaml' },
    { name: 'SBT', tabKey: 'sbt', language: 'ocaml' },
    { name: 'Leiningen', tabKey: 'leiningen', language: 'ocaml' },
  ])

  return <Paper p={"xl"} shadow={"lg"} radius={"lg"}>
    <Group spacing={5}>
      <FiCode size={17} />
      <Title className={classes.title} color={"w_primary"}>{ t('detail.title') }</Title>
    </Group>
    <Text className={classes.subTitle} color={"dimmed"}>{ t('detail.subTitle') }</Text>
    <Space h={"md"} />
    <Tabs defaultValue={storageTab} value={storageTab} onTabChange={value => setStorageTab(value)} color={"w_secondary"}>
      <Tabs.List grow>
        {
          tabs.map((value: Tab, index: number) => {
            return <Tabs.Tab key={index} value={value.tabKey}>{ value.name }</Tabs.Tab>
          })
        }
      </Tabs.List>
      {
        tabs.map((value: Tab, index: number) => {
          return <Tabs.Panel key={index} value={value.tabKey} pt={"md"}>
            <RenderTab name={value.name} tabKey={value.tabKey} language={value.language} />
          </Tabs.Panel>
        })
      }
    </Tabs>
  </Paper>
}

export default class DetailSelection extends Component<any, any> {

  render(): ReactNode {
    return <Render />
  }

}

function RenderTab(tab: Tab): JSX.Element {
  const { t } = useTranslation()

  const [category] = useLocalStorage<string>({
    key: 'category'
  })

  let code: string = ``
  switch (tab.tabKey) {
    case 'maven': {
      code = RenderMaven(category || '{unknown}')
      break
    }
    case 'gradle_groovy': {
      code = RenderGradleGroovy(category || '{unknown}')
      break
    }
    case 'gradle_kotlin': {
      code = RenderGradleKotlin(category || '{unknown}')
      break
    }
    case 'sbt': {
      code = RenderSBT(category || '{unknown}')
      break
    }
    case 'leiningen': {
      code = RenderLeiningen(category || '{unknown}')
      break
    }
  }

  return <div className={"allowSelection"}>
    <Prism
      withLineNumbers
      language={tab.language as any}
      copyLabel={t('detail.clipboard.copy') ?? ''}
      copiedLabel={t('detail.clipboard.copied') ?? ''}>
      { code }
    </Prism>
  </div>
}

function format(content: string, category: string): string {
  const port: string = window.location.port
  return content
    .replaceAll('$name', globalConfig?.repositoryName || 'Wizard')
    .replaceAll('$protocol', `${window.location.protocol}//`)
    .replaceAll('$host', `${window.location.host}/`)
    .replaceAll('$id', category)
}

function RenderMaven(category: string): string {
  return format(`<repository>
  <id>$id</id>
  <name>$name</name>
  <url>$protocol$host$id</url>
</repository>`, category)
}

function RenderGradleGroovy(category: string): string {
  return format(`maven {
    url "$protocol$host$id"
}`, category)
}

function RenderGradleKotlin(category: string): string {
  return format(`maven {
    url = uri("$protocol$host$id")
}`, category)
}

function RenderSBT(category: string): string {
  return format(`resolvers +=
  "$id" 
     at "$protocol$host$id"`, category)
}

function RenderLeiningen(category: string): string {
  return format(`:repositories [["$id" "$protocol$host$id"]]`, category)
}