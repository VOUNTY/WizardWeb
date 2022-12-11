import React, { Component, ReactNode, useEffect, useState } from 'react';
import { useListState, useLocalStorage } from '@mantine/hooks';
import { Container, Grid, Space } from '@mantine/core';
import { globalConfig } from '../index';

import DetailSelection from '../components/DetailSelection';
import SearchComponent from '../components/SearchComponent';
import CollectionComponent from '../components/CollectionComponent';
import HomeHeader from '../components/HomeHeader';

import SettingsModal from '../modals/SettingsModal';
import LoginModal from '../modals/LoginModal';
import RepositoryClient from '../api/repository/RepositoryClient';
import RepositoryList from '../api/models/RepositoryList';
import RepositoryContent from '../api/models/RepositoryContent';
import DependenciesComponent from '../components/DependenciesComponent';

function Render(): JSX.Element {

  const [values, handlers] = useListState<string>([])
  const [search, setSearch] = useState('')
  const [repositoryContent, setRepositoryContent] = useState<RepositoryContent | undefined>(undefined)
  const [types, setTypes] = useState<RepositoryList []>([])
  const [settings, setSettings] = useState(false)
  const [login, setLogin] = useState(false)

  const [category] = useLocalStorage<string>({
    key: 'category',
    defaultValue: types[0]?.name || 'releases',
  })

  const loadRepositories = async (): Promise<void> =>
    setTypes(await RepositoryClient.listRepositories())

  const fetchRepository = async (): Promise<void> =>
    setRepositoryContent(await RepositoryClient.getContent(category, values))

  const [mounted, setMounted] = useState(false)
  if (!mounted) {
    setMounted(true)
    loadRepositories().then(() => {})
    fetchRepository().then(() => {})
  }

  useEffect(() => {
    fetchRepository().then(() => {})
  }, [category, values])

  return <>
    <SettingsModal open={settings} onOpen={() => setSettings(true)} onClose={() => setSettings(false)} />
    <LoginModal open={login} onOpen={() => setLogin(true)} onClose={() => setLogin(false)} sessionSuccess={() => loadRepositories().then(() => {})} />

    <Container size={"xl"}>
      <Space h={"xl"} />
      <HomeHeader logo={globalConfig?.logo || 'https://cdn.vounty.net/Logo.png'} title={"Wizard"} description={"Repository Management"} />
      <Space h={"md"} />
      <SearchComponent value={search} change={setSearch} />
      <Space h={"xl"} />
      <Grid justify={"space-between"} align={"stretch"}>
        <Grid.Col md={6} lg={6}>
          <CollectionComponent repositoryContent={repositoryContent} types={types} search={search} path={values} changePath={(value: string) => {
            switch (value) {
              case ".":
                handlers.setState([])
                break;
              case "..":
                handlers.pop()
                break;
              default:
                handlers.append(value)
                break;
            }
          }} />
        </Grid.Col>
        <Grid.Col md={6} lg={6}>
          <DetailSelection repositoryContent={repositoryContent} />
          <Space h={"md"} />
          { repositoryContent?.dependency && <DependenciesComponent repositoryContent={repositoryContent} /> }
        </Grid.Col>
      </Grid>
    </Container>
  </>
}

export default class HomeDefaultView extends Component<any, any> {

  render(): ReactNode {
    return <Render />
  }

}