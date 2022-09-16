FROM public.ecr.aws/lambda/nodejs:16

ARG dir
ARG DATABASE_URL

ENV DATABASE_URL DATABASE_URL

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json turbo.json ./

COPY ${dir}/index.ts ${dir}/tsconfig.json ${dir}/package.json ./function/

COPY ./@party-box/prisma ./@party-box/prisma
COPY ./config ./config
COPY ./@party-box/common/src ./@party-box/common/src
COPY ./@party-box/common/tsconfig.json ./@party-box/common/package.json ./@party-box/common/

RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile --shamefully-hoist  
RUN pnpm build
RUN pnpm prune --prod

CMD [ "./function/dist/index.handler" ]