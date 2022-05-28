FROM node:gallium-alpine3.14
WORKDIR /app
COPY package.json .
COPY index.ts .
RUN npm install
RUN npm tsc --build
CMD ["node", "index.js"]
