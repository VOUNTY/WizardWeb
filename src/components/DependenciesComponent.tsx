import { Component, ReactNode } from 'react';
import {
  Badge,
  Box,
  createStyles,
  Group,
  MantineTheme,
  Paper,
  ScrollArea,
  Space,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { SiApachemaven } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { MdLibraryBooks } from 'react-icons/md';

import RepositoryContent, { Dependency } from '../api/models/RepositoryContent';

const useStyles = createStyles((theme: MantineTheme) => {
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
    element: {
      cursor: 'pointer',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      padding: 5,
      marginTop: 4,
      borderRadius: 8,
      transition: '0.125s all ease-in-out',
      '&:hover': {
        marginLeft: 10,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
      },
    },
    text: {
      marginLeft: 10,
      fontFamily: `'Dosis', sans-serif`,
    },
    textIcon: {
      marginRight: 10,
    },
    icon: {
      cursor: 'pointer',
    },
  }
})

function Render(props: { repositoryContent: RepositoryContent | undefined }): JSX.Element {
  const { classes } = useStyles()
  const { t } = useTranslation()

  return <Paper p={"lg"} shadow={"lg"} radius={"lg"}>
    <Group position={"apart"}>
      <Group spacing={0}>
        <Group spacing={5} align={"start"}>
          <MdLibraryBooks size={17} />
          <Title className={classes.title} color={"w_primary"}>{ t('dependencies.title') }</Title>
        </Group>
      </Group>
    </Group>
    <Space h={"md"} />
    <ScrollArea.Autosize maxHeight={250} mx={"auto"} type={"scroll"}>
      {
        props.repositoryContent?.dependency?.subDependencies.length === 0 ?
          <Text color={"dimmed"} className={classes.text} align={"center"}>{ t('dependencies.empty') }</Text>
        :
        props.repositoryContent?.dependency?.subDependencies.map((value: Dependency, index: number) => {
          return <Box key={index} className={classes.element}>
            <Group position={"apart"}>
              <Text className={classes.text}>{ `${value.groupId}:${value.artifactId}` }</Text>
              <Group spacing={0}>
                <Badge size={"md"} radius={"sm"} variant={"filled"} color={"w_secondary"} mr={10}>v{ value.version }</Badge>
                <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon} onClick={() => {
                  window.open(`https://central.sonatype.dev/namespace/${value.groupId}`, '_blank')
                }}>
                  <SiApachemaven className={classes.icon} />
                </ThemeIcon>
              </Group>
            </Group>
          </Box>
        })
      }
    </ScrollArea.Autosize>
  </Paper>
}

interface IDependenciesComponent {
  repositoryContent: RepositoryContent | undefined
}

export default class DependenciesComponent extends Component<IDependenciesComponent, any> {

  render(): ReactNode {
    return <Render repositoryContent={this.props.repositoryContent} />
  }

}