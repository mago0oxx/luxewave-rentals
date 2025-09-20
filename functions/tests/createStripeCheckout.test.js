const test = require('node:test');
const assert = require('node:assert');
const functionsTest = require('firebase-functions-test')();

// Mock stripe before requiring function
const Module = require('module');
const originalRequire = Module.prototype.require;
const fakeStripe = {
  checkout: {
    sessions: {
      create: async () => ({ url: 'https://example.com/checkout' }),
    },
  },
};
Module.prototype.require = function(moduleName) {
  if (moduleName === 'stripe') {
    return () => fakeStripe;
  }
  return originalRequire.apply(this, arguments);
};

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
const myFunctions = require('../index');
Module.prototype.require = originalRequire;

const createStripeCheckout = myFunctions.createStripeCheckout;

function mockResponse() {
  const res = {};
  res.statusCode = 0;
  res.body = undefined;
  res.headers = {};
  res.status = (code) => {
    res.statusCode = code;
    return {
      json: (data) => {
        res.body = data;
      },
    };
  };
  res.set = () => {};
  res.setHeader = (key, value) => {
    res.headers[key] = value;
  };
  res.getHeader = (key) => res.headers[key];
  return res;
}

test('createStripeCheckout returns url on success', async () => {
  const req = {
    body: { amount: 1000, email: 'test@example.com', name: 'Test', date: '2025-01-01' },
    headers: { origin: 'http://localhost' },
  };
  const res = mockResponse();

  await createStripeCheckout(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body.url);
  functionsTest.cleanup();
});
