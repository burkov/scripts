#!/usr/bin/env node

import nconf from 'nconf';
import gitRepoInfo from 'git-repo-info';
import execa from 'execa';

const repoInfo = gitRepoInfo();

nconf.file('src/config.json');
nconf.set('version', repoInfo.lastTag);
nconf.save(undefined);
execa.commandSync('git commit -am Update version in config file');
execa.commandSync('git push');
