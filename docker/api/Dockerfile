FROM public.ecr.aws/lambda/nodejs:16

ARG dir
ARG workspace

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY ${dir}/index.ts ${dir}/tsconfig.json ${dir}/package.json ./function/
COPY ./@party-box/prisma ./@party-box/prisma
COPY ./@party-box/common ./@party-box/common

RUN npm install -g pnpm
RUN pnpm i 
RUN pnpm -F ./function exec tsc 
RUN pnpm prune --prod

CMD [ "./function/index.handler" ]