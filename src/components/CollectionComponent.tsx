import { Component, ReactNode } from 'react';
import {
  Badge,
  Box, Breadcrumbs,
  createStyles,
  Divider,
  Group,
  MantineTheme,
  Paper,
  ScrollArea,
  Select,
  Space, Stack,
  Text,
  ThemeIcon,
  Title,
  Anchor,
} from '@mantine/core';
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { MdStorage } from 'react-icons/md';
import { useLocalStorage } from '@mantine/hooks';

import RepositoryList from '../api/models/RepositoryList';
import RepositoryContent, { Content } from '../api/models/RepositoryContent';
import { FiDownload, FiEye, FiFile, FiFolder } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';

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

function Render(props: { repositoryContent: RepositoryContent | undefined, types: RepositoryList [], search: string, path: string [], changePath: Function }): JSX.Element {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [sort, setSort] = useLocalStorage<'asc' | 'desc'>({
    key: 'sort',
    defaultValue: 'asc',
    getInitialValueInEffect: true
  })

  const [category, setCategory] = useLocalStorage<string>({
    key: 'category',
    getInitialValueInEffect: true
  })

  const [specialEndings] = useLocalStorage<boolean>({
    key: 'specialEndings',
    defaultValue: true,
    getInitialValueInEffect: true
  })

  const isSpecialEnding = (value: string): boolean => {
    const endings: string [] = ['sha1', 'sha512', 'sha256', 'md5', 'module']
    const last = value.split(".")
    return last.length >= 2 && endings.includes(last[last.length - 1])
  }

  const filter = (value: string): boolean => {
    if (props.search.length > 0) {
      const newSearch: string = props.search.toLowerCase()
      const newValue: string = value.toLowerCase()
      return newValue === newSearch || newValue.startsWith(newSearch) ||
        newValue.endsWith(newSearch) || newValue.includes(newSearch)
    }
    return specialEndings ? !isSpecialEnding(value) : true
  }

  return <Paper p={"lg"} shadow={"lg"} radius={"lg"}>

    <Group position={"apart"}>
      <Group spacing={0}>
        <Group spacing={5} align={"start"}>
          <MdStorage size={17} />
          <Title className={classes.title} color={"w_primary"}>{ t('list.title') }</Title>
        </Group>
      </Group>

      <Group position={"right"}>
        { sort === 'asc' ?
          <AiOutlineSortAscending size={20} onClick={() => setSort('desc')} className={classes.icon} /> :
          <AiOutlineSortDescending size={20} onClick={() => setSort('asc')} className={classes.icon} />
        }
        <Divider orientation={"vertical"} />
        <Select
          value={category}
          onChange={value => {
            setCategory(value || 'releases')
            if (value !== category)
              props.changePath(".")
          }}
          variant={"filled"}
          data={
            props.types.map((value: RepositoryList) => {
              return { value: value.name.toLowerCase(), label: value.name }
            })
          }
        />
      </Group>
    </Group>

    <Space h={"md"} />
    <ScrollArea.Autosize maxHeight={500} mx={"auto"} type={"scroll"}>
      {
        props.repositoryContent?.contents.length === 0 ||
        props.search.length > 0 &&
        props.repositoryContent?.contents.filter(value => filter(value.name)).length === 0 ?
          <Text color={"dimmed"} className={classes.text} align={"center"}>{ t('list.empty') }</Text>
        :
          <>
          {
            props.path.length > 0 && <Box className={classes.element} onClick={() => props.changePath("..")}>
              <Group position={"apart"}>
                <Text className={classes.text}>..</Text>
                <Group spacing={0}>
                  <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon}>
                    <FiFolder />
                  </ThemeIcon>
                </Group>
              </Group>
            </Box>
          }
          {
            props.repositoryContent?.contents
              .sort((a, b) =>
                !a.isFile ? sort === 'asc' ?
                  a.name.localeCompare(b.name) :
                  b.name.localeCompare(a.name) : -1)
              .filter(value => filter(value.name))
              .map((value: Content, index: number) => {
                return <Box key={index} className={classes.element} onClick={() => {
                  if (!value.isFile)
                    props.changePath(value.name)
                }}>
                  <Group position={"apart"}>
                    <Text className={classes.text}>{ value.name }</Text>
                    <Group spacing={0}>
                      { value.isFile ?
                        <>
                          <Badge size={"md"} radius={"sm"} variant={"filled"} color={"w_secondary"} mr={10}>{ value.size.toLocaleString() }B</Badge>
                          <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon} onClick={() => alert('Soon :)')}>
                            <FiDownload />
                          </ThemeIcon>
                          <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon} onClick={() => alert('Soon :)')}>
                            <FiEye />
                          </ThemeIcon>
                        </> : <></>
                      }
                      <ThemeIcon variant={"light"} color={"w_secondary"} className={classes.textIcon}>
                        { value.isFile ? <FiFile /> : <FiFolder /> }
                      </ThemeIcon>
                    </Group>
                  </Group>
                </Box>
              })
          }

          </>
      }
    </ScrollArea.Autosize>
  </Paper>
}

interface Collection {
  repositoryContent: RepositoryContent | undefined
  types: RepositoryList []
  search: string
  path: string []
  changePath: Function
}

export default class CollectionComponent extends Component<Collection, any> {

  render(): ReactNode {
    return <Render
      changePath={this.props.changePath}
      path={this.props.path}
      repositoryContent={this.props.repositoryContent}
      types={this.props.types}
      search={this.props.search} />
  }

}