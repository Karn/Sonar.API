var User = require('./data/userSchema'); // import the model
var Track = require('./data/trackSchema'); // import the model

module.exports = function (app) {
	
	app.all('/api/*', function (req, res, next) {
		res.contentType('json');
		next();
	});
	
	app.use(function (req, res) {
		res.status(404);
		res.json({ meta: { status: 400, message: 'Bad Request' }, response: {} });
	});
	
	app.get('/api/users', function (req, res) {
		
		var conditions = {}; // we can use this object to supply search params ....
		User.find(conditions, function (err, users) {
			
			console.log(users.length);
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
			}
			
			res.send({ meta: { status: 200, message: 'OK' }, response: { artist: users } });
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
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: {} });
			}
			
			res.json({ meta: { status: 201, message: 'Created' }, response: { id: _user.id } });
		});
	});
	
	app.get('/api/users/:id', function (req, res, next) {
		
		var conditions = { id: req.params.id };
		
		User.find(conditions, function (err, user) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
			}
			
			console.log(user);
			if (user != null && user != []) {
				res.send({ meta: { status: 200, message: 'OK' }, response: { artist: user } });
			} else {
				res.send({ meta: { status: 404, message: 'Not found' }, response: { artist: [] } });
			}
		});

	});
	
	app.put('/api/users/:id/follow/:other_id', function (req, res) {
		
		var conditions = { id: req.params.id };
		
		User.find(conditions).exec(function (err, user) {
			
			if (user === null || user === undefined) {
				res.send({ meta: { status: 404, message: 'Not found' }, response: {} })
			} else {
				var j = user.following.indexOf(req.params.other_id);
				if (j != -1) {
					user.following.push(user.id);
					user.following_count = user.following_count + 1;
					
					User.find({ id: req.params.other_id }).exec(function (err, other_user) {
						if (user === null || user === undefined) {
							res.send({ meta: { status: 404, message: 'Not found' }, response: {} })
						} else {
							var i = other_user.followers.indexOf(user.id);
							if (i != -1) {
								other_user.followers.push(user.id);
								other_user.followers_count = other_user.followers_count + 1;
							}
						}
						
						other_user.save(function (err) {
							if (err) {
								console.log(err);
								res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
							}
						});
					});
					
					user.save(function (err) {
						if (err) {
							console.log(err);
							res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
						}
						
						res.send({ meta: { status: 200, message: 'OK' }, response: {} });
					});
				}
			}
		});
	});
		
	app.put('/api/users/:id/unfollow/:other_id', function (req, res) {
		
		var conditions = { id: req.params.id };
		
		User.find(conditions).exec(function (err, user) {
			
			if (user === null || user === undefined) {
				res.send({ meta: { status: 404, message: 'Not found' }, response: {} })
			} else {
				var j = user.following.indexOf(req.params.other_id);
				if (j != -1) {
					user.following.splice(j, 1);
					user.following_count = user.following_count - 1;

					User.find({ id: req.params.other_id }).exec(function (err, other_user) {
						if (user === null || user === undefined) {
							res.send({ meta: { status: 404, message: 'Not found' }, response: {} })
						} else {
							var i = other_user.followers.indexOf(user.id);
							if (i != -1) {
								other_user.followers.splice(i, 1);
								other_user.followers_count = other_user.followers_count - 1;
							}
						}

						other_user.save(function (err) {
							if (err) {
								console.log(err);
								res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
							}
						});
					});

					user.save(function (err) {
						if (err) {
							console.log(err);
							res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
						}
						
						res.send({ meta: { status: 200, message: 'OK' }, response: {} });
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
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
			} else {
				var artist_list = [];
				
				for (index = 0; index < user.following.length; ++index) {
					User.find({ id: user.following[index] }, function (error, user2) {
						if (err) {
							console.log(err);
							res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
						}
						
						artist_list.push(user2);
					});
				}
				
				res.send({ meta: { status: 200, message: 'OK' }, response: { artists: artist_list } });
			}
		});
	});
	
	app.get('/api/users/:id/followers', function (req, res) {
		
		var conditions = { id: req.params.id };
		
		User.find(conditions, function (err, user) {
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
			} else {
				var artist_list = [];
				
				for (index = 0; index < user.followers.length; ++index) {
					User.find({ id: user.followers[index] }, function (error, user2) {
						if (err) {
							console.log(err);
							res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { artist: [] } });
						}
						
						artist_list.push(user2);
					});
				}
				
				res.send({ meta: { status: 200, message: 'OK' }, response: { artists: artist_list } });
			}
		});
	});
	
	app.get('/api/users/:id/tracks', function (req, res, next) {
		
		var conditions = { id: req.params.id };
		
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			if (tracks != null && tracks != []) {
				res.send({ meta: { status: 200, message: 'OK' }, response: { track: tracks } });
			} else {
				res.send({ meta: { status: 404, message: 'Not found' }, response: { track: [] } });
			}
		});
	});
	
	app.get('/api/tracks/:id', function (req, res, next) {
		
		//req.assert('id', 'Id is not a negative value').isLength(0, Number.MAX_VALUE);
		var conditions = { id: req.params.id };
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			if (tracks != null && tracks != []) {
				res.send({ meta: { status: 200, message: 'OK' }, response: { track: tracks } });
			} else {
				res.send({ meta: { status: 404, message: 'Not found' }, response: { track: [] } });
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
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: {} });
			}
			
			res.json({ meta: { status: 201, message: 'Created' }, response: { id: _track.id } });
		});
	});
	
	app.get('/api/feed/new/city/:city', function (req, res, next) {
		var conditions = { city: req.params.city }; // we can use this object to supply search params ....
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			res.send({ meta: { status: 200, message: 'OK' }, response: { track: sortByKey(tracks, "uploaded") } });
		});
	});
	
	app.get('/api/feed/new/state/:state', function (req, res, next) {
		var conditions = { state: req.params.state }; // we can use this object to supply search params ....
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			res.send({ meta: { status: 200, message: 'OK' }, response: { track: sortByKey(tracks, "uploaded") } });
		});
	});
		
	app.get('/api/feed/hot/city/:city', function (req, res, next) {
		var conditions = { city: req.params.city }; // we can use this object to supply search params ....
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			res.send({ meta: { status: 200, message: 'OK' }, response: { track: sortByKey(tracks, "likes") } });
		});
	});
	
	app.get('/api/feed/hot/state/:state', function (req, res, next) {
		var conditions = { state: req.params.state }; // we can use this object to supply search params ....
		Track.find(conditions, function (err, tracks) {
			
			if (err) {
				console.log(err);
				res.send({ meta: { status: 500, message: 'Internal Server Error' }, response: { track: [] } });
			}
			
			console.log(tracks);
			res.send({ meta: { status: 200, message: 'OK' }, response: { track: sortByKey(tracks, "likes") } });
		});
	});
	
	function sortByKey(array, key) {
		return array.sort(function (a, b) {
			var x = a[key]; var y = b[key];
			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		});
	}
};