#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../environment/.env"),
  quiet: true,
});

import { Command } from "commander";
import { loadMergeInstitutionsCommand } from "./commands/mergeInstitutions";
import { loadFetchInstitutionsCommand } from "./commands/fetchInstitutions";

const program = new Command();
program
  .name("institution mapping")
  .description(
    "A tool to help match aggregator institutions to ucp institutions"
  );

loadMergeInstitutionsCommand(program);
loadFetchInstitutionsCommand(program);

program.parse(process.argv);
