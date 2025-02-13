# Installation

The application was developed on MacBook Air M1 with node v22.12.0.

If you have [volta](https://volta.sh) you can install this node version with:

```
volta install node
```

Install dependencies:

```
npm install
```

# Running the application

Server will run on http://localhost:3010/ and client on http://localhost:4200/.

```
npm start
```

Unit tests:

```
npm test
```

# Project structure

The app is based on architecture described in [Angular enterprise architecture](https://angularexperts.io/products/ebook-angular-enterprise-architecture).

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout
        ui - generic ui components

In the application have only one feature - reporting. Still I have decided to create a lazy loaded feature module. I would consider it as a good practice.

# My assumptions and technical choices:

- In general it would be better to have a store and cache the data. There was no time to implement it.
- Used sleep on the server side for reporting calls to display loading state in the browser.
- While using observation service I haven't used loading state. There was no time to implement it. On top of it, knowing the expected behavior without knowing the domain would be difficult.
- User interface is in french.
- I made some form items mandatory. The spec didn't specify any mandatory fields. What is unusual for a form. Also I have added an additional validation for birth date that checks if the value is in the future.
- Server is missing unit tests. There was no time to implement it.
- Server keep state in memory. A nice DB would be better.
- Server could use proper domain modeling. There was no time to work on it.
