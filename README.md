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
curl --data '{"name":"Andy Villiger","email":"a.villiger@gmail.com","password":"1234","password_confirm":"1234"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/signup"
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
curl --data '{"email":"a.villiger@gmail.com","password":"1234"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/token"
```

Response:
```json
{
    "token":    "8e13b2cdbd83eaf49d81685cc6744bece982bdf0"
}
```

### Add a friend
Request:
```bash
curl --data '{"email":"max@gmail.com","token":"8e13b2cdbd83eaf49d81685cc6744bece982bdf0"}' -H "Content-Type: application/json" "127.0.0.1:3000/api/friend"
```

Response:
```json
{
    "_id":      "5495d3509c62d66a99ae21c4",
    "name":     "Max Mustermann",
    "email":    "max@gmail.com",
    "friends":  [ "5495d31a9c62d66a99ae21c3" ]
}
```
