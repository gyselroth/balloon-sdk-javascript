const { assert } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const superagentStub = require('./stubs/superagentStub.js');
const BasicAuthStub = require('./stubs/BasicAuthStub.js');
const BalloonHttpError = require('../src/error/BalloonHttpError.js');

const BalloonRequestBase = proxyquire('../src/BalloonRequestBase.js', { superagent: superagentStub.agent });

describe('BalloonRequestBase', function () {
  describe('constructor', function () {
    const auth = new BasicAuthStub({ username: 'username', password: 'password' });

    it('creates the request', function () {
      sinon.spy(superagentStub.agent, 'get');

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      assert(superagentStub.agent.get.calledOnce);
      superagentStub.agent.get.restore();
    });


    it('falls back to get if no method specfied', function () {
      sinon.spy(superagentStub.agent, 'get');

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({});

      assert(superagentStub.agent.get.calledOnce);
      superagentStub.agent.get.restore();
    });

    it('chooses the correct method', function () {
      sinon.spy(superagentStub.agent, 'post');

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'POST' });

      assert(superagentStub.agent.post.calledOnce);
      superagentStub.agent.post.restore();
    });

    it('creates the request for the given uri', function () {
      sinon.spy(superagentStub.agent, 'post');
      const expectedUri = 'https://example.org';
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({
        method: 'POST',
        uri: expectedUri,
      });

      assert(superagentStub.agent.post.calledWith(expectedUri));
      superagentStub.agent.post.restore();
    });

    it('authorizes the request', function () {
      sinon.spy(BalloonRequestBase.prototype, '_authorize');

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ auth });

      assert(BalloonRequestBase.prototype._authorize.calledOnce);
      assert(BalloonRequestBase.prototype._authorize.calledWith(auth));
      BalloonRequestBase.prototype._authorize.restore();
    });
  });

  describe('type', function () {
    it('sets the request type', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'type');
      request.type('text/plain');
      assert(superagentStub.Request.prototype.type.calledOnce);
      assert(superagentStub.Request.prototype.type.calledWith('text/plain'));
      assert.equal(request._type, 'text/plain');

      superagentStub.Request.prototype.type.restore();
    });
  });

  describe('query', function () {
    it('sets query', function () {
      const query = { id: 'abc', delted: false };

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'query');
      request.type('text/plain');
      request.query(query);

      assert(superagentStub.Request.prototype.query.calledOnce);
      assert(superagentStub.Request.prototype.query.calledWith(query));

      superagentStub.Request.prototype.query.restore();
    });

    it('json encodes the query if request type is json', function () {
      const query = { id: 'abc', delted: false };

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'query');
      request.type('application/json');
      request.query(query);

      assert(superagentStub.Request.prototype.query.calledOnce);
      assert(superagentStub.Request.prototype.query.calledWith(JSON.stringify(query)));

      superagentStub.Request.prototype.query.restore();
    });

    it('does not set the query if params are empty', function () {
      const query = {};

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'query');
      request.type('application/json');
      request.query(query);

      assert(superagentStub.Request.prototype.query.notCalled);

      superagentStub.Request.prototype.query.restore();
    });
  });

  describe('binaryResponse', function () {
    it('sets the responseType to blob', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'responseType');
      request.binaryResponse();

      assert(superagentStub.Request.prototype.responseType.calledOnce);
      assert(superagentStub.Request.prototype.responseType.calledWith('blob'));

      superagentStub.Request.prototype.responseType.restore();
    });
  });

  describe('send', function () {
    it('sends the contents', function () {
      const buffer = new Buffer('xyz');

      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'send');
      request.send(buffer);

      assert(superagentStub.Request.prototype.send.calledOnce);
      assert(superagentStub.Request.prototype.send.calledWith(buffer));

      superagentStub.Request.prototype.send.restore();
    });
  });

  describe('end', function () {
    it('sends the request', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'end');
      const callback = sinon.spy();

      request.end(callback);

      assert(superagentStub.Request.prototype.end.calledOnce);
      assert(callback.calledOnce);

      superagentStub.Request.prototype.end.restore();
    });

    it('logs a warning when end has been called twice', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      /* eslint-disable no-console */
      sinon.stub(console, 'warn');
      const callback = sinon.spy();

      request.end(callback);
      request.end(callback);

      assert(console.warn.calledOnce);
      assert(callback.calledTwice);
      console.warn.restore();
      /* eslint-enable no-console */
    });

    it('passes the superagent response to the callback', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });
      const expectedResponse = { status: 200 };

      sinon.stub(superagentStub.Request.prototype, 'end');
      const callback = sinon.spy();

      superagentStub.Request.prototype.end.callsArgWith(0, null, expectedResponse);

      request.end(callback);

      assert.equal(callback.getCall(0).args[0], null);
      assert.equal(callback.getCall(0).args[1], expectedResponse);

      superagentStub.Request.prototype.end.restore();
    });

    it('passes the superagent err to the callback', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });
      const expectedErr = new Error('Fake superagent error');

      sinon.stub(superagentStub.Request.prototype, 'end');
      const callback = sinon.spy();

      superagentStub.Request.prototype.end.callsArgWith(0, expectedErr);

      request.end(callback);

      assert.equal(callback.getCall(0).args[0], expectedErr);

      superagentStub.Request.prototype.end.restore();
    });

    it('converts superagent error to an BalloonHttpError if err and response recieved', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });
      const expectedResponse = { status: 404 };

      sinon.stub(superagentStub.Request.prototype, 'end');
      const callback = sinon.spy();

      superagentStub.Request.prototype.end.callsArgWith(0, new Error('Fake http error'), expectedResponse);

      request.end(callback);

      assert.instanceOf(callback.getCall(0).args[0], BalloonHttpError);
      assert.equal(callback.getCall(0).args[1], expectedResponse);

      superagentStub.Request.prototype.end.restore();
    });
  });

  describe('then', function () {
    it('sends the request', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      sinon.spy(superagentStub.Request.prototype, 'end');

      const promise = request.then();

      assert(superagentStub.Request.prototype.end.calledOnce);
      assert.instanceOf(promise, Promise);

      superagentStub.Request.prototype.end.restore();
    });

    it('logs a warning when end has been called before then', function () {
      // eslint-disable-next-line no-unused-vars
      const request = new BalloonRequestBase({ method: 'GET' });

      /* eslint-disable no-console */
      sinon.stub(console, 'warn');
      const callback = sinon.spy();

      request.end(callback).then();
      assert(console.warn.calledTwice);
      assert(callback.calledOnce);
      console.warn.restore();
      /* eslint-enable no-console */
    });
  });

  describe('_authorize', function () {
    it('authorizes the request', function () {
      const auth = new BasicAuthStub({ username: 'username', password: 'password' });
      sinon.spy(auth, 'authorizeRequest');

      const request = new BalloonRequestBase({ method: 'GET' });
      request._authorize(auth);

      assert(auth.authorizeRequest.calledOnce);
      assert(auth.authorizeRequest.calledWith(request.request));
    });
  });

  describe('_authorize', function () {
    it('sets the X-Client header', function () {
      const client = { name: 'Name', version: '0.0.1' };
      sinon.spy(superagentStub.Request.prototype, 'set');

      const request = new BalloonRequestBase({ method: 'GET' });
      request._setXClientHeader(client);

      assert(superagentStub.Request.prototype.set.calledOnce);
      assert(superagentStub.Request.prototype.set.calledWith('X-Client', 'Name|0.0.1|'));

      superagentStub.Request.prototype.set.restore();
    });

    it('sets the hostname in the X-Client header', function () {
      const client = { name: 'Name', version: '0.0.1', hostname: 'Hostname' };
      sinon.spy(superagentStub.Request.prototype, 'set');

      const request = new BalloonRequestBase({ method: 'GET' });
      request._setXClientHeader(client);

      assert(superagentStub.Request.prototype.set.calledOnce);
      assert(superagentStub.Request.prototype.set.calledWith('X-Client', 'Name|0.0.1|Hostname'));

      superagentStub.Request.prototype.set.restore();
    });

    it('does not set the X-Client header, if client is undefined', function () {
      const client = undefined;
      sinon.spy(superagentStub.Request.prototype, 'set');

      const request = new BalloonRequestBase({ method: 'GET' });
      request._setXClientHeader(client);

      assert(superagentStub.Request.prototype.set.notCalled);

      superagentStub.Request.prototype.set.restore();
    });
  });
});
