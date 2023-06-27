# Forest Ecommerce Website

![forest-showcase](https://github.com/d1gallar/forest/assets/49170814/44397703-42c4-44a1-a3c1-dd80a9ee5a66)

## 📄 Description

Forest is an ecommerce website that allows customers to shop for plant products. 
This website utilizes the Stripe payment to keep track of purchases.

## ⚡️ Installation
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

### Extra Commands

To get ready for production, this command creates a build directory with a 
production build of the web app.

`npm run build`

Used to compile all the typecript files in the project into
javascript files.

`npm run tsc`

This command compiles all the frontend styling in the website using tailwind.

`npm tailwind`

## 👨🏽‍💻 Tech Stack

This project was created using the following technologies:

- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MongoDB](https://www.mongodb.com/)
- [NodeJS](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [Tailwind](https://tailwindcss.com/)
- [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)


![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### NPM Packages
Here are some notable packages that I used to create the website:
- UUID
- JSONWebToken
- EmailJS
- Stripe
- Axios
- BCrypt
