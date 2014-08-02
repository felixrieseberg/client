var assert = require('assert')
  ,	config = require('../config')
  , fixtures = require('../fixtures')
  ,	nitrogen = require('../../lib');

describe('principal', function() {
    var service = new nitrogen.Service(config);

    it('find with no query returns all principals', function(done) {
        service.connect(fixtures.models.camera, function(err, session) {
            nitrogen.Principal.find(session, {}, {}, function(err, principals) {
                assert(!err);
                assert.equal(principals.length > 0, true);
                done();
            });
        });
    });

    it('find with device query returns device principals', function(done) {
        service.connect(fixtures.models.camera, function(err, session) {
            nitrogen.Principal.find(session, {
                type: "device"
            }, {
                skip: 0,
                sort: { last_connection: 1 }
            }, function(err, principals) {
                assert(!err);
                assert.equal(principals.length > 0, true);
                assert.equal(principals[0].type, "device");
                assert.notEqual(principals[0].toStoreId, undefined);
                done();
            });
        });
    });

    it('should be able to save principals', function(done) {
        service.connect(fixtures.models.camera, function(err, session, camera) {
            assert(!err);

            assert(camera.api_key);

            camera.name = "camera";
            camera.save(session, function(err, camera) {
                assert(!err);
                assert.equal(camera.name, "camera");
                done();
            });
        });
    });

    it('should be able to remove a principal', function(done) {
        var cameraForDelete = new nitrogen.Device({
            nickname: "deleteCamera",
            api_key: fixtures.models.userApiKey.key
        });

        service.connect(cameraForDelete, function(err, session, cameraForDelete) {
            cameraForDelete.remove(session, function(err) {
                assert(!err);

                done();
            });
        });
    });

    it('should be able to fetch a single principal', function(done) {
        service.connect(fixtures.models.camera, function(err, session, camera) {
            assert(!err);

            nitrogen.Principal.findById(session, camera.id, function(err, principal) {
                assert(!err);
                assert.equal(principal.id, camera.id);

                done();
            });
        });
    });

    it('should be able to get an accessToken for a single principal', function(done) {
        service.connect(fixtures.models.user, function(err, session, user) {
            assert(!err);

            nitrogen.Principal.accessTokenFor(session, fixtures.models.camera.id, {
                expires: new Date(2050,1,1)
            }, function(err, accessToken) {
                assert(!err);

                assert(accessToken.token);
                assert.equal(Date.parse(accessToken.expires_at), new Date(2050,1,1).getTime());

                done();
            });
        });
    });

});
