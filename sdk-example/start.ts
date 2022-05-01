#!/usr/bin/env -S npx ts-node -P tsconfig.json
import * as api from '@pay-api/api';
import { default as axios, AxiosResponse } from 'axios';
import joi from 'joi';

// per the respective api environment
//  - dev: 'https://dev.api.pay-api.link'
const BASE_URL = 'https://dev.api.pay-api.link';
const ACCESS_TOKEN = process.env.PAY_API_ACCESS_TOKEN; // keep this private

if (!ACCESS_TOKEN)
  throw new Error(
    'api key not found; load it with `PAY_API_ACCESS_TOKEN="..." ./start.ts`'
  );
const authorizationHeaderValue = `Bearer ${ACCESS_TOKEN}`; // `Key` if dev or prod, `Sandbox` if sandbox
const authorizationHeader = { Authorization: authorizationHeaderValue };

/** mode = Retail */
// identity request

const getIdentity = async (): Promise<api.IdentityResponse> => {
  const response = await axios.request<AxiosResponse<api.IdentityResponse>>({
    method: 'GET',
    url: `${BASE_URL}/retail/identity`,
    headers: { ...authorizationHeader },
  });

  return handleResponse<api.IdentityResponse>({
    response,
    joiType: api.joi.identity,
  });
};

// transactions request
const getTransactions = async (): Promise<api.TransactionsResponse> => {
  const startDate = '2022-04-01';
  const endDate = '2022-04-30';

  const response = await axios.request<AxiosResponse<api.TransactionsResponse>>(
    {
      method: 'GET',
      url: `${BASE_URL}/retail/transactions?start_date=${startDate}&end_date=${endDate}`,
      headers: { ...authorizationHeader },
    }
  );

  return handleResponse<api.TransactionsResponse>({
    response,
    joiType: api.joi.retailTransactions,
  });
};

/** Main */
(async (): Promise<void> => {
  try {
    const [transactions, identity] = await Promise.all([
      getTransactions(),
      getIdentity(),
    ]);

    console.log({ transactions });
    console.log({ identity });
  } catch (err) {
    console.log({ err });
    process.exit(1);
  }

  process.exit(0);
})();

/** helpers, they joi validate the data along with print out the debugging information */
function handleResponseBase<T>({ response }: { response: AxiosResponse }): T {
  const {
    headers: { 'x-amzn-requestid': requestId, 'x-amzn-trace-id': traceId },
    data,
  } = response;

  const apiResponse: T = data; // to type `apiResponse` -- if you destructure inline on L72 (`data`) it will have an `any` type, so we want to property type this

  console.log(
    { requestId, traceId },
    'if errors encountered, please send me these ids\n'
  );

  return apiResponse;
}

function handleResponse<T>({
  response,
  joiType,
}: {
  response: AxiosResponse;
  joiType: joi.ObjectSchema<T> | joi.ArraySchema;
}): T {
  const apiResponse = handleResponseBase<T>({ response });

  if (!apiResponse) throw new Error('Failure!');

  const { value: validatedTxn, error } = joiType.validate(apiResponse, {
    abortEarly: true,
    presence: 'required',
  }) as {
    value: T;
    error: joi.ValidationError | undefined;
  };

  if (error) {
    console.log({ error });
    throw new Error('Did not get expected result back from server');
  }

  return validatedTxn;
}
