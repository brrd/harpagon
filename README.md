![Harpagon](harpagon.png)

# Harpagon

> Simple command-line invoicing tool

## Why?

I wrote this to generate PDF quotes, delivery orders and invoices for freelance activity. It currently matches my own specific needs (french language, "auto-entrepreneur" status...) but this can be easilly changed to fit to your needs.

## Install

```
npm install -g git+https://github.com/brrd/harpagon.git
```

## How to use

```
harpagon <command> [options]
```

COMMANDS:

```
new [filename]                      Create new record
export <template> <sourceFile>      Export record to PDF
reset                               Delete current user config and reset to default
help <command>                      Display help for a specific command
```

## Customize

Configuration files and customizable templates are stored in `home/.harpagon/`:

* `templates/` contains the HTML/CSS templates used to generate PDFs. Templating language is [Nunjucks](https://mozilla.github.io/nunjucks/templating.html).
* `config.yml` contains your personnal informations.
* `record.yml` contains the default record created when using `new` command.

## License

Copyright (c) 2021 Thomas Brouard

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
