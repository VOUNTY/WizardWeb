import { Component, ReactNode, useState } from 'react';
import {
  Button,
  createStyles,
  DefaultMantineColor,
  Grid,
  Group,
  Modal,
  PasswordInput,
  Space,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { FiAlertCircle, FiCheck, FiUser, FiX } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import TokenClient from '../api/token/TokenClient';

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
      right: 15,
      zIndex: 999,
    },
    form: {
      fontFamily: `'Dosis', sans-serif`,
    },
    button: {
      textTransform: 'uppercase',
      fontFamily: `'Heebo', sans-serif`,
    },
  }
})

function Render(props: { open: boolean, onClose: Function, onOpen: Function, sessionSuccess: Function }): JSX.Element {

  const storage = window.localStorage
  const { classes } = useStyles()
  const { t } = useTranslation()

  const isLoggedIn = (): boolean => {
    return storage.getItem("tokenName") !== null &&
           storage.getItem("tokenPassword") !== null
  }

  const [name, setName] = useState(isLoggedIn() ? storage.getItem("tokenName") || '' : '')
  const [password, setPassword] = useState(isLoggedIn() ? storage.getItem("tokenPassword") || '' : '')

  const login = (): void => {
    if (name.length === 0 || password.length === 0) {
      alert(<FiX />, 'red', 'notifications.login.title', 'notifications.login.noFields')
      return
    }

    TokenClient.login(name, password).then(result => {
      const status: number = result.status

      if (status === 200 || status === 204) {
        const storage = window.localStorage
        storage.setItem('tokenName', name)
        storage.setItem('tokenPassword', password)
        alert(<FiCheck />, '', 'notifications.login.title', 'notifications.login.success')
        props.onClose()
        props.sessionSuccess()
      } else if (status === 401) {
        alert(<FiAlertCircle />, 'orange', 'notifications.login.title', 'notifications.login.wrongData')
      } else alert(<FiX />, 'red', 'notifications.login.title', 'notifications.login.failed')

    })
  }

  const alert = (icon: any, color: DefaultMantineColor, title: string, message: string): void => {
    showNotification({
      color: color,
      icon: icon,
      title: t(title),
      message: t(message)
    })
  }

  const logout = (): void => {
    const storage = window.localStorage
    storage.removeItem('tokenName')
    storage.removeItem('tokenPassword')
    alert(<FiCheck />, '', 'notifications.logout.title', 'notifications.logout.success')
    props.onClose()
    props.sessionSuccess()
  }

  return <>
    <ThemeIcon className={classes.icon} onClick={() => props.onOpen()} color={"w_secondary"}>
      <FiUser />
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
          <FiUser />
          <Text className={classes.title}>{ t(`${isLoggedIn() ? 'logout' : 'login'}.title`) }</Text>
        </Group>
        <Text className={classes.subTitle} color={"dimmed"}>{ t(`${isLoggedIn() ? 'logout' : 'login'}.subTitle`) }</Text>
      </>}>

      <Grid grow>
        <Grid.Col lg={6} md={6}>
          <TextInput
            readOnly={isLoggedIn()}
            value={name}
            onChange={event => setName(event.target.value)}
            label={t('login.form.user')}
            variant={"filled"}
            className={classes.form} />
        </Grid.Col>
        <Grid.Col lg={6} md={6}>
          <PasswordInput
            readOnly={isLoggedIn()}
            value={password}
            onChange={event => setPassword(event.target.value)}
            label={t('login.form.password')}
            variant={"filled"}
            className={classes.form} />
        </Grid.Col>
      </Grid>
      <Space h={"xs"} />
      <Button
        color={isLoggedIn() ? 'red' : 'w_primary'}
        fullWidth
        className={classes.button}
        onClick={() => isLoggedIn() ? logout() : login()}>
        { isLoggedIn() ? t('logout.form.submit') : t('login.form.submit') }</Button>

    </Modal>
  </>
}

interface Login {
  open: boolean
  onOpen: Function
  onClose: Function
  sessionSuccess: Function
}

export default class LoginModal extends Component<Login, any> {

  render(): ReactNode {
    return <Render open={this.props.open} onClose={this.props.onClose} onOpen={this.props.onOpen} sessionSuccess={this.props.sessionSuccess} />
  }

}