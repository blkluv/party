FROM public.ecr.aws/lambda/nodejs:16

ARG dir
ARG workspace

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY ${dir}/index.ts ${dir}/tsconfig.json ${dir}/package.json ./function/
COPY ./prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

# WORKDIR /function

RUN pnpm -F ${workspace} exec tsc


# ARG dir
# RUN npm install -g pnpm

# COPY --from=build ${dir}/index.js ${dir}/package.json ./function/
# COPY --from=build ./prisma ./prisma
# COPY --from=build pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json node_modules ./

RUN pnpm prune --prod

WORKDIR /function

CMD [ "index.handler" ]
