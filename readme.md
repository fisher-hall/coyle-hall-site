<img src="assets/images/favicon.png" align="center"></img>
<h1 align="center">Coyle Hall's Website</h1>

<h3 align="center"><a href="https://www.coylehallnd.com">www.coylehallnd.com</a></h3>
<h4 align="center">Current Maintainers: <a href="mailto:wgriffi3@nd.edu">Will Griffin</a> and <a href="mailto:dburke6@nd.edu">Daniel Burke</a></h4>

<hr>

## Current Information on the Website

### Hall Staff

- Rector
- Assistant Rectors
- Priest-in-Residence
- Resident Assistants

### Hall Government

- President
- Vice Presidents
- Hall Commissioners

### Hall Information

- History and Transition from Fisher to Coyle
- Building Information
- Location Guide

### Traditions

- St. Adalbert's
- Coyle Formal
- Coyle Funk
- Regatta

<hr>

## Development and Editing

### Prerequisites

Before editing, make sure these prerequisites are installed on your machine

- [Hugo Extended v0.144+](https://gohugo.io/installation/)
- [Node v22+](https://nodejs.org/en/download/)
- [Go v1.24+](https://go.dev/doc/install)
- [Git](https://git-scm.com/downloads)

### To Make an Edit

The website is hosted using GitHub Pages, and as such, the main branch is the current state of the website. Edits should be made on separate branches, then merged using a pull request to the main branch.

If the repository is <span style="color: red">__NOT__</span> cloned on your machine, use this following command in the terminal:

```bash
git clone git@github.com:fisher-hall/coyle-hall-site.git
```
<em>Note: You may need to set up Git/GitHub SSH to perform this/future steps. You can find out how to do this <a href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent">here</a>. Follow the sections <strong>Generating a new SSH key</strong> and <strong>Adding your SSH key to the ssh-agent</strong></em>

<br><br>
Before making any changes, make sure your main branch is up to date:

```bash
git checkout main
git pull
```

Create a new branch with name <code>branch-name</code>:

```bash
git checkout -b <branch-name>
```

You can self-host a test server found at the url _localhost:1313_ using this command:

```bash
npm run dev
```

Changes are stored using "commits".
To see all files that have been updated, use this command:

```bash
git status
```

To add files to the commit, use this command with the file name/path shown in the <code>git status</code> command:

```bash
git add <file name/path>
```

To write a commit, use this command with your commit message within the quotes:

```bash
git commit -m "<commit message>"
```

Finally, to push to the repository, use this command:

```bash
git push origin <branch-name>
```

On the GitHub page, a pull request can be created to merge <code>branch-name</code> with the main branch. Ensure there are no merge conflicts (or resolve them), and then merge the branch. After a successful merge, the <code>branch-name</code> branch can be safely deleted. It might take up to a couple minutes for the changes to be deployed to the website, but if the deployment is successful, you should see a green checkmark by the commit message at the top of the repository.

Also, after a successful merge, you should update your local version as well using the following commands:

```bash
git checkout main
git pull
```

### Editing Specific Page Content

For specific page editing, use these guides:
- [Hall Staff]()
- [Hall Government]()
- [Hall Commissioners]()
- [Incoming Students]()

