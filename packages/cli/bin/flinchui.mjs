#!/usr/bin/env node
import { main } from '../lib/cli.mjs';

main(process.argv.slice(2)).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`\n  error  ${message}\n\n`);
  process.exitCode = 1;
});
