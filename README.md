# 🕒 time_tracking

Система учёта рабочего времени сотрудников с контролем доступа, регистрацией смен, управлением перерывами, ролями и автоматической отчетов.

---

## 📌 Назначение проекта

Данный проект решает задачу автоматизации учёта смен, расчёта рабочего времени и переработок. Он также обеспечивает контроль ролей и доступов в рамках корпоративной структуры.

---

## ⚙️ Стек технологий

- **Язык:** JavaScript / TypeScript
- **Платформа:** Node.js
- **Фреймворк:** Express
- **Базы данных:**
    - MongoDB 
- **Документация:** Swagger (OpenAPI)
- **Тестирование:** Jest, Postman (json)
- **Логирование:** Morgan (запросы в консоль), Winston (ошибки в консоль и файл)
- **JWT** для авторизации
- **.env** для конфиденциальных переменных


---

## 🛠️ Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/DinaraYa/time_tracking_dinara.git
cd time_tracking

2. Установка зависимостей
npm install

3. Создание .env файла
Создайте файл .env в корне проекта со следующим содержанием:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=java_27_30
OWNER=100000000
OWNER_PASS=123456789.com
MONGO_URI=mongodb+srv://nickName:password.nndz5yc.mongodb.net/time_tracking?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super-secret-key-for-jwt-token
JWT_EXP=1h

4. Запуск проекта
npm start


📡 Документация API
Swagger доступен по адресу:
http://localhost:3771
Файл openapi.json содержит полное описание эндпоинтов, методов, параметров и схем.

🔐 Роли и доступ
Система реализует AAA-схему безопасности (Authentication, Authorization, Accounting).
Роль	Доступы
Работник	Отмечает приход и уход со смены
Менеджер	Управление сменами текущего дня, закрытие смен
HR	Управление сотрудниками, доступ к статистике за месяц
Супервайзер	Может изменять роли и любые данные
	•	Все действия логируются с указанием пользователя
* Только супервайзер может удалять смены
* Все роли хранятся и обрабатываются через JWT

🧠 Архитектура проекта
* Роутеры — принимают HTTP-запросы
* Контроллеры — обрабатывают бизнес-логику
* Сервисы (через интерфейсы) — отделение реализации от логики
* БД:
    * MongoDB — основная БД
* Логирование:
    * Все ошибки — в консоль и файл
    * Все запросы — только в консоль
* Конфигурация — централизована (единый конфигурационный файл)

⏱ Бизнес-логика смен
* Работник может выйти на смену, если с предыдущей прошло >8 часов (конфигурируется)
* Перерывы:
    * <4ч — без перерыва
    * 4–6ч — 1 перерыв 15 мин (оплачиваемый)
    * 6–8ч — 2×15 мин или 1×30 мин (оплачиваемый)
* Неиспользованные перерывы добавляются к рабочему времени
* Уведомление при превышении допустимого времени в месяц
* Автоматическое блокирование смены, если нарушено правило 8 часов

📊 Отчеты
* 📅 Отчет по текущим сменам и перерывам
* 📈 Сводный отчет по всем работникам
* 🧾 Табель с разбивкой по ставкам:
    * После 22:00 — 150%
    * Пятница 20:00 до субботы 19:59 — 200%
* 📉 Отчет о переработках
* 👤 Индивидуальные отчеты по каждому сотруднику

🧪 Тестирование
* Юнит-тесты покрывают все сервисные методы
* Используется: Jest
Запуск тестов:
npm test
Также доступен:
* .postman_collection.json — коллекция ручного тестирования API

📂 Структура проекта
time_tracking/
├── appConfig/
│   └── app-config.json

├── docs/
│   └── openapi.json

├── logs/
│   └── actions.log
│   └── combine.log
│   └── error.log
│   └── warning.log

├── src/
│   ├── config/
│   │   └── libConfig.ts

│   ├── controllers/
│   │   ├── accountController.ts
│   │   └── shiftControlController.ts

│   ├── errorHandler/
│   │   ├── errorHandler.ts
│   │   └── HttpError.ts

│   ├── Logger/
│   │   └── winston.ts

│   ├── Middleware/
│   │   ├── authentication.ts
│   │   └── authorization.ts

│   ├── model/
│   │   ├── Employee.ts
│   │   ├── EmployeeMongooseModel.ts
│   │   ├── Shift.ts
│   │   └── ShiftMongooseModel.ts

│   ├── postman/
│   │   └── time_tracking.postman_collection.ts

│   ├── routes/
│   │   ├── accountsRouter.ts
│   │   └── shiftsRouter.ts

│   ├── services/
│   │   ├── accountService.ts
│   │   ├── AccountServiceImplMongo.ts
│   │   ├── shiftControlService.ts
│   │   └── ShiftControlServiceImplMongo.ts

│   ├── utils/
│   │   ├── libTypes.ts
│   │   └── tools.ts

│   ├── validation/
│   │   ├── joiSchemas.ts
│   │   └── validation.ts

│   ├── app.ts
│   └── server.ts

├── tests/
│   └── unit/
│       └── accountTests/
│           ├── changePassword.test.ts
│           ├── fireEmployee.test.ts
│           ├── getAllEmployees.test.ts
│           ├── getEmployeeById.test.ts
│           ├── hireEmployee.test.ts
│           ├── setRole.test.ts
│           └── updateEmployee.test.ts

├── .env
├── .gitignore
├── access.log
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md




📜 Лицензия
MIT

👤 Автор
GitHub: https://github.com/DinaraYa
