import React, { Component, ReactNode } from 'react';
import { Container, createStyles, Group, Paper, Space, Text, TextInput, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';

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

function Render(props: { value: string, change: Function }): JSX.Element {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return <Container size={"md"}>
    <Paper p={"lg"} shadow={"lg"} radius={"lg"}>
      <Group spacing={5}>
        <FiSearch size={17} />
        <Title className={classes.title} color={"w_primary"}>{ t('search.title') }</Title>
      </Group>
      <Text className={classes.subTitle} color={"dimmed"}>{ t('search.subTitle') }</Text>
      <Space h={"xs"} />
      <TextInput
        variant={"filled"}
        value={props.value}
        size={"xs"}
        onChange={event => props.change(event.target.value)} />
    </Paper>
  </Container>
}

interface Search {
  value: string
  change: Function
}

export default class  SearchComponent extends Component<Search, any> {

  render(): ReactNode {
    return <Render value={this.props.value} change={this.props.change} />
  }

}