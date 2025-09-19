import { Command } from "commander";

export function loadCommands(program: Command) {
  program
    .command("merge")
    .description("Merge institutions")
    .action(() => {
      console.log("merge institutions executed");
    });
}
