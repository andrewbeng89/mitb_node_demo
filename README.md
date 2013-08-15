[![Build Status](https://travis-ci.org/andrewbeng89/mitb_node_demo.png?branch=master)](https://travis-ci.org/andrewbeng89/mitb_node_demo)
# MITB Cloud Computing Lab for Node.js Development and CI with Koding and Travis-CI

This tutorial will cover the steps for using a virtual maching (VM) on [koding.com](https://koding.com) to code node.js web apps and use Travis-CI as a test and deploy tool to push updates to Heroku. This tutorial will also allow you to push 'static' files (e.g. HTML, JavaScripts etc.) to the GitHub pages brance of your repository.

Once you have signed up and received an invitation for Koding.com, you will have access to a persional Koding VM. Open the terminal shell of your VM which will look like this:

![koding terminal](/images/koding_vm.png)


## Install Travis Ruby Gem

The Travi-CI gem will be used to encrypt a OAuth2 token that will be used to push updates to Google App Engine from the Travis build.

1. From the terminal, install the gem by entering `sudo gem install travis`
2. Enter your Koding password when prompted


## Configuring Git and GitHub

Generate a new ssh key pair on the VM to use to sync with GitHub and Travis-CI.

1. Follow the instructions [here](https://help.github.com/articles/generating-ssh-keys)
2. When "Enter file in which to save the key (/home/you/.ssh/id_rsa):" is prompted, enter  `/home/<you>/.ssh/koding_id_rsa`
3. Once the key pair has been generated, open the public key koding_id_rsa.pub using the ACE editor
4. Copy the public key and add it to your [GitHub keys](https://github.com/settings/ssh) with a new key name, e.g. koding.com
5. Create a new config file in the .ssh folder and enter these lines below:
<pre>
  <code>
# Default GitHub user
 Host github.com
 HostName github.com
 PreferredAuthentications publickey
 IdentityFile ~/.ssh/koding_id_rsa
  </code>
</pre> 


## Clone and Configure Demo App

1. Clone this repository `git clone https://github.com/andrewbeng89/mitb_node_demo.git -b master`
2. `cd mitb_node_demo`
3. Reomve the .git directory `rm -rf .git`
4. Create a new GitHub repository with your account
5. Initialise the demo app as a git repo on the VM `git init`
6. Add the remote to the newly create GitHub repository `git remote add origin git@github.com:<your_username>/<your_new_repo>.git`


## Running the application on Koding.com

You can use Koding.com as a testing environment for development.

1. From the VM terminal, enter `node app.js` to run the app
2. Open your application from "vm-0.<your_koding_username>.kd.io:3000"


## Install and user the Heroku Toolbelt

After signing up for [Heroku](https://heroku.com), install the [Heroku Toolbelt](https://toolbelt.heroku.com/) on your Koding VM

1. Using the terminal, follow the instructions from the link
2. Use the toolbelt to login to Heroku
3. Create a new Heroku app: `heroku create <new-app-name>`
4. Use the travis gem to configure the deployment: `travis setup heroku`
5. Check the .travis.yml file that the deploy commands have been added
<pre>
  <code>
deploy:
  provider: heroku
  api_key:
    secure: <encrypted_api_key>
  app: <your_heroku_app_name>
  on:
    repo: <your_github_username>/<your_repo>
  </code>
</pre> 


## Add GitHub Personal API Access Token

1. Create a new Personal API Access Token [here](https://github.com/settings/applications)
2. Copy the token to clipboar and encrypt it with travis
3. `travis encrypt MT_GITHUB_TOKEN="<paste_token from_clipboard>" --add -r <your_github_username/your_github_repo>`
4. Edit this line of the .travis.yml file: `- git push https://$MY_GITHUB_TOKEN@github.com/<your_username>/<your_repo>.git gh-pages`


## Initilialise GH-Pages Branch 

1. From the terminal, cd out of the application repository: `cd ..`
2. Clone the github repository into a new gh-pages folder: `git clone git@github.com:<your_username>/<your_repo>.git gh-pages`
3. cd into the gh-pages folder: `cd gh-pages`
4. Create the new gh-pages branch and remove all content from the working directory and index `git checkout --orphan gh-pages`
5. `git rm -rf .`
6. Add the index.html file from the master branch: `git checkout master -- index.html`
7. Add index.html to the new branch: `git add -A .`
8. Commit:  `git commit -a -m 'initialising gh-pages'`
9. Push: `git push origin gh-pages`


## Setup and Build with Travis-CI

1. Register for [Travis-CI](https://travis-ci.org) using your GitHub account
2. From your Travis-CI [profile](https://travis-ci.org/profile) page, enable the newly created GitHub repository
3. Edit this line of the .travis.yml file: `- git clone https://github.com/<your_username>/<your_repo>.git deploy`
4. Add all file and folders `git add -A .`
5. Commit with message `git commit -a -m 'created node project'`
6. Push the update `git push origin master`
7. You can track the build progress at the Travis-CI website

* updated to include public folder push to gh-pages branch
* coming soon: challenging tasks
* Check you the sister tutorial for deploying to Google App Engine [here](https://github.com/andrewbeng89/mitb_gae_demo)


## View the demo app on [Heroku](http://mitb-node-demo.herokuapp.com)