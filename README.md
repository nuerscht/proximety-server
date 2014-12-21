# Proximety Server

## Installation
- Download and install NodeJS from http://nodejs.org
- Go to the project directory
- Run ```npm install```

## Startup
- Configure the database in ```config/config.json```
- Run ```npm start```

## Endpoints

### Signup
Request:
```bash
curl -X POST --data '{"name":"Andy Villiger","email":"a.villiger@gmail.com","password":"1234","password_confirm":"1234"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/signup"
```

Response:
```json
{
    "_id":          "5495d31a9c62d66a99ae21c3",
    "name":         "Andy Villiger",
    "email":        "a.villiger@gmail.com",
    "latitude":     null,
    "longitude":    null,
    "friends":      []
}
```

### Get a new token
Request:
```bash
curl -X POST --data '{"email":"a.villiger@gmail.com","password":"1234"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/token"
```

Response:
```json
{
    "token": "8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
}
```

### Get all pending friend requests
Request:
```bash
curl -X GET "127.0.0.1:3000/api/friend/request?token=8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
```

Response:
```json
[
    {
        "_id":          "5495d31a9c62d66a99ae21c3",
        "name":         "Andy Villiger",
        "email":        "a.villiger@gmail.com",
        "latitude":     2381737.1231,
        "longitude":    2123002.2134
    },
    {
        "_id":          "5495d31a9c62d66a99ae21c4",
        "name":         "Max Mustermann",
        "email":        "max@gmail.com",
        "latitude":     2381737.1231,
        "longitude":    2123002.2134
    }
]
```

### Send a friend request
Request:
```bash
curl -X POST --data '{"email":"max@gmail.com","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/friend/request"
```

Response:
```json
{
    "_id": "5496cb57c8acd51b04deb001",
    "requester": {
         "_id":          "5495d31a9c62d66a99ae21c3",
         "name":         "Andy Villiger",
         "email":        "a.villiger@gmail.com",
         "latitude":     2381737.1231,
         "longitude":    2123002.2134
     }
}
```

### Accept a friend request
Request:
```bash
curl -X PUT --data '{"request_id":"5496cb57c8acd51b04deb001","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/friend/request"
```

Response:
```json
{
    "_id":          "5495d31a9c62d66a99ae21c3",
    "name":         "Andy Villiger",
    "email":        "a.villiger@gmail.com",
    "latitude":     2381737.1231,
    "longitude":    2123002.2134
}
```

### Decline a friend request
Request:
```bash
curl -X DELETE "request_id":"5496cb57c8acd51b04deb001","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"-H "Content-Type: application/json" "127.0.0.1:3000/api/friend/request?request_id=5496cb57c8acd51b04deb001&token=8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
```

Response:
```json
{
    "msg": "Declined request"
}
```

### Get a list of your friends
Request:
```bash
curl -X GET "127.0.0.1:3000/api/friend?token=8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
```

Response:
```json
[
    {
        "_id":          "5495d31a9c62d66a99ae21c3",
        "name":         "Andy Villiger",
        "email":        "a.villiger@gmail.com",
        "latitude":     2381737.1231,
        "longitude":    2123002.2134
    },
    {
        "_id":          "5495d31a9c62d66a99ae21c4",
        "name":         "Max Mustermann",
        "email":        "max@gmail.com",
        "latitude":     2381737.1231,
        "longitude":    2123002.2134
    }
]
```

### Get the details of a friend
Request:
```bash
curl -X GET "127.0.0.1:3000/api/friend/5495d31a9c62d66a99ae21c3?token=8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
```

Response:
```json
{
    "_id":          "5495d31a9c62d66a99ae21c3",
    "name":         "Andy Villiger",
    "email":        "a.villiger@gmail.com",
    "latitude":     2381737.1231,
    "longitude":    2123002.2134
}
```

### Remove a friend from your friendlist
Request:
```bash
curl -X DELETE -H "Content-Type: application/json" "127.0.0.1:3000/api/friend?friend_id=5495d31a9c62d66a99ae21c3&token=8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
```

Response:
```json
{
    "msg": "Friend removed"
}
```

### Update your location
Request:
```bash
curl -X POST --data '{"latitude":2382937.1231,"longitude":2123002.2134,"token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/location"
```

Response:
```json
{
    "msg": "Position updated"
}
```
