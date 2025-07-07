const functionsTest = require('firebase-functions-test')();
const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('createStripeCheckout', () => {
  let createSessionStub;
  let myFunctions;

  beforeEach(() => {
    // Stub stripe.checkout.sessions.create to resolve with a fake url
    createSessionStub = sinon.stub().resolves({ url: 'https://stripe.test/session' });

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
  });

  afterEach(() => {
    sinon.restore();
  });

  it('responds with 200 and checkout url', async () => {
    const req = {
      body: { amount: 1000, email: 'test@example.com', name: 'Test User', date: '2024-01-01' },
      headers: { origin: 'https://test.com' },
      method: 'POST'
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      set: sinon.stub().returnsThis(),
      setHeader: sinon.stub().returnsThis(),
      getHeader: sinon.stub()
    };

    await myFunctions.createStripeCheckout(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.called).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('url');
  });
});
