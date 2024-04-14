#! /usr/bin/env node
import { program } from 'commander';

program
  .description(
    'An airdrop tool for NEP-141 tokens that is designed to shoot a number of tokens to an NFT allowlist (or any list), with the ability to shoot multiple allocations to specific addresses.'
  )
  .version(require('../package.json').version)
  .parse();
