[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/OY0PKNK3)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11391561&assignment_repo_type=AssignmentRepo)
# Getting started

You're going to install a new Expo app into this directory. It will complain if there are already files present, so first delete these files and folders:

-   `README.md`
-   `1-brainstorming/BRAINSTORMING.md`
-   `2-concept/CONCEPT.md`

(Don't worry, we'll use Git to restore them later.)

Then run the following command in a new terminal window in VS Code:

```sh
npx create-expo-app --example with-router .
```

This will install a new Expo project in the root of your repository folder. It will take a few minutes to install all the dependencies. When it's done, you should see a new `node_modules` folder. In the Explorer tab in VS Code, delete the `README.md` file that Expo just added.

Now go to the "Source Control" tab in VS Code and click the leftward curved arrow next to the three files you deleted earlier. This will restore the files from the last commit.

Now hover over the "Changes" heading and click the plus-button to stage the changes. Then add a commit message at the top of the sidebar with the text "npx create-expo-app --example with-router" and then click the "Commit" button to commit the changes. Finally click "Sync Changes" to push the commit to GitHub.
