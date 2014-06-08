## Fulcrum + Accela

A simple demonstrating showing how to use [Fulcrum platform](http://fulcrumapp.com/) to build a powerful data collection app that can intgrate to [Accela Automation](http://www.accela.com/platform/overview) using the [Accela Construct API](https://developer.accela.com/).

This demonstration leverages the [Accela Construct](https://www.npmjs.org/package/accela-construct) Node module.

## Provisioning an API test token:

1. Go to the API v3 [reference page](https://developer.accela.com/Resource/Index).
2. On the lower left, click on [Get an API Test Token](https://developer.accela.com/TestToken/Index).
3. Enter the agency name (Islandton for testing).
4. Enter the scope for the test token - this is a space delimited list of scope identifiers from the [API reference page](https://developer.accela.com/docs/index.htm).
5. Put the generated token in your config file.