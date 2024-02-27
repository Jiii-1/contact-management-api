# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body:
```json
{
    "username": "zi",
    "password": "123",
    "name": "ghozi"
}
```

Response Body Succes:
```json
{
    "data": {
        "username": "zi",
        "name": "ghozi"
    }
}
```

Response Body error:
```json
{
    "errors": "username already used"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body:

```json
{
    "username": "zi",
    "password": "123"
}
```

Request Body Succes:

```json
{
    "data" : {
        "token" : "unique-token"
    }
}
```

Request Body Error:

```json
{
    "errors" : "username or password wrong"
}
```

## Update User API

Endpoint: PATCH /api/users/current


Request Body:

```json
{
    "name": "ghozi lagi", //optional
    "password": "123" //optional
}
```

Response Body Succes:
```json
{
    "data": {
        "username": "ghozi",
        "name": "ghozi lagi"
    }
}
```

## Get User API

## logout User API