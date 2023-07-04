# link-workspaces

Yarn does not respect `publishConfig.directory` when linking packages in a mono repo. Meaning, when one of your packages isn't being published from the package root - but for example from inside `./dist` - your dev environment will not be able to find the package.

This package deals with that limitation by fixing the links during post install.

See relevant issue: [yarn#7644](https://github.com/yarnpkg/yarn/issues/7644). This package should be deprecated once that issue is resolved.

## Install

```sh
yarn add -D -W link-workspaces
```

## Usage

Add `link-workspaces` to your postinstall:

```json
{
  "scripts": {
    "postinstall": "link-workspaces"
  }
}
```

Now run `yarn install` or `yarn postinstall` and you should be good to go.

## Options

`link-workspaces` will print information about created links to stdout. You can silence this by passing the `--silent` or `-s` flag.

```json
{
  "scripts": {
    "postinstall": "link-workspaces --silent"
  }
}
```


