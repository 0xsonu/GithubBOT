import executeCode from "../utils/codeExecutor";

export default async function handlePullRequest(context: any) {
  const { payload, name } = context;

  console.log({ name, action: payload.action });

  const pr = payload.pull_request;

  const { data: pullRequestDetails } = await context.octokit.pulls.get({
    owner: pr.base.repo.owner.login,
    repo: pr.base.repo.name,
    pull_number: pr.number,
  });
  const commandRegex = /\/execute/g;

  if (pullRequestDetails.body && commandRegex.test(pullRequestDetails?.body)) {
    const codeRegex = /```[\s\S]*?```/g;

    const codeSnippet = pullRequestDetails.body.match(codeRegex)?.[0] || "";

    console.log({ codeSnippet: codeSnippet.toString() });

    if (codeSnippet) {
      try {
        const executionResult = await executeCode(codeSnippet);
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
  }
}
