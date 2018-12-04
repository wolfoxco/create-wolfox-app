# Create Wolfox App

Create Wolfox App with no configuration. This bundles frontend and backend in a good way, ready to code your application.

# Usage

## Create Applications

Create Wolfox App works as a standalone application, just provides a name, and go take a coffee: let the generator do the work for you!

```bash
create-wolfox-app my-awesome-project
```

This command will generate two folders: `my-awesome-project-core` and `my-awesome-project-front`. The first one will contains what needed to get a server started, while the second one focuses on the frontend layer.

We heavily advise you to use Yarn:

```bash
yarn create wolfox-app my-awesome-project
```

And let the magic happens!

## Options

You can provide a bunch of options:
  - `-b, --backend-only` will only build a backend core project.
  - `-f, --frontend-only` will only build a frontend project.
  - `--overwrite` will ask you if you want to overwrite existing folders if any.
  - `-v, --verbose` will make your program verbose.

# Requirements

[Yarn](https://yarnpkg.com/lang/en/) is an absolute requirement. Without it, the software won't work. Git is also required, but it is bundled on every OS nowadays. There's no requirements otherwise.

# Server Architecture

The core part is built around the [French Pastries stack](https://frenchpastries.org). It's a functional backend, built with JavaScript.

# Frontend Architecture

The frontend is built around Hyperapp. It's a functional frontend, inspired by Elm, also built with JavaScript.

# Contributing

Open a PR or fill an issue! Any help is welcome!

# Premium Support

Want some help? Need some consulting to get you started? Reach me, we'll see what we can do for you!
