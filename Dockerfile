
FROM alpine:3.10

# Install system dependencies
RUN apk add --no-cache --update   bash   gcc   g++   make     musl-dev    git   nodejs-current   nodejs-npm

ADD ./ /app/webapp/
WORKDIR /app/webapp/
RUN npm install
RUN adduser -D myuser
USER myuser
CMD ["npm", "start"]
