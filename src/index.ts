#!/usr/bin/env node
import { Command } from "commander";
import { loadCommands } from "./commands/mergeInstitutions";

const program = new Command();
program
  .name("institution mapping")
  .description(
    "A tool to help match aggregator institutions to ucp institutions"
  );

loadCommands(program);
program.parse(process.argv);
