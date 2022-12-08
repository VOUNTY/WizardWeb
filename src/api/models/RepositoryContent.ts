export default class RepositoryContent {

  dependency: DependencyConfiguration | undefined
  contents: Content []

  constructor(dependency: DependencyConfiguration | undefined, contents: Content[]) {
    this.dependency = dependency;
    this.contents = contents;
  }

}

export class DependencyConfiguration {

  dependency: Dependency
  subDependencies: Dependency []

  constructor(dependency: Dependency, subDependencies: Dependency[]) {
    this.dependency = dependency;
    this.subDependencies = subDependencies;
  }

}

export class Dependency {

  groupId: string
  artifactId: string
  version: string

  constructor(groupId: string, artifactId: string, version: string) {
    this.groupId = groupId;
    this.artifactId = artifactId;
    this.version = version;
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