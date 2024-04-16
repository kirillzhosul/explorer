# Requirements

- Node
- Rust (MSVC, C++ Build Tools for Windows)
- Yarn (you can use any package manager)

## Pre-install

Install node modules

```cmd
cd ./explorer
yarn
```

## Dev server

Hot reload server for development

```cmd
cd ./explorer
yarn tauri dev
```

## Build

```cmd
cd ./explorer
yarn tauri build
```

Out builds will be in ./src-tauri/output/release
