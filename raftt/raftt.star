# Currently used for debugging and not for env deployment
config_version("0.9")
mean_deploy = docker_compose("./docker-compose.yml")
mongo_client = docker_compose("./raftt/mongo-client/mongo-client-compose.yml")

deploy(mean_deploy)
deploy(mongo_client)
deploy_dev_container(docker_compose("./raftt/dev-compose.yml"))
