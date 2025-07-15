import { Octokit } from '@octokit/rest';
import * as simpleGitModule from 'simple-git';
const simpleGit = (simpleGitModule as any).default;
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

import { updateYamlFiles } from './yamlUpdater.js';
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const PARENT_DIR = './';
const WORK_DIR = path.join(PARENT_DIR, 'tmp-repo');
const REPO = 'refty-infra-test';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

async function dirExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Формирует URL репозитория с токеном или без него.
 *
 * @param {boolean} useToken - Указывать ли токен в URL.
 * @returns {string} - Полный URL репозитория.
 */
function getRepoUrl(useToken: boolean): string {
  const base = 'github.com';
  const user = process.env.GITHUB_USERNAME;
  const repo = 'refty-infra-test';
  const token = process.env.GITHUB_TOKEN;

  if (useToken && token) {
    return `https://${token}@${base}/${user}/${repo}.git`;
  } else {
    return `https://${base}/${user}/${repo}.git`;
  }
}

/**
 * Обновляет версии образов в YAML-файлах репозитория.
 *
 * Процесс:
 * 1. Клонирует репозиторий в временную папку.
 * 2. Обновляет YAML-файлы с указанной версией образа.
 * 3. Возвращает список изменённых файлов.
 * 4. Удаляет временную папку с репозиторием.
 *
 * @async
 * @function
 * @param {string} image - Имя образа, который нужно обновить.
 * @param {string} version - Новая версия образа.
 * @returns {Promise<{changedFiles: string[]}>} Объект с массивом изменённых файлов.
 * @throws {Error} В случае ошибки при работе с git или файловой системой.
 */
export async function updateImageVersions(image: string, version: string) {

  /***
  * можно не использовать токен если передать false
  **/
  const repoUrl = getRepoUrl(true);

  if (await dirExists(WORK_DIR)) {
    await fs.rm(WORK_DIR, { recursive: true, force: true });
  }

  const gitParent = simpleGit(PARENT_DIR);

  try {
    await gitParent.clone(repoUrl, 'tmp-repo');

    const git = simpleGit(WORK_DIR);

    const changedFiles = await updateYamlFiles(image, version, WORK_DIR);

    await git.add('.');
    await git.commit(`Update ${image} to version ${version}`);
    await git.push('origin', 'main');

    return { changedFiles };
  } finally {
    if (await dirExists(WORK_DIR)) {
      await fs.rm(WORK_DIR, { recursive: true, force: true });
    }
  }
}
