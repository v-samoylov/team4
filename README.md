[![Stories in Ready](https://badge.waffle.io/urfu-2015/team4.png?label=ready&title=Ready)](https://waffle.io/urfu-2015/team4)
[![Build Status](https://travis-ci.org/urfu-2015/team4.svg?branch=master)](https://travis-ci.org/urfu-2015/team4)

# PhotoQuest 44
> 0.0.1a

![circle](https://cloud.githubusercontent.com/assets/4165695/13728695/78d6ac82-e942-11e5-8e1d-d9c456fba919.gif)

## Запуск проекта

Этот проект расчитан на запуск под `node >= 4`

Для запуска сервера (после клонирования репозитория) выполните:
```bash
npm install
npm start
```

## Структура проекта

```
bin/            Инстанс сервера
blocks/         Статика и верстка (partials)
config/         Конфигурационные файлы для разных окружений
controllers/    Контроллеры для страниц
lib/            helpers
middleware/     Мидлвары проекта
models/         Модели
pages/          Статика и верстка (pages)
tests/          Тесты
app.js          Express приложение
routes.js       Привязка контроллеров к url
```

### Окружение

По умолчанию сервер запускается в режиме development.
Для запуска с различным окружением выполните:

Unix:
```bash
export NODE_ENV=production && npm start
```
Windows:
```bash
SET NODE_ENV=production
npm start
```

### npm скрипты

* `npm start` - запуск проекта
* `npm lint:js` - проверка js (eslint)
* `npm lint:css` - проверка css (stylelint)
* `npm lint` - проверка js и css (выполняется перед push)
* `npm build` - сборка клиентского js и css (webpack)

### Работа с GitHub (console вариант)
1. Делаем fork главного репозитория через сайтик.
    Просто полный клон репозитория на ваш GitHub аккаунт.
2. `git clone 'главный репозиторий' .`
    Скачиваем содержимое репозитория на локальный компьютер в текущую
    папку.
3. `git remote add upstream 'главный репозиторий'`
    Указали на репозиторий из которого будем подтягивать изменения для
    обновления проекта.
    [Убедиться, что всё получилось можно командой: `git remote -v`]
4.  `git checkout -b 'имя вашей новой ветки'`
    Создадим ветку для какой-нибудь супер фичи, в которой продолжим
    разработку.
    [Убедиться, что всё получилось можно командой: `git remote -v`]
5.  `git add 'file[s]'`
    `git commit -m 'type(where): message'`
    `git push origin 'имя вашей новой ветки'`
     Знатно кодим, а после фиксируем все изменения и пушим в ветку.
6.  `git checkout origin master`
    Переключились на мастер, чтобы подтянуть все изменения из upstream'а.
    `git fetch upstream master`
    Обновили структуру проекта, узнали о ветках и прочее.
    `git pull upstream master`
    Подтянули все обновления.
7.  `git checkout 'имя вашей новой ветки'`
    Переключаемся обратно на нашу ветку.
    `git merge origin master`
    Начинаем мёрджить с последними изменения из мастера нашего форка.
    [Вполне возможно, что у вас возникнут конфликты, о чём скажет консоль.
    Загляните в каждый файл и ручками устраните все конфликты]
    `git push origin 'имя вашей новой ветки'`
    Запушили всё в нашу ветку.
8.  Идём на сайт и создаём pull-request.
