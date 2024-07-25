# Explorer

File explorer in style of Windows built with Tauri

At current moment, project provides core features that explorer should have (deal with files, select files etc), project is not built for big community, but if there is a lot of support within reporting issues / features I am will provide support for the project!

### Current Features

- Views
- - 'This PC' view with system drives
- - 'Settings' view
- - 'Files' view
- Sidebar with pins
- History
- Search
- Selection (same as Windows Explorer ctrl/shift)
- Context menu
- Different file view styles

### Planned features

Look into GitHub issues, or read
[Roadmap](docs/ROADMAP.md)

### OS support

Both Windows and Linux is tested and supported. \
For local environment and fixes:  [read that](docs/HOW_TO_BUILD.md)

### Built stack

The project is built using Tauri (React + Rust)

Rust is used for backend OS interactions for now (refactoring logic into Rust is one of next goals)
React is capable of rendering (frontend), storing settings, and actually deal with raw data from Rust backend

Main goal is to build maintainable and extendable code

### How to build / run or create dev environment 

Current workflow is not targeted for release-cycle (publishing releases), so best way is to test and run locally

For documentation, please [read that](docs/HOW_TO_BUILD.md)

### Preview

#### Home page

![](docs/readme/images/home.png)

#### Some files

![](docs/readme/images/files.png)

#### Selection and context menu

![](docs/readme/images/selection.png)

#### Settings

![](docs/readme/images/settings.png)
