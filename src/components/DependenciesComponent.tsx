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
import { FiCheck, FiCopy } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { MdLibraryBooks } from 'react-icons/md';

import RepositoryContent, { Dependency } from '../api/models/RepositoryContent';
import { useClipboard, useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

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
  const clipboard = useClipboard()

  const [storageTab] = useLocalStorage<string | null>({
    key: 'tab',
    defaultValue: 'maven',
    getInitialValueInEffect: true
  })

  const copyDependency = (dependency: Dependency): void => {
    let codeToCopy: string = ``
    switch (storageTab) {
      case 'maven': {
        codeToCopy = `<dependency>
  <groupId>$groupId</groupId>
  <artifactId>$artifactId</artifactId>
  <version>$version</version>
</dependency>`
        break
      }
      case 'gradle_groovy': {
        codeToCopy = `implementation "$groupId:$artifactId:$version"`
        break
      }
      case 'gradle_kotlin': {
        codeToCopy = `implementation("$groupId:$artifactId:$version")`
        break
      }
      case 'sbt': {
        codeToCopy = `libraryDependencies += "$groupId" % "$artifactId" % "$version"`
        break
      }
      case 'leiningen': {
        codeToCopy = `[$groupId/$artifactId "$version"]`
        break
      }
      case 'buildr': {
        codeToCopy = `'$groupId:$artifactId:jar:$version'`
        break
      }
      case 'grape': {
        codeToCopy = `@Grab(group='$groupId', module='$artifactId', version='$version')`
        break
      }
      case 'ivy': {
        codeToCopy = `<dependency org="$groupId" name="$artifactId" rev="$version"/>;`
        break
      }
    }
    if (codeToCopy.length > 0) {
      clipboard.copy(codeToCopy
          .replaceAll('$groupId', dependency.groupId)
          .replaceAll('$artifactId', dependency.artifactId)
          .replaceAll('$version', dependency.version)
      )
      showNotification({
        icon: <FiCheck />,
        title: t('notifications.usedDependency.title'),
        message: t('notifications.usedDependency.message'),
      })
    }
  }

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
                <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon} onClick={() => copyDependency(value)}>
                  <FiCopy className={classes.icon} />
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