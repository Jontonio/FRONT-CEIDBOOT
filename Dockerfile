# Imagen base Node
FROM node:16-alpine

# Crea directorio de trabajo
WORKDIR /app

# Copia solo dependencias primero
COPY package*.json ./

# Instala Angular CLI y dependencias
RUN npm install -g @angular/cli@13 && npm install

# Copia el resto del código
COPY . .

# Expone el puerto Angular
EXPOSE 4200

# Variable para desarrollo (permite hot reload)
ENV CHOKIDAR_USEPOLLING=true

# Comando por defecto
CMD ["npm", "start"]
