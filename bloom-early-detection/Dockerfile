# base image
FROM node:latest

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install && npm install react-scripts@1.1.1 -g

EXPOSE 3000
EXPOSE 35729

# start app
CMD ["npm", "start"]