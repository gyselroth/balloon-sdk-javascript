const { assert } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const BalloonRequestStub = require('./stubs/BalloonRequestStub.js');

const BalloonResource = proxyquire('../src/BalloonResource.js', { './BalloonRequest.js': BalloonRequestStub });
const TokenAuth = require('../src/auth/TokenAuth.js');

describe('BalloonResource', function () {
  describe('request', function () {
    const client = { name: 'Balloon API Tet', version: '0.1', hostname: 'Hostname' };
    const auth = { type: 'token', token: 'abc' };
    let resource;

    beforeEach(function () {
      resource = new BalloonResource({
        url: 'https://example.org/api/v1',
        auth,
        client,
      });
    });

    it('creates the request', function () {
      sinon.spy(BalloonResource, 'createRequest');

      resource.request('POST', '/node', {});

      assert(BalloonResource.createRequest.calledOnce);

      assert.equal(BalloonResource.createRequest.getCall(0).args[0], 'POST');
      assert.equal(BalloonResource.createRequest.getCall(0).args[1], 'https://example.org/api/v1/node');
      assert.equal(BalloonResource.createRequest.getCall(0).args[2], client);
      assert.instanceOf(BalloonResource.createRequest.getCall(0).args[3], TokenAuth);
    });

    describe('content type', function () {
      beforeEach(function () {
        sinon.spy(BalloonRequestStub.prototype, 'type');
      });

      afterEach(function () {
        BalloonRequestStub.prototype.type.restore();
      });

      it('is set', function () {
        resource.request('GET', 'collection', {}, { type: 'text/plain' });

        assert(BalloonRequestStub.prototype.type.calledOnce);
      });

      it('falls back to default', function () {
        resource.request('GET', 'collection', {});

        assert(BalloonRequestStub.prototype.type.calledWith('application/json'));
      });

      it('is set to the specified type', function () {
        resource.request('GET', 'collection', {}, { type: 'text/plain' });

        assert(BalloonRequestStub.prototype.type.calledWith('text/plain'));
      });
    });

    describe('query', function () {
      beforeEach(function () {
        sinon.spy(BalloonRequestStub.prototype, 'query');
      });

      afterEach(function () {
        BalloonRequestStub.prototype.query.restore();
      });

      it('is set', function () {
        resource.request('GET', 'collection', {});

        assert(BalloonRequestStub.prototype.query.calledOnce);
      });

      it('is called with the correct params', function () {
        const expectedParams = { id: 'xyz', attributes: ['name', 'id'] };
        resource.request('GET', 'collection', expectedParams);

        assert(BalloonRequestStub.prototype.query.calledWith(expectedParams));
      });
    });

    describe('binaryResponse', function () {
      beforeEach(function () {
        sinon.spy(BalloonRequestStub.prototype, 'binaryResponse');
      });

      afterEach(function () {
        BalloonRequestStub.prototype.binaryResponse.restore();
      });

      it('is called', function () {
        resource.request('GET', 'collection', {}, { binary: true });

        assert(BalloonRequestStub.prototype.binaryResponse.calledOnce);
      });

      it('is not called if option.binary is not set', function () {
        resource.request('GET', 'collection', {}, {});

        assert(BalloonRequestStub.prototype.binaryResponse.calledOnce === false);
      });
    });
  });
});
