FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY supabase ./supabase
CMD ["sh", "-c", "npx supabase db push --remote=\"$DATABASE_URL\" --include-seed --yes"]