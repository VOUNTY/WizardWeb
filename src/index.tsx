import React, { useState } from 'react';
import ReactDOM, { Root } from 'react-dom/client';

import './assets/index.scss';
import './addons/TranslationAddon';

import { ModalsProvider } from '@mantine/modals';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorScheme, ColorSchemeProvider, MantineProvider, MantineTheme } from '@mantine/core';

import HomeDefaultView from './views/HomeDefaultView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useMetaTags from 'react-metatags-hook';
import RestClient from './api/RestClient';
import WebsiteConfig from './api/models/WebsiteConfig';

let globalConfig: WebsiteConfig | null = null

function Render(): JSX.Element {

  const colorScheme = useColorScheme()
  const [storageColorScheme, setStorageColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme',
    defaultValue: colorScheme,
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme): void =>
    setStorageColorScheme(value || (storageColorScheme === 'dark' ? 'light' : 'dark'));

  const [configuration, setConfiguration] = useState<WebsiteConfig>({
    title: '| Wizard - Repository Management',
    description: 'Powered by VountyWizard',
    color: '#2c4696',
    favicon: 'https://cdn.vounty.net/favicons/favicon-96x96.png',
    logo: 'https://cdn.vounty.net/Logo.png',
    keywords: 'wizard,repository,repository management',
    repositoryName: 'Wizard',
    mantine: {
      primary: ['#fff', '#2c4696', '#2c4696', '#2c4696', '#2c4696', '#2c4696', '#2c4696', '#2c4696', '#2c4696', '#2c4696'],
      secondary: ['#fff', '#4761b3', '#4761b3', '#4761b3', '#4761b3', '#4761b3', '#4761b3', '#4761b3', '#4761b3', '#4761b3']
    },
  })
  const [mounted, setMounted] = useState(false)

  if (!mounted) {
    setMounted(true)
    RestClient.getConfiguration('website').then(value => {
      setConfiguration(value)
      globalConfig = value
    })
  }

  useMetaTags({
    title: configuration.title,
    description: configuration.description,
    links: [
      { rel: 'icon', type: 'image/png', href: configuration.favicon, size: '96x96' }
    ],
    metas: [
      { name: 'theme-color', content: configuration.color },
      { name: 'keywords', content: configuration.keywords },
    ],
  })

  return <>
    <ColorSchemeProvider
      colorScheme={storageColorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{
          colorScheme: storageColorScheme,
          primaryColor: 'w_primary',
          colors: {
            'w_secondary': configuration.mantine.secondary,
            'w_primary': configuration.mantine.primary,
          },
          components: {
            Paper: {
              styles: (theme: MantineTheme) => {
                return {
                  root: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : ''
                  }
                }
              }
            }
          },
        }}
        withGlobalStyles
        withNormalizeCSS>

        <NotificationsProvider>
          <ModalsProvider>

            <BrowserRouter>
              <Routes>
                <Route path={"*"} element={<HomeDefaultView />} />
              </Routes>
            </BrowserRouter>

          </ModalsProvider>
        </NotificationsProvider>

      </MantineProvider>
    </ColorSchemeProvider>
  </>
}

const root: Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<Render />)

export {
  globalConfig
}