# How to run and build

## Requirements

- [Node.js](https://nodejs.org/en/download/package-manager/all)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (Optional, documentation uses this)
- [Rust](https://www.rust-lang.org/tools/install)


## OS support (Linux guideline)

Currently, both Windows and Linux is tested and supported (MacOS has been not tested and almost never will be!)

#### Windows
For windows, nothing required, simply follow this document

#### Linux
If you launch / build from source you should change given constant for using posix path system:

This is temporary solution, sorry for inconvience, if you are have solution, please create pull request!
```js
/* 
    ./src/shared/lib/path.ts
*/

// Before ->
const OS_DEFAULT_PATH_STYLE_FALLBACK = OsPathStyle.windows;

// After -> 
const OS_DEFAULT_PATH_STYLE_FALLBACK = OsPathStyle.posix;
``` 

Known problems:
- Dev tools may not appear

If you have no window content, do:
```bash
export WEBKIT_DISABLE_DMABUF_RENDERER=1
```

## Installing environment

Before first launch you required to install JS modules via `Yarn` (or `NPM` on your wish)
By running command below, you will create `node_modules` with JS modules!

(For Rust, everything will be installed on launch/build!)
```cmd
cd ./explorer
yarn
```


## Run in development mode (Development server)

If you want to test / support in development of the project, you will need to launch development server

This will launch Rust backend alongside with React frontend as it will be in bundled build (Also there will be hot reloading for both Rust/React)

```cmd
cd ./explorer
yarn tauri dev
```

## Testing and linting

If you want to run tests you simply run command below,

For linters, at current moment there is no specifications, but please use `Prettier`
```cmd
cd ./explorer
yarn test
```

## Build bundle

If you are want to create final build of the current application, you call tauri builder, that will create build for your current OS (Tauri for now does support cross compilation)

Final build will be located in  `./src-tauri/output/release`

```cmd
cd ./explorer
yarn tauri build
```