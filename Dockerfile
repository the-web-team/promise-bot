FROM node:latest

COPY package.json /var/app/package.json
COPY tsconfig.json /var/app/tsconfig.json
COPY guild_configs.yml /var/app/guild_configs.yml
COPY .swcrc /var/app/.swcrc
COPY src /var/app/src

CMD yarn start
