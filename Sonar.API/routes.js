var User = require('./data/userSchema'); // import the User model
var Track = require('./data/trackSchema'); // import the Track model

module.exports = function (app) {
    
    /**
     * Catch all endpoint, returns the error code 400 to indicate a 
     * non-existent url.
     */
    app.use(function (req, res) {
        res.status(400);
        res.send({ error: 'Bad request' });
    });
    
    /**
     * Sets up a defualt API endpoint and sets content type of responses to
     * JSON.
     */
    app.all('/api/*', function (req, res, next) {
        res.contentType('json');
        next();
    });
    
    /**
     * Retrives a collection of users.
     */
    app.get('/api/users', function (req, res) { 
        
        var conditions = {};
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
    
    /**
     * Creates a user and adds it to the Users table.
     */
    app.post('/api/users', function (req, res) {

        var _user = new User();
        _user.id = req.body.id;
        _user.name = req.body.name;
        _user.description = req.body.description;
        _user.city = req.body.city;
        _user.state = req.body.state;
        _user.following = [];
        _user.followers = [];
        _user.track_count = 0;
        _user.liked_tracks = [];
        
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
    
    /**
     * Returns a specific user with the given id.
     * 
     * Eg. /api/users/1
     */
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
    
    /**
     * Returns Status Code: OK if a user is able to follow another user.
     */
    app.get('/api/users/:id/follow/:other_id', function (req, res) {
        
        var current_user = {};
        
        User.find({ id: req.params.id }).exec(function (err, user) {
            if (user == null || user == undefined) {
                res.status(404);
                res.send({});
            } else {
                current_user = user;
            }
        });
        
        var other_user = {}
        
        User.find({ id: req.params.other_id }).exec(function (err, user) {
            if (user == null || user == undefined) {
                res.status(404);
                res.send({});
            } else {
                other_user = user;
            }
        });
        
        addToFollowing(current_user, req.params.other_id);
        addToFollowers(other_user, req.params.id);
        
        current_user.save(function (e1) {
            if (e1) {
                console.log(e1);
                res.status(500);
                res.send({});
            }
        });
        
        other_user.save(function (e2) {
            if (e2) {
                console.log(e2);
                res.status(500);
                res.send({});
            }
        });
        
        res.status(200);
        res.send({});
    });
    
    function addToFollowers(user, id) {
        if (user.followers == undefined) {
            user.followers = [id];
        } else if (!contains(user.followers, id)) {
            user.followers.push(id);
        }
    }
    
    function addToFollowing(user, id) {
        if (user.following == undefined) {
            user.following = [id];
        } else if (!contains(user.following, id)) {
            user.following.push(id);
        }
    }
    
    /**
     * Returns Status Code: OK if a user has successfully followed another
     * user.
     */
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
                    
                    User.find({ id: req.params.other_id }).exec(
                        function (err, other_user) {

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
    
    /**
     * Allows a user to like a track.
     */
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
    
    /**
     * Allows a user to unlike a track.
     */
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
    
    /**
     * Returns a collection of users that are being followed.
     */
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
    
    /**
     * Returns a collection of users that are following a given blog.
     */
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
    
    /**
     * Returns a collection of users which have been  'starred' by the user.
     */
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
    
    /**
     * Return a collection of tracks which have been liked by a given user.
     */
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
    
    /**
     * Return a collection of tracks uploaded by a given user.
     */
    app.get('/api/users/:id/tracks', function (req, res, next) {
        
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
    
    /**
     * Create a track item.
     */
    app.post('/api/tracks/create', function (req, res) {
        
        var _track = new Track();
        _track.id = req.body.id;
        _track.name = req.body.name;
        _track.description = req.body.description;
        _track.city = req.body.city;
        _track.state = req.body.state;
        _track.source = req.body.source;
        
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
    
    
    /**
     * Return a particular track.
     */
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
    
    
    /**
     * Returns a collection of the latest uploaded tracks.
     */
    app.get('/api/feed/new', function (req, res, next) {
        var conditions = {
            city: req.query.city.toLowerCase(), 
            state: req.query.state.toLowerCase()
        };

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
    
    /**
     * Returns a collection of tracks that have the most amount of likes.
     */
    app.get('/api/feed/hot', function (req, res, next) {
        var conditions = {
            city: req.query.city.toLowerCase(), 
            state: req.query.state.toLowerCase()
        };
        Track.find(conditions, function (err, tracks) {
            
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            }
            
            res.send(sortByKey(tracks, "likes"));
        });
    });
    
    /**
     * Returns a collection of tracks that have been uploaded by users being 
     * followed by the given user.
     */
    app.get('/api/users/:id/following_tracks', function (req, res, next) {
        
        var following_tracks = [];
        
        var followed_users = {};
        
        User.find({ id: req.params.id }, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({});
            } else {
                console.log(user.following)
                if (user.following != undefined) {
                    for (var i = 0; i < user.following.length; i++) {
                        Track.findOne({ id: followed_users[i].id },
                            function (err, tracks) {
                            
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send({});
                            }
                            
                            if (tracks != null && tracks != []) {
                                following_tracks.push(tracks);
                            } else {
                                res.status(404);
                                res.send({});
                            }
                        });
                    }
                }
            }
        });
        
        res.send(following_tracks);
    });
    
    /**
     * Performs a search operation to locate a user or track.
     */
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
    
    /**
     * Basic comparator. Sorts a collection of objects by a given key.
     */
    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    
    /**
     * Check if a collection of objects contains a given object.
     */
    function contains(array, obj) {
        if (array != undefined) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === obj) {
                    return true;
                }
            }
        }
        return false;
    }
};