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

# Application's overview

The Application is ...

# Project structure

The app is based on architecture described in [Angular enterprise architecture](https://angularexperts.io/products/ebook-angular-enterprise-architecture).

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout

In the application have only one feature - offboarding. Still I have decided to create a lazy loaded feature module. I would consider it as a good practice.

# My assumptions and technical choices:
