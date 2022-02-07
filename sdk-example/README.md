# SDK example

## Quickstart

install the dependencies (including sdk), 

```bash
npm install
```

call the sdk-example,

```bash
PAY_API_KEY='your key here' ./start.ts
```

what you will receive back as a response

```
$ PAY_API_KEY='[[ redacted ]]' ./start.ts
{
  requestId: '53d2a97f-7dbe-409b-9496-ee56c3e10d1f',
  xrayTraceId: 'Root=1-620085d5-671652990fd885c013148878'
} logged request ids; if errors encountered, please contact us with these ids

{
  result: {
    amount: 123,
    created_at: '2022-02-07T02:37:13.338Z',
    is_test: true,
    merchant_id: 'cd0938bc-ed24-5b3c-b930-c878ebfb54ae',
    transaction_id: '5cff0dc5-86a7-41c9-ad3d-d6c6c87fd902',
    transaction_type: 'charge'
  }
}
```

### Notes

The script (`start.ts`) is currently set up to hit the sandbox environment. 

To hit the other environments (`dev`, `prod`), you will need to do two changes to this example:

1. Edit BASE_URL to target the respective environment (here, we'll change this to the dev environment)

	```typescript
	const BASE_URL = 'https://sandbox.dev.engineering.pay-api.link';
	```
	
	to
	
	```typescript
	const BASE_URL = 'https://dev.api.pay-api.link';
	```
	
	the `BASE_URL` will change yet again if you wish to call the production environment.

2. Change the API token prefix

	```typescript
	const authorizationHeaderValue = `Sandbox ${API_KEY}`;
	```
	
	```typescript
	const authorizationHeaderValue = `Key ${API_KEY}`;
	```
	
	the token prefix (`Key`) will not change if you wish to call the production environment, but your respective API key will need to change, as API keys are restricted to their respective environments.
