FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_APOLLO_DEVTOOLS=false
ENV VITE_APOLLO_DEVTOOLS=$VITE_APOLLO_DEVTOOLS

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
