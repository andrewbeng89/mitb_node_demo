[![Build Status](https://travis-ci.org/andrewbeng89/mitb_node_demo.png?branch=master)](https://travis-ci.org/andrewbeng89/mitb_node_demo)
# MITB Cloud Computing Lab for Node.js Development and CI with Koding and Travis-CI

This tutorial will cover the steps for using a virtual maching (VM) on [koding.com](https://koding.com) to develop and deploy node.js web apps.

The tutorial is divided into the following 3 sections: 

1. Part 1 walks through the steps to use Git and Travis-CI as a test and deploy tool to push updates to Heroku (PaaS). This section will also allow you to push 'static' files (e.g. HTML, JavaScripts etc.) to the GitHub pages brance of your repository.
2. Part 2 demonstrates automated deployment of the same application to AWS Elastic Beanstalk and Auto Scaling based on performance thresholds.
3. Part 3 covers application development approaches in the Cloud


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

Sign up for [Amazon Web Services (AWS)](https://aws.amazon.com). The following steps will walk through using services from AWS. Elastic Beanstalk (EB) provides a platform which developers can deploy a wide variety of web applications to Amazon Machine Instances (AMIs) remotely via web or command line interfaces. Elastic Load Balancer (ELB) is used to configure automated resource scaling on AWS, e.g. scaling an EB instance by launching more AMIs when a certain performance threshold has exceeded.

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

There are three versions of this "todo" application:

1. A purely front-end AngularJS app that DOES NOT communicate with any back-end database that will be pushed to GitHub Pages (index.html located [here](https://github.com/andrewbeng89/mitb_node_demo/blob/master/index.html))
3. A purelt front-end AngularJS app that COMMUNICATES with a [Firebase](https://firebase.com) real-time Database-as-a-Service
2. Integrated AngularJS app that communites with a Node.js backe-end hosted on Heroku and Elastic Beanstalk (index.html located [here](https://github.com/andrewbeng89/mitb_node_demo/blob/master/public/index.html))

The "/public/js/todo.js" script, together with the "index.html" file located at the root of this repository is all that is required to get an AngularJS "todo list" application up and running. This purely front-end application is pushed to and viewable on GH-Pages branch of this repository. The list of "todos" is reinitialized to an empty list after the page has been refreshed. In order to create an application that will persist the list "todos", please refer to the steps below.


### AngularJS + Firebase + AngularFire

[Firebase](https://firebase.com) provides a real-time document (JSON) database. [AngularFire](http://angularfire.com/) is a JavaScript library that allows developers to bind AngularJS scope objects with real-time data from Firebase. CRUD operations will be persisted and executed on the client-side without any need for any backend operations. 

Take a look at "indext.html" at the root of this repository and "/public/js/todo_fire.js" to see the modifications from "todo.js". 

To create your own Firebase real-time database: 

1. Sign up for Firebase with your GitHub account
2. Create a new developer plan Firebase, and note the URL of the Firebase
3. Change this line in "todo_fire.js": `var ref = new Firebase('https://<your-firebase-name>.firebaseio.com/todos');`
4. Push an update that will publish the the static "index.html" to GH-Pages
5. View the app on your GH-Pages URL
6. Create some new todos and reload the page and observe


### Node.js with MongoDB (Mongolab Database-as-a-Service)

[Node.js](http://nodejs.org) is a JavaScript platform built on [Google's V8 engine](https://code.google.com/p/v8/), and is used to develop a wide variety of network applications, including web applications.

This demo application uses the [Express web app framework](http://expressjs.com/) as its backbone, with a "public" folder containing all of the front-end code (AngularJS-based application). The AngularJS code for this integrated version of the app exists in "todo_xhr.js". Unlike "todo.js", the method calls will interact with the Expressjs application via HTTP requests. The application back-end code ("app.js") will handle these request to either create, retrieve, update or delete (CRUD) "todo" items in the application's database.

The application database used here is [MongoDB](http://www.mongodb.org/), a document/object based database system. Unlike a traditional relational databse system (e.g. MySQL, Oracle DB), MongoDB is an example of a non-relational [NoSQL](http://en.wikipedia.org/wiki/NoSQL) database. Other examples of NoSQL database systems include CouchDB and Google's App Engine Datastore (NDB is covered in the [sister GAE tutorial](https://github.com/andrewbeng89/mitb_gae_demo)).

To uses MongoDB-as-a-Service hosted on [Mongolab](https://mongolab.com) with the "todo list" application, follow these steps:

1. Sign up for Mongolab [here](https://mongolab.com/signup/)
2. Once logged in, proceed to create a new mondolab development environment [here](https://mongolab.com/create). Remember to select "Development (single-node)" under "plans"
3. Choose a name for the database, e.g. "<your name>-todos-db"
4. When prompted, create the credentials for a new database user (username and password)
5. Make a note of the database name and the username and password of the new user you have just created 

To make use of the MongoDB database you have just created in the Node.js web application these credentials have to be used in a secure manner:

1. For developemnt on Koding.com, a new file at the root level of this repository called credentials.js will be used
2. Using the Heroku toolbelt, the MongoDB password will be set as Heroku environment variable
3. Using the Elastic Beanstalk console, the MongoDB password will be set as Heroku environment variable
4. Using the travis gem CLI, the MongoDB password will be encrypted and used during the build process

To use the password in the development environment, create a new file called "credentials.js" in the root directory of application repository. Edit the contents of "credentials.js" accordingly:

<pre>
  <code>
module.exports = {
    MONGO_PASSWORD: '<MongoDB Password from Mongolab here>'
};
  </code>
</pre>

Using Heroku toolbelt from the VM terminal:

1. `heroku config:set MONGO_PASSWORD=<MongoDB Password from Mongolab here>`
2. Verify that the MONGO_PASSWORD variable has been set: `heroku config`

Using the Elastic Beanstalk Console:

1. From the [console](https://console.aws.amazon.com/elasticbeanstalk/home), navigate to the application's "Configuration" page
2. Scroll down to "Environment Properties"
3. At the last table row, Enter "MONGO_PASSWORD" into the "Property Name" column and your password into the "Property Value" column
4. Save the configuration

Using travis to encrypt:

1. From the VM terminal at the repository's root level: `travis encrypt MONGO_PASSWORD="<MongoDB Password from Mongolab here>" --add`
2. Check the .travis.yml file to verify that a new secure variable has been added


### Application Tracking with Google Analytics

Google Analytics can be used as a tool to track your application's users' behaviour. These include page views, application events, content flow and user locations, just to name a few.

The following steps will demonstrate configuring Google Analytics to track the number of page views and the number of CRUD events triggered by users:

1. Create a Google Analytics account [here](http://www.google.com/analytics/)
2. From the main home console, navigate to the "Admin" page
3. Create a new "Property"
4. Enter the details of this application (the URL can either be the Heroku or Elastic Beanstalk URL)
5. Once created, note the "Tracking ID" for this application
6. Open the "/public/js/gooogle-analytics.js" file
7. Edit this line: `_gaq.push(['_setAccount', '<Tracking ID here>']);`
8. Open the "/public/js/todo_xhr.js" file
9. The lines with code similar to ` _gaq.push(['_trackEvent', 'create', 'click', 'todo']);` indicate event tracking with Google Analytics


## View the demo app on [Heroku](http://mitb-node-demo.herokuapp.com)
## View the demo app on [Elastic Beanstalk](http://mitb-node-demo-8tqj3ypyra.elasticbeanstalk.com)
