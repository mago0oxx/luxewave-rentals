const functionsTest = require('firebase-functions-test')();
const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('createStripeCheckout', () => {
  let createSessionStub;
  let myFunctions;
  let wrappedCreateStripeCheckout;

  after(() => functionsTest.cleanup());

  beforeEach(() => {
    // Stub stripe.checkout.sessions.create to resolve with a fake url
    createSessionStub = sinon.stub().resolves({ url: 'https://stripe.test/session' });

    functionsTest.mockConfig({
      stripe: {
        secret_key: 'sk_test_key',
      },
    });

    const stripeStub = sinon.stub().returns({
      checkout: {
        sessions: {
          create: createSessionStub,
        },
      },
    });

    // Load index.js, injecting the stripe stub
    myFunctions = proxyquire('../index', {
      stripe: stripeStub,
    });

    wrappedCreateStripeCheckout = functionsTest.wrap(myFunctions.createStripeCheckout);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('responds with checkout url', async () => {
    const data = { amount: 1000, email: 'test@example.com', name: 'Test User', date: '2024-01-01' };
    const context = {};

    const result = await wrappedCreateStripeCheckout(data, context);

    expect(result).to.have.property('url');
  });
});
