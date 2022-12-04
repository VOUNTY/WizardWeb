export default class RepositoryContent {

  contents: Content []

  constructor(contents: Content []) {
    this.contents = contents;
  }

}

export class Content {

  name: string
  isFile: boolean
  size: number

  constructor(name: string, isFile: boolean, size: number) {
    this.name = name;
    this.isFile = isFile;
    this.size = size;
  }

}