# Backend

## Endpoints

Action | Method | URL | Response status | Notes
------------ | ------------- | ------------ | ------------ | --------------
Register | POST | /api/auth/register | 201 Created
Login | POST | /api/auth/login | 200 OK
Get all users | GET | /api/users | 200 OK
Get a user by id | GET | /api/users/:id | 200 OK
Get all stories | GET | /api/stories | 200 OK
Get a story by id | GET | /api/stories/:id | 200 OK
Get a story by userId | GET | /api/stories/user/:id | 200 OK
Add a story | POST | /api/stories | 201 Created
Edit a story | PUT | /api/stories/:id | 200 OK
Delete a story | DELETE | /api/stories/:id | 200 OK | Deletes a story __and all its posts__
Get all posts | GET | /api/posts | 200 OK
Get a post by its id | GET | /api/posts/:id | 200 OK
Get all posts by userId | GET | /api/posts/user/:id | 200 OK
Get all posts by storyId | GET | /api/posts/story/:id | 200 OK
Add a post | POST | /api/posts | 201 Created | Also automatically updates __coverImage__ of a story it belongs to.
Edit a post | PUT | /api/posts/:id | 200 OK | Can edit only title and description. Rejects any other data.
Delete a post | DELETE | /api/posts/:id | 200 OK
Get an uploaded image | GET | /uploads/image.jpg | 200 OK | For example: https://backendurl/uploads/image.jpg



## Registration / login data
Property | Type | Example | Notes
------------ | ------------- | ------------ | ------------
username | string | "Oliver" | Required. At least 3, max 80 characters
password | string | "password" | Required. At least 4, max 255 characters


## Story data
Property | Type | Notes
------------ | ------------- | ------------
title | string | Required. Min 3, max 80 characters
description | string | Optional, any length
coverImage | string | Optional image URL. Max 255 characters. Set to *null* by default, then set automatically to an image of the latest post.
userId | number | Set automatically by token


## Post data
Property | Type | Notes
------------ | ------------- | ------------
title | string | Required. Min 2, max 80 characters
description | string | Optional. Any length
image | string | Required
storyId | number | Required
userId | number | Set automatically by token

---
# Examples
For all endpoints, except login and register, you will need to send `Authorization: token` header
## Register
Request:
```json
{
    "username": "Jamie",
    "password": "1234"
}
```
Response:
```json
[
    {
        "id": 2,
        "username": "asdf"
    }
]
```
## Login
Request:
```json
{
    "username": "Jamie",
    "password": "1234"
}
```
Response:
```json
{
    "token": "eyJhbGciOiJI..."
}
```

## Get a story by id
Response:
```json
[
    {
        "id": 2,
        "title": "Sample title",
        "description": "Sample description",
        "coverImage": "uploads/1595983870950-202106253.jpg",
        "userId": 1
    }
]
```

## Get all stories, get all  stories by userId
Response:
```json
[
    {
        "id": 1,
        "title": "Sample 1",
        "description": "Sample 2",
        "coverImage": "uploads/1595983870950-202106253.jpg",
        "userId": 1
    },
    {
        "id": 2,
        "title": "Sample 2",
        "description": "Sample 2",
        "coverImage": "uploads/5595983870950-23412342.jpg",
        "userId": 1
    }
]
```
## Add a story
Request:
```json
{
    "title": "Sample title",
    "description": "Sample description"
}
```
Response:
```json
[
    {
        "id": 3,
        "title": "Sample title",
        "description": "Sample description",
        "coverImage": null,
        "userId": 1
    }
]
```
## Edit a story
Request:
```json
{
    "title": "Sample title",
    "description": "Sample description"
}
```
or only:
```json
{
    "title": "Sample title"
}
```
Response:
```json
[
    {
        "id": 2,
        "title": "Sample title",
        "description": "Sample description",
        "coverImage": "uploads/1595983870950-202106253.jpg",
        "userId": 1
    }
]
```
## Delete a story
Response:
```json
[
    {
        "id": 3,
        "title": "Sample title",
        "description": "Sample description",
        "coverImage": null,
        "userId": 1
    }
]
```
## Get all users
Response:
```json
[
    {
        "id": 1,
        "username": "Domi"
    },
    {
        "id": 2,
        "username": "Dee"
    }
]
```

## Get a user by id
Response:
```json
[
    {
        "id": 1,
        "username": "Jamie"
    }
]
```

## Get all posts, by userId, by storyId
Response:
```json
[
    {
        "id": 6,
        "title": "Old cars",
        "description": null,
        "image": "uploads/1595986117459-854885789.jpg",
        "userId": 1,
        "storyId": 7
    },
    {
        "id": 7,
        "title": "Retro cars everywhere",
        "description": "Cadillac",
        "image": "uploads/1595986433419-429829392.jpg",
        "userId": 1,
        "storyId": 7
    }
]
```

## Get a post by id, delete a post by id
Response:
```json
[
    {
        "id": 1,
        "title": "Sample title",
        "description": "Sample description",
        "image": "uploads/1595983870950-202106253.jpg",
        "userId": 1,
        "storyId": 2
    }
]
```

## Add a post
The request body must contain **form data**:

|   |    | 
------- | ------
title: | "Title here"
storyId:|  1
image: |`file`
Please contact me for details on this.

## Edit a post
You can only change title, description or both.
Request:
```json
{
    "title": "Changed title",
    "description": "Changed description",
}
```
or only title:
```json
{
    "title": "Changed title",
}
```
Response:
```json
[
    {
        "id": 1,
        "title": "Changed title",
        "description": "Changed description",
        "image": "uploads/1595983870950-202106253.jpg",
        "userId": 1,
        "storyId": 2
    }
]
```