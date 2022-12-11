import { Component, ReactNode } from 'react';
import { createStyles, Group, Modal, Text } from '@mantine/core';
import { FiUser } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { Prism } from '@mantine/prism';

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

function Render(props: { open: boolean, onClose: Function, onOpen: Function, content: string }): JSX.Element {
  const { classes } = useStyles()
  const { t } = useTranslation()
  return <>
    <Modal
      radius={"lg"}
      size={"75%"}
      transition={"slide-up"}
      transitionDuration={300}
      exitTransitionDuration={300}
      transitionTimingFunction={"ease"}
      centered
      overflow={"inside"}
      opened={props.open}
      onClose={() => props.onClose()}
      title={<>
        <Group spacing={5}>
          <FiUser />
          <Text className={classes.title}>{ t(`fileView.title`) }</Text>
        </Group>
        <Text className={classes.subTitle} color={"dimmed"}>{ t(`fileView.subTitle`) }</Text>
      </>}>

      <div className={"allowSelection"}>
        <Prism
          withLineNumbers
          language={"xml" as any}
          copyLabel={t('detail.clipboard.copy') ?? ''}
          copiedLabel={t('detail.clipboard.copied') ?? ''}>
          { props.content }
        </Prism>
      </div>

    </Modal>
  </>
}

interface Login {
  open: boolean
  onOpen: Function
  onClose: Function
  content: string
}

export default class FileModal extends Component<Login, any> {

  render(): ReactNode {
    return <Render
      open={this.props.open}
      onClose={this.props.onClose}
      onOpen={this.props.onOpen}
      content={this.props.content} />
  }

}