import { debug } from "console";
import executeCode from "../utils/codeExecutor";

export default async function handleComments(context: any) {
  const { payload } = context;

  // const pr = payload.issue.pull_request;
  const commandRegex = /\/execute/g;

  // console.log("name and pr : %j", context);
  // Fetch and process comments
  const comments = await context.octokit.issues.listComments({
    owner: payload.sender.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
  });

  console.log("Reading comments...");
  for (const comment of comments.data) {
    if (comment.body && commandRegex.test(comment.body)) {
      // Extract the code snippet from the comment
      const codeRegex = /```[\s\S]*?```/g;
      const commentCodeSnippet = comment.body.match(codeRegex)?.[0] || "";
      !commentCodeSnippet &&
        console.log(
          "Code not found in comment. Trying to find code in pull request."
        );
      if (commentCodeSnippet) {
        // Execute the code using the PISTON API (or any similar code execution API)
        const executionResult = await executeCode(commentCodeSnippet);

        // Post the execution result as a comment reply
        try {
          await context.octokit.issues.createComment({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.issue.number,
            body: executionResult,
            in_reply_to: comment.id,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        const { data: pr } = await context.octokit.pulls.get({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          pull_number: payload.issue.number,
        });
        debug({ pr: pr.body && codeRegex.test(pr.body), body: pr.body });
        // console.log("PR Details : %j", pr);
        debug({ match: pr.body.match(codeRegex) });
        if (pr.body && codeRegex.test(pr.body)) {
          console.log("Entered into body check");
          const prCodeSnippet = pr.body.match(codeRegex)?.[0] || "";

          console.log({ prCodeSnippet: prCodeSnippet.toString() });

          if (prCodeSnippet) {
            try {
              const executionResult = await executeCode(prCodeSnippet);
              console.log("Creating comment");
              await context.octokit.issues.createComment({
                owner: pr.base.repo.owner.login,
                repo: pr.base.repo.name,
                issue_number: pr.number,
                body: executionResult,
              });
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          console.log("Not able to enter into body");
        }
      }
    } else {
      console.log("No Command Found in commnet");
    }
  }
}
