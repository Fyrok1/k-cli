# K-CLI

a console cli for [k freamwork](https://github.com/Fyrok1/k)

## Installation

```
npm i -g k-cli
```

## Features

1. Create project
1. Generate components

# Documantation

## Available K Version List
```
k versions
```

## Create New Project

```
k new <projectName>
```
> project name **can not** be null or path only name

**select version with `--version <versionName>`**

### Example

```
k new hello-world
```

## Generate Component

```
k generate <type> <path>
```
| Component Name | Short |
| - | - |
| router | r |
| controller | c |
| modal | m |

> you can find component patterns in `generate` folder in github

### Example

```
k generate controller site
```

**with custom folder**

```
k generate controller custom-folder/site
```