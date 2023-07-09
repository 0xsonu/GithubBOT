import { Probot } from "probot";
import handlePullRequest from "./handlers/pullRequestHandler";
import handleComments from "./handlers/commentsHandler";

export = (app: Probot) => {
  app.on(
    ["pull_request.opened", "pull_request.edited"],
    async (context: any) => {
      await handlePullRequest(context);
    }
  );
  app.on(
    ["issue_comment.created", "issue_comment.edited"],
    async (context: any) => {
      await handleComments(context);
    }
  );
};

// const code = `\`\`\`js
//   console.log("Hellow form Executed code");
// \`\`\``;

// executeCode(code).then((response) => console.log(response));

