/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Expense App API
 * MVP 用の最小家計簿 API。
認証は JWT（Bearer トークン）方式。

 * OpenAPI spec version: 0.1.1
 */
import {
  faker
} from '@faker-js/faker';

import {
  HttpResponse,
  delay,
  http
} from 'msw';

import type {
  Transaction
} from '.././model';


export const getGetTransactionsResponseMock = (): Transaction[] => (Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), userId: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), categoryId: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), null]), undefined]), transDate: faker.helpers.arrayElement([faker.date.past().toISOString().split('T')[0], undefined]), amount: faker.helpers.arrayElement([faker.helpers.fromRegExp('^-?\d+(\.\d{1,2})?$'), undefined]), memo: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 500}}), null]), undefined]), createdAt: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`, undefined])})))

export const getPostTransactionsResponseMock = (overrideResponse: Partial< Transaction > = {}): Transaction => ({id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), userId: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), categoryId: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), null]), undefined]), transDate: faker.helpers.arrayElement([faker.date.past().toISOString().split('T')[0], undefined]), amount: faker.helpers.arrayElement([faker.helpers.fromRegExp('^-?\d+(\.\d{1,2})?$'), undefined]), memo: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 500}}), null]), undefined]), createdAt: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`, undefined]), ...overrideResponse})

export const getGetTransactionsIdResponseMock = (overrideResponse: Partial< Transaction > = {}): Transaction => ({id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), userId: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), categoryId: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), null]), undefined]), transDate: faker.helpers.arrayElement([faker.date.past().toISOString().split('T')[0], undefined]), amount: faker.helpers.arrayElement([faker.helpers.fromRegExp('^-?\d+(\.\d{1,2})?$'), undefined]), memo: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 500}}), null]), undefined]), createdAt: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`, undefined]), ...overrideResponse})

export const getPutTransactionsIdResponseMock = (overrideResponse: Partial< Transaction > = {}): Transaction => ({id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), userId: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), undefined]), categoryId: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined, multipleOf: undefined}), null]), undefined]), transDate: faker.helpers.arrayElement([faker.date.past().toISOString().split('T')[0], undefined]), amount: faker.helpers.arrayElement([faker.helpers.fromRegExp('^-?\d+(\.\d{1,2})?$'), undefined]), memo: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 500}}), null]), undefined]), createdAt: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`, undefined]), ...overrideResponse})


export const getGetTransactionsMockHandler = (overrideResponse?: Transaction[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<Transaction[]> | Transaction[])) => {
  return http.get('*/transactions', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetTransactionsResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getPostTransactionsMockHandler = (overrideResponse?: Transaction | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<Transaction> | Transaction)) => {
  return http.post('*/transactions', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPostTransactionsResponseMock()),
      { status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getGetTransactionsIdMockHandler = (overrideResponse?: Transaction | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<Transaction> | Transaction)) => {
  return http.get('*/transactions/:id', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetTransactionsIdResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getPutTransactionsIdMockHandler = (overrideResponse?: Transaction | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<Transaction> | Transaction)) => {
  return http.put('*/transactions/:id', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPutTransactionsIdResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getDeleteTransactionsIdMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void)) => {
  return http.delete('*/transactions/:id', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 204,
        
      })
  })
}
export const getTransactionsMock = () => [
  getGetTransactionsMockHandler(),
  getPostTransactionsMockHandler(),
  getGetTransactionsIdMockHandler(),
  getPutTransactionsIdMockHandler(),
  getDeleteTransactionsIdMockHandler()
]
