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

# Captain Registration API Documentation

## Endpoint

`POST /captain/register`

## Description

Registers a new captain (driver) in the system. Requires personal details and vehicle information.

## Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "vehicleType": "car",
    "capacity": 4
  }
}
```

- `fullname.firstname` (string, required): First name, at least 3 characters.
- `fullname.lastname` (string, optional): Last name.
- `email` (string, required): Valid email address.
- `password` (string, required): At least 6 characters.
- `vehicle.color` (string, required): Vehicle color, at least 3 characters.
- `vehicle.plate` (string, required): Vehicle plate, at least 3 characters.
- `vehicle.vehicleType` (string, required): Type of vehicle (`car`, `bike`, or `auto`).
- `vehicle.capacity` (number, required): Vehicle capacity.

## Responses

- **201 Created**

  - Registration successful.
  - Returns a JSON object containing the authentication token and captain data.

  ```json
  {
    "token": "<jwt_token>",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "jane.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "vehicleType": "car",
        "capacity": 4
      }
      // other captain fields
    }
  }
  ```

- **400 Bad Request**
  - Validation failed or captain already exists.
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
    // OR
    "message": "Captain already exists"
  }
  ```

## Example Request

```sh
curl -X POST http://localhost:4000/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Jane", "lastname": "Smith" },
    "email": "jane.smith@example.com",
    "password": "yourpassword",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "vehicleType": "car",
      "capacity": 4
    }
  }'
```

## Related Files

- [routes/captain.routes.js](routes/captain.routes.js)
- [controllers/captian.controller.js](controllers/captian.controller.js)
- [models/captian.model.js](models/captian.model.js)
- [service/captian.service.js](service/captian.service.js)
