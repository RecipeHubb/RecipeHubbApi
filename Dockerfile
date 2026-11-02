FROM node:14

# Create app directory
WORKDIR /app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock ./

RUN yarn

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV SERVER_PORT 8080

EXPOSE 8080
CMD [ "yarn", "start"]