# Backend

## Endpoints

Action | Method | URL | Response status | Notes
------------ | ------------- | ------------ | ------------ | --------------
Register | POST | /api/auth/register | 201 Created
Login | POST | /api/auth/login | 200 OK
Get all stories | GET | /api/stories | 200 OK
Add a story | POST | /api/stories | 201 Created
Edit a story | PUT | /api/stories/:id | 200 OK
Delete a story | DELETE | /api/stories/:id | 200 OK | Deletes a story __and all its posts__


## Registration / login data
Property | Type | Example | Notes
------------ | ------------- | ------------ | ------------
username | string | "Oliver" | Required. At least 3, max 80 characters
password | string | "password" | Required. At least 4, max 255 characters


## Story data
Property | Type | Notes
------------ | ------------- | ------------
title | string | Min 3, max 80 characters, required
description | text | Optional, any length
coverImage | string | Image URL (coming soon). Optional, max 255 characters.
userId | integer | Set automatically by token