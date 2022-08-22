## Welcome to the mean stack

The mean stack is intended to provide a simple and fun starting point for cloud native fullstack javascript applications.  
MEAN is a set of Open Source components that together, provide an end-to-end framework for building dynamic web applications; starting from the top (code running in the browser) to the bottom (database). The stack is made up of:

- **M**ongoDB : Document database – used by your back-end application to store its data as JSON (JavaScript Object Notation) documents
- **E**xpress (sometimes referred to as Express.js): Back-end web application framework running on top of Node.js
- **A**ngular (formerly Angular.js): Front-end web app framework; runs your JavaScript code in the user's browser, allowing your application UI to be dynamic
- **N**ode.js : JavaScript runtime environment – lets you implement your application back-end in JavaScript

### Pre-requisites

- git - [Installation guide](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) .
- node.js - [Download page](https://nodejs.org/en/download/) .
- npm - comes with node or download yarn - [Download page](https://yarnpkg.com/lang/en/docs/install) .
- mongodb - [Download page](https://www.mongodb.com/download-center/community) .

### Installation

```
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
yarn
yarn start (for development)
```

### Docker based

> ⚠️ Make sure your Docker version is 19.03.0+.

```
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
docker-compose up -d
```

### Alternative - Develop with Raftt

#### What is Raftt?

Raftt is a cloud-based development infrastructure that lets you spawn remote dev envs without the need for any local setup and while keeping the tools and experience of local environments.

#### Pre-requisites

- git - [Installation guide](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) .
- Raftt [installation guide](https://docs.raftt.io/docs/basics/quickstart#step-1---install-raftt)

That's all. No need to install Node.js, MongoDB etc..

#### Interactive debugging

Using Raftt allows interactively debugging microservices with minimal configuration.  
See [here](https://docs.raftt.io/docs/debugging/JetBrains) documentation about configuring debugging.

#### How to start development

```
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
Mac OS  - brew install rafttio/tap/raftt or curl -fsSL get.raftt.io/install | bash
Linux   - sudo snap install raftt --classic or curl -fsSL get.raftt.io/install | bash
Windows - Download and run (https://get.raftt.io/windowsinstall)
raftt up
```

### Credits

- The MEAN name was coined by Valeri Karpov.
- Initial concept and development was done by Amos Haviv and sponsered by Linnovate.
- Inspired by the great work of Madhusudhan Srinivasa.
