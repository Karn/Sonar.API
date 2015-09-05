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
            }
            
            console.log(user);
            if (user != null && user != []) {
                res.send(user);
            } else {
                res.status(404);
            }
        });

    });
    
    app.put('/api/users/:id/follow/:other_id', function (req, res) {
        
        var conditions = { id: req.params.id };
        
        User.find(conditions).exec(function (err, user) {
            
            if (user === null || user === undefined) {
                res.status(404);
            } else {
                var j = user.following.indexOf(req.params.other_id);
                if (j != -1) {
                    user.following.push(user.id);
                    
                    User.find({ id: req.params.other_id }).exec(function (err, other_user) {
                        if (user === null || user === undefined) {
                            res.status(404);
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
                            }
                        });
                    });
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        }
                        
                        res.status(200);
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
            } else {
                var j = user.following.indexOf(req.params.other_id);
                if (j != -1) {
                    user.following.splice(j, 1);
                    
                    User.find({ id: req.params.other_id }).exec(function (err, other_user) {
                        if (user === null || user === undefined) {
                            res.status(404);
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
                            }
                        });
                    });
                    
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        }
                        
                        res.status(200);
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
            } else {
                res.send(user.followers);
            }
        });
    });
    
    app.get('/api/users/:id/tracks', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
            }
            
            console.log(tracks);
            if (tracks != null && tracks != []) {
                res.send(tracks);
            } else {
                res.status(404);
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
            }
            
            res.status(201);
        });
    });
    
    app.get('/api/tracks/:id', function (req, res, next) {
        
        var conditions = { id: req.params.id };
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
            }
            
            if (tracks != null && tracks != []) {
                res.send(tracks);
            } else {
                res.status(404);
            }
        });
    });
    
    app.get('/api/feed/new/city/:city', function (req, res, next) {
        var conditions = { city: req.params.city }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
            }
            
            res.send(sortByKey(tracks, "uploaded"));
        });
    });
    
    app.get('/api/feed/new/state/:state', function (req, res, next) {
        var conditions = { state: req.params.state }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
            }
            
            res.send(sortByKey(tracks, "uploaded"));
        });
    });
    
    app.get('/api/feed/hot/city/:city', function (req, res, next) {
        var conditions = { city: req.params.city }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
            }
            
            res.send(sortByKey(tracks, "likes"));
        });
    });
    
    app.get('/api/feed/hot/state/:state', function (req, res, next) {
        var conditions = { state: req.params.state }; // we can use this object to supply search params ....
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
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