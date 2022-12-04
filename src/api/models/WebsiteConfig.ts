import { Tuple } from '@mantine/styles/lib/theme/types/Tuple';

export default class WebsiteConfig {

  title: string
  logo: string
  favicon: string
  description: string
  color: string
  keywords: string
  repositoryName: string
  mantine: Mantine

  constructor(title: string, logo: string, favicon: string, description: string, color: string,
              keywords: string, repositoryName: string, mantine: Mantine) {
    this.title = title;
    this.logo = logo;
    this.favicon = favicon;
    this.description = description;
    this.color = color;
    this.keywords = keywords;
    this.repositoryName = repositoryName;
    this.mantine = mantine;
  }

}

export class Mantine {

  primary: Tuple<string, 10>
  secondary: Tuple<string, 10>

  constructor(primary: Tuple<string, 10>, secondary: Tuple<string, 10>) {
    this.primary = primary;
    this.secondary = secondary;
  }

}