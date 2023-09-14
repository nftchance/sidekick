This is a sandbox for CHANCE sidekick development.

## Install the Dependencies

Before you can do anything in this repository, you need to install all of the dependencies. Simply run:

```bash
bun i
```

> **Important**
> You will need to have Bun installed as the raw API has been integrated in many critical places.

## Commands

- 👷 `bun dev` -- Run the admin interface that is used for Sandbox visualization.
  - Access the server at [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- 👁️ 🧩 `bun aggregate:galaxe` -- Retrieve historical campaigns on Galaxe.
- 👁️ 🧩 `bun aggregate:rabbithole` -- Retrieve historical campaigns on Rabbithole.
- 🏗️ 🧩 ✨ `bun prisma:generate` -- Combine the parts of the Prisma schema and generate the core schema.

