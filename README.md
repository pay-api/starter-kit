<p align="center">
  <a href="https://pay-api.link">
    <img src = "./dev-resources/Word__logo.svg" width = 200px>
  </a>
</p>

## Starter kit resources

- [Connect guide](./connect): examples on how to use [Connect](https://connect.pay-api.link/?client_id=88C0525D-067C4B8B-A96DD467-FAD7BE72&mode=retail&scopes=identity%20transactions%20&redirect_uri=https://pay-api.link&sandbox=true)
- [SDK usage example](./sdk-example): examples on how to use the [SDK](https://www.npmjs.com/package/@pay-api/api)
- [curl collection](./curl-collection): example scripts calling the api with `curl`

## Authenticating with pay-api

- Go [signup](https://signup.pay-api.link/) to purchase API key(s).
- You will receive your `client_id` (your license key) in the email you specified.
- You may cancel at anytime using the management link sent to your email.
- Your `client_secret` will be initially set as your `client_id` (the same
  value). Setting this value provents authorized parties from generating access
  tokens under your client id (ie a billing concern), but otherwise is not a
  security concern.
- Your `redirect_uri` will be initially set as `https://pay-api.link`. You may
  set multiple `redirect_uri`s
- The name of your application will be initially set as your emaill address.

After self-signup, please email me to set these values for your client application:
- `client_secret` (I will generate a unique value)
- `redirect_uri` (you may send me multiple uris)
- `name` (your application name)

With your `client_id` key, you are ready to start the authenticate flow with
live users. Using [Connect](./connect) successfully will generate an
`authorzation_code`, which you can then use the [curl
scripts](./curl-collection) to obtain an `access_token`. With the
`access_token`, you are now ready to call the pay-api API.

In all API calls to you must include the API key in the `Authorization` header:
`"Authorization" : "Bearer <Access_Token>"`.

## Read our documentation

- [API Reference](https://docs.pay-api.link/)

## Get in touch
- [Send us a message](https://linkedin.com/in/skilbeck) to talk to our development team
- [Create an issue](https://github.com/pay-api/starter-kit/issues) in this repo if you encounter a bug
- [Start a discussion](https://github.com/pay-api/starter-kit/discussions) in this repo if you have any feedback on how we can improve this resource
