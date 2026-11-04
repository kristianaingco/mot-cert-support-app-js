# Timesheet Manager

Frontend for the Timesheet Manager support app, used in the Automation in Testing Engineer learning journey.

It is a React app (Create React App) for signing in and working with projects, timesheets, users, reports, and profiles. The UI calls a `/v1` API. In local development that path is proxied to a WireMock server on port 8080, using the stubs in `mocks/mappings`.

## Prerequisites

- Node.js 18 and npm. The pipeline pins Node.js `18.x`.
- A Java runtime. `npm start` launches `mocks/wiremock-standalone.jar`.
- Google Chrome. End-to-end tests run in headless Chrome through WebdriverIO.

Install dependencies from the lockfile:

```bash
npm ci
```

## Run the app

Start WireMock and the React dev server together:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The login stub accepts `admin@test.com` / `password123`.

To start only the React app, without WireMock:

```bash
npm run start-mockless
```

Build the production bundle into `build/`:

```bash
npm run build
```

## Unit and API checks

Unit and API checks run in one Jest suite (`react-scripts`). Specs live in `src/__tests__/`. Component tests render with React Testing Library. API calls in those tests are stubbed with [nock](https://github.com/nock/nock) (for example `GET /v1/project` in the project list test), so they do not need WireMock or a running server.

Run the suite once and exit:

```bash
CI=true npm test
```

`CI=true` turns off Jest watch mode. Omit it to stay in watch mode:

```bash
npm test
```

On Windows, set the variable in the shell before the command:

```powershell
$env:CI = "true"
npm test
```

Jest writes a JUnit report to `reports/junit/junit.xml` (`jest-junit`).

## End-to-end tests

End-to-end tests use WebdriverIO and Mocha. Specs are in `test/specs/` and are configured in `wdio.conf.js`. Chrome runs headless. Results are written to `reports/e2e-report/junit-report.xml`.

`test/specs/Login.e2e.js` signs in against this app, so WireMock and the dev server must already be running. In one terminal:

```bash
npm start
```

In a second terminal, after [http://localhost:3000](http://localhost:3000) is up:

```bash
npm run wdio
```

That runs `wdio run ./wdio.conf.js`. `test/specs/test.e2e.js` targets `https://the-internet.herokuapp.com` and needs outbound network access.

## CI/CD

Continuous integration is the GitHub Actions workflow [`.github/workflows/build_test_react.yml`](.github/workflows/build_test_react.yml) (`NodeJS CI`). It runs on every push to the repository. There is no deploy step; the job builds production artifacts and publishes test results.

The `build` job runs on `windows-latest` with Node.js `18.x`:

1. Check out the repository.
2. Install that Node.js version.
3. **Unit checks.** `npm ci`, then `npm test` with the `jest-junit` reporter. GitHub Actions sets `CI`, so Jest exits instead of watching.
4. **End-to-end checks.** In bash, start the app in the background (`npm start`), wait 10 seconds, then `npx wdio run ./wdio.conf.js`.
5. **Production build.** `npm run build`.
6. **Publish test results.** [EnricoMi/publish-unit-test-result-action](https://github.com/EnricoMi/publish-unit-test-result-action) (`windows@v2`) reads `reports/junit/*.xml` and `reports/e2e-report/*.xml`. It still runs when an earlier step fails (`if: (!cancelled())`).
