FROM node:18 as dev

RUN npm install -g pnpm


FROM dev

WORKDIR /var/app

COPY package.json /var/app/package.json
COPY pnpm-lock.yaml /var/app/pnpm-lock.yaml
RUN pnpm i

COPY prisma /var/app/prisma
RUN pnpm generate

COPY tsconfig.json /var/app/tsconfig.json
COPY guild_configs.yml /var/app/guild_configs.yml
COPY src /var/app/src

CMD pnpm migrate:prod && pnpm start
