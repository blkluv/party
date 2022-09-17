FROM public.ecr.aws/lambda/nodejs:16 as build

ARG dir
ARG DATABASE_URL

ENV DATABASE_URL DATABASE_URL

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json turbo.json ./

COPY ${dir} ./function/

COPY ./packages ./packages

RUN npm install -g pnpm

RUN pnpm install --no-frozen-lockfile --shamefully-hoist  
RUN pnpm build

FROM public.ecr.aws/lambda/nodejs:16

COPY --from=build ./var/task/function/dist ./function/dist

CMD [ "./function/dist/index.handler" ]