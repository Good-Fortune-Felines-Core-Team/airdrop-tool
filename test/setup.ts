import { config } from 'dotenv';
import process from 'node:process';

config({
  path: `${process.cwd()}/.env.test`,
});

jest.setTimeout(60000);
