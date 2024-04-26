FROM node:21-alpine3.17

ADD . /code/
ADD config/package[s] /packages

WORKDIR /code

# These packages are needed to run evanescent and the webrtc sfu
RUN apk add gcompat

RUN yarn install && \
    yarn build && \
    yarn cache clean --all

EXPOSE 8090
CMD ["yarn", "start"]
