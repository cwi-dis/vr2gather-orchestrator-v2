# VR2Gather Orchestrator v2

Orchestrator application to go along with the VR2Gather architecture, handling
user and session management as well as transmission of binary data between
users over the network.

## Running the Orchestrator

The easiest way to run the orchestrator is through Docker. First, make sure you
have Docker and `docker-compose` installed. Rename the file `.env-sample` to
`.env` and copy the file `config/config-sample/ntp-config.json` to
`config/ntp-config.json` and adjust the values if needed.

If you set the key `EXTERNAL_HOSTNAME` in `.env` to `dynamic` or leave it unset
completely, the server will try to determine the external hostname using the
request headers when creating a new session. If it fails to do so, an exception
will be raised.

You can add multiple NTP servers to this config file, they will be tried in
order until the first one returns a valid response. Adding an entry with the
key-value pair `"server": "localtime"` will return the host's local time
without querying an NTP server. After setting up the config, simply build and
start the container by running

    docker compose up

This will build the container if it hasn't already been build and launch it on
port 8090.

### Note for Ubuntu users

It is recommended that you use the latest version of Docker and all associated
tools. The versions found in Ubuntu's official APT repositories are sometimes a
bit outdated, therefore, we recommend you download Docker from Docker's APT
repositories. Follow [this guide](https://docs.docker.com/engine/install/ubuntu/)
to do so.

### External SFUs

External SFU binaries placed inside a folder `packages/` in the project root
are placed inside to container during build time inside the folder `/packages`.
Keep this in mind when writing SFU config files.

## Development

### Building

In order to build the application for development, first make sure you have
`yarn` installed. Then, to install the dependencies and compile the application
run:

    yarn install
    yarn build

### Running

After compiling it, make sure to copy the file `.env-sample` to `.env` and
update the environment variables as needed. Moreover, copy the file
`config/config-sample/ntp-config.json` to `config/ntp-config.json` and change
the hostname/port of your time server if needed. Then, the application server
can be launched as follows:

    yarn start

## Utilities

The orchestrator comes with a series of utilities which may come in handy for
development and debugging. They are Node.js scripts and located in the
`scripts/` folder.

### Reading logs remotely

If the property `LOG_SERVER` is set in `.env`, all Orchestrator log messages
are forwarded via the Orchestrator's Socket.IO connection. To read them
remotely, you can use the `logreader` script, which takes the Orchestrator's
hostname (and optional port) as command line argument:

    node scripts/logreader.js localhost:8090

### Dump data tree

In order to dump the entire data tree of an orchestrator instance, you can use
the `dump` script, passing in the hostname of an orchestrator instance:

    node scripts/dump.js localhost:8090

### Terminate orchestrator

In order to restart/terminate a remote orchestrator instance, use the
`terminate` script, passing along the hostname of an instance:

    node scripts/terminate.js localhost:8090

If the orchestrator instance is running inside a Docker container using the
supplied `docker-compose.yml` configuration, the Docker daemon will relaunch
the container immediately. All data stored in the orchestrator at the time of
termination will be lost.
