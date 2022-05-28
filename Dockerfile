FROM node:gallium-alpine3.14
WORKDIR /app
COPY ["package.json", "index.ts", "tsconfig.json", ".env", "./"]
RUN npm install
RUN npx tsc --build
CMD ["node", "index.js"]
