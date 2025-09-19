import { Command } from "commander";
import { readFinicityInstitutionsAndConvertToUCP } from "../institutionMapping/finicity";
import { fetchInstitutions } from "../fetchInstitutions/finicity";

export function loadCommands(program: Command) {
  program
    .command("merge")
    .description("Merge institutions")
    .action(async () => {
      await fetchInstitutions();
    });
}
