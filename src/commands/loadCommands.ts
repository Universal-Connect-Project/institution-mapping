import { Command } from "commander";
import { loadMergeInstitutionsCommand } from "./mergeInstitutions";
import { loadFetchInstitutionsCommand } from "./fetchInstitutions";

export function loadCommands(program: Command) {
  loadFetchInstitutionsCommand(program);
  loadMergeInstitutionsCommand(program);
}
