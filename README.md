# ToDo MCP Server

To-Do List implemented on MCP with TypeScript

# Running Locally

1. From root, run `npm i`
2. Ensure valid keys are set for OpenAI and WeatherAPI in a .env file (see example template)
3. From root, run `npm start`
4. Terminal output will show application behavior.

# Architecture

This application is built on the Model Context Protocol (MCP) and leverages openai's agent framework to interact with a locally-hosted MCP server.

The MCP server registers DB repo methods as tools that are discovered and leveraged by the agents to facilitate various workflows.

The agents are configured to adhere to specific input/output data structures, and in certain instances, throw errors if a guardrail is triggered.

# Functionality

This application manages a collection of to-do items, and augments the functionality by adding metadata relative to priority, completion, and other dependencies.

The main process impelements an interval logger to communicate that the process is still working between agent resolutions. This is also helpful
to get a sense of execution speed for each operation.
