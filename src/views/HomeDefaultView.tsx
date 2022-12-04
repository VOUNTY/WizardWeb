import React, { Component, ReactNode, useState } from 'react';
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

function Render(): JSX.Element {

  const [search, setSearch] = useState('')
  const [types, setTypes] = useState<RepositoryList []>([])

  const [settings, setSettings] = useState(false)
  const [login, setLogin] = useState(false)

  const loadRepositories = async (): Promise<void> =>
    setTypes(await RepositoryClient.listRepositories())

  const [mounted, setMounted] = useState(false)
  if (!mounted) {
    setMounted(true)
    loadRepositories().then(() => {})
  }

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
          <CollectionComponent types={types} search={search} />
        </Grid.Col>
        <Grid.Col md={6} lg={6}>
          <DetailSelection />
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