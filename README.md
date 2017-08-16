# accounts-offline-logout
[Source code of released version](https://github.com/meteorich/accounts-offline-logout)
***

Clears client side user information when logging out with no connection (and also destroys server token when connection is re-established)

- This package simulates logout on the client when there is no connection
- If present, the autologin token is cached so that it can be destroyed on the server when connection is re-established

This package improves logout integrity when connection is lost (which is especially useful for applications with offline functionality, but also has value for standard online web apps). Without this package, if connection is lost before logging out, and then tab is closed, auto-login token is still saved, and will be valid for login next time site is visited.