# laravel-mix-cli
A simple CLI for initiating [laravel-mix](https://github.com/JeffreyWay/laravel-mix/) projects in non-laravel, standalone projects

> Laravel Mix provides a clean, fluent API for defining basic webpack build steps for your Laravel application. Mix supports several common CSS and JavaScript pre-processors.
> (laravel-mix/readme)

laravel-mix-cli scaffold the laravel-mix standalone projects by setting up a global `mix` command in your command-line.

----------

### Installation
``` bash
npm install -g laravel-mix-cli

```

run: `mix -h` to ensure the installation was successful.

### Getting Started:
``` bash
npm install -g laravel-mix-cli
mix init -i -d my-project
cd my-project
npm run watch
```


----------


### Usage

``` bash
# initiate the mix project files in the currrent directory
mix init
```

The above command will assume you want the `default` laravel-mix template, it will extract the template files from [laravel-mix-templates/default](https://github.com/laravel-mix-templates/default), and generates the project at the current working directory.

At the time of this writing, there is only one `default` template at the [laravel-mix-templates](https://github.com/laravel-mix-templates) github-organization account.

----------


### `init` Options

Note: `new` is an alias for `init`, so you can use: `mix new [options][template]`

#### `-d < dir >` or  `--dir < dir >`  (default: './')

create this project in the specified new directory. by default, `laravel-mix-cli` will assume you want to initiate your project in the current working directory (the command line directory you called `mix init`  from).

Example:
``` bash
    mkdir mix-projects && cd mix-projects
    ls # empty directory
    mix init -d first-project
    ls # first-project directory is created & scaffolded with the laravel-mix template files
```

#### `-i` or `--install` (default: false)

install npm/yarn dependencies after initiating the project.

Example:
``` bash
mix init -i # create a mix project in the current directory, then install all of it's package.json dependencies 
```
``` bash
mix init -d my-app -i # create a my-app directory if it's not exists, then scaffold it with the laravel-mix template files, then "cd" into that project and "npm install" all of it's dependencies 
```

Note:
the `-i` or `--install` option will check if there is a `yarn.lock` file in the destination directory, and will run `yarn install` if the file exists.


----------

### Credits
While creating this project, I got help from looking at the [vuejs/vue-cli](https://github.com/vuejs/vue-cli) source code, and the [laravel-mix](https://github.com/JeffreyWay/laravel-mix/) itself.

----------

### Contribution

Yes Please! I created this project as my own-helper at first, there is so much refactoring need to be done here :/
