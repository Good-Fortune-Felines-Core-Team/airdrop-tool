####
# This stage clones the nearcore repo and builds the node binary.
####
FROM ubuntu:22.04 AS builder

ENV RUSTUP_HOME=/usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo
ENV PATH=/usr/local/cargo/bin:$PATH

RUN apt-get update -qq && apt-get install -y \
    git \
    cmake \
    g++ \
    pkg-config \
    libssl-dev \
    curl \
    llvm \
    clang \
    && rm -rf /var/lib/apt/lists/*
RUN curl https://sh.rustup.rs -sSf | \
    sh -s -- -y --no-modify-path --default-toolchain none

WORKDIR /usr/app

RUN git clone --depth 1 --branch 1.39.0 https://github.com/near/nearcore
RUN cd ./nearcore && make neard

####
# This stage initializes a localnet node configuration and runs the node.
####
FROM ubuntu:22.04 AS runner

RUN apt-get update -qq && apt-get install -y \
    libssl-dev ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

# copy the neard binary from the builder stage
COPY --from=builder /usr/app/nearcore/target/release /usr/app/

# initialize a local node with credentials
RUN ./neard --home ./.near init --chain-id localnet

# start runnning the node
CMD ["/bin/sh", "-c", "./neard --home ./.near run"]
