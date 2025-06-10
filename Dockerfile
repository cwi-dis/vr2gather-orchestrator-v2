FROM ubuntu:24.04

WORKDIR /code

RUN apt update && \
    apt install -y python3 npm && \
    npm install -g yarn

ADD ./package[s] /packages

ADD ./package.json /code/package.json
ADD ./yarn.lock /code/yarn.lock

ADD ./.env-sample /code/.env
ADD ./config-sample/* /code/config/

RUN yarn install

ADD . /code/
RUN yarn build && \
    yarn cache clean --all

EXPOSE 8090-8099

CMD ["yarn", "start"]
