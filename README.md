## Sonar.API

Sonar is a hyper local music discovery platform. Sonar provides an outlet for emargin artists to share their music and grow their fan base. Alternatively, the music enthusiast can find new and talented artists who are looking to break out.
The Sonar API provides the infrastructure for all the data storage and retrival. The API uses NodeJS as well as MongoDB.

### Usage

The service provides various endpoints from which relevant data can be accessed and created/updated.


Returns a collection of users within the database.
```
GET: /api/users
```

Returns a user with the specified id from the database.
```
GET: /api/users/:id

PARAMS: id (integer)
```

Creates a user object and adds it to the Users table.
```
POST: /api/users

BODY: id (integer), name (string), description (string), city (string), state (string).
```

Adds a user (other_user) to the list of accounts being followed by this (id) user.
```
GET: /api/users/:id/follow/:other_id

PARAMS: id (integer), other_id (integer)
```

Removes a user (other_user) from the list of accounts being followed by this (id) user.
```
GET: /api/users/:id/unfollow/:other_id

PARAMS: id (integer), other_id (integer)
```

Allows a user with the given id to like a given track.
```
GET: /api/users/:id/like

PARAMS: id (integer)
QUERY: track_id (integer)
```


Allows a user with the given id to unlike a given track.
```
GET: /api/users/:id/unlike

PARAMS: id (integer)
QUERY: track_id (integer)
```

Returns a collection of users that are being followed.
```
GET: /api/users/:id/following

PARAMS: id (integer)
```

Returns a collection of users that are following a given blog.
```
GET: /api/users/:id/followers

PARAMS: id (integer)
```

Returns a collection of users which have been  'starred' by the user.
```
GET: /api/users/:id/starred_artists

PARAMS: id (integer)
```

Return a collection of tracks which have been liked by a given user.
```
GET: /api/users/:id/liked_tracks

PARAMS: id (integer)
```

Return a collection of tracks uploaded by a given user.
```
GET: /api/users/:id/tracks

PARAMS: id (integer)
```

Allows for the creation of a track object.
```
POST: /api/tracks/create

BODY: id (integer), name (string), description (string), city (string), state (string), source (string).
```

Return track by its id.
```
GET: /api/tracks/:id

PARAMS: id (integer)
```

Returns a collection of the latest uploaded tracks.
```
GET: /api/feed/new

QUERY: city (string), state (string)
```

Returns a collection of tracks that have the most amount of likes.
```
GET: /api/feed/hot

QUERY: city (string), state (string)
```

Returns a collection of tracks that have been uploaded by users being followed by the given user.
```
GET: /api/users/:id/following_tracks

QUERY: id (interger)
```

Search for a particular song or artist
```
GET: /api/search

QUERY: filter (string) where "users" filters by users.
```

### License
GitTracker is released under the The GNU General Public License v3.0 (GPLv3), which can be found in the LICENSE file in the root of this project.

