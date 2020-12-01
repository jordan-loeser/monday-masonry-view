## Inspiration

This project was inspired by a problem I encounter often during my day-to-day life as a Software Engineer: a messy backlog.

When working in a quick-paced environment with multiple tasks happening at once, it's not uncommon for items to get re-prioritized or fall out of scope. While it’s easy to throw outdated items into the backlog, it can be a monotonous and even daunting task to fish back through them later, which leads to items getting overlooked. By helping to remove unnecessary items in a fun and engaging way, Swipe View allows engineers to focus on items that are relevant and make sure they are attended to.

## What it does

Swipe View is a custom Board View that presents users with a stack of items, sorted by group. Users can "swipe" right to keep an item and left to add it to the trash. Based on the board settings, the items are either archived or deleted when the trash is emptied.

## How I built it

I started this app using Monday's `quickstart-react` scaffolding, using my own React and front end experience to give it a unique twist.

## Challenges & Accomplishments

This was my first time using the Monday.com JavaScript SDK, so it took a bit of reading to get my footing and integrate information from the board in a meaningful way. Fortunately, I found the documentation very intuitive and was able to utilize the Monday Community forum to answer all my questions.

At the beginning of this challenge, I ran into issues with the `monday.execute()` command used to open item cards. After raising the issue in the Monday Community forum, the problem was tracked and a fix was implemented. I am proud that this collaboration lead to a long-term solution that could help future developers.

## What's next for Swipe View

I would love to expand this project to give users more granular control over what information is displayed on each card in the view. This would create support for more diverse use cases, such as cards with images.

## Developer Instructions

In the project directory, you should run:

### `npm install`

And then to run an application with automatic virtual ngrok tunnel, run:

### `npm start`

Visit http://localhost:4040/status and under "command_line section" find the URL. This is the public URL of your app, so you can use it to test it.
F.e.: https://021eb6330099.ngrok.io

## Configure Monday App

1. Open monday.com, login to your account and go to a "Developers" section.
2. Create a new "QuickStart View Example App"
3. Open "OAuth & Permissions" section and add "boards:read" scope
4. Open "Features" section and create a new "Boards View" feature
5. Open "View setup" tab and fulfill in "Custom URL" field your ngrok public URL, which you got previously (f.e. https://021eb6330099.ngrok.io)
6. Click "Boards" button and choose one of the boards with some data in it.
7. Click "Preview button"
8. Enjoy the Quickstart View Example app!

## Release your app

1. Run script

### `npm run build`

2. Zip your "./build" folder
3. Open "Build" tab in your Feature
4. Click "New Build" button
5. Click "Upload" radio button and upload zip file with your build
6. Go to any board and add your just released view
7. Enjoy!
