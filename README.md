
This project aims to solve the problem that comes with syncing many repos with Github in windows. It will look for all git projects under a given root folder.
It uses bun and git bash.



# Installation

install bun for windows:
```
powershell -c "irm bun.sh/install.ps1|iex"
```

install git for windows:
```
winget install --id Git.Git -e --source winget
```

clone the repo:
```
git clone github.com/lrsperanza/SyncManyRepos
```

navigate to the project folder
```
cd SyncManyRepos
```

then install the necessary packages (this is equivalent to npm install)
```
bun install
```


# Running

```
bun sync-repos.ts -- "C:/Path/to/your/projects/root/folder"
```

It should iterate over all the subfolders looking for git repos and it will try to apply to each of them:
```
git pull origin main
git pull origin master
git add .
git commit -m "." (you can change the "." value by altering the const commitMessage on sync-repos.ts)
git push
```

