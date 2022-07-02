import axios from 'axios';
import * as api from '@pay-api/api';

// per the respective api environment
//  - dev: 'https://dev.api.pay-api.link'
const BASE_URL = 'https://dev.api.pay-api.link';

// we mock this call in the test, so it can be fake
const ACCESS_TOKEN = 'fake-jwt';
const authorizationHeader = { Authorization: `Bearer ${ACCESS_TOKEN}` };

export const requestOrders = async (): Promise<api.OrdersResponse> =>
  (
    await axios.request<api.OrdersResponse>({
      method: 'GET',
      url: `${BASE_URL}/retail/orders`,
      headers: { ...authorizationHeader },
    })
  ).data;
