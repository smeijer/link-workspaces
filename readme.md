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

## Credits

I've used the following packages/files as inspiration when creating `link-workspaces`. You might see similarities in the code if you were to compare the files. All source code used and linked below is licensed under the MIT license.

Much kudos to the authors of the original source:

- [webiny/webiny-js/.../linkPackages.js](https://github.com/webiny/webiny-js/blob/da269089ebaf18cc00c43919688fc4a005314d72/packages/project-utils/packages/linkPackages.js)

- [get-yarn-workspaces](https://github.com/viewstools/yarn-workspaces-cra-crna/blob/d349ecb223fda7ebca7e0686dc0472534780399c/get-yarn-workspaces/index.js)

