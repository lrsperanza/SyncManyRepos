#!/usr/bin/env bun

import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir } from 'fs/promises';
import { join } from 'path';

const commitMessage = ".";
const execAsync = promisify(exec);

async function findGitFolders(dir) {
  const gitFolders: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  // console.log(entries.map(x=>x.name))

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git') {
        console.log("found", entry.name)
        gitFolders.push(dir);
      } else {
        if(path.indexOf('node_modules') > -1)
          continue;
        if(path.indexOf('.git') > -1)
          continue
        if(path.indexOf('.vscode') > -1)
          continue
        if(path.indexOf('bin') > -1)
          continue
        if(path.indexOf('obj') > -1)
          continue
        if(path.indexOf('Properties') > -1)
          continue
        if(path.indexOf('packages') > -1)
          continue
        if(path.indexOf('obj') > -1)
          continue
        if(path.indexOf('.vs') > -1)
          continue

        gitFolders.push(...await findGitFolders(path));
      }
    }
  }

  return gitFolders;
}

async function gitOperations(dir, commitMessage) {
  try {
    process.chdir(dir);

    console.log("")
    console.log("")
    console.log("##############")
    console.log("executing", dir)
    let r;
    try {
      console.log('git pull origin main')
      r = await execAsync('git pull origin main', {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
      console.log(r.stdout)

    } catch (err){
      console.log(`Error in ${dir}:`, err.message);
      console.log('git pull origin master')
      r = await execAsync('git pull origin master', {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
      console.log(r.stdout)
    }
    console.log('git add .')
    r = await execAsync('git add .', {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
    if(r.stdout == "")
      {
        console.log("No new files found in ", dir)
      }
    console.log(r.stdout)
    
    // Check if there are changes to commit
    console.log('git status --porcelain')
    r = await execAsync('git status --porcelain', {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
    
    if (r.stdout.trim() === '') {
      console.log("No changes to commit in", dir)
    } else {
      console.log('git commit -m "' + commitMessage + "\"")
      r = await execAsync('git commit -m "' + commitMessage + "\"", {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
      console.log(r.stdout)
      
      console.log('git push')
      r = await execAsync('git push', {shell: 'C:\\Program Files\\Git\\bin\\sh.exe'});
      console.log(r.stdout)
    }

    console.log(`Successfully performed git operations in ${dir}`);
  } catch (error) {
    console.error(`Error in ${dir}:`, error.message);
  }
  console.log("##############")

}

async function main() {
  console.log(process.argv);
  console.log(process.argv[2]);
  console.log(process.argv[3]);

  let currentDir = process.cwd();
  if(process.argv.length >= 3)
    currentDir = process.argv[2];

  let commitMessage = ".";
  if(process.argv.length >= 4)
    commitMessage = process.argv[3];
  
  
  console.log("Current Directory:", currentDir);
  console.log("Commit Message:", commitMessage);

  const gitFolders = await findGitFolders(currentDir);

  for (const folder of gitFolders) {
    await gitOperations(folder, commitMessage);
  }
}

main().catch(console.error);