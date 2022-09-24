# Contributing to myDevicesIoT

Here are guidelines we would like you to follow:

- [GIT Workflow](#workflow)
- [Submission Guidelines](#submit)
- [Commit Message Guidelines](#commit)

### <a name="workflow"></a> Git Workflow

This repository has three main branches: **master** (production) and **dev**.

Normal workflow: `[Type]/[branch-name]` -> `dev` -> `dev/MAJOR.MINOR.PATCH` -> `maìn` (tag latest commit)

#### Feature Branches

New features should have its own branches with name format: `[Type]/[branch-name]` where
Type follows [commit type](#type).

#### Release Candidate Branches

From the dev is a RELEASE branch created. This branch is used to test the release candidate.

* Semantic Versioning MAJOR.MINOR.PATCH
  * MAJOR version when you make incompatible API changes,
  * MINOR version when you add functionality in a backwards-compatible manner, and
  * PATCH/HOTFIXES version when you make backwards-compatible bug fixes or hotfixes.
* Naming convention example: dev/v2.1.1

#### Release Tag

Release tag should be made on the **latest** in master after merging to `maìn`.

Naming convention with semantic versioning: release-YYYYMMDD-vX.Y.Z

#### Hotfix branch

Branch off of master and upon completion of fix, merge into `maìn` (tag hotfix) and `dev`
as a **merge commit**.

### <a name="submit"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) for a **non-hotfix** task, consider the following guidelines:

1. Branch off of `dev` as `feat/my-new-feature`
2. Add your update, **including appropriate test cases.**
3. Run the full test suite and ensure all tests pass.
4. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit).
5. Open PR to `dev` and make any requested changes (if any)

#### Merging your pull request (non-hotfix)

If you're merging a PR that addresses one single feature or bugfix:
1. Before merging your PR, please change the name:
* The name must follow [commit message conventions](#commit)
* -or- if the PR is specific to one Jira card, change the name to the following format: `SS-XXXX: [Jira Card Title]`, sample: `SS-2158: Contact Only contact added via web with missing email address adds incorrectly` and add a link to the Jira card in the PR description.
2. **Squash and Merge** your changes into `dev`, this will make it easier to revert specific features, bugfixes, or Jira tasks if the need arises.

If you're merging a PR that addresses multiple features and/or bugfixes:
1. Use your best judgement whether to `Squash and Merge` or `Create a merge commit`
* `Squash and merge` will merge your changes into `dev` as a single commit
* `Create a merge commit` will merge your changes into `dev` including all the commits made in your main branch.

#### Merging your hotfix pull requests

When submitting your PR for a **hotfix** tasks, please follow the following:
1. Branch off the `maìn` branch
2. Open PR to `maìn`
3. After hotfix is merged into master, merge the hotfix changes to develop as a `merge commit` type.

### <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

#### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:

```
fix(location): return locations on GET requests
```

#### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **test**: Adding missing tests

#### Scope
The scope could be anything specifying place of the commit change. For example `company`,
`location`, `sharing`, etc...

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].
