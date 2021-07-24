# Test Assignment

I will try to explain how to work with this project. I'm sorry if this seems too complicated,
but I generally do not take home assignments, so I decided to learn something new while 
implementing it.

## Run project

I didn't spend time trying to create production-ready build environment, so forgive me.

To run this project you need just to execute:
```bash
docker-compose up -d
```

This command will run PostgreSQL, backend and frontend applications.

**Please don't run command any `npm install` command on host machine if you are using MacOS. 
  This will lead to incompatibility of `esbuild` binary between docker and host OS.**

## Open application

By default, frontend application will use port `3000`, you could open it in browser 
[http://localhost:3000]().

Backend application will use port `4000`.

I'm sorry, there is no `.env` file to change these defaults, but you could manually change them in 
`docker-compose.yaml` file.

## Technical Details

### Communication between backend and frontend

In dev environment, frontend is hosted by built-in vite dev server. I intentionally use `proxy` 
setting for keeping CORS off. Vite's server is redirecting any `/api` requests to the backend 
which is located in single docker network. This means I also assume that in production environment
both frontend and backend will be served on a single domain, behind reverse-proxy like `nginx`.

Also, as a side effect, this solution allows you to share links to your development environment 
in local network which is great for demonstration and collaboration. 

### Typescript

This project uses typescript and it always hard to setup it correctly. Many instruments just 
skip type-checking part and rely that any error will be caught by IDE or programmer. I don't 
like this assumption and explicitly use typescript-compiler to compile and type-check my entire 
codebase. I'm trying to utilize project references for smart incremental builds with correct 
order of dependencies (`@test-assignment/shared` package).

### Monorepo

I prefer using monorepo because I think it is easier to maintain and share codebase. This 
project utilizes npm7 workspaces.

This project consists of multiple packages:
* `@test-assignment/root` contains any infrastructural and dev dependencies and is 
responsible for typescript code compilation
* `@test-assignment/backend` and `@test-assignment/frontend` declare only backend and 
  frontend dependencies respectively
* `@test-assignment/shared` is used for code sharing between frontend and backend

### Tests

There are no tests because my time budget is limited, but both backend and frontend are easily 
testable. I would use `jest` as main test runner.

### Cache

I try to use as much cache as possible for faster and smoother developer experience.
