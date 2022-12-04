import { Component, ReactNode } from 'react';
import { Grid, Image, Title, Text, createStyles, Space } from '@mantine/core';

const useStyles = createStyles(() => {
  return {
    box: {
      textAlign: 'center',
    },
    image: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    title: {
      textTransform: 'uppercase',
      fontSize: 25,
      fontFamily: `'Heebo', sans-serif`
    },
    subTitle: {
      textTransform: 'uppercase',
      fontSize: 14,
    },
  }
})

function Render(props: { logo: string, title: string, description: string }): JSX.Element {
  const { classes } = useStyles()
  return <Grid className={classes.box}>
    <Grid.Col md={12} lg={12}>
      <Image
        onDragStart={event => event.preventDefault()}
        className={classes.image}
        src={props.logo}
        withPlaceholder
        height={100}
        width={100} />
      <Space h={"md"} />
      <Title className={classes.title} color={"w_primary"}>{ props.title }</Title>
      <Text className={classes.subTitle} color={"dimmed"}>{ props.description }</Text>
    </Grid.Col>
  </Grid>
}

interface Header {
  logo: string
  title: string
  description: string
}

export default class HomeHeader extends Component<Header, any> {

  render(): ReactNode {
    return <Render
      logo={this.props.logo}
      title={this.props.title}
      description={this.props.description} />
  }

}