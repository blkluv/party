FROM public.ecr.aws/lambda/nodejs:16

ARG dir

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./

COPY ${dir}/index.ts ${dir}/tsconfig.json ${dir}/package.json ./function/

COPY ./@party-box/prisma ./@party-box/prisma

COPY ./@party-box/common/src ./@party-box/common/src
COPY ./@party-box/common/tsconfig.json ./@party-box/common/package.json ./@party-box/common/

RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile --shamefully-hoist
RUN pnpm -F ./@party-box/common build 
RUN pnpm -F ./function exec tsc 
RUN pnpm prune --prod

CMD [ "./function/index.handler" ]