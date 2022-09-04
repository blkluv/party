FROM public.ecr.aws/lambda/nodejs:16

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm tsc
RUN pnpm prune --prod

CMD [ "index.handler" ]