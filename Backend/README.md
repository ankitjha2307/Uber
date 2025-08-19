# User Registration API Documentation

## Endpoint

`POST /users/register`

## Description

Registers a new user in the system. Requires a valid email, a first name (minimum 3 characters), and a password (minimum 6 characters). Optionally, a last name can be provided.

## Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `fullname.firstname` (string, required): First name, at least 3 characters.
- `fullname.lastname` (string, optional): Last name.
- `email` (string, required): Valid email address.
- `password` (string, required): At least 6 characters.

## Responses

- **201 Created**

  - Registration successful.
  - Returns a JSON object containing the authentication token and user data.

  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // other user fields
    }
  }
  ```

- **400 Bad Request**
  - Validation failed. Returns an array of error messages.
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email address",
        "param": "email",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

---

# User Login API Documentation

## Endpoint

`POST /users/login`

## Description

Authenticates a user with email and password. Returns a JWT token and user data if credentials are valid.

## Request Body

Send a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required): Valid email address.
- `password` (string, required): At least 6 characters.

## Responses

- **200 OK**

  - Login successful.
  - Returns a JSON object containing the authentication token and user data.

  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // other user fields
    }
  }
  ```

- **400 Bad Request**
  - Validation failed. Returns an array of error messages.
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email address",
        "param": "email",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

- **401 Unauthorized**
  - Invalid email or password.
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

## Example Request

```sh
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

---

# User Logout API Documentation

## Endpoint

`GET /users/logout`

## Description

Logs out the authenticated user by blacklisting their JWT token for 24 hours. Requires authentication.

## Request

- No request body required.
- JWT token must be provided in the cookie or `Authorization` header.

## Responses

- **200 OK**
  - Logout successful.
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

- **401 Unauthorized**
  - If the user is not authenticated or token is missing/invalid.

---

# User Profile API Documentation

## Endpoint

`GET /users/profile`

## Description

Returns the profile information of the authenticated user. Requires authentication.

## Request

- No request body required.
- JWT token must be provided in the cookie or `Authorization` header.

## Responses

- **200 OK**
  - Returns the user profile data.
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // other user fields
  }
  ```

- **401 Unauthorized**
  - If the user is not authenticated or token is missing/invalid.

---

## Related Files

- [routes/user.routes.js](routes/user.routes.js)
- [controllers/user.controller.js](controllers/user.controller.js)
- [models/user.model.js](models/user.model.js)
- [service/user.service.js](service/user.service.js)
