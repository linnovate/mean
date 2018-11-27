## Welcome to the mean stack

The mean stack is intended to provide a simple and fun starting point for cloud native fullstack javascript applications.

### Pre-requisites
* git - [Installation guide](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/)
* node.js - [Download page](https://nodejs.org/en/download/)
* yarn - [Download page](https://yarnpkg.com/lang/en/docs/install)
* mongodb - [Download page](https://www.mongodb.com/download-center/community)

### Installation 
``` 
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
yarn install
yarn build
yarn start (for development)
yarn serve (for production)
```
### Docker based 
``` 
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
docker-compose up -d
```
