import { Component, ReactNode, useState } from 'react';
import { createStyles, Group, Paper, Space, Tabs, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Prism } from '@mantine/prism';
import { useLocalStorage } from '@mantine/hooks';
import { FiCode } from 'react-icons/fi';
import { globalConfig } from '../index';
import RepositoryContent from '../api/models/RepositoryContent';

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

function Render(props: { repositoryContent: RepositoryContent | undefined }): JSX.Element {
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

  return <Paper p={"lg"} shadow={"lg"} radius={"lg"}>
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
            <RenderTab repositoryContent={props.repositoryContent} name={value.name} tabKey={value.tabKey} language={value.language} />
          </Tabs.Panel>
        })
      }
    </Tabs>
  </Paper>
}

interface Detail {
  repositoryContent: RepositoryContent | undefined
}

export default class DetailSelection extends Component<Detail, any> {

  render(): ReactNode {
    return <Render repositoryContent={this.props.repositoryContent} />
  }

}

function RenderTab(props: { repositoryContent: RepositoryContent | undefined, name: string, tabKey: string, language: string }): JSX.Element {
  const { t } = useTranslation()

  const [category] = useLocalStorage<string>({
    key: 'category',
    defaultValue: 'releases'
  })

  let code: string = ``
  switch (props.tabKey) {
    case 'maven': {
      code = RenderMaven(props.repositoryContent, category || '{unknown}')
      break
    }
    case 'gradle_groovy': {
      code = RenderGradleGroovy(props.repositoryContent, category || '{unknown}')
      break
    }
    case 'gradle_kotlin': {
      code = RenderGradleKotlin(props.repositoryContent, category || '{unknown}')
      break
    }
    case 'sbt': {
      code = RenderSBT(props.repositoryContent, category || '{unknown}')
      break
    }
    case 'leiningen': {
      code = RenderLeiningen(props.repositoryContent, category || '{unknown}')
      break
    }
  }

  return <div className={"allowSelection"}>
    <Prism
      withLineNumbers
      language={props.language as any}
      copyLabel={t('detail.clipboard.copy') ?? ''}
      copiedLabel={t('detail.clipboard.copied') ?? ''}>
      { code }
    </Prism>
  </div>
}

function format(repositoryContent: RepositoryContent | undefined, content: string, category: string): string {
  return content
    .replaceAll('$name', globalConfig?.repositoryName || 'Wizard')
    .replaceAll('$protocol', `${window.location.protocol}//`)
    .replaceAll('$host', `${window.location.host}/`)
    .replaceAll('$id', category)
    .replaceAll('$groupId', repositoryContent?.dependency?.dependency.groupId || 'unknown')
    .replaceAll('$artifactId', repositoryContent?.dependency?.dependency.artifactId || 'unknown')
    .replaceAll('$version', repositoryContent?.dependency?.dependency.version || 'unknown')
}

function RenderMaven(repositoryContent: RepositoryContent | undefined, category: string): string {
  const repository: string = `<repository>
  <id>$id</id>
  <name>$name</name>
  <url>$protocol$host$id</url>
</repository>`

  const dependency: string = `<dependency>
  <groupId>$groupId</groupId>
  <artifactId>$artifactId</artifactId>
  <version>$version</version>
</dependency>`

  const content: string = repositoryContent?.dependency ? dependency : repository
  return format(repositoryContent, content, category)
}

function RenderGradleGroovy(repositoryContent: RepositoryContent | undefined, category: string): string {
  const repository: string = `maven {
    url "$protocol$host$id"
}`
  const dependency: string = `implementation "$groupId:$artifactId:$version"`

  const content: string = repositoryContent?.dependency ? dependency : repository
  return format(repositoryContent, content, category)
}

function RenderGradleKotlin(repositoryContent: RepositoryContent | undefined, category: string): string {
  const repository: string = `maven {
    url = uri("$protocol$host$id")
}`
  const dependency: string = `implementation("$groupId:$artifactId:$version")`

  const content: string = repositoryContent?.dependency ? dependency : repository
  return format(repositoryContent, content, category)
}

function RenderSBT(repositoryContent: RepositoryContent | undefined, category: string): string {
  const repository: string = `resolvers +=
  "$id" 
     at "$protocol$host$id"`
  const dependency: string = `libraryDependencies += "$groupId" % "$artifactId" % "$version"`

  const content: string = repositoryContent?.dependency ? dependency : repository
  return format(repositoryContent, content, category)
}

function RenderLeiningen(repositoryContent: RepositoryContent | undefined, category: string): string {
  const repository: string = `:repositories [["$id" "$protocol$host$id"]]`
  const dependency: string = `[$groupId/$artifactId "$version"]`

  const content: string = repositoryContent?.dependency ? dependency : repository
  return format(repositoryContent, content, category)
}