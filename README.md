# Welcome to WhatIf!

### The comprehensive and user-friendly web-based platform that provides investors with valuable insights into the potential returns of their hypothetical cryptocurrency investments.

The app's intuitive interface allows users to easily select from a range of popular cryptocurrencies and specify a starting date, enabling them to see the estimated profits or losses they would have made if they had invested on that date and held until the present.

WhatIf leverages historical market data to provide accurate calculations of investment returns, allowing users to make informed investment decisions based on historical market trends and patterns. The app's sophisticated algorithm takes into account various factors, such as market volatility and price fluctuations, to provide users with a comprehensive analysis of their potential returns. 

Whether you're an experienced cryptocurrency investor or just starting out, WhatIf provides you with the tools to realize how much money you could have had. With its easy-to-use interface and advanced calculation algorithms, WhatIf is the fun tool for anyone looking to explore the world of cryptocurrency investment. 

## Collaborators

- [Benjamin Mendoza](https://www.github.com/benmendoza3)
- [Phillip Hurm](https://github.com/PhillipHurm)
- [Eldhose Salby](https://github.com/eldhose1998)
- [Sergio Arcila](https://github.com/SergArcila)

## To Install WhatIf On Your Machine

You must have [Go](https://go.dev), [Docker](https://www.docker.com), and [Node.js](https://nodejs.org/en/) installed.

To verify installation, run the following commands:
```zsh
go version
```
```zsh
docker -v
```
```zsh
node -v
```

Use your preferred method of cloning the repository to get the WhatIf project within your go/src folder.

## Initalizing front-end server

Navigate to the `whatif` folder
```zsh
cd whatif
```

Install all necessary Node.js dependencies
```zsh
npm install
```

Start up the front-end server
```zsh
npm start
```

The front end will serve on http://localhost:3000.

## Initalizing back-end server

First, ensure you have a .env file with the appropriate UFL CISE Oracle Database information and ensure you are connected to the Gatorlink VPN service so you can connect to the database.

Navigate to the `server` folder
```zsh
cd server
```

Run Docker compose to setup back-end server and Air live-reload

```zsh
docker compose up
``` 

The back end will serve on http://localhost:8008.
