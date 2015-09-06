var User = require('./data/userSchema'); // import the model
var Track = require('./data/trackSchema'); // import the model

module.exports = function (app) {
    
    app.all('/api/*', function (req, res, next) {
        res.contentType('json');
        next();
    });
    
    app.use(function (req, res) {
        res.status(400);
        res.send({ error: 'Bad request' });
    });
    
    app.get('/api/users', function (req, res) {
        
        var conditions = {}; // we can use this object to supply search params ....
        User.find(conditions, function (err, users) {
            
            console.log(users.length);
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.send(users)
        });
    });
    
    app.post('/api/users', function (req, res) {
        var _user = new User();
        _user.id = req.body.id;
        _user.name = req.body.name;
        _user.description = req.body.description;
        _user.city = req.body.city;
        _user.state = req.body.state;
        _user.country = req.body.country;
        
        User.create(_user, function (err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.status(201);
            res.send({});
        });
    });
    
    app.get('/api/users/:id', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        
        User.findOne(conditions, function (err, user) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            console.log(user);
            if (user != null && user != []) {
                res.send(user);
            } else {
                res.status(404);
                res.send({});
            }
        });

    });
    
    app.get('/api/users/:id/follow/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user == null || user == undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = 0;
                if (user.following == []) {
                    user.following.push(req.params.other_id);
                } else {
                    j = user.following.indexOf(req.params.other_id);
                }
                if (j != -1) {
                    user.following.push(user.id);
                    
                    User.find({ id: req.params.other_id }).exec(function (err, other_user) {
                        if (user === null || user === undefined) {
                            res.status(404);
                            res.send({});
                        } else {
                            var i = other_user.followers.indexOf(user.id);
                            if (i != -1) {
                                other_user.followers.push(user.id);
                            }
                        }
                        
                        other_user.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send({});
                            }
                        });
                    });
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.get('/api/users/:id/unfollow/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.following.indexOf(req.params.other_id);
                if (j != -1) {
                    user.following.splice(j, 1);
                    
                    User.find({ id: req.params.other_id }).exec(function (err, other_user) {
                        if (user === null || user === undefined) {
                            res.status(404);
                            res.send({});
                        } else {
                            var i = other_user.followers.indexOf(user.id);
                            if (i != -1) {
                                other_user.followers.splice(i, 1);
                            }
                        }
                        
                        other_user.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send({});
                            }
                        });
                    });
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.put('/api/users/:id/star/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.starred_artists.indexOf(req.params.other_id);
                if (j != -1) {
                    user.starred_artists.push(user.id);
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.put('/api/users/:id/unstar/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.starred_artists.indexOf(req.params.other_id);
                if (j != -1) {
                    user.starred_artists.splice(j, 1);
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.put('/api/users/:id/like', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.liked_tracks.indexOf(req.query.track_id);
                if (j != -1) {
                    user.liked_tracks.push(req.query.track_id);
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.put('/api/users/:id/unlike', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.liked_tracks.indexOf(req.query.track_id);
                if (j != -1) {
                    user.liked_tracks.splice(j, 1);
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send({});
                        }
                        
                        res.status(200);
                        res.send({});
                    });
                }
            }
        });
    });
    
    app.get('/api/users/:id/following', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            } else {
                res.send(user.following);
            }
        });
    });
    
    app.get('/api/users/:id/followers', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            } else {
                res.send(user.followers);
            }
        });
    });
    
    app.get('/api/users/:id/starred_artists', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            } else {
                res.send(user.starred_artists);
            }
        });
    });
    
    app.get('/api/users/:id/liked_tracks', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            } else {
                res.send(user.liked_tracks);
            }
        });
    });
    
    app.get('/api/users/:id/tracks', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            console.log(tracks);
            if (tracks != null && tracks != []) {
                res.send(tracks);
            } else {
                res.status(404);
                res.send({});
            }
        });
    });
    
    //upload a file to azure blob storage
    app.get('/api/tracks/upload', function (req, res) {
        res.contentType('html');
        res.send(
            '<form action="/api/tracks/upload" method="post" enctype="multipart/form-data">' +
    '<input type="file" name="album_art" />' +
    '<input type="file" name="media" />' +
    '<input type="submit" value="Upload" />' +
    '</form>'
        );
    });
    
    
    app.post('/api/tracks/upload', function (req, res) {
        var album_art_name = "";
        var file_name = "";
        
        var azure = require('azure-storage');
        var multiparty = require('multiparty');
        
        var accessKey = 'OQyP8P4TinFFqcKtKuFzaJqEoAxiL/ppgRd3V4MH5vP6sF81lni0aapPJ7FrxtPaSFoueHwMHdbmd+Irx1x3zg==';
        var storageAccount = 'sonarapp';
        var containerName = 'audio-store';
        var albumContainerName = 'album-art-store';
        
        var blobService = azure.createBlobService(storageAccount, accessKey);

        var form = new multiparty.Form();
        
        form.on('part', function (part) {
            console.log(part);

            if (part.name == 'album_art') {
                console.log('entered album art');
                var size = part.byteCount - part.byteOffset;
                album_art_name = part.filename;
                
                blobService.createBlockBlobFromStream(albumContainerName, album_art_name, part, size, function (error) {
                    if (error) {
                        res.send({ error: 'Unable to upload media' });
                    }
                });
            } 

            if (part.name == 'media') {
                console.log('entered media file');
                var size = part.byteCount - part.byteOffset;
                file_name = part.filename;
                
                blobService.createBlockBlobFromStream(containerName, file_name, part, size, function (error) {
                    if (error) {
                        res.send({ error: 'Unable to upload media' });
                    }
                });
            } 
            
            //else {
            //    form.handlePart(part);
            //}
        });
        form.parse(req);
        
        var _track = new Track();
        _track.id = req.body.id;
        _track.name = req.body.name;
        _track.description = req.body.description;
        _track.city = req.body.city;
        _track.state = req.body.state;
        _track.country = req.body.country;
        _track.album_art = 'https://sonarapp.blob.core.windows.net/album-art-store/' + album_art_name;
        _track.source = 'https://sonarapp.blob.core.windows.net/audio-store/' + file_name;
        
        Track.create(_track, function (err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.status(201);
            res.send({});
        });
    });
    
    app.get('/api/track/add', function (req, res) {
        var _track = new Track();
        _track.id = req.query.id;
        _track.name = req.query.name;
        _track.city = req.query.city;
        _track.state = req.query.state;
        _track.country = req.query.country;
        _track.source = req.query.source;
        
        Track.create(_track, function (err) {
            if (err) {
                console.log(err);
                res.satus(500);
                res.send({ error: 'Internal server error' });
            }
            
            res.status(201);
            res.send({});
        });
    });
    
    app.get('/api/tracks/:id', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            if (tracks != null && tracks != []) {
                res.send(tracks);
            } else {
                res.status(404);
                res.send({ error: 'Not Found' });
            }
        });
    });
    
    app.get('/api/feed/new', function (req, res, next) {
        var conditions = { city: req.query.city, state: req.query.state, country: req.query.country }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            console.log(tracks)
            res.send(sortByKey(tracks, "uploaded"));
        });
    });
    
    
    app.get('/api/feed/hot', function (req, res, next) {
        var conditions = { city: req.query.city, state: req.query.state, country: req.query.country }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.send(sortByKey(tracks, "likes"));
        });
    });
    
    app.get('/api/search', function (req, res, next) {
        var conditions = { name: { $regex : req.query.tag } };
        
        if (req.query.filter == 'users') {
            
            User.find(conditions, function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send({});
                } else {
                    res.send(user.liked_tracks);
                }
            });
        } else {
            Track.find(conditions, function (err, tracks) {
                
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send({});
                }
                
                res.send(sortByKey(tracks, "likes"));
            });
        }
    });
    
    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

///Ask how to send to specific user.
//function sendPushNotification(content) {
//    var payload = {
//        data: {
//            message: content
//        }
//    };

//    notificationHubService.gcm.send(null, payload, function (error) {
//        if (!error) {
//            //notification sent
//            console.log('sent');
//        }
//    });
//}
};