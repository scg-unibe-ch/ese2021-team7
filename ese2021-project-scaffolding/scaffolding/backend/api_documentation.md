# /user
TODO: copy existing endpoints from readme.md
## GET /user/getById
### Request
HTTP query param: userId: int
```
GET /user/getById?userId=1
```
### Response
If no user is found: HTTP status code 500, and no meaningful body.
If a user is found: HTTP status code 200 and the user's data in the response:
```
{
    "userId": 1,
    "userName": "Alice",
    "password": null,
    "admin": false,
    "firstName": null,
    "lastName": null,
    "email": "alice@gmail.com",
    "street": null,
    "houseNumber": null,
    "zipCode": null,
    "city": null,
    "birthday": null,
    "phoneNumber": null,
    "createdAt": "2021-09-19T18:52:40.401Z",
    "updatedAt": "2021-09-19T18:52:40.401Z"
}
```
## POST /user/checkUserNameOrEmailInUse
### Request
```
{
    "userName": string(optional),
    "email": string(optional)
}
```
### Response
`inUse` is true if the specified userName is in use, or if the specified email is in use.
```
{
    "inUse": false
}
```
# /post
## GET /post/all
Returns all posts. If sortBy is 1, posts are ordered by their score. Otherwise, posts are ordered by creation time. 
### Request
HTTP query param: sortBy: int (optional)
```
e.g. GET /post/all
e.g. GET /post/all?sortBy=1
```
### Response
```
[
    {
        "postId": 16,
        "title": "Table",
        "image": null,
        "text": "Congo",
        "upvote": 0,
        "downvote": 0,
        "category": null,
        "createdAt": "2021-10-22T19:42:01.988Z",
        "updatedAt": "2021-10-22T19:42:01.994Z",
        "UserUserId": 9
    },
    {
        "postId": 15,
        "title": "SCSI",
        "image": null,
        "text": "Kenya",
        "upvote": 0,
        "downvote": 0,
        "category": null,
        "createdAt": "2021-10-22T19:42:01.443Z",
        "updatedAt": "2021-10-22T19:42:01.454Z",
        "UserUserId": 9
    },
    ...
]
```
## GET /post/byId
Returns a post by ID. Returns HTTP status code 500 if no post with the specified postId exists.
### Request
HTTP query param: postId: int
```
GET /post/byId?postId=1
```
### Response
```
{
    "postId": 2,
    "title": "Fantastic",
    "image": null,
    "text": "Keyboard",
    "upvote": 0,
    "downvote": 0,
    "category": null,
    "createdAt": "2021-10-22T17:25:20.258Z",
    "updatedAt": "2021-10-22T17:25:20.264Z",
    "UserUserId": 1
}
```
## POST /post/create
A post can only be created by a non-admin user.
### Request
The request must contain a header `Authorization` with value `Bearer: <token>` where `<token>` is the token from a login response.
```
{
    "title": string(optional),
    "text": string(optional),
    "image": string(optional),
    "category": int(optional),
    "upvote": int(optional),
    "downvote": int(optional),
}
```
### Response
The created post is returned. Returns HTTP status code 200 on success, 403 if deletion is not permitted, and status code 500 on failure.
```
{
    "postId": 19,
    "title": "Personal",
    "text": "Division",
    "category": 6,
    "image": "link to image",
    "upvote": 0,
    "downvote": 0,
    "updatedAt": "2021-10-22T20:08:07.406Z",
    "createdAt": "2021-10-22T20:08:07.399Z",
    "UserUserId": 9
}
```
## POST /post/modify
A post can only be modified by its creator or by an admin.

### Request
The request must contain a header `Authorization` with value `Bearer: <token>` where `<token>` is the token from a login response.
```
{
    "postId": int,
    "title": string(optional),
    "text": string(optional),
    "image": string(optional),
    "category": int(optional),
    "upvote": int(optional),
    "downvote": int(optional),
}
```
### Response
The modified post is returned. Returns HTTP status code 200 on success, 403 if deletion is not permitted, and status code 500 on failure (e.g. postId does not exist).
```
{
    "postId": 19,
    "title": "Personal",
    "text": "Division",
    "category": 6,
    "image": "link to image",
    "upvote": 0,
    "downvote": 0,
    "updatedAt": "2021-10-22T20:08:07.406Z",
    "createdAt": "2021-10-22T20:08:07.399Z",
    "UserUserId": 9
}
```
## POST /post/delete
A post can only be deleted by its creator or by an admin.
### Request
The request must contain a header `Authorization` with value `Bearer: <token>` where `<token>` is the token from a login response.
```
{
    "postId": int
}
```
### Response
No meaningful response body. Returns HTTP status code 200 on success, 403 if deletion is not permitted, and status code 500 on failure (e.g. postId does not exist).
```
```
## POST /post/upvote, /post/downvote
### Request
```
{
    "postId": int
}
```
### Response
Returns the upvoted/downvoted post. Returns HTTP status code 500 if no post with the specified postId exists.
```
{
    "postId": 1,
    "title": "Legacy",
    "image": null,
    "text": "Sudan",
    "upvote": 2,
    "downvote": 0,
    "category": null,
    "createdAt": "2021-10-22T17:25:18.490Z",
    "updatedAt": "2021-10-22T19:55:44.100Z",
    "UserUserId": 1
}
```
# /product
## POST /product/create
### Request
```
{
    "title": string(optional),
    "description": string(optional),
    "image": string(optional),
    "price": number(optional),
    "productCategory": int(optional),
}
```
### Response
The created product is returned. Returns HTTP status code 200 on success, and status code 500 on failure.
```
{
    "productId": 6,
    "title": "input",
    "productCategory": 3,
    "updatedAt": "2021-11-15T20:16:34.394Z",
    "createdAt": "2021-11-15T20:16:34.394Z"
}
```
## GET /product/all
Returns all products, ordered by ID (i.e. creation time).
### Request
```
```
### Response
```
[
    {
        "productId": 2,
        "title": "Chair",
        "image": null,
        "description": null,
        "price": null,
        "productCategory": 55,
        "createdAt": "2021-11-15T20:14:50.472Z",
        "updatedAt": "2021-11-15T20:19:05.151Z"
    },
    {
        "productId": 3,
        "title": "navigating",
        "image": null,
        "description": null,
        "price": null,
        "productCategory": null,
        "createdAt": "2021-11-15T20:14:51.056Z",
        "updatedAt": "2021-11-15T20:14:51.056Z"
    },
    ...
]
```
## GET /product/byCategory
Returns all product with the specified productId.
### Request
HTTP query param: productCategory: int
```
GET /product/byId?productCategory=5
```
### Response
```
[
    {
        "productId": 2,
        "title": "Chair",
        "image": null,
        "description": null,
        "price": null,
        "productCategory": 5,
        "createdAt": "2021-11-15T20:14:50.472Z",
        "updatedAt": "2021-11-15T20:19:05.151Z"
    },
    {
        "productId": 3,
        "title": "navigating",
        "image": null,
        "description": null,
        "price": null,
        "productCategory": 5,
        "createdAt": "2021-11-15T20:14:51.056Z",
        "updatedAt": "2021-11-15T20:14:51.056Z"
    },
    ...
]
```
## GET /product/byId
Returns a productId by ID. Returns HTTP status code 500 if no product with the specified productId exists.
### Request
HTTP query param: productId: int
```
GET /product/byId?productId=2
```
### Response
```
{
    "productId": 2,
    "title": "navigating",
    "image": null,
    "description": null,
    "price": null,
    "productCategory": 5,
    "createdAt": "2021-11-15T20:14:51.056Z",
    "updatedAt": "2021-11-15T20:14:51.056Z"
}
```

## POST /product/modify
### Request
```
{
    "productId": int,
    "title": string(optional),
    "description": string(optional),
    "image": string(optional),
    "price": number(optional),
    "productCategory": int(optional),
}
```
### Response
The modified product is returned. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. productId does not exist).
```
{
    "productId": 2,
    "title": "Chair",
    "productCategory": 55,
    "createdAt": "2021-11-15T20:14:50.472Z",
    "updatedAt": "2021-11-15T20:19:05.151Z"
}
```
## POST /product/delete
### Request
```
{
    "productId": int
}
```
### Response
No meaningful response body. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. productId does not exist).
```
```
# /oder
Order statuses:
PENDNIG: 0,
SHIPPED: 1,
CANCELLED: 2.
## POST /oder/create
### Request
```
{
    "deliveryAdress": string(optional)",
    "paymentOption": int(optional),
    "user": int,
    "productId": int
}
```
### Response
The created product is returned. Returns HTTP status code 200 on success, and status code 500 on failure. (e.g. user or product does not exist).
```
{
    "orderId": 3,
    "deliveryAdress": "Teststrasse\n3012 Bern",
    "paymentOption": 1,
    "user": 1,
    "orderStatus": 0,
    "updatedAt": "2021-11-19T22:30:51.510Z",
    "createdAt": "2021-11-19T22:30:51.502Z",
    "ProductProductId": 1
}
```
## GET /oder/all
Returns all orders, ordered by ID (i.e. creation time).
### Request
```
```
### Response
```
[
    {
        "orderId": 2,
        "deliveryAdress": "Testrasse\n3012 Bern",
        "paymentOption": 1,
        "orderStatus": 1,
        "user": 1,
        "createdAt": "2021-11-19T22:29:29.714Z",
        "updatedAt": "2021-11-19T22:29:29.727Z",
        "ProductProductId": 1
    },
    {
        "orderId": 3,
        "deliveryAdress": "Teststrasse\n3012 Bern",
        "paymentOption": 1,
        "orderStatus": 1,
        "user": 1,
        "createdAt": "2021-11-19T22:30:51.502Z",
        "updatedAt": "2021-11-19T22:30:51.510Z",
        "ProductProductId": 1
    }
]
```
## GET /oder/byUser
Returns all orders of the specified user.
### Request
HTTP query param: userId: int
```
GET /oder/byUser?userId=5
```
### Response
```
[
    {
        "orderId": 2,
        "deliveryAdress": "Testrasse\n3012 Bern",
        "paymentOption": 1,
        "orderStatus": 1,
        "user": 1,
        "createdAt": "2021-11-19T22:29:29.714Z",
        "updatedAt": "2021-11-19T22:29:29.727Z",
        "ProductProductId": 1
    },
    {
        "orderId": 3,
        "deliveryAdress": "Teststrasse\n3012 Bern",
        "paymentOption": 1,
        "orderStatus": 1,
        "user": 1,
        "createdAt": "2021-11-19T22:30:51.502Z",
        "updatedAt": "2021-11-19T22:30:51.510Z",
        "ProductProductId": 1
    }
]
```
## GET /oder/byId
Returns an order ID. Returns HTTP status code 500 if no oder with the specified oderId exists.
### Request
HTTP query param: oderId: int
```
GET /oder/byId?oderId=2
```
### Response
```
{
    "orderId": 2,
    "deliveryAdress": "Testrasse\n3012 Bern",
    "paymentOption": 1,
    "orderStatus": 1,
    "user": 1,
    "createdAt": "2021-11-19T22:29:29.714Z",
    "updatedAt": "2021-11-19T22:29:29.727Z",
    "ProductProductId": 1
}
```
## POST /oder/modify
### Request
```
{
    "orderId": int,
    "deliveryAdress": string(optional)",
    "paymentOption": int(optional),
    "user": int,
    "productId": int
}
```
### Response
The modified order is returned. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. user/product do not exist).
```
{
    "orderId": 2,
    "deliveryAdress": "Teststrasse\n3012 Bern\nSchweiz",
    "paymentOption": 2,
    "user": 1,
    "createdAt": "2021-11-19T22:29:29.714Z",
    "updatedAt": "2021-11-19T22:51:22.120Z",
    "ProductProductId": 2
}
```
## POST /oder/cancel
### Request
```
{
    "orderId": int
}
```
### Response
The cancelled order is returned. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. user/product do not exist).
```
{
    "orderId": 2,
    "deliveryAdress": "Teststrasse\n3012 Bern\nSchweiz",
    "paymentOption": 2,
    "orderStatus": 2,
    "user": 1,
    "createdAt": "2021-11-19T22:29:29.714Z",
    "updatedAt": "2021-11-19T22:52:05.066Z",
    "ProductProductId": 2
}
```
## POST /oder/ship
### Request
```
{
    "orderId": int
}
```
### Response
The shipped order is returned. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. user/product do not exist).
```
{
    "orderId": 2,
    "deliveryAdress": "Teststrasse\n3012 Bern\nSchweiz",
    "paymentOption": 2,
    "orderStatus": 1,
    "user": 1,
    "createdAt": "2021-11-19T22:29:29.714Z",
    "updatedAt": "2021-11-19T22:52:53.517Z",
    "ProductProductId": 2
}
```
## POST /oder/delete
### Request
```
{
    "orderId": int
}
```
### Response
No meaningful response body. Returns HTTP status code 200 on success, and status code 500 on failure (e.g. order do not exist).
```
```