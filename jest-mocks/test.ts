import axios from 'axios';
import * as api from '@pay-api/api';

import { requestOrders } from './src';
import { HttpError } from './utils';

jest.mock('axios', () => ({
  request: jest.fn(),
}));

const ordersResponse: api.OrdersResponse = [
  {
    order_id: '111-8523618-8988224',
    date: '2022-04-02T00:00:00.000Z',
    shipment_date: '2022-04-02T00:00:00.000Z',
    status: 'completed',
    carrier_name_and_tracking_number:
      'AMZN_US(TBA09R942511234),RABBIT(DW00H05P0YXU4FADFA1M)',
    shipment_to: 'Laurine Barton',
    shipment_street_address: '221 S Main St',
    shipment_city: 'Yuma',
    shipment_state: 'AZ',
    shipment_postal: '30691-3189',
    payment_instrument: 'Visa - 9999',
    currency: 'usd',
    subtotal: 523,
    shipping_fee: 148,
    tax: 339,
    promotions: 23,
    total: 988,
  },
];

const mock200Orders = () => {
  axios.request
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockImplementationOnce(async () => ({ data: ordersResponse }));

  return axios;
};

const mock202 = () => {
  axios.request
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockImplementationOnce(async () => ({
      data: {
        message:
          'Pending - Retry your call after the specified amount of seconds',
      },
    }));

  return axios;
};

const mock401 = () => {
  axios.request
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockImplementationOnce(async () => {
      throw new HttpError({
        data: { message: 'Reauthentication required' },
        status: 401,
      });
    });

  return axios;
};

describe('pay-api jest mocks', () => {
  describe('2xx mocks', () => {
    it('mocks a 200', async () => {
      mock200Orders();

      const expected = ordersResponse;

      const actual = await requestOrders();

      expect(actual).toStrictEqual(expected);
    });

    it('mocks a 202', async () => {
      mock202();

      const expected = {
        message:
          'Pending - Retry your call after the specified amount of seconds',
      };

      const actual = await requestOrders();

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('4xx mocks', () => {
    it('mocks a 401', async () => {
      mock401();

      const actual = async () => requestOrders();

      await expect(actual()).rejects.toThrowError('Reauthentication required');
    });
  });
});
