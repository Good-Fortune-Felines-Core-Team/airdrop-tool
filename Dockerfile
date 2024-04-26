FROM ubuntu:22.04

RUN apt-get update -qq && apt-get install -y \
    libssl-dev ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

# start runnning the node
CMD ["/bin/sh", "-c", "./neard --home ./.near init --chain-id localnet && ./neard --home ./.near run"]
