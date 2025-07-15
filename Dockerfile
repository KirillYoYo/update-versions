FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Установим зависимости
COPY package*.json ./
RUN npm install

# Копируем всё
COPY . .

# Убедимся, что tsx установлен
RUN npx tsx --help > /dev/null

# Копируем .env (или укажем переменные на уровне Kubernetes)
COPY .env .env

# Порт для K8s (необязательный, чтобы EXPOSE был консистентен)
EXPOSE 3001

# Запускаем с tsx
CMD ["npx", "tsx", "src/index.ts"]
