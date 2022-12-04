import { Component, ReactNode, useState } from 'react';
import {
  ColorScheme,
  createStyles,
  Group,
  Modal,
  Select,
  Space,
  Switch,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FiMoon, FiSettings, FiSun } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../addons/TranslationAddon';
import i18next from 'i18next';
import { useLocalStorage } from '@mantine/hooks';

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
    },
    text: {
      marginLeft: 10,
      fontFamily: `'Dosis', sans-serif`,
    },
    icon: {
      cursor: 'pointer',
      position: 'fixed',
      bottom: 15,
      left: 15,
    },
    input: {
      cursor: 'pointer',
      fontFamily: `'Dosis', sans-serif`,
    },
  }
})

function Render(props: { open: boolean, onClose: Function, onOpen: Function }): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { classes } = useStyles()
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const [specialEndings, setSpecialEndings] = useLocalStorage<boolean>({
    key: 'specialEndings',
    defaultValue: true,
    getInitialValueInEffect: true
  })

  const [language, setLanguage] = useState(i18next.language)

  const changeLanguage = (language: string | null): void => {
    if (language === null)
      return

    i18next.changeLanguage(language).then(() => {})
    setLanguage(language)
  }

  return <>
    <ThemeIcon className={classes.icon} onClick={() => props.onOpen()} color={"w_secondary"}>
      <FiSettings />
    </ThemeIcon>

    <Modal
      radius={"lg"}
      size={"lg"}
      transition={"slide-up"}
      transitionDuration={300}
      exitTransitionDuration={300}
      transitionTimingFunction={"ease"}
      centered
      opened={props.open}
      onClose={() => props.onClose()}
      title={<>
        <Group spacing={5}>
          <FiSettings />
          <Text className={classes.title}>{ t('settings.title') }</Text>
        </Group>
        <Text className={classes.subTitle} color={"dimmed"}>{ t('settings.subTitle') }</Text>
      </>}>

      <Group position={"apart"}>
        <Text className={classes.text}>{ t('settings.specialEndings') }</Text>
        <Switch
          size={"md"}
          className={classes.input}
          onChange={() => setSpecialEndings(!specialEndings)}
          checked={specialEndings}
        />
      </Group>

      <Group position={"apart"}>
        <Text className={classes.text}>{ t('settings.colorscheme') }</Text>
        <Switch
          size={"md"}
          className={classes.input}
          onChange={() => toggleColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          checked={colorScheme === 'dark'}
          color={colorScheme === 'dark' ? 'gray' : 'dark'}
          onLabel={<FiSun size={16} color={theme.colors.yellow[4]} />}
          offLabel={<FiMoon size={16} color={theme.colors.blue[6]} />}
        />
      </Group>

      <Space h={"md"} />

      <Group position={"apart"}>
        <Text className={classes.text}>{ t('settings.language') }</Text>
        <Select
          styles={{
            input: {
              fontFamily: `'Heebo', sans-serif`,
            },
            item: {
              fontFamily: `'Heebo', sans-serif`,
            },
          }}
          data={availableLanguages}
          value={language}
          onChange={changeLanguage}
          variant={"filled"} />
      </Group>

    </Modal>
  </>
}

interface Settings {
  open: boolean
  onOpen: Function
  onClose: Function
}

export default class SettingsModal extends Component<Settings, any> {

  render(): ReactNode {
    return <Render open={this.props.open} onClose={this.props.onClose} onOpen={this.props.onOpen} />
  }

}