# Book Service API

## Описание
Book Service API — это сервис для управления книгами, написанный на Node.js с использованием Express и базы данных PostgreSQL.

## Стек технологий
- **Node.js** / **Express.js** — серверная часть
- **TypeScript** — статическая типизация
- **PostgreSQL** — база данных
- **Docker** / **Docker Compose** — контейнеризация

## Запуск проекта

### 1. Клонирование репозитория
```sh
git clone https://github.com/your-repo/book-service.git
cd book-service
```

### 2. Настройка переменных окружения
Создай `.env` файл в корне проекта и добавь:
```env
PORT_APP=3000
PORT_DB=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=bookdb
DATABASE_URL=postgres://admin:admin@database:5432/bookdb
ACCESS_SECRET=mysecretkey
REFRESH_SECRET=mysecretkey
```

### 3. Запуск с помощью Docker Compose
```sh
docker-compose up -d --build
```

Контейнеры будут запущены в фоне. Проверить их можно командой:
```sh
docker-compose ps
```

### 4. Доступ к API
После успешного запуска API будет доступно по адресу:
```
http://localhost:3000
```

## Основные эндпоинты

### Получение списка книг
```http
GET /books?page=0
```

### Получение книги по ID
```http
GET /books/{id}
```

### Создание новой книги
```http
POST /books
Content-Type: application/json
{
  "title": "Название книги",
  "description": "Описание",
}
```

### Остановка контейнеров
```sh
docker-compose down
```

## Полезные команды

📜 **Посмотреть логи:**
```sh
docker-compose logs -f
```

🗑 **Удалить все контейнеры и данные:**
```sh
docker-compose down -v
```

🚀 **Пересобрать и запустить заново:**
```sh
docker-compose up -d --build
```


