yarn dlx create-turbo@latest -e with-vite / npx create-turbo@latest -e with-vite
npm init -y (run this in api for initiate npm)
yarn add typescript tsx -D
yarn workspace api add express (install anything in api worksspace)
yarn workspace @repo/config add -D @types/dotenv
yarn workspace api add express -D
yarn workspace @repo/db db-generate
yarn workspace @repo/db db-migrate --name "initial"
yarn workspace @repo/db db-seed
yarn workspace @repo/db db-reset


{
  "email": "test@email.com",
  "password": "password"
}


// need to check husky
// need to check why yarn run husky is not working when yarn install trigger
// need to check while commit why lint not stopping the commit
// need to check docker file also.

turbo.json

//tash => Tasks define what commands turbo can run (build, dev, lint, start and etc..)
//dev => Dev runs development servers
//cache => Don't cache dev mode (always run fresh)
//persistent => Keep running (doesn't exit) - for watch mode/servers
//build => Build will compiles Typescript to JavaScript
//dependsOn => "^build" means first build all dependencies (packages) befour building apps
//inputs => input files to watch for cache invalidation. If $TURBO_DEFAULT$ (src, package.json, etc.), .env file change then it build again else it use cache for avoit unnecessary build 
//start => Start runs production servers
//dependsOn => "build" means first build all dependencies (packages) befour building apps
//persistent => Keep running (server stays alive)
//cache => Don't cache (always run fresh)
//lint => Lint checks code quality with ESLint