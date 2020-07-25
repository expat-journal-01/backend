# Backend

## Endpoints

Action | Method | URL | Response
------------ | ------------- | ------------ | ------------
Register | POST | /api/auth/register | 201 Created
Login | POST | /api/auth/login | 200 OK


## Registration / login data
Property | Type | Example | Notes
------------ | ------------- | ------------ | ------------
username | string | "Oliver" | Required. At least 3, max 80 characters
password | string | "password" | Required. At least 4, max 255 characters
