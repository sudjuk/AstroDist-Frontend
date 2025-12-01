# AstroDist Frontend

Frontend приложение для AstroDist с поддержкой Tauri, PWA и Redux Toolkit.

## Возможности

- ✅ Redux Toolkit для управления состоянием фильтров
- ✅ PWA поддержка
- ✅ Адаптивный дизайн
- ✅ Tauri desktop приложение
- ✅ Подключение к API через IP адрес в локальной сети

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Tauri Desktop App

### Требования

- Rust (установите через [rustup](https://rustup.rs/))
- Visual Studio Build Tools (для Windows)

### Разработка

```bash
npm run tauri:dev
```

### Сборка

```bash
npm run tauri:build
```

## Как настроить IP адрес сервера

В Tauri приложении:
1. Нажмите на кнопку "⚙️ Настройки API" в навигации
2. Введите IP адрес вашего Go сервера (например: `http://192.168.1.101:8080`)
3. Нажмите "Сохранить"
4. Приложение перезагрузится

## Развертывание на GitHub Pages

```bash
npm run deploy
```

## Структура проекта

```
src/
├── api/              # API клиент
├── components/       # React компоненты
├── config/          # Конфигурация (Tauri API)
├── pages/           # Страницы приложения
├── store/           # Redux store и slices
└── main.tsx         # Точка входа

src-tauri/           # Tauri Rust код
```


