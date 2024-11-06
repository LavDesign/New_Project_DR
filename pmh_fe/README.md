# Paid Media Hub - Frontend Project

For documentation please go to: https://dev.azure.com/TfO-DevOps-CCT-US/SynOpsForMarketing_56280/_wiki/wikis/PMH%20Wiki/398/Trainings

#To start
#1- Install Packages
npm install
#2- Build code
npm run build
#3- Run code
npm run start:proxy


To run the docker-compose for the Frontend, please run the following command:

docker-compose up --build --force-recreate



#To update npm packages:

npm outdated // run to check outdated npm packages

npm update // run to check updates outdated npm packages

npm install -g npm
npm install npm@latest -g

npm install // run to update npm packages


On windows to easy delete node_modules folder, using cmd:
rmdir /s /q node_modules

To clean npm cache:
npm cache clean --force

---------------------------
To check un-used dependencies:

npm install -g depcheck
cd path_to_your_project (on window)
depcheck

This will list all the unused dependencies in your project.
Please note that depcheck may not be 100% accurate and it may have some false positives or negatives.

npm uninstall unused-library
