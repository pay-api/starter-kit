# SDK example

## Quickstart

install the dependencies (including sdk),

```bash
npm install
```

call the sdk-example,

```bash
PAY_API_ACCESS_TOKEN='your key here' ./start.ts
```

for example (note that this key will be revoked after publishing):

  ```bash
  @mbp2:sdk-example $ PAY_API_ACCESS_TOKEN=Y2xpZW50Izg4QzA1MjVELTA2N0M0QjhCLUE5NkRENDY3LUZBRDdCRTcyfHRva2VuIzY3NGQyNTkyLTcwZGMtNGY4YS05YWZjLTZjYThkMTA1NTllNA== ./start.ts
  ```

what you will receive back as a response

```
$ PAY_API_ACCESS_TOKEN='[[ redacted ]]' ./start.ts
{
  requestId: 'c37074ec-c5c7-45b4-898f-a792463599e3',
  traceId: 'Root=1-626e05b0-1e49a2cd340c02bb63c3d5cc'
} if errors encountered, please send me these ids

{
  identity: { email: 'Louisa_Bogan47@yahoo.com', name: 'Ernie Schmitt' }
}
```

### Notes

The script (`start.ts`) is currently set up to hit the dev environment.

To hit the other environments (`dev`, `prod`), you will need to do two changes to this example:

Edit BASE_URL to target the respective environment (here, we'll change this to the prod environment)

  ```typescript
  const BASE_URL = 'https://dev.api.pay-api.link';
  ```

  to

  ```typescript
  const BASE_URL = 'https://api.pay-api.link';
  ```
