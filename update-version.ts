#!/usr/bin/env node

import nconf from 'nconf';
import gitRepoInfo from 'git-repo-info';

const repoInfo = gitRepoInfo();

nconf.file('src/config.json');
nconf.set('version', repoInfo.lastTag);
nconf.save(undefined);
