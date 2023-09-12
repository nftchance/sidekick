This is a sandbox for CHANCE sidekick development.

## Install the Dependencies

Before you can do anything in this repository, you need to install all of the dependencies. Simply run:

```bash
bun i
```

> **Important**
> You will need to have Bun installed as the raw API has been integrated in many critical places.

## Commands

👷 : For Development
👁️ : For Analysis
❌ : For CI

- 👷 `bun dev` -- Run the admin interface that is used for Sandbox visualization.
  - Access the server at [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- ❌ `bun test` -- Make sure that everything works.
  - I have broken this, this is currently non-functional although all core features have blocking tests inline. 
- 👁️ `bun aggregate:galaxe` -- Retrieve the historical campaigns that have run on Galaxe.
