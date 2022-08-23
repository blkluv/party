FROM public.ecr.aws/lambda/nodejs:16

COPY . .

RUN npm install --omit=dev

CMD [ "index.handler" ]