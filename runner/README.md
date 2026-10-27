# Code runner

BackPract runs code in two places:

| Languages | Where | Setup |
|---|---|---|
| JavaScript, TypeScript, Python, SQL, PHP, Ruby | In the browser ([lib/browser-runner.ts](../lib/browser-runner.ts)) | None |
| Java, C#, Go, Rust, C++ | A self-hosted [Piston](https://github.com/engineer-man/piston) server | Below |

The public Piston API (emkc.org) is whitelist-only since 2/15/2026, so the
compiled languages need your own instance.

## Run Piston

Needs a Linux host (or Docker Desktop) that allows privileged containers.
Container platforms that forbid privileged mode (most serverless and PaaS
hosts) won't work; a small VPS will.

```sh
cd runner
docker compose up -d
./install-languages.sh            # or: ./install-languages.sh http://your-host:2000
```

Installing all five runtimes downloads a few GB and takes several minutes.

## Point the app at it

Set this where the Next.js app runs (`.env.local` locally, or your host's
environment variables), then restart the app:

```sh
PISTON_API_URL=http://your-host:2000/api/v2
```

Leave `NEXT_PUBLIC_PISTON_URL` unset so the browser goes through the app's
`/api/execute` route instead of calling Piston directly.

## Security

Piston isolates each run (no network, CPU/memory/time limits), but anyone who
can reach port 2000 can run code on the host. Don't expose it to the internet:
firewall it so only the app server can connect, or keep both on one machine.
