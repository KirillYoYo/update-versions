import { Octokit } from '@octokit/rest';
import * as simpleGitModule from 'simple-git';
const simpleGit = simpleGitModule.default;
import fs from 'fs';
import { updateYamlFiles } from './yamlUpdater.js';
const git = simpleGit();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const WORK_DIR = './tmp-repo';
const REPO = 'refty-infra-test';
const OWNER = 'alun';
const FORK_OWNER = process.env.GITHUB_USERNAME;
export async function updateImageVersions(image, version) {
  const repoUrl = `https://github.com/${FORK_OWNER}/${REPO}.git`;
  if (fs.existsSync(WORK_DIR))
    fs.rmSync(WORK_DIR, { recursive: true, force: true });
  await git.clone(repoUrl, WORK_DIR);
  process.chdir(WORK_DIR);
  const changedFiles = await updateYamlFiles(image, version, WORK_DIR);
  await git.add('.');
  await git.commit(`Update ${image} to version ${version}`);
  await git.push('origin', 'main'); // Можно сделать отдельную ветку и pull request
  process.chdir('..');
  fs.rmSync(WORK_DIR, { recursive: true, force: true });
  return { changedFiles };
}
