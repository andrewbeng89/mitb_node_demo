[![Build Status](https://travis-ci.org/andrewbeng89/mitb_node_demo.png?branch=master)](https://travis-ci.org/andrewbeng89/mitb_node_demo)
# MITB Cloud Computing Lab for Node.js Development and CI with Koding and Travis-CI

This tutorial will cover the steps for using a virtual maching (VM) on [koding.com](https://koding.com) to code node.js web apps and use Travis-CI as a test and deploy tool to push updates to Heroku. This tutorial will also allow you to push 'static' files (e.g. HTML, JavaScripts etc.) to the GitHub pages brance of your repository.

The second part of this tutorial will cover automated 

Once you have signed up and received an invitation for Koding.com, you will have access to a persional Koding VM. Open the terminal shell of your VM which will look like this:

![koding terminal](https://github.com/andrewbeng89/mitb_gae_demo/raw/master//images/koding_vm.png)


## Install Travis Ruby Gem

The Travi-CI gem will be used to encrypt a OAuth2 token that will be used to push updates to Google App Engine from the Travis build.

1. From the terminal, install the gem by entering `sudo gem install travis`
2. Enter your Koding password when prompted


## Part 1: Travis, Github and Heroku

### Configuring Git and GitHub

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


### Clone and Configure Demo App

1. Clone this repository `git clone https://github.com/andrewbeng89/mitb_node_demo.git -b master`
2. `cd mitb_node_demo`
3. Reomve the .git directory `rm -rf .git`
4. Create a new GitHub repository with your account
5. Initialise the demo app as a git repo on the VM `git init`
6. Add the remote to the newly create GitHub repository `git remote add origin git@github.com:<your_username>/<your_new_repo>.git`


### Running the application on Koding.com

You can use Koding.com as a testing environment for development.

1. From the VM terminal, enter `node app.js` to run the app
2. Open your application from "vm-0.<your_koding_username>.kd.io:3000"


### Install and user the Heroku Toolbelt

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


### Add GitHub Personal API Access Token

1. Create a new Personal API Access Token [here](https://github.com/settings/applications)
2. Copy the token to clipboar and encrypt it with travis
3. `travis encrypt MT_GITHUB_TOKEN="<paste_token from_clipboard>" --add -r <your_github_username/your_github_repo>`
4. Edit this line of the .travis.yml file: `- git push https://$MY_GITHUB_TOKEN@github.com/<your_username>/<your_repo>.git gh-pages`


### Initilialise GH-Pages Branch 

1. From the terminal, cd out of the application repository: `cd ..`
2. Clone the github repository into a new gh-pages folder: `git clone git@github.com:<your_username>/<your_repo>.git gh-pages`
3. cd into the gh-pages folder: `cd gh-pages`
4. Create the new gh-pages branch and remove all content from the working directory and index `git checkout --orphan gh-pages`
5. `git rm -rf .`
6. Add the index.html file from the master branch: `git checkout master -- index.html`
7. Add index.html to the new branch: `git add -A .`
8. Commit:  `git commit -a -m 'initialising gh-pages'`
9. Push: `git push origin gh-pages`


### Setup and Build with Travis-CI

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


## Part 2: AWS Elastic Beanstalk and Elastic Load Balancing

Sign up for [Amazon Web Services (AWS)](https://aws.amazon.com). The following steps will walk through using services from AWS. Elastic Beanstalk (EB) provides a platform which developers can deploy a wide variety of web applications to Amazon Machine Instances (AMIs) remotely via web or command line interfaces. Elastic Load Balancer (ELB) is used to configure automated resource scaling on AWS, e.g. scaling an EB instance by launching more AMIs when a certian performance threshold has exceeded.

### Security Credentials

1. Create an Access Key with a corresponding ID and Secret [here](https://portal.aws.amazon.com/gp/aws/securityCredentials)
2. From the [EC2 console](https://console.aws.amazon.com/ec2/v2/home?region=ap-southeast-1), create a new Key Pair


### Using the Elastic Beanstalk Command Line Interface Tools

1. Sign up for Elastic Beanstalk
2. From the VM terminal, navigate to "home": `cd ~$`
3. Download the modified version of the EB CLI Tools from the VM terminal: `wget https://dl.dropboxusercontent.com/u/6484381/AWS-ElasticBeanstalk-CLI-2.5.1.zip`
4. Unzip: `unzip wget AWS-ElasticBeanstalk-CLI-2.5.1.zip`
5. Export the PATH for the EB tools: `export PATH=$PATH:$PWD/AWS-ElasticBeanstalk-CLI-2.5.1/eb/linux/python2.7`
6. Navigate to application folder: `cd mitb_node_demo`
7. Initialise a new EB application: `eb init`
8. When prompted, enter your AWS Access Key ID and Secret respectively5
9. Select option 5 for "service regions" (Asia Pacific (Singapore))
10. Enter an application name: `<yourname>-node-demo`
11. Use this application name for environment name as well
12. Select option 6 for "solution stack" (64bit Amazon Linux running Node.js)
13. Enter `No` when prompted to create a RDS instance
14. Start the environment: `eb start`
15. Push the application from the repository: `eb push`
16. View the application at the URL returned in the terminal


### Automate EB updates with Travis

These lines in the .travis.yml file automates the updates to EB. The AWS Access Key ID and Secrets will be encrypted by travis and used upon a successful build.

<pre>
  <code>
- wget https://dl.dropboxusercontent.com/u/6484381/AWS-ElasticBeanstalk-CLI-2.5.1.zip
- unzip AWS-ElasticBeanstalk-CLI-2.5.1.zip
- export PATH=$PATH:$PWD/AWS-ElasticBeanstalk-CLI-2.5.1/eb/linux/python2.7
- echo "No"|eb init -S $AWS_ACCESS_SECRET -I $AWS_ACCESS_KEY -a mitb-node-demo -e mitb-node-demo --region "ap-southeast-1" -s "64bit Amazon Linux running Node.js"
- eb push
  </code>
</pre>

1. Encrypt you AWS Access Key ID with the travis gem: `travis encrypt AWS_ACCESS_KEY="<paste_key_id_from_clipboard>" --add`
2. Encrypt you AWS Access Key Secret with the travis gem: `travis encrypt AWS_ACCESS_SECRET="<paste_key_secret_from_clipboard>" --add`
3. Edit this line of the .travis.yml file: `-a <name-of-your-app> -e <name-of-your-app>`


### Auto Scaling with Elastic Beanstalk

The following configuration will automatically scale the Elastic Beanstalk application to a maximum of 4 instances depending on a threshold number of requests made to the application.

1. Navigate to your application environment from the [Elastic Beanstalk console](https://console.aws.amazon.com/elasticbeanstalk/home?region=ap-southeast-1#/applications)
2. Navigate to the "Configuations" settings for your application
3. Select "Scaling" configuration
4. Change the "Environment type" from "Single instance" to "Load balancing, autoscaling"
5. Use the default values for "Auto Scaling"
6. Use the following values for "Scaling Trigger"
7. Trigger measurement: "RequestCount" (counts the number of requests made to the application)
8. Trigger statistic: "Sum" (sum the request count)
9. Unit of measurement: "Count"
10. Measurement period (minutes): 1
11. Breach duration (minutes): 1
12. Upper treshold: 60 (trigger scaling up when there are more than 60 requests made in a minute)
13. Upper breach scale increment: 1 (scale up by one instance)
14. Lower threshold: 30 (trigger scaling down whent there are less than 30 requests made in a minute)
15. Lower breach scale increment: -1 (scale down by one instance)
16. Save the auto scaling configuration


### Track Elastic Beanstalk Activity and Scaling Events

1. Using the EB Console, select your application to open up the EB dashboard for the app to track recent environment updates
2. Select "Montitoring" to view performance details of the appliation, e.g. latency, requests, CPU utilization etc.
3. Use the EC2 console to view the number of actual instances of the application
4. To simulate exceeding the request threshold configured above, allow other people to use application simultaneously for five minutes, by continuously creating, checking and deleting todo items
5. This should cause the request per minute to exceed the threshold of 60 (observe under EB monitoring)
6. The auto scaling should be triggered (observe under EB dashnoard)
7. Note the number of EC2 instances for the app after auto scale events (observe under EC2 console)


## Part 3: Application Development in the Cloud

This section will cover simple front and back end techniques to get you up to speed with application development in the Cloud

### AngularJS

[AngularJS](http://angularjs.org) provides a modularized approach to bind data structures, e.g. Arrays, Objects and other variables, to HTML views. This repository provides the code for a simple "todo list" application created in AngularJS.

There are two versions of this "todo" application:
1. A purely front-end AngularJS app that does not communicate with any back-end database that will be pushed to GitHub Pages (index.html located [here](https://github.com/andrewbeng89/mitb_node_demo/blob/master/index.html))
2. Integrated AngularJS app that communites with a Node.js backe-end hosted on Heroku and Elastic Beanstalk (index.html located [here](https://github.com/andrewbeng89/mitb_node_demo/blob/master/public/index.html))

### Node.js with MongoDB (Mongolab Database-as-a-Service)


### Application Tracking with Google Analytics


## View the demo app on [Heroku](http://mitb-node-demo.herokuapp.com)
## View the demo app on [Elastic Beanstalk](http://mitb-node-demo-8tqj3ypyra.elasticbeanstalk.com)
