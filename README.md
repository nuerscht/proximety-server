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
    "_id":      "5495d31a9c62d66a99ae21c3",
    "name":     "Andy Villiger",
    "email":    "a.villiger@gmail.com",
    "friends":  [ "5495d31a9c62d66a99ae21c3" ]
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
    "token":    "8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
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
        "_id":      "5495d31a9c62d66a99ae21c3",
        "name":     "Andy Villiger",
        "email":    "a.villiger@gmail.com"
    },
    {
        "_id":      "5495d31a9c62d66a99ae21c4",
        "name":     "Max Mustermann",
        "email":    "max@gmail.com"
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
    "requester": "5495d31a9c62d66a99ae21c3",
    "requestee": "5495d31a9c62d66a99ae21c3",
    "_id": "5496cb57c8acd51b04deb001"
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
    "_id":      "5495d31a9c62d66a99ae21c3",
    "name":     "Andy Villiger",
    "email":    "a.villiger@gmail.com"
}
```

### Decline a friend request
Request:
```bash
curl -X DELETE --data '{"request_id":"5496cb57c8acd51b04deb001","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/friend/request"
```

Response:
```json
{
    "msg":      "Declined request"
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
        "_id":      "5495d31a9c62d66a99ae21c3",
        "name":     "Andy Villiger",
        "email":    "a.villiger@gmail.com"
    },
    {
        "_id":      "5495d31a9c62d66a99ae21c4",
        "name":     "Max Mustermann",
        "email":    "max@gmail.com"
    }
]
```

### Remove a friend from your friendlist
Request:
```bash
curl -X DELETE --data '{"friend_id":"5495d31a9c62d66a99ae21c3","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/friend"
```

Response:
```json
{
    "msg":      "Friend removed"
}
```
