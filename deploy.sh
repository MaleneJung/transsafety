git pull
git rm -r dist
git commit -m 'Removing old dist'
npm run build
git add dist 
git commit -m 'Deploying new dist'
git push 
git push -d origin github-pages
git subtree push --prefix dist origin github-pages
