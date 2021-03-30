# K-CLI

a console cli for [k freamwork](https://github.com/Fyrok1/k)

## Installation

```
npm i -g k-cli
```

## Features

1. Create project
1. Change project version
1. Generate components

# Documantation

## Available K Version List
```
k-cli versions
```

## Create New Project

```
k-cli new <projectName>
```
> project name **can not** be null or path only name

**select version with `--version <versionName>`**

### Example

```
k-cli new hello-world
```

## Change Project Version

change local project version to selected version.

changes:
1. src/k folder completly changed 
1. k.json version changed
1. package.json dependencies and devDependencies merged to new version dependencies

```
k-cli change-version <version>
```

### Example

```
k-cli change-version 0.0.1
```

## Generate Component

```
k-cli generate <type> <path>
```
| Component Name | Short |
| - | - |
| router | r |
| controller | c |
| modal | m |

> you can find component patterns in `generate` folder in github

### Example

```
k-cli generate controller site
```

**with custom folder**

```
k-cli generate controller custom-folder/site
```