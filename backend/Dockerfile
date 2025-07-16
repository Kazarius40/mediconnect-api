FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x start.sh

RUN npm run build

CMD ["sh", "./start.sh"]
