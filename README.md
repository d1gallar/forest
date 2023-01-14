# Forest Ecommerce App

## Basic Overview

Forest is an ecommerce website that allows customers to shop for plant products. 
This website utilizes the Stripe payment to keep track of purchases.

## Technologies Overview

This project was created using the following technologies:

- React
- Typescript
- Javascript
- MongoDB
- NodeJS
- Express
- Tailwind
- UUID
- JSONWebToken
- EmailJS
- Stripe
- Axios
- BCrypt

## Installation
To install this web app, you need to run the node package manager and 
install all of its packages. Next, you need to run the backend and frontend 
server and you're all set!

1. Install all node packages!

`npm install`

2. Start both frontend and backend servers with this command in the root 
directory!

To run frontend: 

`npm start`

To run backend: 

`npm run server`

To run Stripe in development: 

`stripe listen  --events payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:3000/stripe/webhook`

### Extra Notes

To get ready for production, this command creates a build directory with a 
production build of the web app.

`npm run build`

Used to compile all the typecript files in the project into
javascript files.

`npm run tsc`

This command compiles all the frontend styling in the website using tailwind.

`npm tailwind`
