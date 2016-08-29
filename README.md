# Introduction of TravelGo

TravelGo is a mini project about travel itinerary management. It is developed in IBM Hackademy Shanghai Event and it requires each team to decide what they would do. My team (1 designer + 6 developers) finished this work in only 2 days. 

In this mini project, I, [Jing Hua Zhu](https://github.com/jinghzhu), contributed the whole idea of what we could do, how to implement them and why we should make it happen. Besides, I also designed the main features and coperated with designer to go through the wirdframe.

Talking about development, I was responsible for the landing page with and backedn logic.

## Features

The main features of TravleGO include:
(1) With the input destination and travel date, it could automatically list all available resources with helpful information, like price, duration ...etc. Being different with most existing itineray management system, it is smart enough to deal with the seasonal travle resources. For example, if the travle date is around December 31th, it could help you get the travle info of New Year Eve.

(2) A interactive map is implemented to provide the navigation info. When adding or removing some spot, it will automatically generate new navigation info.

## Collaborating

One of the most effective ways to collaborate on GitHub is by using a forking/branching model as described in the [GitHub Guides](https://guides.github.com/).

### Setup

* [Fork](https://guides.github.com/activities/forking/) the main repository to your personal GitHub space
* Clone this new fork locally to your computer. Make sure you use the SSH URL, not the HTTPS URL. This will be your `origin` remote.
* Add an `upstream` remote whose URL is the SSH URL of the main repository - `git remote add upstream {{url}}`, replacing `{{url}}` with the main repo's URL.

### Divvying Up Work

* As a team, create [issues](https://guides.github.com/features/issues/) in the main repository to describe what work needs to be done
* Assign the issue to an individual to work on and add it to the `To Do` pipeline in the [ZenHub](ibm.biz/zenhub-install) boards
* When you have started working on an issue, move it to the `In Progress` pipeline.

### Doing Work

* Each time you begin doing work on a new issue, check out the master branch by doing `git checkout master`. You will only be able to do this if you don't have any changes in your local codebase.
* Pull in the latest changes from upstream's master branch - `git pull upstream master`
* Create a new [branch](https://guides.github.com/introduction/flow/), named something relevant to the issue being worked on - `git checkout -b {{branch-name}}`, replacing `{{branch-name}}` with the name of your branch.
* Push your new branch to your origin remote - `git push -u origin {{branch-name}}`
* Add your commits and push to that branch - `git push origin {{branch-name}}`
* Issue a Pull Request in to the upstream repository when the work is done. Make sure the Pull Request comment includes a [keyword for closing issues](https://help.github.com/articles/closing-issues-via-commit-messages/) for closing the issue the work is for - `Resolves #42` (with `42` being the issue number)
* Once the Pull Request is merged, delete the local and remote branch you worked on - `git branch -d {{branch-name}}` for local, `git push origin :{{branch-name}}` for remote. **Important: Never Reuse A Branch After It Has Been Merged**

## Installing

After forking and cloning the codebase, run the following command to install all of the dependencies:

```bash
npm install
```

Whenever you update your branch from `upstream master`, be sure to re-run `npm install` to install the latest dependencies from your team.

## Running

Running your project for development is a single command:

```bash
npm run gulp
```

This will run [Gulp](http://gulpjs.com/), starting your Node server, wrapping it in a proxy server that will be accessible on multiple devices and live reload your assets, and watch your Node file for changes, stopping and starting the Node server on changes. It will also lint all of your JavaScript and Sass, compile your Sass, Uglify your JavaScript, and optimize your Images (yay Task Runners!).

## Extending This Starter

The Node Starter is a very bare-bones Node server.

* `src` - Browser source files
  * `src/js` - Browser JS files you write. Will render to `public/js` and available in the `/js` folder from the browser
  * `src/images` - Images to be available to the browser. Will render to `public/images` and available in the `/images` folder from the browser
  * `src/sass` - Sass files to be rendered to CSS. Will render to `public/css` and available in the `/css` folder from the browser
* `lib` - Node source files
* `views` - Templates to be rendered by the Node server
* `index.js` - Main application file

The following folders contain generated content and _will not_ be included in your source control:

* `public` - The folder browser assets will be served from.
* `node_modules` - The folder containing Node dependencies

### Templating

Many applications will want to include templating for server-side rendering capabilities. The Node Starter comes with a very basic one: it will read `*.html` files in the `views` directory and render them out directly. It will neither allow you to pass variables in to the HTML to render, nor allow you to break up your files in to reusable pieces.

If you would like to use templating, it is recommended you research some available templating engines for Node and replace the default one with one of your choosing.
