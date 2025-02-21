FROM node:20.9.0 as build-stage

WORKDIR /app

# Copiar todo el código fuente
COPY . .

# Instalar dependencias y construir
RUN npm install
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
