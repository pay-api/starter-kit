#!/usr/bin/env -S npx ts-node -P tsconfig.json
import * as api from '@pay-api/api';
import { default as axios, AxiosResponse } from 'axios';
import joi from 'joi';

// per the respective api environment
//  - dev: `https://dev.api.pay-api.link`
//  - sandbox: `https://sandbox.dev.engineering.pay-api.link`
const BASE_URL = 'https://sandbox.dev.engineering.pay-api.link';
const API_KEY = process.env.PAY_API_KEY; // keep this private

if (!API_KEY)
  throw new Error(
    'api key not found; load it with `PAY_API_KEY="..." ./start.ts`'
  );
const authorizationHeaderValue = `Sandbox ${API_KEY}`; // `Key` if dev or prod, `Sandbox` if sandbox
const authorizationHeader = { Authorization: authorizationHeaderValue };

type TransactionRequest = Omit<api.TransactionRequest, 'merchant_id'>; // merchantId not required for client requests

const createTransaction = async (): Promise<api.TransactionResponse> => {
  const txn: TransactionRequest = {
    amount: 123,
    is_test: true,
    transaction_type: 'charge',
  };

  const response = await axios.request<AxiosResponse<api.TransactionResponse>>({
    method: 'POST',
    url: `${BASE_URL}/transaction`,
    headers: { ...authorizationHeader },
    data: txn,
  });

  return handleResponse<api.TransactionResponse>({
    response,
    joiType: api.joi.transaction,
  });
};

const getTransaction = async (
  txnId: api.TransactionIdRequest
): Promise<api.TransactionResponse> => {
  const response = await axios.request<AxiosResponse<api.TransactionResponse>>({
    method: 'GET',
    url: `${BASE_URL}/transaction/${txnId}`,
    headers: { ...authorizationHeader },
  });

  return handleResponse<api.TransactionResponse>({
    response,
    joiType: api.joi.transaction,
  });
};

const searchTransactions =
  async (): Promise<api.SearchTransactionsResponse> => {
    const response = await axios.request<
      AxiosResponse<api.SearchTransactionsResponse>
    >({
      method: 'GET',
      url: `${BASE_URL}/search?start_date=2022-01-01&end_date=2022-01-15`,
      headers: { ...authorizationHeader },
    });

    return handleResponseBase<api.SearchTransactionsResponse>({
      response,
    });
  };

(async (): Promise<void> => {
  try {
    const create = await createTransaction();

    console.log({ create });

    const describe = await getTransaction(create.transaction_id);

    console.log({ describe }); // if using the sandbox, the values are randomly generated / do not persist across calls. the data persists in `dev`/`prod` environments.
    //
    const search = await searchTransactions();

    console.log({ search });
    console.log({ searchExampleTxn: search.transactions.slice(0, 2) });
  } catch (err) {
    console.log({ err });
    process.exit(1);
  }

  process.exit(0);
})();

function handleResponseBase<T>({ response }: { response: AxiosResponse }): T {
  const {
    headers: { 'x-amzn-requestid': requestId, 'x-amzn-trace-id': traceId },
    data,
  } = response;

  const apiResponse: T = data; // type `apiResponse`, if you destructure inline on L96 it will have an `any` type

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
  joiType: joi.ObjectSchema<T>;
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
