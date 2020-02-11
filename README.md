# drawio_chartjs_plugin

![overview](doc/overview.png)

## Online Demo
[Online Demo](https://nopeslide.github.io/drawio/?p=chart)

## Usage

* double click on a shape and edit the JSON, the shape will be redrawn after leaving the editor

![example](doc/example.png)

## Installation

* clone repository

* start draw.io desktop
* click on `Extras` , then `Plugins...`
![extras/plugins](doc/drawio_extras.png)

* click `Add`
![extras/plugins/add](doc/drawio_plugin_add.png)

* enter path to cloned git as `file://` uri and append `/build/chart.js` and click `Add`
![extras/plugins/add/path](doc/drawio_plugin_path.png)

* check path and click `Apply`
![extras/plugins/apply](doc/drawio_apply.png)

* confirm dialog and restart draw.io
![restart drawio](doc/drawio_restart.png)

* if the library does not appear on the left side (last entry)
  * check plugin dialog if path was saved
    * if not, remove the directory `~/.config/draw.io` und install again
