var User = require('./data/userSchema'); // import the model
var Track = require('./data/trackSchema'); // import the model

module.exports = function (app) {
    
    app.all('/api/*', function (req, res, next) {
        res.contentType('json');
        next();
    });
    
    app.use(function (req, res) {
        res.status(404);
    });
    
    app.get('/api/users', function (req, res) {
        
        var conditions = {}; // we can use this object to supply search params ....
        User.find(conditions, function (err, users) {
            
            console.log(users.length);
            if (err) {
                console.log(err);
                res.status(500)
            }
            
            res.send(users)
        });
    });
    
    app.post('/api/users', function (req, res) {
        var _user = new User();
        _user.id = req.body.id;
        _user.name = req.body.name;
        _user.description = req.body.description;
        _user.location = req.body.location;
        
        User.create(_user, function (err) {
            if (err) {
                console.log(err);
                res.satus(500);
            }
            
            res.status(201);
        });
    });
    
    app.get('/api/users/:id', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions, function (err, user) {
            
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
    
    app.put('/api/users/:id/follow/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
                res.send({});
            } else {
                var j = user.following.indexOf(req.params.other_id);
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
    
    app.put('/api/users/:id/unfollow/:other_id', function (req, res) {
        
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
    
    app.post('/api/tracks', function (req, res) {
        
        var _track = new Track();
        _track.id = req.body.id;
        _track.name = req.body.name;
        _track.description = req.body.description;
        _track.source = 'j';
        
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
                res.send({});
            }
        });
    });
    
    app.get('/api/feed/new', function (req, res, next) {
        var conditions = { city: req.query.city, state: req.query.state }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.send(sortByKey(tracks, "uploaded"));
        });
    });
    

    app.get('/api/feed/hot', function (req, res, next) {
        var conditions = { city: req.query.city, state: req.query.state }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.send(sortByKey(tracks, "likes"));
        });
    });
    
    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
};