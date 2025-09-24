import ora, { Ora } from "ora";

// Define the return type for the spinner
export type ProgressBar = {
  start: () => void;
  stop: () => void;
  setText: (text: string) => void;
};

export const createProgressBar = (text: string = "Loading..."): ProgressBar => {
  let spinner: Ora | null = null;

  return {
    start: () => {
      if (!spinner) {
        spinner = ora({ text }).start();
      }
    },
    stop: () => {
      if (spinner) {
        spinner.stop();
        spinner = null;
      }
    },
    setText: (newText: string) => {
      if (spinner) {
        spinner.text = newText;
      }
    },
  };
};
