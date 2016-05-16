[![Stories in Ready](https://badge.waffle.io/urfu-2015/team4.png?label=ready&title=Ready)](https://waffle.io/urfu-2015/team4)
[![Build Status](https://travis-ci.org/urfu-2015/team4.svg?branch=master)](https://travis-ci.org/urfu-2015/team4)

# PhotoQuest 44
> 0.1.0a

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

Для включения логов дебага выполните:

Unix:
```bash
DEBUG=team4:* npm start
```
Windows:
```bash
set DEBUG=team4:*
npm start
```

### npm скрипты

* `npm start` - запуск проекта
* `npm lint:js` - проверка js (eslint)
* `npm lint:css` - проверка css (stylelint)
* `npm lint` - проверка js и css (выполняется перед push)
* `npm build` - сборка клиентского js и css (webpack)

### Работа с GitHub (console вариант)
1. Делаем fork главного репозитория через сайтик. <br />
    Просто полный клон репозитория на ваш GitHub аккаунт. <br />
2. `git clone 'главный репозиторий' .` <br />
    Скачиваем содержимое репозитория на локальный компьютер в текущую
    папку. <br />
3. `git remote add upstream 'главный репозиторий'` <br />
    Указали на репозиторий из которого будем подтягивать изменения для
    обновления проекта. <br />
    [Убедиться, что всё получилось можно командой: `git remote -v`] <br />
4.  `git checkout -b 'имя вашей новой ветки'` <br />
    Создадим ветку для какой-нибудь супер фичи, в которой продолжим
    разработку. <br />
    [Убедиться, что всё получилось можно командой: `git remote -v`] <br />
5.  `git add 'file[s]'` <br />
    `git commit -m 'type(where): message'` <br />
    `git push origin 'имя вашей новой ветки'` <br />
     Знатно кодим, а после фиксируем все изменения и пушим в ветку. <br />
6.  `git checkout master` <br />
    Переключились на мастер, чтобы подтянуть все изменения из upstream'а. <br />
    `git fetch upstream master` <br />
    Обновили структуру проекта, узнали о ветках и прочее. <br />
    `git pull upstream master` <br />
    Подтянули все обновления. <br />
    `git push origin master` <br />
    Запушили в свой форковский мастер изменения. <br />
7.  `git checkout 'имя вашей новой ветки'` <br />
    Переключаемся обратно на нашу ветку. <br />
    `git merge master` <br />
    Начинаем мёрджить с последними изменения из мастера нашего форка. <br />
    [Вполне возможно, что у вас возникнут конфликты, о чём скажет консоль.
    Загляните в каждый файл и ручками устраните все конфликты] <br />
    `git push origin 'имя вашей новой ветки'` <br />
    Запушили всё в нашу ветку. <br />
8.  Идём на сайт и создаём pull-request, указывая нашу ветку.
