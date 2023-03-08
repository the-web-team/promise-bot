FROM node:16

WORKDIR /var/app

COPY package.json /var/app/package.json
RUN yarn

COPY prisma /var/app/prisma
RUN yarn generate

COPY tsconfig.json /var/app/tsconfig.json
COPY guild_configs.yml /var/app/guild_configs.yml
COPY .swcrc /var/app/.swcrc
COPY src /var/app/src

CMD yarn migrate:prod && yarn start
