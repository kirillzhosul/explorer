# Explorer

File explorer in style of Windows built with Tauri
For now, provides core features that explorer should provide (deal with files, select files and etc), project is not build for big community, but if there is a lot of support within reporting issues / features I am will provide support for the project!

### Features

- Views
- - 'This PC' view with system drives (WIP)
- - 'Settings' view (WIP)
- - 'Files' view
- Sidebar with pins
- History (WIP)
- Search (WIP, grep)
- Selection (same as Windows Explorer ctrl/shift)
- Context menu
- Different file view styles

### TODO

- Add column information view (like, Windows explorer)
- Add properties view
- Allow to view content of some files
- Allow to have paths with external sources (SFTP/WebDAV/Predefined cloud drives)
- More in GitHub issues...

### OS support

Currently, only Windows is tested and supported, Linux may come later but no guarantee

### Built stack

The project is built using Tauri (React + Rust)

Rust is used for backend OS interactions for now (refactoring logic into Rust is one of next goals)
React is capable of rendering (frontend), storing settings, and actually deal with raw data from Rust backend

Main goal is to build maintainable and extendable code

### How to build / run

[Read that](docs/readme/HOW_TO_BUILD.md)

### Preview

#### Home page

![](docs/readme/images/home.png)

#### Some files

![](docs/readme/images/files.png)

#### Selection and context menu

![](docs/readme/images/selection.png)

#### Settings

![](docs/readme/images/settings.png)
