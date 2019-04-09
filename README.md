# 3 Elephants

3 Elephants is a chrome extension that encourages eco-friendly consumer behaviors while online.
Right now we do this by reviewing the eco-friendliness of products on Amazon.
If you are curious to learn about the project roadmap; please check out our [Trello Board](https://trello.com/b/ar3tb4be/3elephants).

## Getting Started

### Prerequisites

* node and npm
* python3.5 or greater
* MongoDB (optional if you do not plan to modify the database)


### Installation Instructions
```
git clone https://github.com/3elephants/3elephants
git checkout -b <your_name>_branch
cd frontend_sandbox
npm i
npm install -g parcel-bundler
```
### Running the Frontend
```
cd frontend
```
#### For a Development Build
```
./frontend_sandbox/install/dev_deploy.sh
```

#### For a Production Build
```
./frontend_sandbox/install/prod_deploy.sh
```

Open the Chrome Extensions Page.
![How to Open Chrome Extensions Page](docs/readme_screenshot_1.png)

Click "Load Unpacked" on the top left corner.
![Load Unpacked](docs/readme_screenshot_2.png)

Navigate to the [frontend/frontend_sandbox/dist](frontend/frontend_sandbox/dist) folder, click Select in the bottom right corner.
<!--![Select dist folder](docs/readme_screenshot_3.png)-->

The following should now appear in the chrome extensions page.
![3 Elephants Extension](docs/readme_screenshot_4.png)

There may be a button that says that "Errors" exist if you run the development version.
This is because parcel, the frontend code bundler used by the project, in the development version, will try to update the chrome extension automatically, but it will fail to do so. You can feel free to ignore this issue.

Chrome does not automatically update the plugin when the code changes. In order to update the plugin on chrome after you've changed the code, you may either go through the steps above again or download [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid), a chrome extension that reloads code for extensions with a click on a button. Suggestions and pull requests for resolving immediate reloading experience for developers are welcome.

#### Running the Backend
To run the backend

```
# create a python virtual environment or work with your global environment if you are ok with that. But make sure your default python  
# version is 3.5 or above.
cd backend
pip install -r requirements.txt
python data_downloading/setup.py
./backend/sandbox/deploy.sh
```

The backend is a little bit more tricky. We use AWS lambda and API gateway, so think of the backend as a group of isolated functions using API Gateway as an interface. We're working on making the backend more accessible to open source contributors, but here's a starters guide:

1. Add new functions to [backend/functions.py](backend/sandbox/functions.py)
2. Add any necessary test cases in [backend/sandbox/tests.py](backend/sandbox/tests.py)  
3. Test by running the test cases or directly running the function by using `python -c 'print(<function_name>(...params))'`
4. Add a route to [backend/3el_server/flask_server.py](backend/3el_server/flask_server.py). This file is used for a Flask app that allows developers like yourself to contribute to the backend without having to configure their own API Gateway and AWS Lambda setup.
5. When you're done run `./backend/sandbox/deploy.sh`.

Try to abstract as much work as possible into the [backend/sandbox/lib](backend/sandbox/lib) folder (_For now use your best judgement, based on the style of other functions, but stay posted for more specifics on how to do this._).


#### Modifying the Database

For most cases, we recommend using our preset MongoDB database URL. However, you might want to work on data collection and updating the database.

For data collection,
1) Write code used to download information in (data_downloading/downloaders/<data_collection_project_name>).
2) Afterwards, upload the data collected to this [Google Drive Folder](). As this project falls under the GPL License, the information collected through this project will not be used for commercial aims.
3) In your contribution, explain through a .txt file how you expect this data to be integrated in the database.  More specific the better and more likely your data collection work will be integrated into the project's database. We aim to integrate  such work when possible.

However, if you do also want to figure out how to update the information in the database, then you must setup a MongoDB instance locally. Please note, the following instructions cater to experienced MongoDB users only. In a future update,

The following steps are required:

* create a new database called 3Elephants
* `mongorestore` the database files in this [Google Drive Folder]()
* create the indices specified in `create_indices.js`

## Running the tests

Explain how to run the automated tests for this system

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GLPv3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to contributors: Aditya Aggarwal and Sail Allu. Please add your name to this README in your pull request; we aim to acknowledge any contributions.
