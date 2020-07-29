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