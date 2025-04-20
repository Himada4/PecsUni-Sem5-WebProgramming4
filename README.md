# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## External Node.js library used
> https://www.npmjs.com/package/bbcode

## Routing
> /recipe/[id] \
> /register \
> /user[id]


A website structure consisting of at least three routes.
• Basic styling using CSS or SCSS.
• Usage of at least eight custom Svelte components.
• A well-organized folder structure.
• At least four API calls, with at least one external API (not written by the student).
• Data storage on a server – either in a database or a text file. Queries should be executed
using SQL or NoSQL.
• Project documentation explaining:
o The purpose of the project
o The implementation
o The structure of the codebase
o Description of APIs
o Description of stored data
o The communication method between components/services
• At least one external Node.js module used for any functionality (e.g., date handling, a
third-party Svelte component, a vanilla JavaScript module for data processing, drag-and
drop mechanics, etc.).
Submission Method:
The project must be submitted via a public Git repository and shared on Teams. The
documentation should be included in the root directory as a README.md file.
Deadlines:
• Submission deadline: April 30, 2025
• Resubmission deadline: May 7, 2025